"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objFilter = exports.revertObjFromPath = exports.getObjPathEntries = exports.setObjValueByPath = exports.getObjValueByPath = exports.translateObjPath = exports.objEntries = exports.objValues = exports.objKeys = exports.ObjFromEntries = exports.createObj = exports.pickUpdated = exports.objUpdate = exports.defaults = exports.assign = exports.omit = exports.renameObjKey = exports.pickDiff = exports.pick = exports.pickRename = exports.pickByKeys = exports.objReduce = exports.reduceObj = exports.getReverseObj = exports.objForEach = exports.forEachObj = exports.deepMerge = exports.getTreeNodeLen = exports.getTreeMaxDeep = void 0;
const array_1 = require("./array");
const dataType_1 = require("./dataType");
// 获取object树的最大层数 tree是object的话，tree就是层数1
function getTreeMaxDeep(tree) {
    function deeps(obj, num = 0) {
        if (typeof tree !== "object" || tree === null)
            return num;
        let arr = [++num];
        forEachObj(obj, (v) => {
            arr.push(deeps(v, num));
        });
        return Math.max(...arr);
    }
    return deeps(tree);
}
exports.getTreeMaxDeep = getTreeMaxDeep;
// 获取树某层的节点数 0是tree本身
function getTreeNodeLen(tree, nodeNumber = 1) {
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
exports.getTreeNodeLen = getTreeNodeLen;
// 合并两个object TODO 可优化
function deepMerge(first, second) {
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
exports.deepMerge = deepMerge;
/**
 * 代替Object.keys(obj).forEach，减少循环次数
 * @param obj
 * @param callbackFn 返回false的时候中断
 * @param elseCB 遍历完后执行
 * @returns {boolean} isDone
 */
function forEachObj(obj, callbackFn, elseCB) {
    for (const k in obj) {
        if (!obj.hasOwnProperty(k))
            continue;
        const v = obj[k];
        if (callbackFn(v, k, obj) === false)
            return false;
    }
    elseCB && elseCB();
    return true;
}
exports.forEachObj = forEachObj;
/**
 * @alias forEachObj
 */
exports.objForEach = forEachObj;
/**
 * object key-value翻转
 * @param obj
 */
function getReverseObj(obj) {
    return reduceObj(obj, (res, v, k) => {
        res[v] = k;
        return res;
    }, {});
}
exports.getReverseObj = getReverseObj;
/**
 * 代替Object.keys(obj).reduce，减少循环次数
 * @param obj
 * @param callbackFn
 * @param initialValue 初始值 数组中可以省略，默认使用数组中的第一项作为初始值，但object不存在第一项，所以不能省略
 */
function reduceObj(obj, callbackFn, initialValue) {
    let result = initialValue;
    forEachObj(obj, (v, k, o) => {
        result = callbackFn(result, v, k, o);
    });
    return result;
}
exports.reduceObj = reduceObj;
/**
 * @alias reduceObj
 */
exports.objReduce = reduceObj;
/**
 * @param originObj
 * @param pickKeys
 * @param cb
 */
function pickByKeys(originObj, pickKeys, cb) {
    const callback = cb || (v => v);
    return pickKeys.reduce((res, key) => {
        if (originObj.hasOwnProperty(key))
            res[key] = callback(originObj[key], key, originObj);
        return res;
    }, {});
}
exports.pickByKeys = pickByKeys;
// TODO 不完美的地方：k === "a"时应该限定返回值类型为number
/*pickByKeys({a: 123, b: "111", c: false}, ["a", "b"], (v, k, o) => {
    if(k === "a"){
        return "123123"
    }
    return v;
});*/
// 新属性名作为键名的好处是可以多个属性对应一个值
function pickRename(originObj, pickKeyMap, cb) {
    const callback = cb || (v => v);
    /* const renames = Object.keys(renamePickObj) as (keyof O)[];
     return renames.reduce((result, rename) => {
         const pick = renamePickObj[rename];
         if (originObj.hasOwnProperty(pick)) {
             result[rename] = callback(originObj[pick], pick, originObj);
         }
         return result;
     }, {} as any);*/
    return reduceObj(pickKeyMap, (result, pick, rename) => {
        if (originObj.hasOwnProperty(pick)) {
            result[rename] = callback(originObj[pick], pick, originObj);
        }
        return result;
    }, {});
}
exports.pickRename = pickRename;
/**
 * 合并pickByKeys与pickRename两者的功能
 */
function pick(originObj, picks, cb) {
    const isObj = (0, dataType_1.isObject)(picks);
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
exports.pick = pick;
// pick({a: 132, b: "123123"}, ["a", "b"]);
/**
 * 从其他对象中挑出与原对象值不一样的或原对象中不存在的键值对所组成的新对象
 * @param origin
 * @param objs
 * @param verify
 */
function pickDiff(origin, objs, verify) {
    const verifyFn = verify || ((originV, objV, k, origin, obj) => {
        return origin.hasOwnProperty(k) && originV === objV || (0, dataType_1.isNaN)(originV) && (0, dataType_1.isNaN)(objV);
    });
    return objs.reduce((result, obj) => {
        (0, exports.objForEach)(obj, (v, k) => {
            if (verifyFn(origin[k], v, k, origin, obj))
                return;
            result[k] = v;
        });
        return result;
    }, {});
}
exports.pickDiff = pickDiff;
/**
 * 根据新键值对重命名对象的key，并生成一个新的对象
 * @param originObj
 * @param keyMap
 */
function renameObjKey(originObj, keyMap) {
    const result = assign({}, originObj);
    let delKeys = [];
    const newKeys = [];
    forEachObj(keyMap, (originKey, k) => {
        if (result.hasOwnProperty(originKey)) {
            result[k] = result[originKey];
            delKeys.push(originKey);
            newKeys.push(k);
        }
    });
    // 可能新key会与旧key同名，如果是同名则把该key从要删除的key数组中移除
    // delKeys = delKeys.filter(k => newKeys.indexOf(k as string) === -1);
    delKeys.forEach(k => {
        if (newKeys.indexOf(k) > -1)
            return;
        delete result[k];
    });
    return result;
}
exports.renameObjKey = renameObjKey;
/**
 * Omit 省略
 * @example
 *  // returns {c: true}
 *  omit({a: 123, b: "bbb", c: true}, ["a", "b"])
 * @param target
 * @param keys
 */
function omit(target, keys) {
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
exports.omit = omit;
function assign(target, ...args) {
    args.forEach(arg => {
        // forEachObj(arg, (v, k) => target[k] = v);  // 不能返回“target[k] = v”值，v可能会为false，为false会中断循环
        forEachObj(arg, (v, k) => {
            target[k] = v;
        });
    });
    return target;
}
exports.assign = assign;
/**
 * 与lodash defaults一样 只替换target里面的值为undefined的属性
 * 类型推导会以前面的为准
 * @example
 * defaults({a: 12, b: undefined, c: 3}, {a: 1}, {b: 2}, {d: 4}); // returns {a: 12, b: 2, c: 3, d: 4}
 * defaults({a:12,b:undefined,c:3},{a:1},{b:2},{c:undefined}); // returns {a: 12, b: 2, c: 3}
 * @param target
 * @param args
 */
function defaults(target, ...args) {
    args.forEach(arg => {
        forEachObj(arg, (v, k) => {
            if (v === undefined || target[k] !== undefined)
                return;
            target[k] = v;
        });
    });
    return target;
}
exports.defaults = defaults;
/**
 * 使用target里面的key去查找其他的对象，如果其他对象里有该key，则把该值复制给target,如果多个对象都有同一个值，则以最后的为准
 * 会更新原对象
 * @param target
 * @param args
 */
function objUpdate(target, ...args) {
    (0, exports.objForEach)(target, (v, k) => {
        (0, array_1.forEachRight)(function (item) {
            if (item && item.hasOwnProperty(k)) {
                target[k] = item[k];
                return false;
            }
        }, args);
    });
    return target;
}
exports.objUpdate = objUpdate;
/**
 * 根据与target对比，挑出与target同key不同value的key所组成的object
 * @param target
 * @param objs  相当于assign(...objs) 同样的key只会取最后一个
 * @param compareFn
 */
function pickUpdated(target, objs, compareFn = (a, b) => a === b || ((0, dataType_1.isNaN)(a) && (0, dataType_1.isNaN)(b))) {
    return (0, exports.objReduce)(target, (result, v, k) => {
        (0, array_1.forEachRight)(function (item) {
            if (item && item.hasOwnProperty(k)) {
                if (!compareFn(target[k], item[k])) {
                    result[k] = item[k];
                }
                return false;
            }
        }, objs);
        return result;
    }, {});
}
exports.pickUpdated = pickUpdated;
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
function createObj(entries) {
    return entries.reduce((initValue, item) => {
        if (!(0, dataType_1.isArray)(item) || item.length < 1)
            throw new TypeError("createObj args type error");
        const [key, value] = item;
        if (key !== void 0) {
            initValue[key] = value;
        }
        return initValue;
    }, {});
}
exports.createObj = createObj;
/**
 * @alias createObj
 */
exports.ObjFromEntries = createObj;
/**
 * Object.keys
 * @param obj
 */
function objKeys(obj) {
    // Object.keys es5可以使用
    return reduceObj(obj, (init, v, k) => {
        init.push(k);
        return init;
    }, []);
}
exports.objKeys = objKeys;
/**
 * Object.values
 * @param obj
 */
function objValues(obj) {
    return reduceObj(obj, (init, v) => {
        init.push(v);
        return init;
    }, []);
}
exports.objValues = objValues;
/**
 * Object.entries
 * @param obj
 */
function objEntries(obj) {
    return reduceObj(obj, (init, v, k) => {
        init.push([k, v]);
        return init;
    }, []);
}
exports.objEntries = objEntries;
/**
 * obj[a] => obj.a 从getObjValueByPath中分离出来
 * @param path
 * @param [objName = ""]
 */
function translateObjPath(path, objName = "") {
    let result = path;
    // obj[a] => obj.a
    result = result.replace(new RegExp(`^${objName}`), "");
    result = result.replace(/\[([^\]]+)]/g, ".$1");
    result = result.replace(/^\.|\[]/g, "");
    return result;
}
exports.translateObjPath = translateObjPath;
/**
 * 通过object路径获取值
 * @example
 * getObjValueByPath({a: {b: {c: 123}}}, "a.b.c") // => 123
 * @param obj
 * @param path
 * @param [objName = ""]
 */
function getObjValueByPath(obj, path, objName = "") {
    const p = translateObjPath(path, objName);
    return p.split(".").reduce((init, v) => {
        if (!(0, dataType_1.isBroadlyObj)(init))
            return undefined;
        return init[v];
    }, obj);
}
exports.getObjValueByPath = getObjValueByPath;
/**
 * 通过object路径设置值 如果路径中不存在则会自动创建对应的对象
 * @example
 * @param obj
 * @param path
 * @param value
 * @param onExist 当要改动位置已经有值时的回调
 * @param [objName = ""]
 */
function setObjValueByPath(obj, path, value, onExist = (a, b) => b, objName = "") {
    const p = translateObjPath(path, objName);
    const split = p.split(".");
    const end = split.length - 1;
    split.reduce(([init, currentPath], key, index) => {
        currentPath = currentPath + (currentPath ? "." + key : key);
        if (index === end) {
            if (init.hasOwnProperty(key)) {
                value = onExist(init[key], value, true, currentPath);
            }
            init[key] = value;
            return [init[key], currentPath];
        }
        if (!(0, dataType_1.isBroadlyObj)(init[key])) {
            init[key] = init.hasOwnProperty(key) ? onExist(init[key], {}, false, currentPath) : {};
        }
        return [init[key], currentPath];
    }, [obj, ""]);
    return obj;
}
exports.setObjValueByPath = setObjValueByPath;
/**
 * 获取object的路径数组
 * @example
 * getObjPathEntries({a: 1}) // => [["[a]", 1]]
 * getObjPathEntries({a: 1},"obj") // => [["obj[a]", 1]]
 * @param obj
 * @param [objName = ""]
 */
function getObjPathEntries(obj, objName = "") {
    return reduceObj(obj, (init, v, k) => {
        const key = `${objName}[${k}]`;
        if ((0, dataType_1.isBroadlyObj)(v)) {
            init.push(...getObjPathEntries(v, key));
        }
        else {
            init.push([key, v]);
        }
        return init;
    }, []);
}
exports.getObjPathEntries = getObjPathEntries;
// 根据路径还原整个object
function revertObjFromPath(pathArr) {
    function getKV(path) {
        let [key, value] = path.split("=").map(item => decodeURIComponent(item));
        let innerKey = "";
        const reg = /(?:\[([^\[\]]*)])|(?:\.\[?([^\[\]]*)]?)/g;
        if (reg.test(key)) {
            innerKey = RegExp.$1 || RegExp.$2;
            key = key.replace(reg, "");
        }
        // key = key.replace(/\[[^\[\]]*]/g, "");
        return { key, value, innerKey };
    }
    return pathArr.reduce((result, path) => {
        const { key, value, innerKey } = getKV(path);
        const resultValue = result[key];
        switch ((0, dataType_1.typeOf)(resultValue)) {
            case "undefined":
                if (!innerKey) {
                    result[key] = value;
                }
                else {
                    const arr = [];
                    arr[innerKey] = value;
                    result[key] = arr;
                }
                break;
            case "string":
                result[key] = [resultValue];
            case "array":
                if (!innerKey) {
                    result[key].push(value);
                }
                else {
                    result[key][innerKey] = value;
                }
        }
        return result;
    }, {});
}
exports.revertObjFromPath = revertObjFromPath;
// ie9+ 支持，不需要实现
/*
export function objCreate(proto: any) {
    const origin = {};
    // @ts-ignore
    origin.__proto__ = proto;
    return origin;
}*/
function objFilter(obj, predicate = (v) => v) {
    return (0, exports.objReduce)(obj, (init, v, k) => {
        if (predicate(v, k)) {
            init[k] = v;
        }
        return init;
    }, {});
}
exports.objFilter = objFilter;
