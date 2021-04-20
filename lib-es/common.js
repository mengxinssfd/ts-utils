import { __awaiter } from "tslib";
import { createTimeCountDown } from "./time";
import { isArray, isString, isPromiseLike } from "./type";
import { assign, getReverseObj } from "./object";
/**
 * 防抖函数
 * @param callback 回调
 * @param delay 延时
 * @returns {Function}
 */
export function debounce(callback, delay) {
    let lastThis;
    let lastArgs;
    let lastResult;
    let timer;
    const cancel = () => {
        clearTimeout(timer);
        timer = undefined;
    };
    const debounced = function (...args) {
        if (timer) {
            cancel();
        }
        lastThis = this;
        lastArgs = args;
        timer = setTimeout(() => {
            cancel();
            debounced.flush();
        }, delay);
        return lastResult;
    };
    debounced.cancel = cancel;
    debounced.flush = () => {
        lastResult = callback.apply(lastThis, lastArgs);
        lastThis = lastArgs = undefined;
        return lastResult;
    };
    return debounced;
}
const db = debounce((a, b) => {
}, 1000);
db(100, "");
db.cancel();
/**
 * 如果callback执行了的话，那么不论是否resolved都不会再被reject
 * @param callback
 * @param delay
 */
export function debounceAsync(callback, delay) {
    let timer = null;
    let rej;
    return function (...args) {
        return new Promise((resolve, reject) => {
            if (timer !== null) {
                clearTimeout(timer);
                timer = null;
                rej("debounceAsync reject");
            }
            rej = reject;
            timer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                timer = null;
                const result = yield callback.apply(this, args);
                resolve(result);
            }), delay);
        });
    };
}
export function timeDown() {
}
/**
 * 节流函数
 * @param callback
 * @param delay
 * @param invalidCB {function}间隔期间调用throttle返回的函数执行的回调  例如一个按钮5秒点击一次，不可点击时执行该函数
 */
export function throttle(callback, delay, invalidCB) {
    let countDown = () => 0;
    return function (...args) {
        const interval = countDown();
        if (interval > 0) {
            invalidCB && invalidCB(interval);
            return;
        }
        countDown = createTimeCountDown(delay);
        return callback.apply(this, args);
    };
}
// 第1种实现方式
/*export function throttle<CB extends (...args: any[]) => (void | any)>(
    callback: CB,
    delay: number,
    invalidCB?: (interval: number) => void,
): CB {
    let lastTime = 0;
    return function (...args: any[]) {
        const now = Date.now();
        const interval = now - lastTime;
        if (interval < delay) {
            invalidCB && invalidCB(delay - interval);
            return;
        }
        lastTime = now;
        return callback.apply(this, args);
    } as CB;
}*/
// 第三种实现方式，不能获取剩余时间或者另外获取时间，有点多余
/*export function throttleByTimeOut<CB extends (...args: any[]) => (void | any)>(
    callback: CB,
    delay: number,
    invalidCB?: (interval: number) => void,
): CB {
    let throttling = false;
    return function (...args: any[]) {
        if (throttling) {
            return;
        }
        throttling = true;
        setTimeout(() => {
            throttling = false;
        }, delay);
        return callback.apply(this, args);
    } as CB;
}*/
/**
 * 可取消防抖函数
 * @param callback 回调
 * @param delay 延时
 * @returns {Function}
 */
export function debounceCancelable(callback, delay) {
    let timer = null;
    function cancel() {
        if (!timer)
            return;
        clearTimeout(timer);
        timer = null;
    }
    return function (...args) {
        cancel();
        timer = setTimeout(() => {
            timer = null;
            callback.apply(this, args);
        }, delay);
        return cancel;
    };
}
/**
 * 前一个promise未完成即reject，最后一个或者中断前调用的才会执行
 * 无法阻止cb被调用 不推荐使用
 * @param callback
 */
export function debounceByPromise(callback) {
    let rejectFn;
    return function (...args) {
        rejectFn && rejectFn();
        return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            rejectFn = rej;
            const result = yield callback.apply(this, args);
            res(result);
        }));
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
 * 千位分隔 1,234,567,890
 * @param num
 */
export function thousandFormat(num) {
    return String(num).replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}
// 给不能用``模板字符串的环境使用
// es5的格式化字符串 example: strTemplate("11%s111%s", 3, 4) => "1131114"
export function strTemplate(str, ...params) {
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
 * @param maxLen
 * @param fill
 */
export function strPadStart(target, maxLen, fill = " ") {
    if (target.length >= maxLen || fill === "")
        return target;
    const lessLen = maxLen - target.length;
    while (fill.length < lessLen) {
        fill += fill;
    }
    fill = fill.substr(0, lessLen);
    return fill + target;
}
/**
 * 给长度不满足要求的字符串添加后缀 strFillPrefix
 * @param target
 * @param maxLen
 * @param fill
 */
export function strPadEnd(target, maxLen, fill = " ") {
    if (target.length >= maxLen || fill === "")
        return target;
    let lessLen = maxLen - target.length;
    let end = strPadStart(target, maxLen, fill).substr(0, lessLen);
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
            // console.log(word);
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
    const numberArr = arr.map((it) => {
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
            unit = unitIndex > 0 ? Math.pow(10, unitIndex) : unit;
        }
        // 以十开头的要单独列出来 例如十一完全体是一十一
        if (it[0] === chinese2Number.units[1]) {
            res += 10;
        }
        return res;
    });
    // 把分割开的数字拼接回去
    return numberArr.reverse().reduce((res, item, index) => {
        return res + Math.pow(10000, index) * item;
    }, 0);
};
chinese2Number.units = [...units];
chinese2Number.numbers = [...numberArr];
// 代替扩展符"...", 实现apply的时候可以使用此方法
export function generateFunctionCode(argsArrayLength) {
    let code = "return arguments[0][arguments[1]](";
    // 拼接args
    for (let i = 0; i < argsArrayLength; i++) {
        if (i > 0) {
            code += ",";
        }
        code += "arguments[2][" + i + "]";
    }
    code += ")";
    // return object.property(args)
    // return arguments[0][arguments[1]](arg1, arg2, arg3...)
    return code;
}
// const args = [1, 2, 3];
// (new Function(generateFunctionCode(args.length)))(object, property, args);
export function functionApply(obj, property, args) {
    return (new Function(generateFunctionCode(args.length)))(obj, property, args);
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
/**
 * 格式化json
 * @param json
 * @param indent tab空格占位
 */
export function formatJSON(json, indent = 2) {
    if (typeof json === "string") {
        try {
            json = JSON.parse(json);
        }
        catch (e) {
            throw new TypeError();
        }
    }
    function foreach(js, floor = 0) {
        switch (typeof js) {
            case "object":
                const isArr = isArray(js);
                let space = " ".repeat(indent * floor);
                const start = isArr ? "[\r\n" : "{\r\n";
                const end = "\r\n" + space + (isArr ? "]" : "}");
                let times = 0;
                let result = start;
                for (const key in js) {
                    if (!js.hasOwnProperty(key))
                        continue;
                    const value = js[key];
                    // 如果改行不是第一行，则给上一行的末尾添加逗号，并且换行
                    if (times)
                        result += ",\r\n";
                    // 拼接空格
                    const childSpace = " ".repeat(indent * floor + indent);
                    const child = foreach(value, floor + 1);
                    if (isArr) {
                        result += `${childSpace}${child}`;
                    }
                    else {
                        result += `${childSpace}"${key}":${child}`;
                    }
                    times++;
                }
                return result + end;
            case "function":
                // 函数的}位置有点对不上
                return `"${js.toString()}"`;
            default:
                return isString(js) ? ("\"" + js + "\"") : js;
        }
    }
    return foreach(json);
}
// TODO 暂时无法手动设置值 未添加测试用例
export function createEnum(items) {
    const result = {};
    items.forEach((item, index) => {
        result[item] = index;
        result[index] = item;
    });
    Object.freeze(result); // freeze值不可变
    // Object.seal(result); // seal值可以变
    return result;
}
export function createEnumByObj(obj) {
    /* const res: any = {};
     for (let k in obj) {
         if (res.hasOwnProperty(k)) throw new Error("key multiple");
         res[res[k] = obj[k]] = k;
     }

     Object.freeze(res); // freeze值不可变
     // Object.seal(result); // seal值可以变
     return res;*/
    return assign({}, obj, getReverseObj(obj));
}
// omit({a: 123, b: "bbb", c: true}, ["a", "b", "d"]);
// type O = Omit<{ a: 123, b: "bbb", c: true }, "a" | "c">
export function promiseAny(list) {
    return new Promise(((resolve, reject) => {
        let rejectTimes = 0;
        try {
            for (const p of list) {
                if (isPromiseLike(p)) {
                    p.then(res => resolve(res), () => {
                        rejectTimes++;
                        if (rejectTimes === list.length) {
                            reject("AggregateError: All promises were rejected");
                        }
                    });
                }
                else {
                    resolve(p);
                }
            }
            !list.length && reject("AggregateError: All promises were rejected");
        }
        catch (e) {
            reject(e.toString());
        }
    }));
}
export const root = Function("return this")();
