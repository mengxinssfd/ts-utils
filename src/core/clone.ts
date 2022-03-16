import {Stack} from "./Stack";
import {isBroadlyObj, typeOf} from "./dataType";

// 如果要复制函数属性的话，使用deepClone
// 不建议复制函数，因为复制的函数不能访问原函数外面的变量
export function cloneFunction<T extends Function>(fn: T): T {
    if (typeOf(fn) !== "function") return fn;

    let str = fn.toString();
    // fn(){} es6写法的函数要转换成function(){}
    str = str.replace(/(function)? ?\w+ ?\(/, "function(");
    // let newFn: any;
    // str = "newFn = " + str;
    // (0, eval)(str); // 直接使用eval在rollup build的时候会报错 (0, eval)(str)在nodejs里面不会有效
    // return newFn;

    // 用new Function(str)代替eval(str)
    return new Function("return " + str)();
}

const cloneStrategies: { [key: string]: (target: any) => any } = (function () {
    const st: typeof cloneStrategies = {
        array(target) {
            return new target.constructor();
        },
        "function": function (target) {
            // 复制的函数作用域不再是原函数的作用域
            // (如复制一个闭包函数，作用域会提升到script顶层，将不能访问原闭包函数外的变量)，
            // 不再复制函数
            // return cloneFunction(target);
            return target;
        },
        date(target) {
            return new target.constructor(target);
        },
    };
    st.object = st.array;
    st.regexp = st.date;

    return st;
})();

// 对象深拷贝办法(深度优先)
export function deepClone<T>(target: T): T {
    const cache = new Stack();

    function _clone(value: any) {
        const type = typeOf(value);
        const isObject = isBroadlyObj(value as any);
        if (isObject) {
            if (cache.has(value)) return value;
            // 非引用类型不缓存
            cache.set(value);
        }
        // 使用策略模式
        const strategies = cloneStrategies[type];
        const result: any = strategies ? strategies(value) : value;
        if (["object", "array", "function"].indexOf(type) === -1) return result;
        const tar: any = value;
        // 虽然array使用for i++比for in遍历快，但是如果在数组里面有非number类型的键的话，就无法复制，所以统一用for in遍历
        for (const k in tar) {
            //prototype继承的不复制  es6继承的不会被拦截
            if (!tar.hasOwnProperty(k)) continue;
            result[k] = _clone(tar[k]);   // 递归复制
        }
        return result;
    }

    return _clone(target);
}

// 对象深拷贝办法(广度优先)
export function deepCloneBfs<T>(target: T): T {
    if (typeof target !== "object" || !target) return target;
    type key = string
    type value = any;
    type parent = any;
    type queItem = [key, value, parent];
    const result: any = new (target as any).constructor();
    const queue: queItem[] = [];
    getChildren(target as any, result);

    function getChildren(tar: object, parent: any) {
        for (let k in tar) {
            if (!tar.hasOwnProperty(k)) continue;
            queue.push([k, tar[k], parent]);
        }
    }

    while (queue.length) {
        const [k, v, parent] = queue.shift()!;

        const type = typeof v;
        // console.log(type);
        if (type !== "object") {
            parent[k] = v;
            continue;
        }

        if (parent[k] === undefined) {
            parent[k] = new v.constructor();
        }
        getChildren(v, parent[k]);
    }
    return result;
}