let common = [
    'testcases/**/*.feature',
    '--require-module ts-node/register',
    '--require ./testcases/testScripts/**/*.ts',
    // '--format progress-bar',
    // `--format-options '{"snippetInterface": "synchronous"}'`,
    `--tags @feature2`,
    `--format json:./test_result.json`,
  ].join(' ');

module.exports = {
    default: common
}