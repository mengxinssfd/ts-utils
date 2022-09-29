const path = require('path');
const fs = require('fs');
const { prompt } = require('enquirer');
const chalk = require('chalk');
const tsUtils = require('@mxssfd/core');

const pkgsPath = path.resolve(__dirname, '../packages');

async function getConfig() {
  const config = {
    name: '',
    pkgName: '',
    umdName: '',
    deps: [],
    formats: [],
    private: false,
    description: '',
    keywords: [],
    addToTsUtils: true,
  };

  ({ value: config.name } = await prompt({
    type: 'input',
    name: 'value',
    message: '目录名(dirName)',
    required: true,
    validate(value) {
      if (fs.existsSync(path.resolve(pkgsPath, value))) {
        return '目录已存在！';
      }
      return true;
    },
  }));

  ({ value: config.pkgName } = await prompt({
    type: 'input',
    name: 'value',
    message: '包名(pkgName)',
    initial: '@mxssfd/' + config.name,
    required: true,
  }));

  ({ value: config.umdName } = await prompt({
    type: 'input',
    name: 'value',
    message: '全局umd名(umdName)',
    initial: 'tsUtils' + tsUtils.toCamel(config.name, '-', true),
    required: true,
  }));
  ({ value: config.description } = await prompt({
    type: 'input',
    name: 'value',
    message: '项目描述(description)',
    required: true,
  }));
  ({ value: config.keywords } = await prompt({
    type: 'input',
    name: 'value',
    message: '关键词(keywords)',
    initial: config.name.split('-').join(','),
    required: true,
  }));

  ({ value: config.private } = await prompt({
    type: 'confirm',
    name: 'value',
    message: '是否私有(private)',
    initial: false,
    required: true,
  }));

  const deps = fs.readdirSync(pkgsPath).map((pkg) => {
    return path.basename(pkg);
  });

  ({ value: config.deps } = await prompt({
    type: 'multiselect',
    name: 'value',
    message: '选择依赖(deps)(按空格键选中，enter键确定)',
    choices: deps,
  }));

  ({ value: config.formats } = await prompt({
    type: 'multiselect',
    name: 'value',
    message: '选择打包类型(formats)(按空格键选中，enter键确定)',
    choices: ['esm-bundler', 'esm-browser', 'cjs', 'global'],
  }));

  ({ value: config.addToTsUtils } = await prompt({
    type: 'confirm',
    name: 'value',
    message: '是否添加到tsUtils(addToTsUtils)',
    initial: true,
    required: true,
  }));

  console.log('\n');
  step(JSON.stringify(config, null, 2));
  console.log('\n');
  const { confirm } = await prompt({
    type: 'confirm',
    name: 'confirm',
    message: '确认',
    initial: false,
    required: true,
  });

  if (!confirm) throw 'cancel';

  return config;
}

const step = (msg) => console.log(chalk.cyan(msg));

async function setup() {
  try {
    const config = await getConfig();

    const pkgPath = path.resolve(pkgsPath, config.name);
    const corePath = path.resolve(pkgsPath, 'core');
    const corePkg = require(path.resolve(corePath, 'package.json'));

    // 1.生成pkg目录
    step('生成pkg目录');
    fs.mkdirSync(pkgPath);

    // 2.生成package.json
    step('生成package.json');

    // 拼接package.json
    const pkgContent = `
{
  "name": "${config.pkgName}",
  "version": "${corePkg.version}",
  "description": "${config.description}",
  "main": "index.js",
  "module": "dist/${config.name}.esm-bundler.js",
  "exports": {
    ".": {
      "import": "./dist/${config.name}.esm-bundler.js",
      "require": "./index.js"
    },
    "./": "./dist"
  },
  "types": "dist/${config.name}.d.ts",
  "keywords": ${JSON.stringify(config.keywords.split(','))},
  "files": [
    "index.js",
    "index.mjs",
    "dist"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/mengxinssfd/ts-utils.git"
  },
  "buildOptions": {
    "name": "${config.umdName}",
    "formats": ${JSON.stringify(config.formats)}
  },
  "scripts": {
    "apie": "api-extractor run"
  },
  "dependencies": ${JSON.stringify(
    config.deps.reduce((prev, cur) => {
      prev['@mxssfd/' + cur] = corePkg.version;
      return prev;
    }, {}),
  )},
  "author": "dyh",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/mengxinssfd/ts-utils/issues"
  },
  "homepage": "https://github.com/mengxinssfd/ts-utils/tree/master/packages/${config.name}"
}
  `.trim();
    console.log(pkgContent);
    // 写入
    fs.writeFileSync(
      path.resolve(pkgPath, 'package.json'),
      JSON.stringify(JSON.parse(pkgContent), null, 2),
    );

    // 创建index.js index.mjs
    step('生成index.js index.mjs');
    const jsContent = `
    'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/${config.name}.cjs.prod.js');
} else {
  module.exports = require('./dist/${config.name}.cjs.js');
}
    `.trim();
    fs.writeFileSync(path.resolve(pkgPath, 'index.js'), jsContent);
    fs.copyFileSync(path.resolve(corePath, 'index.mjs'), path.resolve(pkgPath, 'index.mjs'));

    // 创建api-extractor.json
    step('生成api-extractor.json');
    fs.copyFileSync(
      path.resolve(corePath, 'api-extractor.json'),
      path.resolve(pkgPath, 'api-extractor.json'),
    );

    // 创建README.md
    step('创建README.md');
    const mdContent = `
# ${config.pkgName}  
${config.description}
    `.trim();
    fs.writeFileSync(path.resolve(pkgPath, 'README.md'), mdContent);

    // 创建src目录
    step('创建src目录');
    fs.mkdirSync(path.resolve(pkgPath, 'src'));

    // 添加src/index.ts文件
    step('创建src/index.ts文件');
    fs.writeFileSync(path.resolve(pkgPath, 'src/index.ts'), '');

    // 添加__test__目录
    step('创建__test__目录');
    const testDir = path.resolve(pkgPath, '__test__');
    fs.mkdirSync(testDir);
    step('添加__test__/index.test.ts');
    const testContent = `
import * as testTarget from '../src';

describe('${config.pkgName}', function () {
  test('base', () => {
    expect(1).toBe(1);
  });
});
`.trim();
    fs.writeFileSync(path.resolve(testDir, 'index.test.ts'), testContent);

    // 添加到ts-utils
    if (config.addToTsUtils) {
      step('添加到ts-utils');
      const tsUtilsPath = path.resolve(pkgsPath, 'ts-utils');
      const tuPkgPath = path.resolve(tsUtilsPath, 'package.json');

      // 更新package.json
      step('更新ts-utils package.json');
      const tuPkg = require(tuPkgPath);
      /**
       * @type {Record<string, string>}
       */
      const deps = tuPkg.dependencies;
      deps[config.pkgName] = deps['@mxssfd/core'];
      fs.writeFileSync(tuPkgPath, JSON.stringify(tuPkg, null, 2));

      // 更新src/index.ts
      step('更新ts-utils src/index.ts');
      const indexPath = path.resolve(tsUtilsPath, 'src/index.ts');
      const indexContent = fs.readFileSync(indexPath).toString();
      fs.writeFileSync(indexPath, indexContent + `export * from '@mxssfd/${config.name}';\n`);
    }

    step('finish');
  } catch (e) {
    console.log(e);
  }
}
setup();
