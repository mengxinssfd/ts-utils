"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomColor = exports.randomHEX = exports.randomRGBA = exports.randomRGB = exports.shuffle = exports.randomItem = exports.randomInt = exports.randomFloat = void 0;
const array_1 = require("./array");
const clone_1 = require("./clone");
const string_1 = require("./string");
const dataType_1 = require("./dataType");
function randomFloat(min, max, len) {
    // randomFloat()
    if (!arguments.length)
        return Math.random();
    // randomFloat(max)
    if (arguments.length === 1) {
        max = min;
        min = 0;
    }
    // randomFloat(min, max)
    if (len === undefined) {
        const dif = max - min;
        return (Math.random() * dif) + min;
    }
    else {
        return array_1.createArray({ len, fill: () => randomFloat(min, max) });
    }
}
exports.randomFloat = randomFloat;
function randomInt(min, max, len) {
    // randomInt()
    if (!arguments.length)
        return Math.random();
    // randomInt(max)
    if (arguments.length === 1) {
        max = min;
        min = 0;
    }
    if (len === undefined) {
        const dif = max - min;
        // 直接调用randomFloat的话randomInt(-10,10)永远都不会出现-10
        return ~~(Math.random() * dif) + min;
    }
    else {
        return array_1.createArray({ len, fill: () => randomInt(min, max) });
    }
}
exports.randomInt = randomInt;
/**
 * 随机获取数组中的一个
 * @param arr
 */
function randomItem(arr) {
    const index = randomInt(arr.length);
    return arr[index];
}
exports.randomItem = randomItem;
/**
 * 洗牌
 * @param arr
 */
function shuffle(arr) {
    if (!dataType_1.isArrayLike(arr))
        throw new TypeError();
    const newArr = clone_1.deepCloneBfs(arr);
    let m = newArr.length;
    while (m) {
        const i = randomInt(m--);
        [newArr[m], newArr[i]] = [newArr[i], newArr[m]];
    }
    return newArr;
}
exports.shuffle = shuffle;
/*
export function shuffle<T>(arr: ArrayLike<T>): T[] {
    if (!isArrayLike(arr)) throw new TypeError();
    const result: T[] = [];
    const indexArr = createArray({len: arr.length});
    while (indexArr.length) {
        const index = randomInt(indexArr.length);
        const arrIndex = indexArr.splice(index, 1)[0];
        result.push(arr[arrIndex]);
    }
    return result;
}
*/
function randomRGB() {
    const num = randomInt(0, 255, 3);
    return `rgb(${num[0]},${num[1]},${num[2]})`;
}
exports.randomRGB = randomRGB;
function randomRGBA() {
    const num = randomInt(0, 255, 3);
    const opacity = +randomFloat().toFixed(2);
    return `rgba(${num[0]},${num[1]},${num[2]},${opacity})`;
}
exports.randomRGBA = randomRGBA;
function randomHEX() {
    const num = randomInt(0xffffff).toString(16);
    return "#" + string_1.strPadStart(num, 6, "0");
}
exports.randomHEX = randomHEX;
function randomColor(type, len) {
    if (dataType_1.isNumber(type)) {
        len = type;
        type = "HEX";
    }
    if (type === undefined) {
        type = "HEX";
    }
    type = type.toUpperCase();
    if (len === undefined) {
        const map = {
            "HEX": randomHEX,
            "RGB": randomRGB,
            "RGBA": randomRGBA,
        };
        return (map[type] || map.HEX)();
    }
    else {
        return array_1.createArray({ len, fill: () => randomColor(type) });
    }
}
exports.randomColor = randomColor;
