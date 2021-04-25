import {typeOf, isEmpty, isNaN, isArray, isArrayLike, isFunction} from "./type";

/**
 * @description len与end两个都有值时，以小的为准
 * @example
 * // returns [0, 1]
 * createArray({end: 2});
 * @example
 * // returns [0, 1]
 * createArray({start: 0, end: 2});
 * @example
 * // [1, 1]
 * createArray({start:0, end:2, len:2, fill:1});
 * @example
 * // returns [1, 2]
 * createArray(start: 0, len: 2, fill: item => item+1);
 */
export function createArray<T = number>(
    {start = 0, end, len, fill}: {
        start?: number,
        end?: number,
        len?: number,
        fill?: T | ((item: number, index: number) => T)
    },
): T[] {
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
            callback = fill as typeof callback;
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

export async function forEachAsync<T>(callbackfn: (value: T, index: number, array: ArrayLike<T>) => (any | false), thisArg?: ArrayLike<T> | Iterable<T>) {
    const arr = thisArg || this;
    // 不能直接把arr.length放进循环，否则在循环里新增的话length会变长,原生的不会变长
    const len = arr.length;
    // if (!isArrayLike(arr)) throw new TypeError();
    for (let i = 0; i < len; i++) {
        const v = await callbackfn(arr[i], i, arr);
        if (v === false) break;
    }
}

export async function mapAsync<T, R, A extends ArrayLike<T>>(
    callbackfn: (value: T, index: number, array: A) => Promise<R>,
    thisArg?: A | Iterable<T>,
): Promise<R[]> {
    const arr = thisArg || this;
    const result: any[] = [];
    await forEachAsync<T>(async (v, k, a) => {
        const item = await callbackfn(v, k, a as any);
        result.push(item);
    }, arr);
    return result;
}

export function forEachRight<T>(
    callbackfn: (value: T, index: number, array: ArrayLike<T>) => (any | false),
    thisArg?: ArrayLike<T> | Iterable<T>) {
    const arr = thisArg || this;
    if (!isArray(arr)) throw new TypeError();
    // if (!isArrayLike(arr)) throw new TypeError();
    for (let i = arr.length - 1; i > -1; i--) {
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

export function findIndex<T>(
    predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean,
    thisArg: ArrayLike<T>,
): number;
export function findIndex<T, A extends ArrayLike<T>>(
    this: A,
    predicate: (value: T, index: number, obj: A) => boolean,
): number;
export function findIndex(
    predicate,
    thisArg?,
): number {
    const arr = thisArg || this;
    if (!isArrayLike(arr)) throw new TypeError();
    if (!isFunction(predicate)) return -1; // 在typescript中有类型检查，不需要这一句(用call和apply调用无法检查，还是加上)
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        const item = arr[i];
        if (predicate(item, i, arr as any)) return i;
    }
    return -1;
}

export function findIndexRight<T>(
    predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean,
    thisArg: ArrayLike<T>,
): number;
export function findIndexRight<T, A extends ArrayLike<T>>(
    this: A,
    predicate: (value: T, index: number, obj: A) => boolean,
): number;
export function findIndexRight(
    predicate,
    thisArg?,
) {
    const arr = thisArg || this;
    if (!isArrayLike(arr)) throw new TypeError();
    if (!isFunction(predicate)) return -1; // 在typescript中有类型检查，不需要这一句(用call和apply调用无法检查，还是加上)
    const end = arr.length - 1;
    for (let i = end; i >= 0; i--) {
        const item = arr[i];
        if (predicate(item, i, arr as any)) return i;
    }
    return -1;
}

export function flat<T>(target: readonly T[], depth: number = 1): T[] {
    function innerFlat(innerArr: readonly any[], innerDepth: number = 0): any {
        if (!isArray(innerArr) || innerDepth++ === depth) return innerArr;
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
 * @param handler 判断条件 item => target - item 返回值为0时为要找的值，小于0则往前找，大于0往后找
 * @param pcz 不用传
 */
export function binaryFind2<T>(arr: T[], handler: (item: T, index: number, arr: T[]) => number, pcz: number = 0): T | undefined {
    if (arr.length === 0) return undefined;
    let result: T | undefined;
    let middleIndex = Math.floor(arr.length / 2);
    const item = arr[middleIndex];
    // 当前index = middleIndex + pcz
    const value = handler(item, middleIndex + pcz, arr);
    if (value === 0) {
        return item;
    } else {
        if (arr.length === 1) {
            return undefined;
        }
        // 如果target大于当前item值，则获取middle右边，否则相反
        if (value > 0) {
            middleIndex++;
            result = binaryFind2(arr.slice(middleIndex), handler, pcz + middleIndex);
        } else {
            result = binaryFind2(arr.slice(0, middleIndex), handler, pcz);
        }
    }
    return result;
}

export function binaryFind<T>(arr: T[], handler: (item: T, index: number, arr: T[]) => number): T | undefined {
    let start = 0;
    let end = arr.length;
    while (start < end) {
        const mid = ~~((end + start) / 2);
        const item = arr[mid];
        const v = handler(item, mid, arr);
        if (v === 0) {
            return item;
        } else if (v > 0) {
            start = mid + 1;
        } else {
            end = mid;
        }
    }
    return undefined;
}

/**
 * 二分查找item index
 * @param arr 要查找的数组
 * @param handler 判断条件 item => target - item 返回值为0时为要找的值，小于0则往前找，大于0往后找
 */
export function binaryFindIndex<T>(arr: T[], handler: (item: T, index: number, start: number, end: number) => number): number {
    if (arr.length === 0) return -1;
    let start = 0;
    let end = arr.length;

    do {
        const middleIndex = Math.floor((end - start) / 2) + start;
        const value: number = handler(arr[middleIndex], middleIndex, start, end);

        if (value === 0) {
            return middleIndex;
        } else if (value > 0) {
            start = middleIndex + 1;
        } else {
            end = middleIndex;
        }
    } while (end > start);

    return -1;
}

type Param = { after?: boolean; reverse?: boolean }

export function insertToArray<T>(
    insert: T,
    to: number,
    array: T[],
    param?: Param,
): number;
export function insertToArray<T>(
    inserts: T[],
    to: number,
    array: T[],
    param?: Param,
): number;
export function insertToArray<T>(
    insert: T,
    to: (value: T, index: number, array: T[], insert: T) => boolean,
    array: T[],
    param?: Param,
): number;
export function insertToArray<T>(
    inserts: T[],
    to: (value: T, index: number, array: T[], inserts: T[]) => boolean,
    array: T[],
    param?: Param,
): number;
/**
 * item插入到数组，在原数组中改变
 * @param insert 插入的item
 * @param to 要插入的位置 如果to是函数的话没有找到则不会插进数组
 * @param array 要插入item的数组
 * @param after 默认插到前面去
 * @param reverse 是否反向遍历
 */
export function insertToArray<T>(
    insert,
    to,
    array,
    {after = false, reverse = false} = {},
): number {
    const inserts = castArray(insert) as T[];
    let index = to as number;
    if (isFunction(to)) {
        index = (reverse ? findIndexRight : findIndex)((v, k, a) => {
            return to(v, k, a as T[], insert);
        }, array);
        if (index === -1) {
            return -1;
        }
    } else {
        if (to < 0) {
            index = 0;
        } else if (to > array.length) {
            index = array.length - (after ? 1 : 0);
        }
    }
    after && index++;
    array.splice(index, 0, ...inserts);
    return index;
}

export function arrayRemoveItem<T>(item: T, array: T[]): void | T {
    const index = array.indexOf(item);
    if (index === -1) return;
    return array.splice(index, 1)[0];
}

export function arrayRemoveItemsBy<T>(by: (v: T, k: number, a: T[]) => boolean, array: T[]): T[] {
    const removedItems: T[] = [];
    forEachRight<T>((v, k, a) => {
        if (!by(v, k, a as T[])) return;
        const item = array.splice(k, 1)[0];
        removedItems.unshift(item);
    }, array);
    return removedItems;
}

export function unique<T>(target: T[], isRepeatFn?: (value: T, value2: T) => boolean) {
    if (!target.length) return target;
    const fn = isRepeatFn || ((v1, v2) => v1 === v2);
    const result: T[] = [target[0]];
    for (let i = 1; i < target.length; i++) {
        const item = target[i];
        if (result.some(resItem => fn(resItem, item))) continue;
        result.push(item);
    }
    return result;
}

/**
 * @example
 * castArray([1]); // [1]
 * @param value
 */
export function castArray<T>(value: T[]): T[];
/**
 * @example
 * castArray(1); // [1]
 * @param value
 */
export function castArray<T>(value: T): T[];
export function castArray(value) {
    return isArray(value) ? value : [value];
}

/**
 * 数组分片
 * @example
 * chunk([0,1,2,3,4,5,6], 3) // => [[0,1,2],[3,4,5],[6]]
 * @param arr
 * @param chunkLen
 */
export function chunk(arr: any[], chunkLen: number) {
    if (!isArray(arr)) throw new TypeError("chunk param arr type error");
    if (chunkLen < 1) return arr.slice();
    const result: any[] = [];
    let i = 0;
    while (i < arr.length) {
        result.push(arr.slice(i, i += chunkLen));
    }
    return result;
}