import { OneByOne } from "./OneByOne";
import { UrlParse } from "./urlParse";
import { addClass, removeClass, isDom, prefixStyle } from "./dom";
export { OneByOne, UrlParse, addClass, removeClass, isDom, prefixStyle };
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
 * @param interval
 * @param immediate
 */
export declare function polling(callback: (...args: any[]) => void | Promise<any>, interval: number, immediate?: boolean): () => void;
export declare function deepCopy(obj: any): any;
/**
 * 格式化日期  到date原型上用 不能import导入调用 或者用call apply
 * @param formatStr
 * @returns String
 */
export declare function formatDate(formatStr: string): string;
export declare function getNumberLenAfterDot(num: number | string): number;
export declare const FloatCalc: {
    add(a: number, b: number): number;
    minus(a: number, b: number): number;
    mul(a: number, b: number): number;
    division(a: number, b: number): number;
};
export declare function typeOf(target: any): string;
export declare function isEmpty(target: any): boolean;
export declare function randomNumber(start?: number, end?: number): number;
/**
 * 随机颜色
 */
export declare function randomColor(): string;
/**
 * 字符串转为date对象 因为苹果手机无法直接new Date("2018-08-01 10:20:10")获取date
 * @param dateString
 * @returns {Date}
 */
export declare function getDateFromStr(dateString: string): Date;
export declare function objectIsEqual(obj1: any, obj2: any): boolean;
export declare function isEqual(a: any, b: any): boolean;
/**
 * 千位分隔 1,234,567,890
 * @param num
 */
export declare function qwFormat(num: string | number): string;
export declare function getFormatStr(): any;
/**
 * 给长度不满足要求的字符串添加前缀
 * @param target
 * @param fill
 * @param len
 */
export declare function strFillPrefix(target: string, fill: any, len: number): string;
/**
 * 每隔一段事件返回字符串中的一个单词
 * @param words
 * @param delay
 * @param callback
 */
export declare function oneByOne(words: string, delay: number, callback?: (word: string, words: string) => boolean | undefined): void;
/**
 * 阿拉伯数字转为中文数字
 * @param number
 */
export declare function getChineseNumber(number: number): any;
