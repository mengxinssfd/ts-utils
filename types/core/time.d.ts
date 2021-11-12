/**
 * @param millisecond
 * @param {string} [format=d天hh时mm分ss秒] - 格式化模板
 */
export declare function number2Date(millisecond: number, format?: string): string;
/**
 * 比较两个日期相差年天时分秒  用于倒计时等
 * @param start
 * @param end
 * @param [format="y年d天hh时mm分ss秒"]
 */
export declare function dateDiff(start: Date, end: Date, format?: string): string;
export interface formatDateInterface {
    (format?: string): string;
    seasonText: string[];
    weekText: string[];
}
/**
 * 格式化日期  到date原型上用 不能import导入调用 或者用call apply
 * @param [format="yyyy-MM-dd hh:mm:ss"]
 * @param date {Date?}
 * @returns String
 */
export declare const formatDate: formatDateInterface;
export declare function useDateFormat(force?: boolean): void;
export declare function noConflictDateFormat(): void;
/**
 * 字符串转为date对象 因为苹果手机无法直接new Date("2018-08-01 10:20:10")获取date
 * @param date 格式：yyyy-MM-dd hh:mm:ss
 * @returns {Date}
 */
export declare function getDateFromStr(date: string): Date | null;
export declare const str2Date: typeof getDateFromStr;
export declare function sleep(ms: number): Promise<void>;
export declare function createTimeCountUp(): () => number;
/**
 * 创建一个倒计时函数
 * @param countDown 目标毫秒
 */
export declare function createTimeCountDown(countDown: number): () => number;
/**
 * 获取某月最后一天的date
 * @param month
 */
export declare function getTheLastDayOfAMonth(month: Date): Date;
/**
 * 获取指定某年月份(month)第n(nth)个星期几(weekday)的Date
 * @param month
 * @param nth nth为负的时候从月末开始倒数
 * @param [weekday=0] 0和7都是周日
 */
export declare function getMonthTheNthWeekday(month: Date, nth: number, weekday?: number): Date | null;
/**
 * 获取毫秒数
 * @param days
 * @param hours
 * @param minutes
 * @param seconds
 */
export declare function getMilliseconds({ days, hours, minutes, seconds }?: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}): number;
