/**
 * Number.prototype.toLocaleString 也能转成千位分隔数字字符串
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
export declare function capitalizeFirstChar(value: string): string;
export declare function fromCamel(value: string, delimiter?: string): string;
export declare function toCamel(value: string, delimiter?: string | RegExp, toUpperCamelCase?: boolean): string;
