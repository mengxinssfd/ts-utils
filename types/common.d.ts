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
 * @param invalidCB {function}间隔期间调用throttle返回的函数执行的回调  例如一个按钮5秒点击一次，不可点击时执行该函数
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
/**
 * 千位分隔 1,234,567,890
 * @param num
 */
export declare function thousandFormat(num: string | number): string;
export declare function strTemplate(str: any, ...params: any[]): any;
/**
 * 给长度不满足要求的字符串添加前缀 strFillPrefix
 * @param target
 * @param maxLen
 * @param [fill=' '] 默认fill=" "
 */
export declare function strPadStart(target: string, maxLen: number, fill?: string): string;
/**
 * 给长度不满足要求的字符串添加后缀 strFillPrefix
 * @param target
 * @param maxLen
 * @param [fill=" "] 默认fill=" "
 */
export declare function strPadEnd(target: string, maxLen: number, fill?: string): string;
/**
 * 每隔一段事件返回字符串中的一个单词
 * @param words
 * @param delay
 * @param callback
 */
export declare function oneByOne(words: string, delay: number, callback?: (word: string, index: number, words: string) => false | void): () => void;
export interface Number2Chinese {
    (number: number): string;
    units: string[];
    numbers: string[];
}
/**
 * 阿拉伯数字转为中文数字
 * @param number
 */
export declare const number2Chinese: Number2Chinese;
export interface Chinese2Number {
    (chineseNumber: string): number;
    units: string[];
    numbers: string[];
}
/**
 * 中文转为阿拉伯数字
 * @param chineseNumber
 */
export declare const chinese2Number: Chinese2Number;
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
 * 从字符串中删除指定字符串(from)中重复的第n(num)个字符串(str)
 * @example
 * removeSlashByNum("123/456/78", 2, "\/"); // "123/45678"
 * @param from
 * @param num
 * @param removeStr
 */
export declare function removeStrByNum(from: string, num: number, removeStr: string): string;
/**
 * 原来的函数四舍五入不准确
 * @param num
 * @param [fractionDigits = 0]
 * @param [rounding = false] 是否四舍五入
 */
export declare function numToFixed(num: number, fractionDigits?: number, rounding?: boolean): string;
/**
 * 切割字符串
 * @param str
 * @param start
 * @param {number?} [end=str.length] end为正数时与String.prototype.substring效果一致，为负数时相当于end+str.length
 */
export declare function subString(str: string, start: number, end?: number): string;
/**
 * 与String.prototype.repeat相同
 * String.prototype.repeat支持到ie11
 * @param value
 * @param repeatCount
 */
export declare function strRepeat(value: string, repeatCount: number): string;
export declare namespace strRepeat {
    var MAX_STR_LENGTH: number;
}
/**
 * 根据模板创建出字符串  除了面试题找不到应用场景的函数
 * @example
 * smartRepeat("2[2[a]2[b]]") // returns "aabbaabb"
 * @param format
 */
export declare function smartRepeat(format: string): string;
