// 数字计算
/**
 * 把错误的数据转正  from number-precision
 * strip(0.09999999999999998)=0.1
 */
export function strip(num, precision = 12) {
    return +parseFloat(num.toPrecision(precision));
}
// 获取小数点后面数字的长度  // 支持科学计数法from number-precision
export function getNumberLenAfterDot(num) {
    Number(1000).toPrecision();
    const eSplit = String(num).split(/[eE]/);
    const len = (eSplit[0].split(".")[1] || "").length - (+(eSplit[1] || 0));
    return len > 0 ? len : 0;
}
// (10.10, 1.00001) => 100000
export function getCommonPow(a, b) {
    let aLen = getNumberLenAfterDot(a);
    let bLen = getNumberLenAfterDot(b);
    return Math.pow(10, Math.max(aLen, bLen));
}
export function calcArr(num, nums, callback) {
    return nums.reduce((a, b) => {
        const pow = getCommonPow(a, b);
        return callback(a, b, pow);
    }, num);
}
/**
 * 科学计数法转普通小数
 * @note 不能转太大的数 比如大于Number.MAX_SAFE_INTEGER
 * @param num
 */
export function toNonExponential(num) {
    // toExponential 转为科学计数法
    // const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    const sNum = String(num);
    const m = sNum.match(/\d(?:\.(\d*))?e([+-]\d+)/);
    if (num > Number.MAX_SAFE_INTEGER || !m || m.length < 3)
        return sNum;
    return num.toFixed(Math.max(0, (m[1] || "").length - Number(m[2])));
}
export function plus(num, ...nums) {
    return calcArr(num, nums, (a, b, pow) => (a * pow + b * pow) / pow);
}
export function minus(num, ...nums) {
    return calcArr(num, nums, (a, b, pow) => (a * pow - b * pow) / pow);
}
export function times(num, ...nums) {
    return calcArr(num, nums, (a, b, pow) => pow * a * (b * pow) / (pow * pow));
}
export function divide(num, ...nums) {
    return calcArr(num, nums, (a, b, pow) => a * pow / (b * pow));
}