const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

const tag = process.argv.find(s=>s.startsWith("@"))
console.warn(`TAG : ${tag}`)

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
function runCommand(command) {
    console.warn(`Running : ${command}`)
    return new Promise((resolve, reject) => {
        exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
            }
            if (stderr) {
                console.log(`stdout: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);
            resolve();
        });
    });
}

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
        fs.rmSync(targetFolder.appsetting, { recursive: true, force: true })
        fs.rmSync(targetFolder.payloads, { recursive: true, force: true })
        fs.rmSync(targetFolder.testcases, { recursive: true, force: true })
        fs.rmSync(srcFolder.testresultreport, { recursive: true, force: true })
    }
}

async function main() {
    try {
        await runCommand("npm i");
        console.warn(`**Read payloads***`)
        copyDir(srcFolder.payloads, targetFolder.payloads);
        console.warn(`**Read testcases***`)
        copyDir(srcFolder.testcases, targetFolder.testcases);
        console.warn(`**Read app-setting.json***`)
        fs.copyFile(srcFolder.appsetting, targetFolder.appsetting, (err) => { if (err) throw `ไม่พบ app-setting.json`; });
        await runCommand(`npm run test:cucumber ${process.argv.slice(2).join(" ")}`);
        console.warn(`***Generate Report***`)
        fs.copyFile(srcFolder.testresultreport, targetFolder.testresultreport, (err) => { if (err) throw `เกิดข้อผิดพลาดในการออก report` });
        rmTestImage();
    } catch (error) {
        console.error(`running error: ${error}`);
    }
}

main();
