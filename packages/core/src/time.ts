import { strPadStart } from './string';
import { inRange } from './array';

/**
 * @param millisecond
 * @param {string} [format=d天hh时mm分ss秒] - 格式化模板
 */
export function number2Date(millisecond: number, format = 'd天hh时mm分ss秒') {
  let result = format;
  const seconds = millisecond / 1000;
  const obj: { [k: string]: number } = {
    's+': seconds % 60,
    'm+': ~~(seconds / 60) % 60,
    'h+': ~~(seconds / (60 * 60)) % 24,
    // 'd+': ~~(seconds / (60 * 60 * 24))
  };
  // 有多少天就显示多少天,但不会补0
  const days = ~~(seconds / (60 * 60 * 24));
  result = result.replace(/d+/, String(days));
  for (const k in obj) {
    const reg = new RegExp('(' + k + ')');
    if (reg.test(result)) {
      const s1 = RegExp.$1;
      const v = obj[k];
      let value = String(v).padStart(s1.length, '0');
      value = value.substring(value.length - s1.length);
      result = result.replace(s1, value);
    }
  }
  return result;
}

/**
 * 比较两个日期相差年天时分秒  用于倒计时等
 * @param start
 * @param end
 * @param [format="y年d天hh时mm分ss秒"]
 */
export function dateDiff(start: Date, end: Date, format = 'y年d天hh时mm分ss秒'): string {
  let result = format;
  if (start.getTime() > end.getTime()) {
    [start, end] = [end, start];
  }
  const targetTime = end.getTime() - start.getTime();
  const seconds = ~~(targetTime / 1000);
  const obj: { [k: string]: number } = {
    'S+': targetTime % 1000,
    's+': seconds % 60,
    'm+': ~~(seconds / 60) % 60,
    'h+': ~~(seconds / (60 * 60)) % 24,
    'd+': (function (): number {
      const day = ~~(seconds / (60 * 60 * 24));
      // 如果要显示年，则把天余年，否则全部显示天
      // 默认一年等于365天
      return /y+/.test(result) ? day % 365 : day;
    })(),
    // "M+": 0,
    'y+': ~~(seconds / (60 * 60 * 24 * 365)),
  };

  for (const k in obj) {
    const reg = new RegExp('(' + k + ')');
    if (reg.test(result)) {
      // 奇怪的bug 本地调试的时候RegExp.$1不准确,"s+"的时候$1是空字符串; 非调试的时候又没问题
      const s1 = RegExp.$1;
      const v = obj[k];
      let value = strPadStart(String(v), s1.length, '0');
      // substring(start,end) start小于0的时候为0  substr(from,len)from小于0的时候为字符串的长度+from
      value = value.substring(value.length - s1.length); //手动切割00:00 m:s "00".length - "s".length，因为strPadStart当字符串长度大于length的话不会切割
      result = result.replace(s1, value);
    }
  }
  return result;
}

// 比较两个日期相差年天时分秒  用于倒计时等
/*
export function dateDiff(first: Date, second: Date, format: string = "Y年d天 H时m分s秒"): string {
    const seconds = ~~((second.getTime() - first.getTime()) / 1000);
    const Time: { [k: string]: number } = {
        "s+": seconds % 60,
        "m+": ~~(seconds / 60) % 60,
        "H+": ~~(seconds / (60 * 60)) % 24,
        "d+": (function (): number {
            const day = ~~(seconds / (60 * 60 * 24));
            // 如果要显示年，则把天余年，否则全部显示天
            // 默认一年等于365天
            return /Y+/.test(format) ? day % 365 : day;
        })(),
        // "M+": 0,
        "Y+": ~~(seconds / (60 * 60 * 24 * 365)),
    };

    for (let k in Time) {
        format = format.replace(new RegExp(k), String(Time[k]));
    }
    return format;
}
*/

export interface formatDateInterface {
  (date: Date, format?: string, options?: { seasonText?: string[]; weekText?: string[] }): string;

  seasonText: string[];
  weekText: string[];
}

/**
 * 格式化日期
 * @param [format="yyyy-MM-dd hh:mm:ss"]
 * @param date {Date}
 * @param seasonText {string[]}
 * @param weekText {string[]}
 * @returns String
 */
export const formatDate: formatDateInterface = function (
  date,
  format = 'yyyy-MM-dd hh:mm:ss',
  { seasonText = formatDate.seasonText, weekText = formatDate.weekText } = {},
) {
  const o: Record<string, Function> = {
    'M+': () => date.getMonth() + 1, //月份
    'd+': () => date.getDate(), //日
    'h+': () => date.getHours(), //小时
    'm+': () => date.getMinutes(), //分
    's+': () => date.getSeconds(), //秒
    q: () => {
      //季度
      // 按月份区分的季度并不准确
      const q = Math.floor((date.getMonth() + 3) / 3) - 1;
      return seasonText[q];
    },
    'S+': () => date.getMilliseconds(), //毫秒
    w: () => weekText[date.getDay()], //周
  };
  if (/(y+)/.test(format)) {
    format = format.replace(
      RegExp.$1,
      strPadStart(String(date.getFullYear()), RegExp.$1.length, '0', true),
    );
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      const s1 = RegExp.$1;
      const v = String(o[k]());
      // const value = s1.length === 1 ? v : ("00" + v).substr(String(v).length);
      format = format.replace(s1, strPadStart(v, s1.length, '0'));
    }
  }
  return format;
};
formatDate.weekText = ['日', '一', '二', '三', '四', '五', '六'];
formatDate.seasonText = ['春', '夏', '秋', '冬'];

type FormattedTimeStr =
  | `${number}-${number}-${number}`
  | `${number}-${number}-${number} ${number}:${number}`
  | `${number}-${number}-${number} ${number}:${number}:${number}`;

/**
 * 字符串转为date对象 因为苹果手机无法直接new Date("2018-08-01 10:20:10")获取date
 * @param date 格式：yyyy-MM-dd hh:mm:ss
 * @returns {Date}
 */
export function getDateFromStr(date: FormattedTimeStr): Date | null {
  // 检测非数字、非/、非:、非-
  if (!date || /[^/\d: -]/.test(date)) return null; // 去除不符合规范的字符串
  const arr: number[] = date.split(/[- :/]/).map((item) => Number(item));
  if (arr.length < 6) {
    for (let i = arr.length; i < 6; i++) {
      arr[i] = i < 3 ? 1 : 0; // 年月日最小为1
    }
  }
  return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
}

export const str2Date = getDateFromStr;

export function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export function createTimeCountUp(): () => number {
  const startTime = Date.now();
  return function () {
    return Date.now() - startTime;
  };
}

/*
/!**
 * 创建一个倒计时函数
 * @param countDown 目标毫秒
 *!/
export function createTimeCountDown(countDown: number): () => number {
    const startTime = Date.now();
    return function () {
        const ms = Date.now() - startTime;
        return countDown - ms;
    };
}*/

/**
 * 创建一个倒计时函数
 * @param countDown 目标毫秒
 */
export function createTimeCountDown(countDown: number): () => number {
  const timeCountUp = createTimeCountUp();
  return function () {
    return countDown - timeCountUp();
  };
}

/**
 * 获取某月最后一天的date
 * @param month
 */
export function getTheLastDateOfAMonth(month: Date): Date {
  const lastDate = new Date(month.getTime());
  lastDate.setMonth(month.getMonth() + 1);
  lastDate.setDate(0);
  return lastDate;
}

/**
 * 获取指定某年月份(month)第n(nth)个星期几(weekday)的Date
 * @param month
 * @param nth nth为负的时候从月末开始倒数
 * @param [weekday=0] 0和7都是周日
 */
export function getMonthTheNthWeekday(month: Date, nth: number, weekday = 0) {
  // if (!nth || weekday < 0 || weekday > 7) return null;
  if (!nth || !inRange(weekday, [0, 7])) return null;
  const monthTime = month.getTime();
  const endDate = getTheLastDateOfAMonth(month);

  let date: Date;
  if (nth > 0) {
    date = new Date(monthTime);
    date.setDate(1);
  } else {
    date = new Date(endDate.getTime());
  }
  weekday = weekday === 0 ? 7 : weekday;
  const diff = weekday - date.getDay();
  if (nth > 0) {
    diff >= 0 && nth--;
  } else {
    diff <= 0 && nth++;
  }
  const dayDate = nth * 7 + date.getDate() + diff;
  if (dayDate > endDate.getDate() || dayDate < 1) {
    return null;
  }
  date.setDate(dayDate);
  return date;
}

/**
 * 获取毫秒数
 * @param [days=0]
 * @param [hours=0]
 * @param [minutes=0]
 * @param [seconds=0]
 */
export function getMilliseconds({
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
}: {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
} = {}): number {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;

  let result = seconds * second;
  result += minutes * minute;
  result += hours * hour;
  result += days * hour * 24;
  return result;
}

/**
 * 判断时间是否相同
 * @param format yyyy-MM-dd hh:mm:ss
 * @param date
 * @param dates
 */
export function isSameTime(format: string, date: Date, ...dates: Date[]): boolean {
  const dt = formatDate(date, format);
  return dates.every((date) => formatDate(date, format) === dt);
}
