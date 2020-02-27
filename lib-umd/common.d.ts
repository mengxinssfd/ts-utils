/**
 * 防抖函数
 * @param callback 回调
 * @param delay 延时
 * @returns {Function}
 */
export declare function debounce(callback: (...args: any[]) => void, delay: number): (...args: any[]) => void;
/**
 * 轮询函数
 * @param callback
 * @param interval  间隔
 * @param immediate 是否马上执行第一次
 */
export declare function polling(callback: (times: number) => void | Promise<any>, interval: number, immediate?: boolean): () => void;
export declare function forEachByLen(len: any, callback: (index: number) => any | false): void;
export declare function deepCopy<T>(target: T): T;
export interface formatDateInterface {
    (format: string): string;
    seasonText: string[];
    weekText: string[];
}
/**
 * 格式化日期  到date原型上用 不能import导入调用 或者用call apply
 * @param format
 * @returns String
 */
export declare const formatDate: formatDateInterface;
export declare function getNumberLenAfterDot(num: number | string): number;
export declare const FloatCalc: {
    add(a: number, b: number): number;
    minus(a: number, b: number): number;
    mul(a: number, b: number): number;
    division(a: number, b: number): number;
};
export declare function typeOf(target: any): string;
export declare function isObject(target: any): target is object;
export declare function isArray(target: any): target is Array<any>;
export declare function isArrayLike(target: any): target is ArrayLike<any>;
export declare function isString(target: any): target is string;
export declare function isNumber(target: any): target is number;
export declare function isFunction(target: any): target is Function;
export declare function isBoolean(target: any): target is boolean;
export declare function isUndefined(target: any): target is undefined;
export declare function isNaN(target: any): boolean;
export declare function isEmptyObject(target: object): boolean;
export declare function isEmpty(target: any): boolean;
export declare function randomNumber(start?: number, end?: number, length?: number): number | number[];
/**
 * 随机颜色
 */
export declare function randomColor(len?: number): string | string[];
/**
 * 字符串转为date对象 因为苹果手机无法直接new Date("2018-08-01 10:20:10")获取date
 * @param date 格式：yyyy-MM-dd hh:mm:ss
 * @returns {Date}
 */
export declare function getDateFromStr(date: string): Date | void;
export declare function objectIsEqual(obj1: object, obj2: object): boolean;
export declare function isEqual(a: any, b: any): boolean;
/**
 * 千位分隔 1,234,567,890
 * @param num
 */
export declare function thousandFormat(num: string | number): string;
export declare function getFormatStr(str: any, ...params: any[]): any;
/**
 * 给长度不满足要求的字符串添加前缀
 * @param target
 * @param fill
 * @param len
 */
export declare function strFillPrefix(target: string, fill: string, len: number): string;
/**
 * 每隔一段事件返回字符串中的一个单词
 * @param words
 * @param delay
 * @param callback
 */
export declare function oneByOne(words: string, delay: number, callback?: (word: string, index: number, words: string) => false | void): () => void;
/**
 * 阿拉伯数字转为中文数字
 * @param number
 */
export declare function getChineseNumber(number: number): any;
export declare function generateFunctionCode(argsArrayLength: number): string;
export declare function generateFunction(obj: object, property: string, args: any[]): any;
