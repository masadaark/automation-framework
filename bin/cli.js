#!/usr/bin/env node

const { spawn } = require("child_process");

function runCommand(command) {
    // console.warn(`Running : ${command}`)
    return new Promise((resolve,reject) => {
        const child = spawn(command, {
            stdio: 'inherit',cwd: __dirname, 
            shell: true
        });
        child.on('error', (error) => {
            console.error(`error: ${error.message}`);
        });

        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } if (code !== 0) {
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
}

runCommand("npm i").then(() => {
    require("../index.js");
}).catch((err)=>{
    console.error(`Building Error : ${err}`)
})


