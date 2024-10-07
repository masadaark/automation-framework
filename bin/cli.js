#!/usr/bin/env node

const { exec } = require("child_process");

function runCommand(command) {
    console.warn(`Running : ${command}`)
    return new Promise((resolve, reject) => {
        exec(command, { cwd: __dirname, shell: true, stdio: 'pipe' }, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
            }
            if (stderr) console.log(stderr);
            console.log(stdout);
            resolve();
        });
    });
}

runCommand("npm i --force").then(() => {
    require("../index.js");
})

