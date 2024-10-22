const fs = require('fs');
const path = require("path");
const colors = require('ansi-colors');
const figlet = require('figlet');
const { exec } = require('child_process');
const report = require("multiple-cucumber-html-reporter");
console.log(colors.green.bold(figlet.textSync('START', { font: 'ANSI Shadow', horizontalLayout: 'full' })));

const tagEvent = process.argv.find(s => s.startsWith("@")) ?? "@regression-test"
console.log(colors.green.bold(`TAG : ${tagEvent}`))
process.env.CUCUMBER_TAG = tagEvent;
const parallel = process.argv.find(s => s.startsWith("parallel:"))

const srcFolder = {
    payloads: path.resolve(__dirname, '../../payloads'),
    testcases: path.resolve(__dirname, '../../testcases'),
    appsetting: path.resolve(__dirname, '../../app-setting.json'),
    testresultreport: path.resolve(__dirname, 'reports')
}
const targetFolder = {
    payloads: path.resolve(__dirname, 'payloads'),
    testcases: path.resolve(__dirname, 'testcases/features'),
    appsetting: path.resolve(__dirname, 'app-setting.json'),
    testresultreport: path.resolve(__dirname, '../../reports')
}

const testRunner = () => {
    let command = `npm run test:cucumber ${tagEvent} `
    if (parallel) command += parallel
    return new Promise((resolve, reject) => {
        exec(command, { cwd: __dirname, shell: true, stdio: 'pipe' }, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
            }
            if (stderr) console.log(colors.green(stderr));
            console.log(colors.green(stdout));
            resolve();
        });
    });
};

// const ensureDirectoryExists = (dir) => {
//     fs.mkdir(dir, { recursive: true }, (err) => {
//         if (!err) {
//             console.log(colors.red(`dir not found: ${dir}`));
//         }
//     });
// };

const copyDir = (src, dest) => {
    if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true })
    }
    fs.cpSync(src, dest, { recursive: true, force: true });
};

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

async function main() {
    try {
        console.log(colors.blueBright(`**Read payloads***`))
        copyDir(srcFolder.payloads, targetFolder.payloads);
        console.log(colors.blueBright(`**Read testcases***`))
        copyDir(srcFolder.testcases, targetFolder.testcases);
        console.log(colors.blueBright(`**Read app-setting.json***`))
        fs.copyFile(srcFolder.appsetting, targetFolder.appsetting, (err) => {
            if (err) console.error(colors.red(`app-setting.json`))
        });
        console.log(colors.green(`running...`));
        await testRunner()

        gerenateCucumberHtmlReport();
        console.log(colors.blueBright(`** Generate Report ***`));
        copyDir(srcFolder.testresultreport, targetFolder.testresultreport, (err) => {
            if (err) console.error(colors.red(`เกิดข้อผิดพลาดในการออก report`))
        });
       
    } catch (error) {
        console.error(colors.redBright(`running error: ${error}`));
    } finally {
        rmTestImage();
    }
}

main()