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
export declare function createArray<T = number>({ start, end, len, fill }: {
    start?: number;
    end?: number;
    len?: number;
    fill?: T | ((item: number, index: number) => T);
}): T[];
export declare function forEach<T>(callbackfn: (value: T, index: number, array: ArrayLike<T>) => (any | false), thisArg?: ArrayLike<T> | Iterable<T>): void;
export declare function forEachRight<T>(callbackfn: (value: T, index: number, array: ArrayLike<T>) => (any | false), thisArg?: ArrayLike<T> | Iterable<T>): void;
export declare function from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapFn?: (v: T, k: number) => U): U[];
export declare function filter<T>(callbackfn: (value: T, index: number, array: ArrayLike<T>) => boolean, thisArg?: ArrayLike<T>): T[];
export declare function includes<T>(thisArg: ArrayLike<T>, searchElement: (v: T, index: number, arr: ArrayLike<T>) => boolean, fromIndex?: number): boolean;
export declare function includes<T>(thisArg: ArrayLike<T>, searchElement: T, fromIndex?: number): boolean;
export declare function keys<T>(target: T): (keyof T)[];
export declare function find<T>(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: ArrayLike<T>): T | void;
export declare function findIndex<T>(predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean, thisArg: ArrayLike<T>): number;
export declare function findIndex<T, A extends ArrayLike<T>>(this: A, predicate: (value: T, index: number, obj: A) => boolean): number;
export declare function findIndexRight<T>(predicate: (value: T, index: number, obj: ArrayLike<T>) => boolean, thisArg: ArrayLike<T>): number;
export declare function findIndexRight<T, A extends ArrayLike<T>>(this: A, predicate: (value: T, index: number, obj: A) => boolean): number;
export declare function flat<T>(target: readonly T[], depth?: number): T[];
/**
 * 二分查找item
 * @param arr 要查找的数组
 * @param handler 判断条件 item => target - item 返回值为0时为要找的值，小于0则往前找，大于0往后找
 * @param pcz 不用传
 */
export declare function binaryFind2<T>(arr: T[], handler: (item: T, index: number, arr: T[]) => number, pcz?: number): T | undefined;
export declare function binaryFind<T>(arr: T[], handler: (item: T, index: number, arr: T[]) => number): T | undefined;
/**
 * 二分查找item index
 * @param arr 要查找的数组
 * @param handler 判断条件 item => target - item 返回值为0时为要找的值，小于0则往前找，大于0往后找
 */
export declare function binaryFindIndex<T>(arr: T[], handler: (item: T, index: number, start: number, end: number) => number): number;
export declare function insertToArray<T>(insert: T, to: number, array: T[], after?: boolean): number;
export declare function insertToArray<T>(insert: T, findIndexCB: ((v: T, k: number, a: T[]) => boolean), array: T[], after?: boolean): number;
export declare function insertToArray<T>(inserts: T[], to: number, array: T[], after?: boolean): number;
export declare function insertToArray<T>(inserts: T[], findIndexCB: ((v: T, k: number, a: T[]) => boolean), array: T[], after?: boolean): number;
export declare function insertToArrayRight<T>(insert: any, to: any, array: T[], after?: boolean): number;
export declare function arrayRemoveItem<T>(item: T, array: T[]): void | T;
export declare function arrayRemoveItemsBy<T>(by: (v: T, k: number, a: T[]) => boolean, array: T[]): T[];
export declare function unique<T>(target: T[], isRepeatFn?: (value: T, value2: T) => boolean): T[];
/**
 * @example
 * castArray([1]); // [1]
 * @param value
 */
export declare function castArray<T>(value: T[]): T[];
/**
 * @example
 * castArray(1); // [1]
 * @param value
 */
export declare function castArray<T>(value: T): T[];
/**
 * 数组分片
 * @example
 * chunk([0,1,2,3,4,5,6], 3) // => [[0,1,2],[3,4,5],[6]]
 * @param arr
 * @param chunkLen
 */
export declare function chunk(arr: any[], chunkLen: number): any[];
