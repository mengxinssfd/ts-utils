/**
 * ie9不支持的数组函数
 */
import { isEmpty } from "./common";
/**
 * 创建一个包含开始数字和结束数字的数组 包左不包右: start <= item < (end || start + len)
 */
export function createArray({ start = 0, end, len, callback }) {
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
    const arr = [];
    for (let item = start, index = 0; item < e; item++, index++) {
        arr.push(callback ? callback(item, index) : item);
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
    forEach(((v, k, array) => {
        arr.push(mapFn ? mapFn(v, k, array) : v);
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
