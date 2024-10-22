#!/usr/bin/env node
const { exec } = require("child_process");

async function runCommand(command) {
    console.warn(`Running : ${command}`);
    return await new Promise((resolve, reject) => {
        exec(command, { cwd: __dirname, shell: true, stdio: 'inherit' }, (error) => {
            if (error) {
                reject(`Error: ${error.message}`);
            }
            resolve();
        });
    });
}

runCommand("npm i").then(() => {
    require("../index.js");
})
