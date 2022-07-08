const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');
const { prompt } = require('enquirer');
const execa = require('execa');
const semver = require('semver');

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
  // semver.prerelease('1.2.3-alpha.3') -> [ 'alpha', 3 ]
  preId: args.preId || semver.prerelease(pkg.version)?.[0],
};

async function getConfig() {
  const config = {
    ...baseConfig,
  };

  const versionIncrements = [
    'patch',
    'minor',
    'major',
    ...(config.preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
  ];
  if (!config.targetVersion) {
    ({ release: config.targetVersion } = await prompt({
      type: 'select',
      name: 'release',
      choices: versionIncrements.map((i) => `${i} (${config.currentVersion})`).concat(['custom']),
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
