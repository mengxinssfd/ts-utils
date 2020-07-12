import {typeOf} from "./common";
import {deepClone} from "./clone";
import {isEmpty, isNaN, isArray} from "./is";

// @overload
// ({start: 0, end: 2}) => [0, 1];
// (start: 0, len: 2, fill: item => item+1) => [1, 2];
export function createArray({start, end, len, fill}: {
    start?: number,
    end?: number,
    len?: number,
    fill?: ((item: number, index: number) => any)
}): any[];
// @overload
// ({start:0, end:2, len:2, fill:1}) => [1, 1];
export function createArray({start, end, len, fill}: {
    start?: number,
    end?: number,
    len?: number,
    fill?: any
}): any[];
/**
 * 创建一个包含开始数字和结束数字的数组 包左不包右: start <= item < (end || start + len)
 */
export function createArray({start = 0, end, len, fill}) {
    let e: number = start;
    if (len && end) {
        e = Math.min(start + len, end);
    } else {
        if (len !== undefined) {
            e = start + len;
        }
        if (end !== undefined) {
            e = end;
        }
    }
    let callback: (item: number, index: number) => any;
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
    const arr: any[] = [];
    for (let item = start, index = 0; item < e; item++, index++) {
        arr.push(callback(item, index));
    }
    return arr;
}

// ie9支持
// forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
export function forEach<T>(callbackfn: (value: T, index: number, array: ArrayLike<T>) => (any | false), thisArg?: ArrayLike<T> | Iterable<T>) {
    const arr = thisArg || this;
    // 不能直接把arr.length放进循环，否则在循环里新增的话length会变长,原生的不会变长
    const len = arr.length;
    // if (!isArrayLike(arr)) throw new TypeError();
    for (let i = 0; i < len; i++) {
        if (callbackfn(arr[i], i, arr) === false) break;
    }
}

// from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
export function from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapFn?: (v: T, k: number) => U): U[] {
    const arr: U[] = [];
    let callback: (v: T, k: number) => any;
    callback = mapFn || function (value: T, index: number) {
        return value;
    };
    forEach(((v, k, array) => {
        arr.push(callback(v, k));
    }), iterable);
    return arr;
}

// filter<S extends T>(callbackfn: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[]
export function filter<T>(callbackfn: (value: T, index: number, array: ArrayLike<T>) => boolean, thisArg?: ArrayLike<T>): T[] {
    const arr = thisArg || this;
    // if (!isArrayLike(arr)) throw new TypeError();
    const fList: T[] = [];
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        const value = arr[i];
        if (callbackfn(value, i, arr)) {
            fList.push(value);
        }
    }
    return fList;
}

// @overload
export function includes<T>(thisArg: ArrayLike<T>, searchElement: (v: T, index: number, arr: ArrayLike<T>) => boolean, fromIndex?: number): boolean;
// @overload
export function includes<T>(thisArg: ArrayLike<T>, searchElement: T, fromIndex?: number): boolean;
// includes(searchElement: T, fromIndex?: number): boolean
export function includes(thisArg, searchElement, fromIndex = 0) {
    const arr = thisArg || this;
    // if (!isArrayLike(arr)) throw new TypeError();
    const len = arr.length;
    for (let i = fromIndex; i < len; i++) {
        const item = arr[i];
        if (typeof searchElement === "function") {
            if (searchElement(item, i, arr)) return true;
        } else {
            if (item === searchElement) return true;
        }
        if (isNaN(item) && isNaN(searchElement)) return true;
    }
    return false;
}

// 也可以给object用
// Object.keys()
export function keys<T>(target: T): (keyof T)[] {
    if (isEmpty(target)) return [];
    // const type = typeOf(target); // typescript里不需要
    // if (type !== "object" && type !== "array") return [];
    const arr: (keyof T)[] = [];
    for (let key in target) {
        arr.push(key);
    }
    return arr;
}

// find<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
// find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
export function find<T>(
    predicate: (value: T, index: number, obj: T[]) => boolean,
    thisArg?: ArrayLike<T>,
): T | void {
    const arr = thisArg || this;
    // if (!isArrayLike(arr)) throw new TypeError();
    // if (!isFunction(predicate)) return; // 在typescript中有类型检查，不需要这一句
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        const item: T = arr[i];
        if (predicate(item, i, arr)) return item;
    }
}

export function flat<T>(target: readonly T[], depth: number = 1): T[] {
    function innerFlat(innerArr: readonly any[], innerDepth: number = 0): any {
        if (!isArray(innerArr)) return innerArr;
        if (innerDepth++ === depth) return deepClone(innerArr);

        const result: any[] = [];
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
 * @param handler 判断条件=>item-target
 * @param pcz 不用传
 */
export function binaryFind<T>(arr: T[], handler: (item: T, index: number, arr: T[]) => number, pcz: number = 0): T | undefined {
    if (arr.length === 0) return undefined;
    let result: T | undefined;
    let middleIndex = Math.floor(arr.length / 2);
    const item = arr[middleIndex];
    const value = handler(item, middleIndex + pcz, arr);
    if (value === 0) {
        return item;
    } else {
        if (arr.length === 1) {
            return undefined;
        }
        if (value < 0) {
            middleIndex++;
            result = binaryFind(arr.slice(middleIndex), handler, pcz + middleIndex);
        } else {
            result = binaryFind(arr.slice(0, middleIndex), handler, pcz);
        }
    }
    return result;
}


/**
 * 二分查找item
 * @param arr 要查找的数组
 * @param handler 判断条件=>item-target
 */
export function binaryFindIndex<T>(arr: T[], handler: (item: T, index: number) => number): number {
    if (arr.length === 0) return -1;
    let start = 0;
    let end = arr.length;
    let middleIndex = Math.floor((end - start) / 2);
    let value: number;

    while ((value = handler(arr[middleIndex], middleIndex)) !== 0 && end >= start) {
        if (value < 0) {
            start = middleIndex + 1;
        } else {
            end = middleIndex - 1;
        }
        middleIndex = Math.floor((end - start) / 2) + start;
    }

    return end >= start ? middleIndex : -1;
}

//TODO 上面两个未添加测试用例