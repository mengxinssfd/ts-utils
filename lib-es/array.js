import { typeOf } from "./common";
import { deepClone } from "./clone";
import { isEmpty, isNaN, isArray } from "./is";
/**
 * 创建一个包含开始数字和结束数字的数组 包左不包右: start <= item < (end || start + len)
 */
export function createArray({ start = 0, end, len, fill }) {
    let e = start;
    if (len && end) {
        e = Math.min(start + len, end);
    }
    else {
        if (len !== undefined) {
            e = start + len;
        }
        if (end !== undefined) {
            e = end;
        }
    }
    let callback;
    switch (typeOf(fill)) {
        case "function":
            callback = fill;
            break;
        case "undefined":
        case "null":
            callback = (i) => i;
            break;
        default:
            callback = (i) => fill;
    }
    const arr = [];
    for (let item = start, index = 0; item < e; item++, index++) {
        arr.push(callback(item, index));
    }
    return arr;
}
// ie9支持
// forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
export function forEach(callbackfn, thisArg) {
    const arr = thisArg || this;
    // 不能直接把arr.length放进循环，否则在循环里新增的话length会变长,原生的不会变长
    const len = arr.length;
    // if (!isArrayLike(arr)) throw new TypeError();
    for (let i = 0; i < len; i++) {
        if (callbackfn(arr[i], i, arr) === false)
            break;
    }
}
// from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
export function from(iterable, mapFn) {
    const arr = [];
    let callback;
    callback = mapFn || function (value, index) {
        return value;
    };
    forEach(((v, k, array) => {
        arr.push(callback(v, k));
    }), iterable);
    return arr;
}
// filter<S extends T>(callbackfn: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[]
export function filter(callbackfn, thisArg) {
    const arr = thisArg || this;
    // if (!isArrayLike(arr)) throw new TypeError();
    const fList = [];
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        const value = arr[i];
        if (callbackfn(value, i, arr)) {
            fList.push(value);
        }
    }
    return fList;
}
// includes(searchElement: T, fromIndex?: number): boolean
export function includes(thisArg, searchElement, fromIndex = 0) {
    const arr = thisArg || this;
    // if (!isArrayLike(arr)) throw new TypeError();
    const len = arr.length;
    for (let i = fromIndex; i < len; i++) {
        const item = arr[i];
        if (typeof searchElement === "function") {
            if (searchElement(item, i, arr))
                return true;
        }
        else {
            if (item === searchElement)
                return true;
        }
        if (isNaN(item) && isNaN(searchElement))
            return true;
    }
    return false;
}
// 也可以给object用
// Object.keys()
export function keys(target) {
    if (isEmpty(target))
        return [];
    // const type = typeOf(target); // typescript里不需要
    // if (type !== "object" && type !== "array") return [];
    const arr = [];
    for (let key in target) {
        arr.push(key);
    }
    return arr;
}
// find<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
// find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
export function find(predicate, thisArg) {
    const arr = thisArg || this;
    // if (!isArrayLike(arr)) throw new TypeError();
    // if (!isFunction(predicate)) return; // 在typescript中有类型检查，不需要这一句
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        const item = arr[i];
        if (predicate(item, i, arr))
            return item;
    }
}
export function flat(target, depth = 1) {
    function innerFlat(innerArr, innerDepth = 0) {
        if (!isArray(innerArr))
            return innerArr;
        if (innerDepth++ === depth)
            return deepClone(innerArr);
        const result = [];
        for (let i = 0; i < innerArr.length; i++) {
            const newItem = innerFlat(innerArr[i], innerDepth);
            result.push(...(isArray(newItem) ? newItem : [newItem]));
        }
        return result;
    }
    return innerFlat(target);
}
/**
 * 二分查找item
 * @param arr 要查找的数组
 * @param handler 判断条件 item => target - item 返回值为0时为要找的值，小于0则往前找，大于0往后找
 * @param pcz 不用传
 */
export function binaryFind(arr, handler, pcz = 0) {
    if (arr.length === 0)
        return undefined;
    let result;
    let middleIndex = Math.floor(arr.length / 2);
    const item = arr[middleIndex];
    // 当前index = middleIndex + pcz
    const value = handler(item, middleIndex + pcz, arr);
    if (value === 0) {
        return item;
    }
    else {
        if (arr.length === 1) {
            return undefined;
        }
        // 如果target大于当前item值，则获取middle右边，否则相反
        if (value > 0) {
            middleIndex++;
            result = binaryFind(arr.slice(middleIndex), handler, pcz + middleIndex);
        }
        else {
            result = binaryFind(arr.slice(0, middleIndex), handler, pcz);
        }
    }
    return result;
}
/**
 * 二分查找item index
 * @param arr 要查找的数组
 * @param handler 判断条件 item => target - item 返回值为0时为要找的值，小于0则往前找，大于0往后找
 */
export function binaryFindIndex(arr, handler) {
    if (arr.length === 0)
        return -1;
    let start = 0;
    let end = arr.length;
    do {
        const middleIndex = Math.floor((end - start) / 2) + start;
        const value = handler(arr[middleIndex], middleIndex, start, end);
        if (value === 0) {
            return middleIndex;
        }
        else if (value > 0) {
            start = middleIndex + 1;
        }
        else {
            end = middleIndex;
        }
    } while (end > start);
    return -1;
}
