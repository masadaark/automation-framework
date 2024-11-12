const fs = require('fs');
const path = require("path");
const colors = require('ansi-colors');
const figlet = require('figlet');
const { spawn } = require('child_process');
const report = require("multiple-cucumber-html-reporter");
console.log(colors.green.bold(figlet.textSync('START', { font: 'ANSI Shadow', horizontalLayout: 'full' })));

const tagEvent = process.argv.find(s => s.startsWith("@")) ?? "@regression-test"
process.env.CUCUMBER_TAG = tagEvent;
console.log(colors.green.bold(`TAG : ${process.env.CUCUMBER_TAG}`))

const parallelArr = process.argv.find(v => v.startsWith("parallel:"))?.split(":")

const envName = process.argv.find(s => s.startsWith("envName:"))?.split(":")[1] ?? "local"
process.env.ENV_NAME = envName;
console.log(colors.yellowBright.bold(`Enviroment : ${process.env.ENV_NAME}`))

const srcFolder = {
    payloads: path.join(process.cwd(), '/payloads'),
    testcases: path.join(process.cwd(), '/testcases'),
    appsetting: path.join(process.cwd(), '/app-setting.json'),
    testresultreport: path.resolve(__dirname, 'reports'),
}
const targetFolder = {
    payloads: path.resolve(__dirname, 'payloads'),
    testcases: path.resolve(__dirname, 'testcases/features'),
    appsetting: path.resolve(__dirname, 'app-setting.json'),
    testresultreport: path.join(process.cwd(), './reports')
}
const testRunner = () => {
    const paramProcess = ['-p', 'default', '--tags', `"${tagEvent}"`]

    if (parallelArr?.length > 1) {
        paramProcess.push("--parallel")
        paramProcess.push(Number(parallelArr[1] ?? 1))
    }
    console.log(colors.green.bold(`Command: ${paramProcess.join(' ')}`));
    return new Promise((resolve, reject) => {
        const child = spawn('npx cucumber-js', paramProcess, {
            stdio: 'inherit', cwd: __dirname,
            shell: true
        });
        child.on('error', (error) => {
            console.error(`error: ${error.message}`);
        });

        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(`exited code: ${code}`);
            }
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(`exited code: ${code}`);
            }
        });
    });

};

const copyDir = (src, dest, errMessage = "") => {
    try {
        if (fs.existsSync(dest)) {
            fs.rmSync(dest, { recursive: true, force: true });
        }
        fs.cpSync(src, dest, { recursive: true, force: true });
    } catch {
        if (err) console.error(colors.redBright(errMessage));
    }
};

const gerenateCucumberHtmlReport = () => {
    console.error(colors.blueBright(` Generate HTML Report `));
    const jsonPath = path.join(__dirname, 'reports/cucumber-report');
    try {
        report.generate({
            jsonDir: jsonPath,
            reportPath: path.join(__dirname, 'reports', 'cucumber-htmlreport'),
            displayDuration: true,
            reportSuiteAsScenarios: true,
            scenarioTimestamp: true,
            saveCollectedJSON: true,
            displayReportTime: true,

            customData: {
                title: 'Run info',
                data: [{ reportedTime: new Date(), tagEvent }]
            }
        })

    } catch (err) {
        console.error(colors.redBright(`เกิดข้อผิดพลาดในการออก report-html`));
        console.error(err)
    }

}

const rmTestImage = () => {
    try {
        fs.rmSync(targetFolder.appsetting, { recursive: true, force: true })
        fs.rmSync(targetFolder.payloads, { recursive: true, force: true })
        fs.rmSync(targetFolder.testcases, { recursive: true, force: true })
        fs.rmSync(srcFolder.testresultreport, { recursive: true, force: true })
    } catch {
        rmTestImage()
    }
}

async function main() {
    let featureFailed = 1
    let featureCount = 0
    try {
        console.log(colors.blueBright(`**Read payloads***`))
        copyDir(srcFolder.payloads, targetFolder.payloads, "อ่าน payloads ไม่สำเร็จ");
        console.log(colors.blueBright(`**Read testcases***`))
        copyDir(srcFolder.testcases, targetFolder.testcases, "อ่าน testcases ไม่สำเร็จ");
        console.log(colors.blueBright(`**Read app-setting.json***`))
        fs.copyFile(srcFolder.appsetting, targetFolder.appsetting, (err) => {
            if (err) console.error(colors.red(`app-setting.json`))
        });
        console.log(colors.green(`running...`))
        await testRunner().catch((err) => {
            console.error(err)
        })
        gerenateCucumberHtmlReport();
        const enrichedReportPath = path.join(__dirname, 'reports/cucumber-htmlreport/enriched-output.json')
        const reportData = JSON.parse(await fs.promises.readFile(enrichedReportPath, 'utf8'));
        featureFailed = reportData.featureCount.failed
        featureCount = reportData.featureCount.total

        console.log(colors.blueBright(`** Generate Report ***`));
        if (featureCount > 0) copyDir(srcFolder.testresultreport, targetFolder.testresultreport, (err) => {
            if (err) console.error(colors.red(`เกิดข้อผิดพลาดในการออก report`))
        });

    } catch (error) {
        console.error(colors.redBright(`running error: ${error}`));
    } finally {
        rmTestImage();
        if (featureFailed > 0) {
            console.error(colors.redBright(`Gherkin Tag:${tagEvent} envName:${envName} Feature Failed:${featureFailed}.`))
            throw new Error('Test Failed.');
        }
    }
}

main()