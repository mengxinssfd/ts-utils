const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');
const { prompt } = require('enquirer');
const execa = require('execa');

const args = require('minimist')(process.argv.slice(2));

const npmTool = 'yarn';

const bin = (name) => path.resolve(__dirname, '../node_modules/.bin/' + name);

/**
 * @param {string} bin
 * @param {string[]} args
 * @param {{}} opts
 */
const exec = (
  bin,
  args,
  opts = {
    /*execPath: path.resolve(__dirname, '../')*/
  },
) => execa(bin, args, { stdio: 'inherit', ...opts });

const actions = {
  lintCheck: () => exec(npmTool, ['lint']),
  jestCheck: () => exec(bin('jest'), ['--no-cache']),
  build: () => exec(npmTool, ['build_new']),
  release(config) {
    // todo
  },
};

const baseConfig = {
  pkgs: fs.readdirSync(path.resolve(__dirname, '../packages')),
  targetVersion: args._[0],
  skipTest: args.skipTest,
  skipBuild: args.skipBuild,
  currentVersion: pkg.version,
};

async function getConfig() {
  const config = {
    ...baseConfig,
  };
  if (!config.targetVersion) {
    ({ release: config.targetVersion } = await prompt({
      type: 'select',
      name: 'release',
      choices: ['patch', 'minor', 'major']
        .map((i) => `${i} (${config.currentVersion})`)
        .concat(['custom']),
    }));
  }
  return config;
}

async function setup() {
  console.log('start');

  const config = await getConfig();
  //  const config = {};
  if (!config.skipTest) {
    await actions.lintCheck();
    await actions.jestCheck();
  }
  if (!config.skipBuild) {
    await actions.build();
  }
  await actions.release(config);
  // console.log(config);

  console.log('end');
}

setup();
