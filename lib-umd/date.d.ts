/**
 * @param millisecond
 * @param {string} [format=d天hh时mm分ss秒] - 格式化模板
 */
export declare function number2Date(millisecond: number, format?: string): string;
export declare function dateDiff(start: Date, end: Date, format?: string): string;
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
/**
 * 字符串转为date对象 因为苹果手机无法直接new Date("2018-08-01 10:20:10")获取date
 * @param date 格式：yyyy-MM-dd hh:mm:ss
 * @returns {Date}
 */
export declare function getDateFromStr(date: string): Date | null;
export declare const str2Date: typeof getDateFromStr;
