export declare function typeOf(target: any): string;
export declare function isObject(target: any): target is object;
export declare function isArray(target: any): target is Array<any>;
export declare function isArrayLike(target: any): target is ArrayLike<any>;
export declare function isString(target: any): target is string;
export declare function isNumber(target: any): target is number;
export declare function isFunction(target: any): target is Function;
export declare function isBoolean(target: any): target is boolean;
export declare function isUndefined(target: any): target is undefined;
/**
 *  用typeIn("123", ["string", "number"]) 代替  typeOf("123") === "string" || typeOf("123") === "number"
 * @description 注意： 只能判断typeOf能够判断的类型   不能判断是否是NaN 是否是""
 * @param target
 * @param types
 */
export declare function inTypes(target: any, types: string[]): boolean;
export declare function isPromiseLike<T, S>(target: PromiseLike<T> | S): target is PromiseLike<T>;
export declare function isNaN(target: any): boolean;
export declare function isEmptyObject(target: object): boolean;
export declare function isEmpty(target: any): boolean;
export declare function isEqual(a: any, b: any): boolean;
export declare function objectIsEqual(obj1: object, obj2: object): boolean;
export declare function isSameType(a: any, b: any): boolean;
export declare function isIterable(target: any): target is Iterable<any>;
