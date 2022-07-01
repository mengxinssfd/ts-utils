import fs from 'fs';
import { resolve } from 'path';

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

exports.targets = targets;
