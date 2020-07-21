import { createArray } from "./array";
/**
 * 防抖函数
 * @param callback 回调
 * @param delay 延时
 * @returns {Function}
 */
export function debounce(callback, delay) {
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            timer = null;
            callback.apply(this, args);
        }, delay);
    };
}
/**
 * 轮询函数
 * @param callback
 * @param interval  间隔
 * @param immediate 是否马上执行第一次
 */
export function polling(callback, interval, immediate = true) {
    let state;
    (function (state) {
        state[state["running"] = 0] = "running";
        state[state["stopped"] = 1] = "stopped";
    })(state || (state = {}));
    let timer;
    let status;
    let times = 0;
    function handle() {
        const back = callback(times++);
        if (status === state.running) {
            (back instanceof Promise) ? back.then(function () {
                timeout();
            }) : timeout();
        }
    }
    function timeout() {
        timer = window.setTimeout(handle, interval);
    }
    status = state.running;
    if (immediate) {
        handle();
    }
    else {
        timeout();
    }
    return function () {
        status = state.stopped;
        clearTimeout(timer);
    };
}
// 代替for循环
export function forEachByLen(len, callback) {
    for (let i = 0; i < len; i++) {
        if (callback(i) !== false)
            continue;
        break;
    }
}
/**
 * 格式化日期  到date原型上用 不能import导入调用 或者用call apply
 * @param format
 * @returns String
 */
export const formatDate = function (format) {
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
// 获取数据类型
export function typeOf(target) {
    const tp = typeof target;
    if (tp !== 'object')
        return tp;
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}
export function randomNumber(start, end, length) {
    // randomNumber()
    if (!arguments.length)
        return Math.random();
    // randomNumber(end)
    if (arguments.length === 1) {
        end = start;
        start = 0;
    }
    // randomNumber(start, end)
    if (length === undefined) {
        const len = end - start + 1;
        return ~~(Math.random() * len) + start;
    }
    else {
        // randomNumber(start, end, length)
        const arr = [];
        forEachByLen(length, () => arr.push(randomNumber(start, end)));
        return arr;
    }
}
export function randomColor(len) {
    const num = randomNumber(0xffffff).toString(16);
    const color = "#" + strPadStart(num, 6, "0");
    if (len === undefined) {
        return color;
    }
    else {
        const colorList = [];
        forEachByLen(len, () => colorList.push(randomColor()));
        return colorList;
    }
}
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
/**
 * 千位分隔 1,234,567,890
 * @param num
 */
export function thousandFormat(num) {
    return String(num).replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}
// 给不能用``模板字符串的环境使用
// es5的格式化字符串 example: getFormatStr("11%s111%s", 3, 4) => "1131114"
export function getFormatStr(str, ...params) {
    /*
    // es5; typescript不需要str, ...params参数
    var args = Array.prototype.slice.call(arguments, 0);
    if (!args.length) return "";
    var str = args[0];
    var params = args.slice(1);
    */
    return str.replace(/%s/g, function () {
        return params.length ? params.shift() : "";
    });
}
/**
 * 给长度不满足要求的字符串添加前缀 strFillPrefix
 * @param target
 * @param len
 * @param fill
 */
export function strPadStart(target, len, fill) {
    if (target.length >= len)
        return target;
    const lessLen = len - target.length;
    while (fill.length < lessLen) {
        fill += fill;
    }
    fill = fill.substr(0, lessLen);
    return fill + target;
}
/**
 * 给长度不满足要求的字符串添加后缀 strFillPrefix
 * @param target
 * @param len
 * @param fill
 */
export function strPadEnd(target, len, fill) {
    if (target.length >= len)
        return target;
    let lessLen = len - target.length;
    let end = strPadStart(target, len, fill).substr(0, lessLen);
    return target + end;
}
/**
 * 每隔一段事件返回字符串中的一个单词
 * @param words
 * @param delay
 * @param callback
 */
export function oneByOne(words, delay, callback) {
    let cancel;
    const wordArr = words.split("");
    cancel = polling((index) => {
        const word = wordArr.shift();
        let keepRun = !!wordArr.length;
        if (callback) {
            const flag = callback(word, index, words);
            keepRun = keepRun && flag !== false;
        }
        else {
            console.log(word);
        }
        if (!keepRun)
            cancel();
    }, delay);
    return cancel;
}
const numberArr = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const sbq = ["十", "百", "千"];
const units = ["", ...sbq, "万", ...sbq, "亿"];
const unitLen = units.length;
/**
 * 阿拉伯数字转为中文数字
 * @param number
 */
export const number2Chinese = function (number) {
    let key = ~~number;
    let chineseNumber = "";
    let times = 0;
    // 个位数
    if (number >= 0 && number < 10)
        return number2Chinese.numbers[number];
    while (key >= 1 && times < unitLen) {
        let unit = number2Chinese.units[times];
        // 11 % 10 => 一
        let end = number2Chinese.numbers[key % 10];
        // 101 0没有单位
        if (end !== number2Chinese.numbers[0]) {
            chineseNumber = unit + chineseNumber;
        }
        // 11 => 一十一 => 十一
        if (!(key === 1 && times === 1)) {
            chineseNumber = end + chineseNumber;
        }
        key = ~~(key / 10);
        times++;
    }
    // 一万零零一 => 一万零一 | 一万零零零 => 一万
    return chineseNumber.replace(/(零+$)|((零)\3+)/g, "$3");
};
number2Chinese.units = [...units];
number2Chinese.numbers = [...numberArr];
/**
 * 中文转为阿拉伯数字
 * @param chineseNumber
 */
export const chinese2Number = function (chineseNumber) {
    if (new RegExp(`([^${chinese2Number.units.join() + chinese2Number.numbers.join()}])`).test(chineseNumber)) {
        throw new TypeError("发现不符合规则的字符(必须在units和numbers里存在的字符):" + RegExp.$1);
    }
    // 用万和亿分割
    const arr = chineseNumber.split(new RegExp(`[${chinese2Number.units[4]}${chinese2Number.units[8]}]`, "g"));
    const numberArr = arr.map((it, index) => {
        let res = 0;
        let unit = 1;
        // 从个位数往大数累加
        for (let i = it.length - 1; i > -1; i--) {
            const item = it[i];
            let number = chinese2Number.numbers.indexOf(item);
            if (number > 0) {
                res += number * unit;
            }
            let unitIndex = chinese2Number.units.indexOf(item);
            unit = unitIndex > 0 ? 10 ** unitIndex : unit;
        }
        // 以十开头的要单独列出来 例如十一完全体是一十一
        if (it[0] === chinese2Number.units[1]) {
            res += 10;
        }
        return res;
    });
    // 把分割开的数字拼接回去
    return numberArr.reverse().reduce((res, item, index) => {
        return res + 10000 ** index * item;
    }, 0);
};
chinese2Number.units = [...units];
chinese2Number.numbers = [...numberArr];
// 代替扩展符"...", 实现apply的时候可以使用此方法
export function generateFunctionCode(argsArrayLength) {
    let code = 'return arguments[0][arguments[1]](';
    // 拼接args
    for (let i = 0; i < argsArrayLength; i++) {
        if (i > 0) {
            code += ',';
        }
        code += 'arguments[2][' + i + ']';
    }
    code += ')';
    // return object.property(args)
    // return arguments[0][arguments[1]](arg1, arg2, arg3...)
    return code;
}
// const args = [1, 2, 3];
// (new Function(generateFunctionCode(args.length)))(object, property, args);
export function generateFunction(obj, property, args) {
    return (new Function(generateFunctionCode(args.length)))(obj, property, args);
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
// 获取object树的最大层数 tree是object的话，tree就是层数1
export function getTreeMaxDeep(tree) {
    function deeps(obj, num = 0) {
        if (typeof tree !== "object" || tree === null)
            return num;
        let arr = [++num];
        for (const k in obj) {
            if (!obj.hasOwnProperty(k))
                continue;
            arr.push(deeps(obj[k], num));
        }
        return Math.max(...arr);
    }
    return deeps(tree);
}
// 获取树某层的节点数 0是tree本身
export function getTreeNodeLen(tree, nodeNumber = 1) {
    let result = 0;
    if (typeof tree !== "object" || tree === null || nodeNumber < 0)
        return result;
    function deeps(obj, num = 0) {
        if (nodeNumber === num++) {
            result++;
            return;
        }
        for (const k in obj) {
            if (!obj.hasOwnProperty(k))
                continue;
            deeps(obj[k], num);
        }
    }
    deeps(tree);
    return result;
}
// 合并两个object
export function merge(first, second) {
    const result = {};
    function assign(receive, obj) {
        for (const k in obj) {
            if (obj.hasOwnProperty(k)) {
                receive[k] = obj[k];
            }
        }
    }
    assign(result, first);
    assign(result, second);
    return result;
}
// 合并两个object
export function deepMerge(first, second) {
    function assign(receive, obj) {
        for (const k in obj) {
            if (!obj.hasOwnProperty(k))
                continue;
            const v = obj[k];
            if (v && typeof v === "object") {
                receive[k] = new v.constructor();
                assign(receive[k], v);
            }
            else
                receive[k] = v;
        }
    }
    const result = {};
    assign(result, first);
    assign(result, second);
    return result;
}
export function sleep(delay) {
    return new Promise(res => setTimeout(res, delay));
}
/**
 * 生成不重复的字符串
 * @param length
 * @returns {string}
 */
export function createUUID(length) {
    const uuidArr = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < length; i++) {
        uuidArr[i] = hexDigits.substr(Math.random() * 0x10, 1);
    }
    // uuidArr[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    // uuidArr[19] = hexDigits.substr(((uuidArr[19] as any) & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    return uuidArr.join("");
}
