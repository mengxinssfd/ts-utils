const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');
const { prompt } = require('enquirer');

const args = require('minimist')(process.argv.slice(2));

const currentVersion = pkg.version;

const pkgs = fs.readdirSync(path.resolve(__dirname, '../packages'));

let targetVersion = args._;

async function main() {
  if(!targetVersion){

  }
}

main();
