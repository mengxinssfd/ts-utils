"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.divide = exports.times = exports.minus = exports.plus = exports.toNonExponential = exports.calcArr = exports.getCommonPow = exports.getNumberLenAfterDot = exports.strip = void 0;
// 数字计算
/**
 * 把错误的数据转正  from number-precision
 * strip(0.09999999999999998)=0.1
 */
function strip(num, precision = 12) {
    return +parseFloat(num.toPrecision(precision));
}
exports.strip = strip;
// 获取小数点后面数字的长度  // 支持科学计数法from number-precision
function getNumberLenAfterDot(num) {
    Number(1000).toPrecision();
    const eSplit = String(num).split(/[eE]/);
    const len = (eSplit[0].split(".")[1] || "").length - (+(eSplit[1] || 0));
    return len > 0 ? len : 0;
}
exports.getNumberLenAfterDot = getNumberLenAfterDot;
// (10.10, 1.00001) => 100000
function getCommonPow(a, b) {
    let aLen = getNumberLenAfterDot(a);
    let bLen = getNumberLenAfterDot(b);
    return Math.pow(10, Math.max(aLen, bLen));
}
exports.getCommonPow = getCommonPow;
function calcArr(num, nums, callback) {
    return nums.reduce((a, b) => {
        const pow = getCommonPow(a, b);
        return callback(a, b, pow);
    }, num);
}
exports.calcArr = calcArr;
/**
 * 科学计数法转普通小数
 * @note 不能转太大的数 比如大于Number.MAX_SAFE_INTEGER
 * @param num
 */
function toNonExponential(num) {
    // toExponential 转为科学计数法
    // const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    const sNum = String(num);
    const m = sNum.match(/\d(?:\.(\d*))?e([+-]\d+)/);
    if (num > Number.MAX_SAFE_INTEGER || !m || m.length < 3)
        return sNum;
    return num.toFixed(Math.max(0, (m[1] || "").length - Number(m[2])));
}
exports.toNonExponential = toNonExponential;
function plus(num, ...nums) {
    return calcArr(num, nums, (a, b, pow) => (a * pow + b * pow) / pow);
}
exports.plus = plus;
function minus(num, ...nums) {
    return calcArr(num, nums, (a, b, pow) => (a * pow - b * pow) / pow);
}
exports.minus = minus;
function times(num, ...nums) {
    return calcArr(num, nums, (a, b, pow) => pow * a * (b * pow) / (pow * pow));
}
exports.times = times;
function divide(num, ...nums) {
    return calcArr(num, nums, (a, b, pow) => a * pow / (b * pow));
}
exports.divide = divide;
