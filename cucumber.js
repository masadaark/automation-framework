let common = [
    'testcases/**/*.feature',
    '--require-module ts-node/register',
    '--require ./testcases/testScripts/**/*.ts',
    // '--format progress-bar',
    // `--format-options '{"snippetInterface": "synchronous"}'`,
    `--format json:reports/cucumber-temp-report.json`,
  ].join(' ');

module.exports = {
    default: common
}