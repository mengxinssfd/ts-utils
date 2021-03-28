/**
 * 防抖函数
 * @param callback 回调
 * @param delay 延时
 * @returns {Function}
 */
export declare function debounce<CB extends (...args: any[]) => void>(callback: CB, delay: number): CB;
/**
 * 如果callback执行了的话，那么不论是否resolved都不会再被reject
 * @param callback
 * @param delay
 */
export declare function debounceAsync<T, CB extends (...args: any[]) => Promise<T>>(callback: CB, delay: number): CB;
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
 * @param immediate 是否马上执行第一次
 */
export declare function polling(callback: (times: number) => void | Promise<any>, interval: number, immediate?: boolean): () => void;
export declare function forEachByLen(len: number, callback: (index: number) => (any | false)): void;
/**
 * 千位分隔 1,234,567,890
 * @param num
 */
export declare function thousandFormat(num: string | number): string;
export declare function getFormatStr(str: any, ...params: any[]): any;
/**
 * 给长度不满足要求的字符串添加前缀 strFillPrefix
 * @param target
 * @param len
 * @param fill
 */
export declare function strPadStart(target: string, len: number, fill: string): string;
/**
 * 给长度不满足要求的字符串添加后缀 strFillPrefix
 * @param target
 * @param len
 * @param fill
 */
export declare function strPadEnd(target: string, len: number, fill: string): string;
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
export declare function generateFunction(obj: object, property: string, args: any[]): any;
export declare function sleep(delay: number): Promise<void>;
/**
 * 生成不重复的字符串
 * @param length
 * @returns {string}
 */
export declare function createUUID(length: number): string;
/**
 * 格式化json
 * @param json
 * @param indent tab空格占位
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
