const { spawn } = require('child_process');

let tagCommands = process.argv.find(v => v.startsWith("@")) ?? "@regression-test"

const cucumberProcess = spawn('cucumber-js', ['-p', 'default', '--tags', tagCommands], {
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
