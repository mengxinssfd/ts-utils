/**
 * @param millisecond
 * @param {string} [format=d天hh时mm分ss秒] - 格式化模板
 */
export declare function number2Date(millisecond: number, format?: string): string;
export declare function dateDiff(start: Date, end: Date, format?: string): string;
export interface formatDateInterface {
    (format?: string): string;
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
export declare function sleep(delay: number): Promise<void>;
export declare function createTimeCountUp(): () => number;
/**
 * 创建一个倒计时函数
 * @param countDown 目标毫秒
 */
export declare function createTimeCountDown(countDown: number): () => number;
/**
 * 获取指定月份最后一个周日
 * @param month
 */
export declare function getMonthTheLastSundayDate(month: Date): Date;
export declare function getMonthTheLastWeekDay(month: Date, weekDay?: number): Date;
