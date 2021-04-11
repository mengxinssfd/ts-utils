import { isArray, isObject } from "./type";
// 获取object树的最大层数 tree是object的话，tree就是层数1
export function getTreeMaxDeep(tree) {
    function deeps(obj, num = 0) {
        if (typeof tree !== "object" || tree === null)
            return num;
        let arr = [++num];
        forEachObj(obj, (v, k) => {
            arr.push(deeps(v, num));
        });
        return Math.max(...arr);
    }
    return deeps(tree);
}
// 获取树某层的节点数 0是tree本身
export function getTreeNodeLen(tree, nodeNumber = 1) {
    let result = 0;
    if (typeof tree !== "object" || tree === null || nodeNumber < 0)
        return result;
    function deeps(obj, num = 0) {
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
export function deepMerge(first, second) {
    function assign(receive, obj) {
        for (const k in obj) {
            if (!obj.hasOwnProperty(k))
                continue;
            const v = obj[k];
            if (v && typeof v === "object") {
                receive[k] = new v.constructor();
                assign(receive[k], v);
            }
            else
                receive[k] = v;
        }
    }
    const result = {};
    assign(result, first);
    assign(result, second);
    return result;
}
/**
 * 代替Object.keys(obj).forEach，减少循环次数
 * @param obj
 * @param callbackFn 返回false的时候中断
 */
export function forEachObj(obj, callbackFn) {
    for (const k in obj) {
        if (!obj.hasOwnProperty(k))
            continue;
        const v = obj[k];
        if (callbackFn(v, k, obj) === false)
            return;
    }
}
/**
 * object key-value翻转
 * @param obj
 */
export function getReverseObj(obj) {
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
export function reduceObj(obj, callbackFn, initialValue) {
    let result = initialValue;
    forEachObj(obj, (v, k, o) => {
        result = callbackFn(result, v, k, o);
    });
    return result;
}
/**
 * @param originObj
 * @param pickKeys
 * @param cb
 */
export function pickByKeys(originObj, pickKeys, cb) {
    const callback = cb || (v => v);
    return pickKeys.reduce((res, key) => {
        if (originObj.hasOwnProperty(key))
            res[key] = callback(originObj[key], key, originObj);
        return res;
    }, {});
}
// TODO 不完美的地方：k === "a"时应该限定返回值类型为number
/*pickByKeys({a: 123, b: "111", c: false}, ["a", "b"], (v, k, o) => {
    if(k === "a"){
        return "123123"
    }
    return v;
});*/
// 新属性名作为键名的好处是可以多个属性对应一个值
export function pickRename(originObj, renamePickObj, cb) {
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
    }, {});
}
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
export function omit(target, keys) {
    const newKeys = keys.slice();
    return reduceObj(target, (initValue, v, k) => {
        const index = newKeys.indexOf(k);
        if (index === -1) {
            initValue[k] = v;
        }
        else {
            newKeys.splice(index, 1);
        }
        return initValue;
    }, {});
}
export function assign(target, ...args) {
    args.forEach(arg => {
        // forEachObj(arg, (v, k) => target[k] = v);  // 不能返回“target[k] = v”值，v可能会为false，为false会中断循环
        forEachObj(arg, (v, k) => {
            target[k] = v;
        });
    });
    return target;
}
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
            if (v === undefined || target[k] !== undefined)
                return;
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
 * 创建一个object 代替es6的动态key object
 * @example
 * const k1 = "a",k2 = "b"
 * createObj([[k1, 1], [k2, 2]]); // {a:1, b:2}
 * @param entries
 * @return {{}}
 */
export function createObj(entries) {
    return entries.reduce((initValue, item) => {
        if (!isArray(item) || item.length < 1)
            throw new TypeError("createObj args type error");
        const [key, value] = item;
        if (key !== void 0) {
            initValue[key] = value;
        }
        return initValue;
    }, {});
}
/**
 * Object.keys
 * @param obj
 */
export function objKeys(obj) {
    return reduceObj(obj, (init, v, k) => {
        init.push(k);
        return init;
    }, []);
}
/**
 * Object.values
 * @param obj
 */
export function objValues(obj) {
    return reduceObj(obj, (init, v, k) => {
        init.push(v);
        return init;
    }, []);
}
objKeys({ a: 123, b: "", c: 111 });
/**
 * Object.entries
 * @param obj
 */
export function objEntries(obj) {
    return reduceObj(obj, (init, v, k) => {
        init.push([k, v]);
        return init;
    }, []);
}
