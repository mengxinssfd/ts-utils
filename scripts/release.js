const path = require('path');
const fs = require('fs');
const pkg = require('../package.json');
const { prompt } = require('enquirer');
const execa = require('execa');
const semver = require('semver');
const chalk = require('chalk');

const args = require('minimist')(process.argv.slice(2));

const npmTool = 'yarn';

const bin = (name) => path.resolve(__dirname, '../node_modules/.bin/' + name);
const step = (msg) => console.log(chalk.cyan(msg));

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

const updateVersions = {
  updatePackage() {},
  updateDeps() {},
};

const actions = {
  lintCheck: () => exec(npmTool, ['lint']),
  jestCheck: () => exec(bin('jest'), ['--no-cache']),
  build: () => exec(npmTool, ['build_new']),
  updateVersions() {
    // todo
  },
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
  preId: args.preid || semver.prerelease(pkg.version)?.[0],
};

const inc = (i) => semver.inc(baseConfig.currentVersion, i, baseConfig.preId);

async function getVersion(preId, currentVersion) {
  let targetVersion;
  const versionIncrements = [
    'patch',
    'minor',
    'major',
    ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
  ];
  const { release } = await prompt({
    type: 'select',
    name: 'release',
    choices: versionIncrements
      .map((i) => ({ hint: i, value: inc(i) }))
      .concat([{ hint: 'custom', value: 'custom' }]),
  });
  if (release === 'custom') {
    ({ version: targetVersion } = await prompt({
      type: 'input',
      name: 'version',
      message: 'Input custom version',
      initial: currentVersion,
    }));
  } else {
    targetVersion = release;
  }
  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }
  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  });

  if (!yes) {
    throw new Error(`select NO`);
  }
  return targetVersion;
}

async function getConfig() {
  const config = {
    ...baseConfig,
  };

  config.targetVersion ||= await getVersion(config.preId, config.currentVersion);

  return config;
}

async function setup() {
  console.log('start');

  const config = await getConfig();
  //    const config = {};
  step('\nRunning tests...');
  if (!config.skipTest) {
    await actions.lintCheck();
    await actions.jestCheck();
  }

  step('\nRunning update versions...');
  await actions.updateVersions(config.targetVersion);

  step('\nRunning build...');
  if (!config.skipBuild) {
    await actions.build();
  }
  await actions.release(config);
  console.log(config);

  console.log('end');
}

setup();
