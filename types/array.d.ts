export declare function createArray({ start, end, len, fill }: {
    start?: number;
    end?: number;
    len?: number;
    fill?: ((item: number, index: number) => any);
}): any[];
export declare function createArray({ start, end, len, fill }: {
    start?: number;
    end?: number;
    len?: number;
    fill?: any;
}): any[];
export declare function forEach<T>(callbackfn: (value: T, index: number, array: ArrayLike<T>) => (any | false), thisArg?: ArrayLike<T> | Iterable<T>): void;
export declare function from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapFn?: (v: T, k: number) => U): U[];
export declare function filter<T>(callbackfn: (value: T, index: number, array: ArrayLike<T>) => boolean, thisArg?: ArrayLike<T>): T[];
export declare function includes<T>(thisArg: ArrayLike<T>, searchElement: (v: T, index: number, arr: ArrayLike<T>) => boolean, fromIndex?: number): boolean;
export declare function includes<T>(thisArg: ArrayLike<T>, searchElement: T, fromIndex?: number): boolean;
export declare function keys(target: object | []): Array<string | number | symbol>;
export declare function find<T>(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: ArrayLike<T>): T | void;
