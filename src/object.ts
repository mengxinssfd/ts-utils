import {isArray, isObject, isBroadlyObj} from "./type";

// 获取object树的最大层数 tree是object的话，tree就是层数1
export function getTreeMaxDeep(tree: object): number {
    function deeps(obj: object, num: number = 0): number {
        if (typeof tree !== "object" || tree === null) return num;
        let arr: number[] = [++num];
        forEachObj(obj, (v, k) => {
            arr.push(deeps(v, num));
        });
        return Math.max(...arr);
    }

    return deeps(tree);
}

// 获取树某层的节点数 0是tree本身
export function getTreeNodeLen(tree: object, nodeNumber: number = 1): number {
    let result = 0;
    if (typeof tree !== "object" || tree === null || nodeNumber < 0) return result;

    function deeps(obj: object, num: number = 0) {
        if (nodeNumber === num++) {
            result++;
            return;
        }
        forEachObj(obj, (v) => {
            deeps(v, num);
        });
    }

    deeps(tree);
    return result;
}

// 合并两个object TODO 可优化
export function deepMerge<T extends object, U extends object>(first: T, second: U): T & U {
    function assign(receive: object, obj: any) {
        for (const k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            const v = obj[k];
            if (v && typeof v === "object") {
                receive[k] = new v.constructor();
                assign(receive[k], v);
            } else
                receive[k] = v;
        }
    }

    const result: any = {};
    assign(result, first);
    assign(result, second);
    return result;
}

/**
 * 代替Object.keys(obj).forEach，减少循环次数
 * @param obj
 * @param callbackFn 返回false的时候中断
 */
export function forEachObj<T extends object>(obj: T, callbackFn: (value: T[keyof T], key: keyof T, obj: T) => (void | false)) {
    for (const k in obj) {
        if (!obj.hasOwnProperty(k)) continue;
        const v = obj[k];
        if (callbackFn(v, k, obj) === false) return;
    }
}

export const objForEach = forEachObj;

/**
 * object key-value翻转
 * @param obj
 */
export function getReverseObj(obj: { [k: string]: string }): { [k: string]: string } {
    return reduceObj(obj, (res, v, k) => {
        res[v] = k;
        return res;
    }, {});
}

/**
 * 代替Object.keys(obj).reduce，减少循环次数
 * @param obj
 * @param callbackFn
 * @param initialValue 初始值
 */
export function reduceObj<T extends object, R>(
    obj: T,
    callbackFn: (previousValue: R, value: T[keyof T], key: keyof T, obj: T) => R,
    initialValue: R,
): R {
    let result = initialValue;
    forEachObj(obj, (v, k, o) => {
        result = callbackFn(result, v, k, o);
    });
    return result;
}

export const objReduce = reduceObj;

/**
 * @param originObj
 * @param pickKeys
 * @param cb
 */
export function pickByKeys<T extends object, K extends keyof T, O extends Pick<T, K>>(
    originObj: T,
    pickKeys: K[],
    cb?: (value: T[K], key: K, originObj: T) => Pick<T, K>[K],
): Pick<T, K> {
    const callback = cb || (v => v);
    return pickKeys.reduce((res, key) => {
        if (originObj.hasOwnProperty(key)) res[key] = callback(originObj[key], key, originObj);
        return res;
    }, {} as any);
}

// TODO 不完美的地方：k === "a"时应该限定返回值类型为number
/*pickByKeys({a: 123, b: "111", c: false}, ["a", "b"], (v, k, o) => {
    if(k === "a"){
        return "123123"
    }
    return v;
});*/

// 新属性名作为键名的好处是可以多个属性对应一个值
export function pickRename<T extends object, K extends keyof T, O extends { [k: string]: K }>(
    originObj: T,
    renamePickObj: O,
    cb?: (value: T[O[keyof O]], key: O[keyof O], originObj: T) => T[O[keyof O]],
): { [k in keyof O]: T[O[k]] } {
    const callback = cb || (v => v);
    /* const renames = Object.keys(renamePickObj) as (keyof O)[];
     return renames.reduce((result, rename) => {
         const pick = renamePickObj[rename];
         if (originObj.hasOwnProperty(pick)) {
             result[rename] = callback(originObj[pick], pick, originObj);
         }
         return result;
     }, {} as any);*/
    return reduceObj(renamePickObj, (result, pick, rename) => {
        if (originObj.hasOwnProperty(pick)) {
            result[rename] = callback(originObj[pick], pick, originObj);
        }
        return result;
    }, {} as any);
}

/*
export function pickRename2<T extends object,
    K extends keyof T,
    O extends { [k: string]: K | ((t: T) => T[K]) }>(
    originObj: T,
    renamePickObj: O,
): { [k in keyof O]: O[k] extends K ? T[O[k]] : T[K] } {
    return {} as any;
}

pickRename2({a: 123, b: "222"}, {
    c: 'a',
    d: (obj) => obj.a,
});
*/

/**
 * 功能与pickByKeys函数一致
 * @param originObj
 * @param pickKeys
 * @param cb
 */
export function pick<T extends object, K extends keyof T, KS extends K[]>(
    originObj: T,
    pickKeys: KS,
    cb?: (value: T[K], key: K, fromObj: T) => T[K],
): { [key in K]: T[key] }
/**
 * 功能与pickRename函数一致
 * @param originObj
 * @param renamePickObj
 * @param cb
 */
export function pick<T extends object, K extends keyof T, O extends { [k: string]: K }>(
    originObj: T,
    renamePickObj: O,
    cb?: (value: T[O[keyof O]], key: O[keyof O], fromObj: T) => T[O[keyof O]],
): { [k in keyof O]: T[O[k]] }
/**
 * 合并pickByKeys与pickRename两者的功能
 */
export function pick(originObj, picks, cb) {
    const isObj = isObject(picks);
    // ------- 第一种写法 -------
    // const callback = cb || (v => v);
    // const pickKeys = isObj ? Object.keys(picks) : picks;
    // const getOriginObjKey = isObj ? k => picks[k] : k => k;
    // return pickKeys.reduce((res, k) => {
    //     const originObjKey = getOriginObjKey(k);
    //     if (originObj.hasOwnProperty(originObjKey)) {
    //         res[k] = callback(originObj[originObjKey], originObjKey, originObj);
    //     }
    //     return res;
    // }, {} as any);
    // ------- 第二种写法 -------
    // 更简洁 减少判断次数
    // TODO 需要判断返回值类型是否改变了  改变则抛出异常
    return isObj ? pickRename(originObj, picks, cb) : pickByKeys(originObj, picks, cb);
}

// pick({a: 132, b: "123123"}, ["a", "b"]);

/**
 * Omit 省略
 * @example
 *  // returns {c: true}
 *  omit({a: 123, b: "bbb", c: true}, ["a", "b"])
 * @param target
 * @param keys
 */
export function omit<T extends object, K extends keyof T>(target: T, keys: readonly K[]): Omit<T, K> {
    const newKeys = keys.slice();
    return reduceObj(target, (initValue, v, k) => {
        const index = newKeys.indexOf(k as K);
        if (index === -1) {
            initValue[k] = v;
        } else {
            newKeys.splice(index, 1);
        }
        return initValue;
    }, {} as any);
}

export function assign<T, U>(target: T, source: U): T & U;
export function assign<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export function assign<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export function assign(target: object, ...args: object[]);
export function assign(target, ...args) {
    args.forEach(arg => {
        // forEachObj(arg, (v, k) => target[k] = v);  // 不能返回“target[k] = v”值，v可能会为false，为false会中断循环
        forEachObj(arg, (v, k) => {
            target[k] = v;
        });
    });
    return target;
}

export function defaults<T, U>(target: T, source: U): T & U;
export function defaults<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export function defaults<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export function defaults(target: object, ...args: object[]);
/**
 * 与lodash defaults一样 只替换target里面的值为undefined的属性
 * 类型推导会以前面的为准
 * @example
 * // {a: 12, b: 2, c: 3, d: 4}
 * defaults({a: 12, b: undefined, c: 3}, {a: 1}, {b: 2}, {d: 4});
 * // {a: 12, b: 2, c: 3}
 * defaults({a:12,b:undefined,c:3},{a:1},{b:2},{c:undefined})
 * @param target
 * @param args
 */
export function defaults(target, ...args) {
    args.forEach(arg => {
        forEachObj(arg, (v, k) => {
            if (v === undefined || target[k] !== undefined) return;
            target[k] = v;
        });
    });
    return target;
}

// TODO 需要去除掉前面object里的undefined
/*
type A = { a: undefined, b: number }
type Pick2<T, K extends keyof T> = {
    [NonNullable<T[K]>]: NonNullable<T[K]>;
};
type K = keyof A
type V = A[K]
type B = Pick2<A, keyof A>*/

/**
 * 创建一个object 代替es6的动态key object 与Object.fromEntries一样
 * @example
 * const k1 = "a",k2 = "b"
 * createObj([[k1, 1], [k2, 2]]); // {a:1, b:2}
 * @param entries
 * @return {{}}
 */
export function createObj(entries: Array<[string, any]>): { [k: string]: any } {
    return entries.reduce((initValue, item) => {
        if (!isArray(item) || item.length < 1) throw new TypeError("createObj args type error");
        const [key, value] = item;
        if (key !== void 0) {
            initValue[key] = value;
        }
        return initValue;
    }, {});
}

export const ObjFromEntries = createObj;

/**
 * Object.keys
 * @param obj
 */
export function objKeys<T extends object, K extends keyof T>(obj: T): K[] {
    // Object.keys es5可以使用
    return reduceObj(obj, (init, v, k) => {
        init.push(k as K);
        return init;
    }, [] as K[]);
}

/**
 * Object.values
 * @param obj
 */
export function objValues<T extends object, K extends keyof T, V extends T[K]>(obj: T): V[] {
    return reduceObj(obj, (init, v, k) => {
        init.push(v as V);
        return init;
    }, [] as V[]);
}

/**
 * Object.entries
 * @param obj
 */
export function objEntries<T extends object, K extends keyof T>(obj: T): [K, T[K]][] {
    return reduceObj(obj, (init, v, k) => {
        init.push([k, v]);
        return init;
    }, [] as any);
}

/**
 * 通过object路径获取值
 * @example
 * getObjValueByPath({a: {b: {c: 123}}}, "a.b.c") // => 123
 * @param obj
 * @param path
 * @param [objName = ""]
 */
export function getObjValueByPath(obj: object, path: string, objName = ""): unknown {
    const p = path.replace(/\[([^\]]+)]/g, ".$1")
        .replace(new RegExp(`^${objName}`), "")
        .replace(/^\./, "");
    return p.split(".").reduce((init, v, k) => {
        if (!isBroadlyObj(init)) return undefined;
        return init[v];
    }, obj);
}

/**
 * 获取object的路径数组
 * @example
 * getObjPathEntries({a: 1}) // => [["[a]", 1]]
 * getObjPathEntries({a: 1},"obj") // => [["obj[a]", 1]]
 * @param obj
 * @param [objName = ""]
 */
export function getObjPathEntries(obj: object, objName = ""): [string, any][] {
    function getArr(obj: object, outKey: string) {
        return reduceObj(obj, (init, v, k) => {
            const key = `${outKey}[${k as string}]`;
            if (isBroadlyObj(v)) {
                init.push(...getArr(v, key));
            } else {
                init.push([key, v]);
            }
            return init;
        }, [] as [string, any][]);
    }

    return getArr(obj, objName);
}