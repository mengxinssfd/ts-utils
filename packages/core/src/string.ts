import type { StrTemplate, Tuple, TupleM2N } from '@mxssfd/types';
import { ToCamelCase } from '@mxssfd/types';

/**
 * Number.prototype.toLocaleString 也能转成千位分隔数字字符串
 * 千位分隔 1,234,567,890
 * @param num
 * @param [isFormatDecimalPlaces=false] 是否格式化小数位
 * @param [delimiter = ","]
 */
export function thousandFormat(
  num: string | number,
  isFormatDecimalPlaces = false,
  delimiter = ',',
): string {
  // 123123.1111 => 123,123.1,111
  // return String(num).replace(/\B(?=(?:\d{3})+(?!\d))/g, delimiter);
  const split = String(num).split('.') as TupleM2N<string, 1, 2>;
  split[0] = split[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, delimiter);
  if (split.length === 1 || !isFormatDecimalPlaces) return split.join('.');
  split[1] = split[1].replace(/(\d{3})/g, `$1${delimiter}`);
  return split.join('.').replace(new RegExp(`${delimiter}$`), '');
}

// 给不能用``模板字符串的环境使用
// es5的格式化字符串 example: strTemplate("11%s111%s", 3, 4) => "1131114"
// 都是字符串的话ts提示会直接拼接好字符串
export function strTemplate<T extends string, S extends string[]>(
  str: T,
  ...params: S
): StrTemplate<T, S>;
// 这样的ts提示不准确，%s会变为类型而不是字面值
export function strTemplate<T extends string, S extends any[]>(
  str: T,
  ...params: S
): StrTemplate<T, S>;
export function strTemplate(str: string, ...params: any[]) {
  /*
    // es5; typescript不需要str, ...params参数`
    var args = Array.prototype.slice.call(arguments, 0);
    if (!args.length) return "";
    var str = args[0];
    var params = args.slice(1);
    */
  return (str as any).replace(/%s/g, function () {
    return params.length ? params.shift() : '';
  }) as any;
}
/**
 * 给长度不满足要求的字符串添加前缀 strFillPrefix
 * @param target
 * @param maxLen
 * @param [fill=' '] 默认fill=" "
 * @param [clearMore=false]
 */
export function strPadStart(target: string, maxLen: number, fill = ' ', clearMore = false): string {
  if (target.length >= maxLen || fill === '') {
    if (clearMore) {
      // 切掉多余的部分
      return target.substr(target.length - maxLen);
    }
    return target;
  }
  // 缺少的长度
  const lessLen = maxLen - target.length;
  // 填充补足不够的部分
  while (fill.length < lessLen) {
    fill += fill;
  }
  // 切除多余部分 fill是多个字符时补足的长度可能会超出
  fill = fill.substr(0, lessLen);
  // 补足前缀
  return fill + target;
}

/**
 * 给长度不满足要求的字符串添加后缀 strFillPrefix
 * @param target
 * @param maxLen
 * @param [fill=" "] 默认fill=" "
 * @param [clearMore=false]
 */
export function strPadEnd(target: string, maxLen: number, fill = ' ', clearMore = false): string {
  if (target.length >= maxLen || fill === '') {
    if (clearMore) {
      return target.substr(0, maxLen);
    }
    return target;
  }
  const lessLen = maxLen - target.length;
  const end = strPadStart(target, maxLen, fill).substr(0, lessLen);
  return target + end;
}

const numberArr: Tuple<string, 10> = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const sbq = ['十', '百', '千'];
const units: any = ['', ...sbq, '万', ...sbq, '亿'] as const;
const unitLen: number = units.length;

export interface Number2Chinese {
  (number: number): string;

  units: string[];
  numbers: Tuple<string, 10>;
}

/**
 * 阿拉伯数字转为中文数字
 * @param number
 */
export const number2Chinese: Number2Chinese = function (number): string {
  let key = ~~number;
  let chineseNumber = '';
  let times = 0;
  // 个位数
  if (number >= 0 && number < 10) return number2Chinese.numbers[number] as string;
  while (key >= 1 && times < unitLen) {
    const unit = number2Chinese.units[times];
    // 11 % 10 => 一
    const end = number2Chinese.numbers[key % 10];
    // 101 0没有单位
    if (end !== number2Chinese.numbers[0]) {
      chineseNumber = unit + chineseNumber;
    }
    // 11 => 一十一 => 十一
    if (!(key === 1 && times === 1)) {
      chineseNumber = end + chineseNumber;
    }
    key = ~~(key / 10);
    times++;
  }
  // 一万零零一 => 一万零一 | 一万零零零 => 一万
  return chineseNumber.replace(/(零+$)|((零)\3+)/g, '$3');
};
number2Chinese.units = [...units];
number2Chinese.numbers = [...numberArr];

export interface Chinese2Number {
  (chineseNumber: string): number;

  units: string[];
  numbers: string[];
}

/**
 * 中文转为阿拉伯数字
 * @param chineseNumber
 */
export const chinese2Number: Chinese2Number = function (chineseNumber) {
  if (
    new RegExp(`([^${chinese2Number.units.join() + chinese2Number.numbers.join()}])`).test(
      chineseNumber,
    )
  ) {
    throw new TypeError('发现不符合规则的字符(必须在units和numbers里存在的字符):' + RegExp.$1);
  }

  // 用万和亿分割
  const arr = chineseNumber.split(
    new RegExp(`[${chinese2Number.units[4]}${chinese2Number.units[8]}]`, 'g'),
  );
  const numberArr = arr.map((it) => {
    let res = 0;
    let unit = 1;
    // 从个位数往大数累加
    for (let i = it.length - 1; i > -1; i--) {
      const item = it[i] as string;

      const number = chinese2Number.numbers.indexOf(item);
      if (number > 0) {
        res += number * unit;
      }

      const unitIndex = chinese2Number.units.indexOf(item);
      unit = unitIndex > 0 ? 10 ** unitIndex : unit;
    }

    // 以十开头的要单独列出来 例如十一完全体是一十一
    if (it[0] === chinese2Number.units[1]) {
      res += 10;
    }
    return res;
  });

  // 把分割开的数字拼接回去
  return numberArr.reverse().reduce((res, item, index) => {
    return res + 10000 ** index * item;
  }, 0);
};
chinese2Number.units = [...units];
chinese2Number.numbers = [...numberArr];

/**
 * 从字符串中删除指定字符串(from)中重复的第n(num)个字符串(str)
 * @example
 * removeStrByNum("123/456/78", 2, "\/"); // "123/45678"
 * @param from 原字符串
 * @param num 要移除的字符串出现的第几次
 * @param removeStr 要查找并移除的字符串
 */
export function removeStrByNum(from: string, num: number, removeStr: string): string {
  let times = 1;
  return String(from).replace(new RegExp(removeStr, 'g'), (v) => (times++ === num ? '' : v));
}

/**
 * 切割字符串
 * @param str
 * @param start
 * @param {number?} [end=str.length] end为正数时与String.prototype.substring效果一致，为负数时相当于end+str.length
 */
export function subString(str: string, start: number, end = str.length): string {
  if (end < 0) {
    end += str.length;
  }
  return str.substring(start, end);
}

/**
 * 与String.prototype.repeat相同
 * String.prototype.repeat支持到ie11
 * @param value
 * @param repeatCount
 */
export function strRepeat(value: string, repeatCount: number): string {
  if (repeatCount < 0 || repeatCount * value.length > strRepeat.MAX_STR_LENGTH)
    throw new RangeError('strRepeat Invalid repeatCount value');
  let result = '';
  if (value === '') return '';
  while ((repeatCount as number)-- > 0) {
    result += value;
  }
  return result;
}

strRepeat.MAX_STR_LENGTH = 512 * 1024 * 1024;

/**
 * 根据模板创建出字符串  除了面试题找不到应用场景的函数
 * @example
 * smartRepeat("2[2[a]2[b]]") // returns "aabbaabb"
 * @param format
 */
export function smartRepeat(format: string): string {
  let exec;

  const re = /(\d+)\[([^[\]]+)](?!\d+\[)/;
  while ((exec = re.exec(format))) {
    const [, count, repeatValue] = exec;
    // 第一种方式
    format = format.replace(re, strRepeat(repeatValue as string, Number(count)));
    // 第二种方式
    // const start = format.substring(0, exec.index);
    // const end = format.substring(exec.index + exec[0].length);
    // format = start + strRepeat(repeatValue, count) + end;
  }
  return format;
}

/**
 * 首字母大写
 * @param  value
 */
export function capitalize<S extends string>(value: S): Capitalize<S> {
  if (!value.length) return value as any;
  const first = value[0] as string;
  return `${first.toUpperCase()}${value.substring(1).toLowerCase()}` as any;
}

/**
 * 从驼峰转其他命名格式
 * @param {string} value
 * @param [delimiter='_']
 * @param [toUpperCase=false] // 为true时 转为全大写的格式
 * @return {string}
 */
export function fromCamel(value: string, delimiter = '_', toUpperCase = false) {
  const res = value.replace(/([A-Z]+)/g, (_p1, p2, index) => {
    return (index > 0 ? delimiter : '') + p2.toLowerCase();
  });
  return toUpperCase ? res.toUpperCase() : res;
}

/**
 * 其他转驼峰
 * @param {string} value
 * @param {string | RegExp} delimiter
 * @param {boolean} toUpperCamelCase
 * @return {string}
 */
export function toCamel<
  S extends string,
  D extends string | RegExp = '_',
  U extends boolean = false,
>(
  value: S,
  delimiter: D = '_' as D,
  toUpperCamelCase: U = false as U,
): D extends string
  ? U extends true
    ? Capitalize<ToCamelCase<S, D>>
    : ToCamelCase<S, D>
  : string {
  if (!value.length) return value as any;
  const reg = typeof delimiter === 'string' ? new RegExp(delimiter + '+') : (delimiter as RegExp);
  const join = value.split(reg).map((i) => capitalize(i) as string);

  if (!toUpperCamelCase && join.length) {
    join[0] = (join[0] as string).toLowerCase();
  }
  return join.join('') as any;
}

/**
 * 获取字符串实际长度，String.prototype.length获取的是utf-16的长度
 *
 * @example
 *
 * const str = '😂👱👬👨‍👩‍👧👨‍👩‍👧‍👦👨‍👩‍👧‍👦👨‍👧👩‍👧‍👧; // 8个表情，包含组合表情
 * console.log(str.length); // 49
 * console.log(getStringLen(str)); // 8
 *
 * const str2 = '🙎🏿'; // 黑皮肤表情
 * console.log(str2.length); // 4
 * console.log(getStringLen(str2)); // 1
 *
 * @param value 要获取长度的字符串
 * @returns 字符串实际长度
 */
export function getStringLen(value: string): number {
  // https://www.zhihu.com/question/38324041
  // underscore.js toArray
  // const reg = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;

  // 参考 https://juejin.cn/post/6941276804472635405
  // '😂1👱1👬1👨‍👩‍👧1👨‍👩‍👧‍👦23'.split('')
  // 8205 是通过 [...'👨‍👩‍👧‍👦123123123'].forEach((v) => console.log(v.codePointAt(0))); 获取的
  // const emojiDelimiter = String.fromCodePoint(8205); // emoji分隔符：该字符看上去很像空格
  const emojiDelimiter = '\u200D'; // (8205).toString(16)
  const symbol = '[\ud800-\udbff][\udc00-\udfff]';

  // 👱🏼‍👱🏿‍皮肤颜色 参考 https://zhuanlan.zhihu.com/p/328516890
  const skinColor = '\ud83c[\udffc-\udfff]';

  return (
    value
      // 先匹配组合表情符号
      .replace(new RegExp(`${symbol}(${emojiDelimiter}${symbol})+`, 'g'), '_')
      // 再匹配有皮肤的表情符号
      .replace(new RegExp(`${symbol}${skinColor}`, 'g'), '_')
      // 然后匹配普通表情符号
      .replace(new RegExp(symbol, 'g'), '_').length
  );
}
