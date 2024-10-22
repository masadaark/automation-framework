const { spawn } = require('child_process');

let tagCommands = process.argv.find(v => v.startsWith("@")) ?? "@regression-test"
let parallelArr = process.argv.find(v => v.startsWith("parallel:"))?.split(":")
const paramProcess = ['-p', 'default', '--tags', tagCommands]
if(paramProcess?.length > 1){
    paramProcess.push("--parallel")
    paramProcess.push(Number(parallelArr[1]) ?? 1)
}
const cucumberProcess = spawn('cucumber-js', paramProcess, {
    stdio: 'inherit', 
    shell: true
});

cucumberProcess.on('error', (error) => {
    console.error(`error: ${error.message}`);
});

cucumberProcess.on('exit', (code) => {
    if (code !== 0) {
        console.error(`exit code: ${code}`);
    }
});
