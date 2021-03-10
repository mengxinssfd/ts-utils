import { number2Chinese, strPadStart } from "./common";
import { createArray } from "./array";
/**
 * @param millisecond
 * @param {string} [format=d天hh时mm分ss秒] - 格式化模板
 */
export function number2Date(millisecond, format = 'd天hh时mm分ss秒') {
    let result = format;
    const seconds = millisecond / 1000;
    const obj = {
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
// 比较两个日期相差年天时分秒  用于倒计时等
export function dateDiff(start, end, format = "y年d天 hh时mm分ss秒") {
    let result = format;
    if (start.getTime() > end.getTime()) {
        [start, end] = [end, start];
    }
    const seconds = ~~((end.getTime() - start.getTime()) / 1000);
    const obj = {
        "s+": seconds % 60,
        "m+": ~~(seconds / 60) % 60,
        "h+": ~~(seconds / (60 * 60)) % 24,
        "d+": (function () {
            const day = ~~(seconds / (60 * 60 * 24));
            // 如果要显示年，则把天余年，否则全部显示天
            // 默认一年等于365天
            return /y+/.test(result) ? (day % 365) : day;
        })(),
        // "M+": 0,
        "y+": ~~(seconds / (60 * 60 * 24 * 365)),
    };
    for (let k in obj) {
        const reg = new RegExp("(" + k + ")");
        if (reg.test(result)) {
            // 奇怪的bug 本地调试的时候RegExp.$1不准确,"s+"的时候$1是空字符串; 非调试的时候又没问题
            const s1 = RegExp.$1;
            const v = obj[k];
            let value = strPadStart(String(v), s1.length, "0");
            // substring(start,end) start小于0的时候为0  substr(from,len)from小于0的时候为字符串的长度+from
            value = value.substring(value.length - s1.length); //手动切割00:00 m:s "00".length - "s".length，因为strPadStart当字符串长度大于length的话不会切割
            result = result.replace(s1, value);
        }
    }
    return result;
}
/**
 * 格式化日期  到date原型上用 不能import导入调用 或者用call apply
 * @param format
 * @returns String
 */
export const formatDate = function (format = 'yyyy-MM-dd hh:mm:ss') {
    let o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q": (function (__this) {
            const q = Math.floor((__this.getMonth() + 3) / 3) - 1;
            return formatDate.seasonText[q];
        })(this),
        "S+": this.getMilliseconds(),
        "w": (function (__this) {
            const d = __this.getDay();
            // 星期
            if (!formatDate.weekText || !formatDate.weekText.length) {
                formatDate.weekText = createArray({
                    end: 7,
                    fill(item, index) {
                        return index === 0 ? "日" : number2Chinese(index);
                    },
                });
            }
            return formatDate.weekText[d];
        })(this),
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            const s1 = RegExp.$1;
            const v = o[k];
            const value = s1.length === 1 ? v : ("00" + v).substr(String(v).length);
            format = format.replace(s1, value);
        }
    }
    return format;
};
formatDate.weekText = [];
formatDate.seasonText = ["春", "夏", "秋", "冬"];
/**
 * 字符串转为date对象 因为苹果手机无法直接new Date("2018-08-01 10:20:10")获取date
 * @param date 格式：yyyy-MM-dd hh:mm:ss
 * @returns {Date}
 */
export function getDateFromStr(date) {
    // 检测非数字、非/、非:、非-
    if (/[^\/^\d^:^ ^-]/.test(date))
        return null; // 去除不符合规范的字符串
    const arr = date.split(/[- :\/]/).map(item => Number(item));
    if (arr.length < 6) {
        for (let i = arr.length; i < 6; i++) {
            arr[i] = i < 3 ? 1 : 0; // 年月日最小为1
        }
    }
    return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
}
export const str2Date = getDateFromStr;
