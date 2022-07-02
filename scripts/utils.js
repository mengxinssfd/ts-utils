const fs = require('fs');
const { resolve, basename } = require('path');
const chalk = require('chalk');

const targets = fs.readdirSync(resolve(__dirname, '../packages')).filter((f) => {
  if (!fs.statSync(resolve(__dirname, `../packages/${f}`)).isDirectory()) {
    return false;
  }
  const pkg = require(`../packages/${f}/package.json`);
  if (pkg.private && !pkg.buildOptions) {
    return false;
  }
  return true;
});
function checkFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const file = fs.readFileSync(filePath);
  const minSize = (file.length / 1024).toFixed(2) + 'kb';
  console.log(`${chalk.gray(chalk.bold(basename(filePath)))} min:${minSize}`);
}
Object.assign(exports, { targets, checkFileSize });
