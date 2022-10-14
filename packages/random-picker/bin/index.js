#!/usr/bin/env node

const { RandomPicker } = require('../dist/random-picker.cjs');

/**
 * @returns {
 * {
 * help?:boolean;h?:boolean;
 * pick?:boolean|number;p?:boolean|number;
 * take?:boolean|number;t?:boolean;
 * options:(number | string| [string|number,number])[]
 * }
 * }
 */
function getOptions() {
  const args = process.argv.slice(2);

  const keyReg = /^-+/;
  return args.reduce((result, cur, index) => {
    const next = args[index + 1];
    if (keyReg.test(cur)) {
      const key = cur.replace(keyReg, '');
      // --take 2 获取take后面的2
      result[key] = /^\d+$/.test(next) ? Number(next) ?? true : true;
    } else if (/^\[.+]$/.test(cur)) {
      // 随机选项
      try {
        result.options = JSON.parse(cur);
      } catch (e) {
        throw new TypeError('请检查选项数组是否符合JSON格式');
      }
    }
    return result;
  }, {});
}

function showHelp() {
  const helpContent = `
--help/-h 帮助
--take/-t 使用take获取随机选项  获取2个随机选项--take 2 '[1,2]'
--pick/-p 使用pick获取随机选项 同take
`.trim();
  console.log(helpContent);
}

/**
 *
 * @param {(string|number)[]} options
 * @param {boolean|number} take
 * @param {boolean|number} pick
 */
function runRP(options, take, pick) {
  const rm = new RandomPicker(options);

  const result = take
    ? rm.take(typeof take === 'number' ? take : 1)
    : rm.pick(typeof pick === 'number' ? pick : 1);

  console.log(result);
}

function setup() {
  const options = getOptions();

  if (options.h || options.help) {
    showHelp();
    return;
  }

  if (!Array.isArray(options.options)) {
    throw new Error('缺少选项');
  }

  runRP(options.options, options.take ?? options.t, options.pick ?? options.p);
}
setup();
