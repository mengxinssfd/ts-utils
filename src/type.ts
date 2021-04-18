import {includes} from "./array";

export function isNative(value: any): boolean {
    const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    const reIsNative = RegExp(`^${
        Function.prototype.toString.call(Object.prototype.hasOwnProperty)
            .replace(reRegExpChar, "\\$&")
            .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?")
    }$`);
    return isBroadlyObject(value) && reIsNative.test(value as any);
}

// 获取数据类型
export function typeOf(target: any): string {
    const tp = typeof target;
    if (tp !== "object") return tp;
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

export function isObject(target: any): target is object {
    return typeOf(target) === "object";
}

export function isBroadlyObject(value: object): value is object {
    const type = typeof value;
    return value != null && (type === "object" || type === "function");
}

export function isArray(target: any): target is Array<any> {
    return typeOf(target) === "array";
}

// 类数组对象 jq的实现方式
export function isArrayLike(target: any): target is ArrayLike<any> {
    // 检测target的类型
    const type = typeOf(target);
    if (["string", "null", "undefined", "number", "boolean"].indexOf(type) > -1) return false;
    // 如果target非null、undefined等，有length属性，则length等于target.length
    // 否则，length为false
    const length = !!target && "length" in target && target.length;
    // 如果target是function类型 或者是window对象 则返回false
    if (type === "function" || target === window) {
        return false;
    }
    // target本身是数组，则返回true
    // target不是数组，但有length属性且为0，例如{length : 0}，则返回true
    // target不是数组,但有length属性且为整数数值，target[length - 1]存在，则返回true
    return type === "array" || length === 0 || isNumber(length) && length > 0 && (length - 1) in target;
}

export function isString(target: any): target is string {
    return typeOf(target) === "string";
}

export function isNumber(target: any): target is number {
    return typeOf(target) === "number";
}

export function isFunction(target: any): target is Function {
    return typeOf(target) === "function";
}

export function isBoolean(target: any): target is boolean {
    return typeOf(target) === "boolean";
}

export function isUndefined(target: any): target is undefined {
    return target === void 0;
}

// type t = "number" | "string" | "object" | "array" | "function" | "undefined" | "null" | "boolean" | "regexp"
/**
 *  用typeIn("123", ["string", "number"]) 代替  typeOf("123") === "string" || typeOf("123") === "number"
 * @description 注意： 只能判断typeOf能够判断的类型   不能判断是否是NaN 是否是""
 * @param target
 * @param types
 */
export function inTypes(target: any, types: string[]): boolean {
    if (!isArray(types)) throw TypeError("inTypes param types expected Array<string> but received " + typeOf(types));
    const type = typeOf(target);
    return types.indexOf(type) > -1;
}

// 参考is-promise
export function isPromiseLike<T, S>(target: PromiseLike<T> | S): target is PromiseLike<T> {
    const type = typeof target;
    return !!target/*null也是object*/
        && (type === "object" || type === "function")
        && typeof (target as any).then === "function";
}

// 有native isNaN函数 但是 {} "abc"会是true
export function isNaN(target: any): boolean {
    // return String(target) === "NaN"; // "NaN" 会被判断为true
    return isNumber(target) && target !== target;
}

// 判断是否是空object
export function isEmptyObject(target: object): boolean {
    if (!isObject(target)) return false;
    for (let i in target) {
        return i === undefined;
    }
    return true;
}

// 判断是否是空值 undefined, null, "", [], {} ,NaN都为true
export function isEmpty(target: any): boolean {
    // TO DO 可以替换array里的includes
    if (includes([undefined, null, "", NaN], target)) return true;
    // if (includes([undefined, null, "", NaN], target)) return true;
    switch (typeOf(target)) {
        case "array":
            return !target.length;
        case "object":
            // {a(){}} 使用JSON.stringify是会判断为空的
            // return JSON.stringify(target) === "{}";
            return isEmptyObject(target);
    }
    return false;
}

export function isEqual(a: any, b: any): boolean {
    if (a === b) return true;
    const aType = typeOf(a);
    const bType = typeOf(b);
    if (aType !== bType) return false;
    // noinspection FallThroughInSwitchStatementJS
    switch (aType) {
        case "boolean":
        case "string":
        case "function":
            return false;
        case "number":
            return isNaN(b);
        //  只有数组或者object不相等的时候才去对比是否相等
        case "array":
        case "object":
        default:
            return objectIsEqual(a, b);
    }
}

export function objectIsEqual(obj1: object, obj2: object): boolean {
    if (obj1 === obj2) return true;
    for (const key in obj1) {
        const value1 = obj1[key];
        const value2 = obj2[key];
        if (!isEqual(value1, value2)) {
            return false;
        }
    }
    return true;
}

export function isSameType(a: any, b: any): boolean {
    return typeOf(a) === typeOf(b);
}

export function isIterable(target: any): target is Iterable<any> {
    try {
        for (const {} of target) {
            break;
        }
        return true;
    } catch (e) {
        return false;
    }
}
