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

const actions = {
  lintCheck: () => exec(npmTool, ['lint']),
  jestCheck: () => exec(bin('jest'), ['--no-cache']),
  build: () => exec(npmTool, ['build_new']),
  updateVersions(pkgs, version) {
    function updateDeps(json, depType, version) {
      const dep = json[depType];
      for (const k in dep) {
        if (k.startsWith('@mxssfd')) {
          console.log(chalk.yellow(`${json.name} -> ${depType} -> ${k}@${version}`));
          dep[k] = version;
        }
      }
    }
    function updatePackage(pkgPath, version) {
      const file = fs.readFileSync(pkgPath).toString();
      const json = JSON.parse(file);
      json.version = version;
      updateDeps(json, 'devDependencies', version);
      updateDeps(json, 'dependencies', version);
      updateDeps(json, 'peerDependencies', version);
      fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2));
    }
    for (const pkg of pkgs) {
      updatePackage(path.resolve(__dirname, `../packages/${pkg}/package.json`), version);
    }
    updatePackage(path.resolve(__dirname, `../package.json`), version);
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
      .concat([{ hint: `custom cur(${currentVersion})`, value: 'custom' }]),
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
  //  if (!config.skipTest) {
  //    await actions.lintCheck();
  //    await actions.jestCheck();
  //  }

  step('\nRunning update versions...');
  await actions.updateVersions(config.pkgs, config.targetVersion);

  step('\nRunning build...');
  //  if (!config.skipBuild) {
  //    await actions.build();
  //  }
  await actions.release(config);
  console.log(config);

  console.log('end');
}

setup().catch(() => {
  actions.updateVersions(baseConfig.pkgs, baseConfig.currentVersion);
});
