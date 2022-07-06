const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');
const { prompt } = require('enquirer');

const args = require('minimist')(process.argv.slice(2));

const currentVersion = pkg.version;

const pkgs = fs.readdirSync(path.resolve(__dirname, '../packages'));

let targetVersion = args._[0];

console.log(targetVersion);

async function main() {
  if (!targetVersion) {
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      choices: ['patch', 'minor', 'major']
        .map((i) => `${i} (${currentVersion})`)
        .concat(['custom']),
    });
    console.log(release);
  }
}

main();
