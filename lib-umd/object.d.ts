export declare function getTreeMaxDeep(tree: object): number;
export declare function getTreeNodeLen(tree: object, nodeNumber?: number): number;
export declare function deepMerge<T extends object, U extends object>(first: T, second: U): T & U;
/**
 * 代替Object.keys(obj).forEach，减少循环次数
 * @param obj
 * @param callbackFn 返回false的时候中断
 */
export declare function forEachObj<T extends object>(obj: T, callbackFn: (value: T[keyof T], key: keyof T, obj: T) => (void | false)): void;
/**
 * object key-value翻转
 * @param obj
 */
export declare function getReverseObj(obj: {
    [k: string]: string;
}): {
    [k: string]: string;
};
/**
 * 代替Object.keys(obj).reduce，减少循环次数
 * @param obj
 * @param callbackFn
 * @param initialValue 初始值
 */
export declare function reduceObj<T extends object, R>(obj: T, callbackFn: (previousValue: R, value: T[keyof T], key: keyof T, obj: T) => R, initialValue: R): R;
/**
 * @param originObj
 * @param pickKeys
 * @param cb
 */
export declare function pickByKeys<T extends object, K extends keyof T, O extends Pick<T, K>>(originObj: T, pickKeys: K[], cb?: (value: T[K], key: K, originObj: T) => Pick<T, K>[K]): Pick<T, K>;
export declare function pickRename<T extends object, K extends keyof T, O extends {
    [k: string]: K;
}>(originObj: T, renamePickObj: O, cb?: (value: T[O[keyof O]], key: O[keyof O], originObj: T) => T[O[keyof O]]): {
    [k in keyof O]: T[O[k]];
};
/**
 * 功能与pickByKeys函数一致
 * @param originObj
 * @param pickKeys
 * @param cb
 */
export declare function pick<T extends object, K extends keyof T, KS extends K[]>(originObj: T, pickKeys: KS, cb?: (value: T[K], key: K, fromObj: T) => T[K]): {
    [key in K]: T[key];
};
/**
 * 功能与pickRename函数一致
 * @param originObj
 * @param renamePickObj
 * @param cb
 */
export declare function pick<T extends object, K extends keyof T, O extends {
    [k: string]: K;
}>(originObj: T, renamePickObj: O, cb?: (value: T[O[keyof O]], key: O[keyof O], fromObj: T) => T[O[keyof O]]): {
    [k in keyof O]: T[O[k]];
};
/**
 * Omit 省略
 * @example
 *  // returns {c: true}
 *  omit({a: 123, b: "bbb", c: true}, ["a", "b"])
 * @param target
 * @param keys
 */
export declare function omit<T extends object, K extends keyof T>(target: T, keys: readonly K[]): Omit<T, K>;
export declare function assign<T, U>(target: T, source: U): T & U;
export declare function assign<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export declare function assign<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export declare function assign(target: object, ...args: object[]): any;
export declare function defaults<T, U>(target: T, source: U): T & U;
export declare function defaults<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export declare function defaults<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export declare function defaults(target: object, ...args: object[]): any;
/**
 * 创建一个object 代替支持es6的动态key
 * @example
 * // {a:1, b:2}
 * createObj(['a', 1], ['b', 2])
 * @return {{}}
 */
export declare function createObj(...args: Array<[string, any]>): {
    [k: string]: any;
};
