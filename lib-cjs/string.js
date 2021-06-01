"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartRepeat = exports.strRepeat = exports.subString = exports.removeStrByNum = exports.chinese2Number = exports.number2Chinese = exports.strPadEnd = exports.strPadStart = exports.strTemplate = exports.thousandFormat = void 0;
/**
 * 千位分隔 1,234,567,890
 * @param num
 */
function thousandFormat(num) {
    return String(num).replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}
exports.thousandFormat = thousandFormat;
// 给不能用``模板字符串的环境使用
// es5的格式化字符串 example: strTemplate("11%s111%s", 3, 4) => "1131114"
function strTemplate(str, ...params) {
    /*
    // es5; typescript不需要str, ...params参数
    var args = Array.prototype.slice.call(arguments, 0);
    if (!args.length) return "";
    var str = args[0];
    var params = args.slice(1);
    */
    return str.replace(/%s/g, function () {
        return params.length ? params.shift() : "";
    });
}
exports.strTemplate = strTemplate;
/**
 * 给长度不满足要求的字符串添加前缀 strFillPrefix
 * @param target
 * @param maxLen
 * @param [fill=' '] 默认fill=" "
 */
function strPadStart(target, maxLen, fill = " ") {
    if (target.length >= maxLen || fill === "")
        return target;
    const lessLen = maxLen - target.length;
    while (fill.length < lessLen) {
        fill += fill;
    }
    fill = fill.substr(0, lessLen);
    return fill + target;
}
exports.strPadStart = strPadStart;
/**
 * 给长度不满足要求的字符串添加后缀 strFillPrefix
 * @param target
 * @param maxLen
 * @param [fill=" "] 默认fill=" "
 */
function strPadEnd(target, maxLen, fill = " ") {
    if (target.length >= maxLen || fill === "")
        return target;
    let lessLen = maxLen - target.length;
    let end = strPadStart(target, maxLen, fill).substr(0, lessLen);
    return target + end;
}
exports.strPadEnd = strPadEnd;
const numberArr = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const sbq = ["十", "百", "千"];
const units = ["", ...sbq, "万", ...sbq, "亿"];
const unitLen = units.length;
/**
 * 阿拉伯数字转为中文数字
 * @param number
 */
const number2Chinese = function (number) {
    let key = ~~number;
    let chineseNumber = "";
    let times = 0;
    // 个位数
    if (number >= 0 && number < 10)
        return exports.number2Chinese.numbers[number];
    while (key >= 1 && times < unitLen) {
        let unit = exports.number2Chinese.units[times];
        // 11 % 10 => 一
        let end = exports.number2Chinese.numbers[key % 10];
        // 101 0没有单位
        if (end !== exports.number2Chinese.numbers[0]) {
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
    return chineseNumber.replace(/(零+$)|((零)\3+)/g, "$3");
};
exports.number2Chinese = number2Chinese;
exports.number2Chinese.units = [...units];
exports.number2Chinese.numbers = [...numberArr];
/**
 * 中文转为阿拉伯数字
 * @param chineseNumber
 */
const chinese2Number = function (chineseNumber) {
    if (new RegExp(`([^${exports.chinese2Number.units.join() + exports.chinese2Number.numbers.join()}])`).test(chineseNumber)) {
        throw new TypeError("发现不符合规则的字符(必须在units和numbers里存在的字符):" + RegExp.$1);
    }
    // 用万和亿分割
    const arr = chineseNumber.split(new RegExp(`[${exports.chinese2Number.units[4]}${exports.chinese2Number.units[8]}]`, "g"));
    const numberArr = arr.map((it) => {
        let res = 0;
        let unit = 1;
        // 从个位数往大数累加
        for (let i = it.length - 1; i > -1; i--) {
            const item = it[i];
            let number = exports.chinese2Number.numbers.indexOf(item);
            if (number > 0) {
                res += number * unit;
            }
            let unitIndex = exports.chinese2Number.units.indexOf(item);
            unit = unitIndex > 0 ? 10 ** unitIndex : unit;
        }
        // 以十开头的要单独列出来 例如十一完全体是一十一
        if (it[0] === exports.chinese2Number.units[1]) {
            res += 10;
        }
        return res;
    });
    // 把分割开的数字拼接回去
    return numberArr.reverse().reduce((res, item, index) => {
        return res + 10000 ** index * item;
    }, 0);
};
exports.chinese2Number = chinese2Number;
exports.chinese2Number.units = [...units];
exports.chinese2Number.numbers = [...numberArr];
/**
 * 从字符串中删除指定字符串(from)中重复的第n(num)个字符串(str)
 * @example
 * removeSlashByNum("123/456/78", 2, "\/"); // "123/45678"
 * @param from
 * @param num
 * @param removeStr
 */
function removeStrByNum(from, num, removeStr) {
    let times = 1;
    return String(from).replace(new RegExp(removeStr, "g"), v => times++ === num ? "" : v);
}
exports.removeStrByNum = removeStrByNum;
/**
 * 切割字符串
 * @param str
 * @param start
 * @param {number?} [end=str.length] end为正数时与String.prototype.substring效果一致，为负数时相当于end+str.length
 */
function subString(str, start, end = str.length) {
    if (end < 0) {
        end += str.length;
    }
    return str.substring(start, end);
}
exports.subString = subString;
/**
 * 与String.prototype.repeat相同
 * String.prototype.repeat支持到ie11
 * @param value
 * @param repeatCount
 */
function strRepeat(value, repeatCount) {
    if (repeatCount < 0 || repeatCount * value.length > strRepeat.MAX_STR_LENGTH)
        throw new RangeError("strRepeat Invalid repeatCount value");
    let result = "";
    if (value === "")
        return "";
    while (repeatCount-- > 0) {
        result += value;
    }
    return result;
}
exports.strRepeat = strRepeat;
strRepeat.MAX_STR_LENGTH = 512 * 1024 * 1024;
/**
 * 根据模板创建出字符串  除了面试题找不到应用场景的函数
 * @example
 * smartRepeat("2[2[a]2[b]]") // returns "aabbaabb"
 * @param format
 */
function smartRepeat(format) {
    let exec;
    const re = /(\d+)\[([^\[\]]+)](?!\d+\[)/;
    while (exec = re.exec(format)) {
        const [, count, repeatValue] = exec;
        // 第一种方式
        format = format.replace(re, strRepeat(repeatValue, count));
        // 第二种方式
        // const start = format.substring(0, exec.index);
        // const end = format.substring(exec.index + exec[0].length);
        // format = start + strRepeat(repeatValue, count) + end;
    }
    return format;
}
exports.smartRepeat = smartRepeat;
