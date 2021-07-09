import { PathOf, TypeOfPath } from "./ObjPath";
export declare function getTreeMaxDeep(tree: object): number;
export declare function getTreeNodeLen(tree: object, nodeNumber?: number): number;
export declare function deepMerge<T extends object, U extends object>(first: T, second: U): T & U;
/**
 * 代替Object.keys(obj).forEach，减少循环次数
 * @param obj
 * @param callbackFn 返回false的时候中断
 * @param elseCB 遍历完后执行
 * @returns {boolean} isDone
 */
export declare function forEachObj<T extends object>(obj: T, callbackFn: (value: T[keyof T], key: keyof T, obj: T) => (void | false), elseCB?: () => any): boolean;
/**
 * @alias forEachObj
 */
export declare const objForEach: typeof forEachObj;
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
 * @alias reduceObj
 */
export declare const objReduce: typeof reduceObj;
/**
 * @param originObj
 * @param pickKeys
 * @param cb
 */
export declare function pickByKeys<T extends object, K extends keyof T, O extends Pick<T, K>>(originObj: T, pickKeys: K[], cb?: (value: T[K], key: K, originObj: T) => Pick<T, K>[K]): Pick<T, K>;
export declare function pickRename<T extends object, K extends keyof T, O extends {
    [k: string]: K;
}>(originObj: T, pickKeyMap: O, cb?: (value: T[O[keyof O]], key: O[keyof O], originObj: T) => T[O[keyof O]]): {
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
 * @param pickKeyMap
 * @param cb
 */
export declare function pick<T extends object, K extends keyof T, O extends {
    [k: string]: K;
}>(originObj: T, pickKeyMap: O, cb?: (value: T[O[keyof O]], key: O[keyof O], fromObj: T) => T[O[keyof O]]): {
    [k in keyof O]: T[O[k]];
};
/**
 * 从其他对象中挑出与原对象值不一样的或原对象中不存在的键值对所组成的新对象
 * @param origin
 * @param objs
 * @param verify
 */
export declare function pickDiff(origin: object, objs: object[], verify?: (originV: any, objV: any, k: string | number, origin: object, obj: object) => boolean): {
    [k: string]: any;
};
/**
 * 根据新键值对重命名对象的key，并生成一个新的对象
 * @param originObj
 * @param keyMap
 */
export declare function renameObjKey<T extends object, K extends keyof T, O extends {
    [k: string]: K;
}, R extends Omit<T, O[keyof O]>>(originObj: T, keyMap: O): {
    [k in keyof O]: T[O[k]];
} & R;
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
 * 使用target里面的key去查找其他的对象，如果其他对象里有该key，则把该值复制给target,如果多个对象都有同一个值，则以最后的为准
 * 会更新原对象
 * @param target
 * @param args
 */
export declare function objUpdate<T extends object>(target: T, ...args: T[]): T;
/**
 * 根据与target对比，挑出与target同key不同value的key所组成的object
 * @param target
 * @param objs  相当于assign(...objs) 同样的key只会取最后一个
 * @param compareFn
 */
export declare function pickUpdated<T extends object>(target: T, objs: object[], compareFn?: (a: any, b: any) => boolean): Partial<{
    [k in keyof T]: any;
}>;
/**
 * 创建一个object 代替es6的动态key object 与Object.fromEntries一样
 * @example
 * const k1 = "a",k2 = "b"
 * createObj([[k1, 1], [k2, 2]]); // {a:1, b:2}
 * @param entries
 * @return {{}}
 */
export declare function createObj(entries: Array<[string, any]>): {
    [k: string]: any;
};
/**
 * @alias createObj
 */
export declare const ObjFromEntries: typeof createObj;
/**
 * Object.keys
 * @param obj
 */
export declare function objKeys<T extends object, K extends keyof T>(obj: T): K[];
/**
 * Object.values
 * @param obj
 */
export declare function objValues<T extends object, K extends keyof T, V extends T[K]>(obj: T): V[];
/**
 * Object.entries
 * @param obj
 */
export declare function objEntries<T extends object, K extends keyof T>(obj: T): [K, T[K]][];
/**
 * obj[a] => obj.a 从getObjValueByPath中分离出来
 * @param path
 * @param [objName = ""]
 */
export declare function translateObjPath(path: string, objName?: string): string;
/**
 * 通过object路径获取值
 * @example
 * getObjValueByPath({a: {b: {c: 123}}}, "a.b.c") // => 123
 * @param obj
 * @param path
 * @param [objName = ""]
 */
export declare function getObjValueByPath<T extends object, P extends string>(obj: T, path: PathOf<T, P>, objName?: string): TypeOfPath<T, P>;
declare type SetObjValueByPathOnExist = (a: any, b: any, isEnd: boolean, path: string) => any;
/**
 * 通过object路径设置值 如果路径中不存在则会自动创建对应的对象
 * @example
 * @param obj
 * @param path
 * @param value
 * @param onExist 当要改动位置已经有值时的回调
 * @param [objName = ""]
 */
export declare function setObjValueByPath<T extends object>(obj: T, path: string, value: any, onExist?: SetObjValueByPathOnExist, objName?: string): T;
/**
 * 获取object的路径数组
 * @example
 * getObjPathEntries({a: 1}) // => [["[a]", 1]]
 * getObjPathEntries({a: 1},"obj") // => [["obj[a]", 1]]
 * @param obj
 * @param [objName = ""]
 */
export declare function getObjPathEntries(obj: object, objName?: string): Array<[string, any]>;
export declare function revertObjFromPath(pathArr: string[]): object;
export {};
