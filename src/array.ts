/**
 * ie9不支持的数组函数
 */
import {isArrayLike, isEmpty, isFunction, typeOf} from "./common";

/**
 * 创建一个包含开始数字和结束数字的数组 包左不包右: start <= item < (end || start + len)
 */
export function createArray({start = 0, end, len, callback}: {
    start?: number,
    end?: number,
    len?: number,
    callback?: (index) => any
}): Array<any> {
    let e: number = start;
    if (len !== undefined) {
        e = start + len;
    }
    if (end !== undefined) {
        e = end;
    }
    const arr: any[] = [];
    for (let i = start; i < e; i++) {
        arr.push(callback ? callback(i) : i);
    }
    return arr;
}

// ie9支持
// forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
export function forEach(callbackfn: (value: any, index: number, array: any[]) => void, thisArg?: any) {
    const arr = thisArg || this;
    if (!isArrayLike(arr)) throw new TypeError();
    for (let i = 0; i < arr.length; i++) {
        callbackfn(arr[i], i, arr);
    }
}

// filter<S extends T>(callbackfn: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[]
export function filter(callbackfn: (value: any, index: number, array: any[]) => boolean, thisArg?: any): any[] {
    const arr = thisArg || this;
    if (!isArrayLike(arr)) throw new TypeError();
    const fList: any[] = [];
    for (let i = 0; i < arr.length; i++) {
        const value = arr[i];
        if (callbackfn(value, i, arr)) {
            fList.push(value);
        }
    }
    return fList;
}

// includes(searchElement: T, fromIndex?: number): boolean
export function includes(searchElement: any, fromIndex = 0, thisArg: Array<any>): boolean {
    const arr = thisArg || this;
    if (!isArrayLike(arr)) throw new TypeError();
    for (let i = fromIndex; i < arr.length; i++) {
        const item = arr[i];
        if (item === searchElement) return true;
        if (isNaN(item) && isNaN(searchElement)) return true;
    }
    return false;
}

// 也可以给object用
// Object.keys()
export function keys(target: {} | []): Array<string> {
    if (isEmpty(target)) return [];
    const type = typeOf(target);
    if (type !== "object" && type !== "array") return [];
    const arr: string[] = [];
    for (let key in target) {
        if (target.hasOwnProperty(key)) {
            arr.push(key);
        }
    }
    return arr;
}

// find<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
// find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
export function find(
    predicate: (value: any, index: number, obj: any[]) => boolean,
    thisArg?: any,
): any | undefined {
    const arr = thisArg || this;
    if (!isArrayLike(arr)) throw new TypeError();
    if (!isFunction(predicate)) return;
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (predicate(item, i, arr)) return item;
    }
}

