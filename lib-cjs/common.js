"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCmdParams = exports.likeKeys = exports.at = exports.numToFixed = exports.root = exports.promiseQueue = exports.promiseAny = exports.createEnumByObj = exports.createEnum = exports.formatJSON = exports.createUUID = exports.functionApply = exports.generateFunctionCode = exports.oneByOne = exports.forEachByLen = exports.polling = exports.debounceByPromise = exports.debounceCancelable = exports.throttle = exports.debounceAsync = exports.debounce = void 0;
const string_1 = require("./string");
const time_1 = require("./time");
const dataType_1 = require("./dataType");
const object_1 = require("./object");
const array_1 = require("./array");
/**
 * 防抖函数
 * @param callback 回调
 * @param delay 延时
 * @param [immediate = false] 为true的时候第一次会立即执行callback并禁止立即执行，之后时间间隔内的只会执行一次callback并恢复立即执行，
 *                            如果只执行了一次立即执行callback，那么会在一次delay延时后恢复可立即执行
 *
 * @returns {Function}
 */
function debounce(callback, delay, immediate = false) {
    let lastThis;
    let lastArgs;
    let lastResult;
    let timer;
    let canImmediateRun = true;
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
        if (canImmediateRun && immediate) {
            debounced.flush();
            canImmediateRun = false;
            timer = setTimeout(() => {
                canImmediateRun = true;
            }, delay);
            return lastResult;
        }
        timer = setTimeout(() => {
            cancel();
            debounced.flush();
            canImmediateRun = true;
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
exports.debounce = debounce;
/**
 * 如果callback执行了的话，那么不论是否resolved都不会再被reject
 * @param callback
 * @param delay
 */
function debounceAsync(callback, delay) {
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
            timer = setTimeout(async () => {
                timer = null;
                const result = await callback.apply(this, args);
                resolve(result);
            }, delay);
        });
    };
}
exports.debounceAsync = debounceAsync;
/**
 * 节流函数
 * @param callback
 * @param delay
 * @param invalidCB {function?}间隔期间调用throttle返回的函数执行的回调  例如一个按钮5秒点击一次，不可点击时执行该函数
 */
function throttle(callback, delay, invalidCB = (v) => void 0) {
    let countDown = () => 0;
    return function (...args) {
        const interval = countDown();
        if (interval > 0) {
            invalidCB(interval);
            return;
        }
        countDown = time_1.createTimeCountDown(delay);
        return callback.apply(this, args);
    };
}
exports.throttle = throttle;
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
function debounceCancelable(callback, delay) {
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
exports.debounceCancelable = debounceCancelable;
/**
 * 前一个promise未完成即reject，最后一个或者中断前调用的才会执行
 * 无法阻止cb被调用 不推荐使用
 * @param callback
 */
function debounceByPromise(callback) {
    let rejectFn;
    return function (...args) {
        rejectFn && rejectFn();
        return new Promise(async (res, rej) => {
            rejectFn = rej;
            const result = await callback.apply(this, args);
            res(result);
        });
    };
}
exports.debounceByPromise = debounceByPromise;
/**
 * 轮询函数
 * @param callback
 * @param interval  间隔
 * @param [immediate=true] 是否马上执行第一次
 */
function polling(callback, interval, immediate = true) {
    let state;
    (function (state) {
        state[state["running"] = 0] = "running";
        state[state["stopped"] = 1] = "stopped";
    })(state || (state = {}));
    let timer;
    let status;
    let times = 0;
    let lastTime = Date.now();
    let diff = 0;
    function run() {
        const back = callback(times++);
        (back instanceof Promise) ? back.then(timeout) : timeout();
    }
    function timeout() {
        const delay = interval - diff;
        timer = window.setTimeout(() => {
            if (status !== state.running)
                return;
            const now = Date.now();
            diff = now - lastTime - delay;
            lastTime = now;
            run();
        }, delay);
    }
    status = state.running;
    if (immediate) {
        run();
    }
    else {
        timeout();
    }
    return function () {
        status = state.stopped;
        clearTimeout(timer);
    };
}
exports.polling = polling;
// 代替for循环
function forEachByLen(len, callback) {
    for (let i = 0; i < len; i++) {
        if (callback(i) !== false)
            continue;
        break;
    }
}
exports.forEachByLen = forEachByLen;
/**
 * 每隔一段事件返回字符串中的一个单词
 * @param words
 * @param delay
 * @param callback
 */
function oneByOne(words, delay, callback) {
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
exports.oneByOne = oneByOne;
// 代替扩展符"...", 实现apply的时候可以使用此方法
function generateFunctionCode(argsArrayLength) {
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
exports.generateFunctionCode = generateFunctionCode;
// const args = [1, 2, 3];
// (new Function(generateFunctionCode(args.length)))(object, property, args);
function functionApply(obj, property, args) {
    return (new Function(generateFunctionCode(args.length)))(obj, property, args);
}
exports.functionApply = functionApply;
/**
 * 生成不重复的字符串
 * @param length
 * @returns {string}
 */
function createUUID(length) {
    const uuidArr = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < length; i++) {
        uuidArr[i] = hexDigits.substr(Math.random() * 0x10, 1);
    }
    // uuidArr[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    // uuidArr[19] = hexDigits.substr(((uuidArr[19] as any) & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    return uuidArr.join("");
}
exports.createUUID = createUUID;
/**
 * 格式化json
 * @param json
 * @param [indent=2] tab空格占位
 */
function formatJSON(json, indent = 2) {
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
                const isArr = dataType_1.isArray(js);
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
                return dataType_1.isString(js) ? ("\"" + js + "\"") : js;
        }
    }
    return foreach(json);
}
exports.formatJSON = formatJSON;
// TODO 暂时无法手动设置值 未添加测试用例
function createEnum(items) {
    const result = {};
    items.forEach((item, index) => {
        result[item] = index;
        result[index] = item;
    });
    Object.freeze(result); // freeze值不可变
    // Object.seal(result); // seal值可以变
    return result;
}
exports.createEnum = createEnum;
function createEnumByObj(obj) {
    /* const res: any = {};
     for (let k in obj) {
         if (res.hasOwnProperty(k)) throw new Error("key multiple");
         res[res[k] = obj[k]] = k;
     }

     Object.freeze(res); // freeze值不可变
     // Object.seal(result); // seal值可以变
     return res;*/
    return object_1.assign({}, obj, object_1.getReverseObj(obj));
}
exports.createEnumByObj = createEnumByObj;
// omit({a: 123, b: "bbb", c: true}, ["a", "b", "d"]);
// type O = Omit<{ a: 123, b: "bbb", c: true }, "a" | "c">
function promiseAny(list) {
    return new Promise(((resolve, reject) => {
        let rejectTimes = 0;
        try {
            for (const p of list) {
                if (dataType_1.isPromiseLike(p)) {
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
exports.promiseAny = promiseAny;
/**
 * promise队列  任何一个reject都会中断队列 (跟reduceAsync类似)
 * 队列第一个会接收initValue作为参数，其余会接收上一个promise返回值作为参数
 * @param queue
 * @param initValue
 */
async function promiseQueue(queue, initValue) {
    let lastValue = initValue;
    await array_1.forEachAsync(async (promise) => {
        lastValue = await promise(lastValue);
    }, queue);
    return lastValue;
}
exports.promiseQueue = promiseQueue;
exports.root = Function("return this")();
/**
 * 原来的函数四舍五入不准确
 * @note 原来的toFixed可以把科学计数法的小数，给转成普通小数字符串
 * @param num
 * @param [fractionDigits = 0]
 * @param [rounding = false] 是否四舍五入
 */
function numToFixed(num, fractionDigits = 0, rounding = false) {
    if (!dataType_1.isNumber(fractionDigits) || !array_1.inRange(fractionDigits, [0, 100])) {
        throw new TypeError("numToFixed() fractionDigits argument must be between 0 and 100");
    }
    if (fractionDigits === 0)
        return String(~~num);
    const base = 10;
    // 加1 四舍五入
    const pow = base ** (fractionDigits + 1);
    num = ~~(num * pow);
    if (rounding && num) { // num为0的时候位数已经不对了
        num += 5;
    }
    num /= pow;
    const split = String(num).split(".");
    const digits = string_1.strPadEnd((split[1] || "").substr(0, fractionDigits), fractionDigits, "0");
    return split[0] + "." + digits;
}
exports.numToFixed = numToFixed;
/**
 * 从arr获取index处的item，支持负数
 * @param arr
 * @param index
 * @param def
 */
function at(arr, index, def = undefined) {
    if (index < 0) {
        index = (arr.length + index);
    }
    // if (typeof arr === "string") return (arr[index] ?? def) as any;
    return (arr.hasOwnProperty(index) ? arr[index] : def);
}
exports.at = at;
// type A = In<[1, 2, 3], 7, 1>
// type B = In<[1, 2, 3], (-1), 1>
// const a = [1,2,3]
// type A = In<typeof a, 5, unknown>
/**
 * 查找对象中与param key类似的key
 * @param target
 * @param key
 */
function likeKeys(target, key) {
    const reg = new RegExp(key);
    if (undefined !== exports.root.Map && target instanceof Map) {
        // keys = [...obj.keys()]; // babel编译成es5会编译成[].concat，无法使用
        const keys = [];
        for (const k of target.keys()) {
            if (reg.test(k))
                keys.push(k);
        }
        return keys;
    }
    return object_1.objKeys(target).filter(key => reg.test(key));
}
exports.likeKeys = likeKeys;
/**
 * 命令行的参数转为Map
 * @param arr 命令行参数数组
 * @param prefix 前缀 --d --f 前缀是"--"
 * @param defaultKey 如果前面没有变量名那么使用默认
 */
function parseCmdParams(arr, prefix = "-", defaultKey = "default") {
    const list = arr.slice();
    let currentKey = defaultKey;
    const isKeyReg = new RegExp(`^${prefix}`);
    const eqReg = /([^=]+)=([\s\S]+)?/;
    const map = new Map();
    function getKey(key) {
        if (eqReg.test(key)) {
            key = RegExp.$1;
            const value = RegExp.$2;
            value && list.unshift(value);
        }
        return key;
    }
    function setValue(currentValue) {
        switch (dataType_1.typeOf(currentValue)) {
            case "undefined":
            case "boolean":
                map.set(currentKey, it);
                break;
            case "array":
                currentValue.push(it);
                break;
            default:
                map.set(currentKey, [currentValue, it]);
        }
    }
    let it;
    while (it = list.shift()) {
        if (isKeyReg.test(it)) {
            currentKey = getKey(it.replace(isKeyReg, ""));
            if (!map.has(currentKey)) {
                map.set(currentKey, true);
            }
            continue;
        }
        setValue(map.get(currentKey));
    }
    return map;
}
exports.parseCmdParams = parseCmdParams;
