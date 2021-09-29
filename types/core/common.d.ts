/**
 * 防抖函数
 * @param callback 回调
 * @param delay 延时
 * @param [immediate = false] 为true的时候第一次会立即执行callback并禁止立即执行，之后时间间隔内的只会执行一次callback并恢复立即执行，
 *                            如果只执行了一次立即执行callback，那么会在一次delay延时后恢复可立即执行
 *
 * @returns {Function}
 */
export declare function debounce<CB extends (...args: any[]) => any>(callback: CB, delay: number, immediate?: boolean): CB & {
    cancel(): void;
    flush: CB;
};
/**
 * 如果callback执行了的话，那么不论是否resolved都不会再被reject
 * @param callback
 * @param delay
 */
export declare function debounceAsync<T, CB extends (...args: any[]) => Promise<T>>(callback: CB, delay: number): CB;
/**
 * 节流函数
 * @param callback
 * @param delay
 * @param invalidCB {function?}间隔期间调用throttle返回的函数执行的回调  例如一个按钮5秒点击一次，不可点击时执行该函数
 */
export declare function throttle<CB extends (...args: any[]) => (void | any)>(callback: CB, delay: number, invalidCB?: (interval: number) => void): CB;
/**
 * 可取消防抖函数
 * @param callback 回调
 * @param delay 延时
 * @returns {Function}
 */
export declare function debounceCancelable(callback: (...args: any[]) => void, delay: number): (...args: any[]) => () => void;
/**
 * 前一个promise未完成即reject，最后一个或者中断前调用的才会执行
 * 无法阻止cb被调用 不推荐使用
 * @param callback
 */
export declare function debounceByPromise<T, CB extends (...args: any[]) => Promise<T>>(callback: CB): CB;
/**
 * 轮询函数
 * @param callback
 * @param interval  间隔
 * @param [immediate=true] 是否马上执行第一次
 */
export declare function polling(callback: (times: number) => void | Promise<any>, interval: number, immediate?: boolean): () => void;
export declare function forEachByLen(len: number, callback: (index: number) => (any | false)): void;
export declare function forEachByLenRight(len: number, callback: (index: number) => (any | false)): void;
/**
 * 每隔一段事件返回字符串中的一个单词
 * @param words
 * @param delay
 * @param callback
 */
export declare function oneByOne(words: string, delay: number, callback?: (word: string, index: number, words: string) => false | void): () => void;
export declare function generateFunctionCode(argsArrayLength: number): string;
export declare function functionApply<T extends object, K extends keyof T>(obj: T, property: K, args: any[]): any;
/**
 * 生成不重复的字符串
 * @param length
 * @returns {string}
 */
export declare function createUUID(length: number): string;
/**
 * 格式化json
 * @param json
 * @param [indent=2] tab空格占位
 */
export declare function formatJSON(json: object | string, indent?: number): string;
export declare function createEnum<T extends string>(items: T[]): {
    [k in T]: number;
} & {
    [k: number]: T;
};
export declare function createEnumByObj<T extends object, K extends keyof T, O extends {
    [k: string]: K;
}>(obj: T): T & {
    [k: string]: K;
};
/**
 * Promise.prototype.any list中任意一个promise resolve都会resolve
 * @param list
 */
export declare function promiseAny<T>(list: Promise<T>[]): Promise<T>;
/**
 * promise队列  任何一个reject都会中断队列 (跟reduceAsync类似)
 * 队列第一个会接收initValue作为参数，其余会接收上一个promise返回值作为参数
 * @param queue
 * @param initValue
 */
export declare function promiseQueue<T>(queue: Array<(lastValue: unknown) => Promise<unknown>>, initValue: T): Promise<unknown>;
export declare const root: any;
/**
 * 原来的函数四舍五入不准确
 * @note 原来的toFixed可以把科学计数法的小数，给转成普通小数字符串
 * @param num
 * @param [fractionDigits = 0]
 * @param [rounding = false] 是否四舍五入
 */
export declare function numToFixed(num: number, fractionDigits?: number, rounding?: boolean): string;
/**
 * 从arr获取index处的item，支持负数
 * @param arr
 * @param index
 * @param def
 */
export declare function at<V extends ArrayLike<any>, K extends (keyof V | number), T extends ArrayLikeType<V>, D extends any | void>(arr: V, index: K, def?: D): In<V, K, D extends never ? T | void : T | D>;
declare type In<A, K, D> = K extends keyof A ? A[K] extends void ? D : A[K] : D;
declare type ArrayLikeType<T> = T extends ArrayLike<infer R> ? R : never;
/**
 * 查找对象中与param key类似的key
 * @param target
 * @param key
 */
export declare function likeKeys(target: object | Map<string, any>, key: string | RegExp): string[];
/**
 * 命令行的参数转为Map
 * @notice 部分命令行工具中"--"是全写，"-"是缩写 这里未分
 * @param arr 命令行参数数组
 * @param prefix 前缀 --d --f 前缀是"--"
 * @param defaultKey 如果前面没有变量名那么使用默认
 */
export declare function parseCmdParams(arr: string[], prefix?: string, defaultKey?: string): Map<string, string[] | string | boolean>;
/**
 * 返回函数绑定this后的函数
 * @param fn
 * @param thisTarget
 */
export declare function getBoundFn<T extends Function>(fn: T, thisTarget: object): T;
export {};
