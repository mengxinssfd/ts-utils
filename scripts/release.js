const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');
const { prompt } = require('enquirer');

const args = require('minimist')(process.argv.slice(2));

const pkgs = fs.readdirSync(path.resolve(__dirname, '../packages'));

const targetVersion = args._[0];

async function getConfig() {
  const config = {
    pkgs,
    targetVersion,
    currentVersion: pkg.version,
  };
  if (!targetVersion) {
    ({ release: config.targetVersion } = await prompt({
      type: 'select',
      name: 'release',
      choices: ['patch', 'minor', 'major']
        .map((i) => `${i} (${config.currentVersion})`)
        .concat(['custom']),
    }));
  }
}

async function setup() {
  const config = await getConfig();
  console.log(config);
}

setup();
