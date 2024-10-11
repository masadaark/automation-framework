const fs = require('fs');
const path = require("path");
const colors = require('ansi-colors');
const figlet = require('figlet');
const { exec } = require('child_process');

console.log(colors.green.bold(figlet.textSync('Ghostfreak', { font: 'Ghost', horizontalLayout: 'full' })));

const tagEvent = process.argv.find(s => s.startsWith("@")) ?? "@regression-test"
console.log(colors.green.bold(`TAG : ${tagEvent}`))

const srcFolder = {
    payloads: path.resolve(__dirname, '../../payloads'),
    testcases: path.resolve(__dirname, '../../testcases'),
    appsetting: path.resolve(__dirname, '../../app-setting.json'),
    testresultreport: path.resolve(__dirname, 'test_result_report.json')
}
const targetFolder = {
    payloads: path.resolve(__dirname, 'payloads'),
    testcases: path.resolve(__dirname, 'testcases/features'),
    appsetting: path.resolve(__dirname, 'app-setting.json'),
    testresultreport: path.resolve(__dirname, '../../test_result_report.json')
}

const testRunner = () => {
    return new Promise((resolve, reject) => {
        exec(`npm run test:cucumber ${tagEvent}`, { cwd: __dirname, shell: true, stdio: 'pipe' }, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
            }
            if (stderr) console.log(colors.green(stderr));
            console.log(colors.green(stdout));
            resolve();
        });
    });
};

const copyDir = (src, dest) => {
    const copy = (copySrc, copyDest) => {
        fs.readdir(copySrc, (err, list) => {
            if (err) {
                console.log(err);
                return;
            }
            list.forEach((item) => {
                const srcPath = path.resolve(copySrc, item);
                const destPath = path.resolve(copyDest, item);
                fs.stat(srcPath, (err, stat) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    if (stat.isFile()) {
                        fs.createReadStream(srcPath).pipe(fs.createWriteStream(destPath));
                    } else if (stat.isDirectory()) {
                        fs.mkdir(destPath, { recursive: true }, (err) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            copy(srcPath, destPath);
                        });
                    }
                });
            });
        });
    };

    fs.access(dest, (err) => {
        if (err) {
            fs.mkdir(dest, { recursive: true }, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                copy(src, dest);
            });
        } else {
            copy(src, dest);
        }
    });
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
        console.log(colors.blueBright(`** Generate Report ***`));
        fs.copyFile(srcFolder.testresultreport, targetFolder.testresultreport, (err) => {
            if (err) console.error(colors.red(`เกิดข้อผิดพลาดในการออก report`))
        });
        rmTestImage();
    } catch (error) {
        console.error(colors.redBright(`running error: ${error}`));
    }
}

main()