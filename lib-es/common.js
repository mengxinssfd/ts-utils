import { __awaiter } from "tslib";
import { isArray, isString, isObject, isPromiseLike } from "./type";
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
                return isString(js) ? ('"' + js + '"') : js;
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
    return Object.assign({}, obj, getReverseObj(obj));
}
/**
 * @param originObj
 * @param pickKeys
 * @param cb
 */
export function pickByKeys(originObj, pickKeys, cb) {
    const callback = cb || (v => v);
    return pickKeys.reduce((res, key) => {
        if (originObj.hasOwnProperty(key))
            res[key] = callback(originObj[key], key, originObj);
        return res;
    }, {});
}
// TODO 不完美的地方：k === "a"时应该限定返回值类型为number
/*pickByKeys({a: 123, b: "111", c: false}, ["a", "b"], (v, k, o) => {
    if(k === "a"){
        return "123123"
    }
    return v;
});*/
// 新属性名作为键名的好处是可以多个属性对应一个值
export function pickRename(originObj, renamePickObj, cb) {
    const callback = cb || (v => v);
    const renames = Object.keys(renamePickObj);
    return renames.reduce((result, rename) => {
        const pick = renamePickObj[rename];
        if (originObj.hasOwnProperty(pick)) {
            result[rename] = callback(originObj[pick], pick, originObj);
        }
        return result;
    }, {});
}
/**
 * 合并pickByKeys与pickRename两者的功能
 */
export function pick(originObj, picks, cb) {
    const isObj = isObject(picks);
    // ------- 第一种写法 -------
    // const callback = cb || (v => v);
    // const pickKeys = isObj ? Object.keys(picks) : picks;
    // const getOriginObjKey = isObj ? k => picks[k] : k => k;
    // return pickKeys.reduce((res, k) => {
    //     const originObjKey = getOriginObjKey(k);
    //     if (originObj.hasOwnProperty(originObjKey)) {
    //         res[k] = callback(originObj[originObjKey], originObjKey, originObj);
    //     }
    //     return res;
    // }, {} as any);
    // ------- 第二种写法 -------
    // 更简洁 减少判断次数
    // TODO 需要判断返回值类型是否改变了  改变则抛出异常
    return isObj ? pickRename(originObj, picks, cb) : pickByKeys(originObj, picks, cb);
}
// pick({a: 132, b: "123123"}, ["a", "b"]);
/**
 * object key-value翻转
 * @param obj
 */
export function getReverseObj(obj) {
    return Object.keys(obj).reduce((res, key) => {
        const v = obj[key];
        res[v] = key;
        return res;
    }, {});
}
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
