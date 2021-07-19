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
/**
 * @param arr
 * @param callbackFn
 * @param elseCB 类似于Python的for else中的else，
 *        只会在完整的遍历后执行，任何一个break都不会触发
 * @returns {boolean} isDone
 */
export declare function forEach<T>(arr: ArrayLike<T>, callbackFn: (value: T, index: number, array: ArrayLike<T>) => (any | false), elseCB?: () => void): boolean;
/**
 * 跟promiseQueue类似，不过此函数是callback异步，重点在callback
 * @param cbAsync 异步回调
 * @param thisArg
 */
export declare function forEachAsync<T>(cbAsync: (value: T, index: number, array: ArrayLike<T>) => Promise<(any | false)>, thisArg?: ArrayLike<T> | Iterable<T>): Promise<void>;
export declare function mapAsync<T, R, A extends ArrayLike<T>>(cbAsync: (value: T, index: number, array: A) => Promise<R>, thisArg?: A | Iterable<T>): Promise<R[]>;
/**
 * reduce promise 跟 promiseQueue差不多，此函数多了callbackFn
 * @param callbackfn
 * @param initValue
 * @param thisArg
 */
export declare function reduceAsync<T, R, A extends ArrayLike<T>, I>(callbackfn: (initValue: I, value: T, index: number, array: A) => Promise<I>, initValue: I, thisArg?: A | Iterable<T>): Promise<I>;
export declare function forEachRight<T>(callbackfn: (value: T, index: number, array: ArrayLike<T>) => (any | false), thisArg?: ArrayLike<T> | Iterable<T>): void;
export declare function from<T, U = T>(iterable: Iterable<T> | ArrayLike<T>, mapFn?: (v: T, k?: number) => U): U[];
export declare function filter<T>(callbackfn: (value: T, index: number, array: ArrayLike<T>) => boolean, thisArg?: ArrayLike<T>): T[];
export declare function includes<T>(thisArg: ArrayLike<T>, searchElement: (v: T, index: number, arr: ArrayLike<T>) => boolean, fromIndex?: number): boolean;
export declare function includes<T>(thisArg: ArrayLike<T>, searchElement: T, fromIndex?: number): boolean;
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
declare type Param = {
    after?: boolean;
    reverse?: boolean;
};
export declare function insertToArray<T>(insert: T, to: number, array: T[], param?: Param): number;
export declare function insertToArray<T>(inserts: T[], to: number, array: T[], param?: Param): number;
export declare function insertToArray<T>(insert: T, to: (value: T, index: number, array: T[], insert: T) => boolean, array: T[], param?: Param): number;
export declare function insertToArray<T>(inserts: T[], to: (value: T, index: number, array: T[], inserts: T[]) => boolean, array: T[], param?: Param): number;
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
/**
 *  判断min <= num <= max
 * @param value
 * @param [min = Number.MIN_SAFE_INTEGER]
 * @param [max = Number.MAX_SAFE_INTEGER]
 */
export declare function inRange(value: number, [min, max]: [number?, number?]): boolean;
/**
 * 数组分组
 * @example
 * groupBy([{type: 1}, {type: 2}], "type") // returns {1: [{type: 1}], 2: [{type: 2}]}
 * groupBy([{type: 1}, {value: 2}], "type") // returns {"*": [{value: 2}], 1: [{type: 1}]}
 * @param arr
 * @param key 如果item中不存在该key，那么该item会归类到undefined
 * @param defaultKey 如果item中不存在该key，那么该item会归类到defaultKey
 */
export declare function groupBy<T extends {
    [k: string]: any;
}, K extends keyof T, R extends {
    [k: string]: T[];
}>(arr: T[], key: K, defaultKey?: number | string): R;
export declare function groupBy<T extends {
    [k: string]: any;
}, R extends {
    [k: string]: T[];
}>(arr: T[], by: (it: T, result: any) => string | void, defaultKey?: number | string): R;
export {};