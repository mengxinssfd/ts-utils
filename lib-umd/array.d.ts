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
export declare function from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapFn?: (v: T, k: number) => U): U[];
export declare function filter<T>(callbackfn: (value: T, index: number, array: ArrayLike<T>) => boolean, thisArg?: ArrayLike<T>): T[];
export declare function includes<T>(thisArg: ArrayLike<T>, searchElement: (v: T, index: number, arr: ArrayLike<T>) => boolean, fromIndex?: number): boolean;
export declare function includes<T>(thisArg: ArrayLike<T>, searchElement: T, fromIndex?: number): boolean;
export declare function keys<T>(target: T): (keyof T)[];
export declare function find<T>(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: ArrayLike<T>): T | void;
export declare function findIndex<T>(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: ArrayLike<T>): number;
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
/**
 * item插入到数组，返回一个新数组
 * @param insert {any} 插入的item
 * @param to {number} index 要插入的位置
 * @param array {Array} 要插入item的数组
 * @returns Array
 */
export declare function insertToArray<T>(insert: T, to: number, array: T[]): T[];
export declare function unique<T>(target: T[], callbackFn?: (value: T, value2: T) => boolean): T[];
