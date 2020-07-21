// 对象深拷贝办法(深度优先)
import { typeOf } from "./common";
// 如果要复制函数属性的话，使用deepCopy
export function cloneFunction(fn) {
    if (typeOf(fn) !== "function")
        return fn;
    let newFn;
    eval("newFn = " + fn.toString());
    return newFn;
}
const cloneStrategies = (function () {
    const st = {
        array(target) {
            return new target.constructor();
        },
        "function": function (target) {
            return cloneFunction(target);
        },
        date(target) {
            return new target.constructor(target);
        },
    };
    return {
        ...st,
        object: st.array,
        regexp: st.date,
    };
})();
export function deepClone(target) {
    const type = typeOf(target);
    // 使用策略模式
    const strategies = cloneStrategies[type];
    const result = strategies ? strategies(target) : target;
    if (["object", "array", "function"].indexOf(type) === -1)
        return result;
    const tar = target;
    // 虽然array使用for i++比for in遍历快，但是如果在数组里面有非number类型的键的话，就无法复制，所以统一用for in遍历
    for (const k in tar) {
        //prototype继承的不复制  es6继承的不会被拦截
        if (!tar.hasOwnProperty(k))
            continue;
        result[k] = deepClone(tar[k]); // 递归复制
    }
    return result;
}
// 对象深拷贝办法(广度优先)
export function deepCloneBfs(target) {
    if (typeof target !== "object" || !target)
        return target;
    const result = new target.constructor();
    const queue = getChildren(target, result);
    function getChildren(tar, parent) {
        const que = [];
        for (let k in tar) {
            if (!tar.hasOwnProperty(k))
                continue;
            que.push([k, tar[k], parent]);
        }
        return que;
    }
    while (queue.length) {
        const [k, v, parent] = queue.shift();
        if (typeof v !== "object") {
            parent[k] = v;
            continue;
        }
        if (parent[k] === undefined)
            parent[k] = new v.constructor();
        queue.push(...getChildren(v, parent[k]));
    }
    return result;
}
