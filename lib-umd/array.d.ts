/**
 * 创建一个包含开始数字和结束数字的数组 包左不包右: start <= item < (end || start + len)
 */
export declare function createArray({ start, end, len, callback }: {
    start?: number;
    end?: number;
    len?: number;
    callback?: (item: any, index: any) => any;
}): Array<any>;
export declare function forEach(callbackfn: (value: any, index: number, array: ArrayLike<any>) => any | false, thisArg?: ArrayLike<any>): void;
export declare function from(iterable: ArrayLike<any>, mapFn?: (v: any, k: number, array: ArrayLike<any>) => any): any[];
export declare function filter(callbackfn: (value: any, index: number, array: ArrayLike<any>) => boolean, thisArg?: ArrayLike<any>): any[];
export declare function includes(thisArg: ArrayLike<any>, searchElement: any, fromIndex?: number): boolean;
export declare function keys(target: object | []): Array<string>;
export declare function find(predicate: (value: any, index: number, obj: any[]) => boolean, thisArg?: ArrayLike<any>): any | undefined;
