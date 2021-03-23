import { createArray } from "./array";
import { strPadStart } from "./common";
import { isArrayLike } from "./type";
export function randomFloat(min, max, len) {
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
        return createArray({ len, fill: () => randomFloat(min, max) });
    }
}
export function randomInt(min, max, len) {
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
        return createArray({ len, fill: () => randomInt(min, max) });
    }
}
/**
 * 随机获取数组中的一个
 * @param arr
 */
export function randomItem(arr) {
    const index = randomInt(arr.length);
    return arr[index];
}
/**
 * 洗牌
 * @param arr
 */
export function shuffle(arr) {
    if (!isArrayLike(arr))
        throw new TypeError();
    const result = [];
    const indexArr = createArray({ len: arr.length });
    while (indexArr.length) {
        const index = randomInt(indexArr.length);
        const arrIndex = indexArr.splice(index, 1)[0];
        result.push(arr[arrIndex]);
    }
    return result;
}
export function randomRGB() {
    const num = randomInt(0, 255, 3);
    return `rgb(${num[0]},${num[1]},${num[2]})`;
}
export function randomRGBA() {
    const num = randomInt(0, 255, 3);
    const opacity = randomFloat().toFixed(3);
    return `rgba(${num[0]},${num[1]},${num[2]},${opacity})`;
}
export function randomHEX() {
    const num = randomInt(0xffffff).toString(16);
    return "#" + strPadStart(num, 6, "0");
}
export function randomColor(type = "HEX", len) {
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
        return createArray({ len, fill: () => randomColor(type) });
    }
}
