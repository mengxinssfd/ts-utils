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
// 对象深拷贝办法
export function deepCopy(obj) {
    let result = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        // if (!obj.hasOwnProperty(key)) continue; 继承的也要复制
        const v = obj[key];
        if (typeof v === 'object') {
            result[key] = deepCopy(v); //递归复制
        }
        else {
            result[key] = v;
        }
    }
    return result;
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
                        return index === 0 ? "日" : getChineseNumber(index);
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
// 获取小数点后面数字的长度
export function getNumberLenAfterDot(num) {
    num = Number(num);
    if (isNaN(num))
        return 0;
    let item = String(num).split(".")[1];
    return item ? item.length : 0;
}
function getPow(a, b) {
    let aLen = getNumberLenAfterDot(a);
    let bLen = getNumberLenAfterDot(b);
    return Math.pow(10, Math.max(aLen, bLen));
}
// 小数运算 小数位不能太长，整数位不能太大
export const FloatCalc = {
    // 加
    add(a, b) {
        let pow = getPow(a, b);
        return (a * pow + b * pow) / pow;
    },
    // 减
    minus(a, b) {
        let pow = getPow(a, b);
        return (a * pow - b * pow) / pow;
    },
    // 乘
    mul(a, b) {
        let pow = getPow(a, b);
        return pow * a * (b * pow) / (pow * pow);
    },
    // 除
    division(a, b) {
        let pow = getPow(a, b);
        return a * pow / (b * pow);
    },
};
// 获取数据类型
export function typeOf(target) {
    const tp = typeof target;
    if (tp !== 'object')
        return tp;
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}
export function isObject(target) {
    return typeOf(target) === "object";
}
export function isArray(target) {
    return typeOf(target) === "array";
}
// 类数组对象 jq的实现方式
export function isArrayLike(target) {
    // 检测target的类型
    const type = typeOf(target);
    if (["string", "null", "undefined", "number", "boolean"].indexOf(type) > -1)
        return false;
    // 如果target非null、undefined等，有length属性，则length等于target.length
    // 否则，length为false
    const length = !!target && "length" in target && target.length;
    // 如果target是function类型 或者是window对象 则返回false
    if (type === "function" || target === window) {
        return false;
    }
    // target本身是数组，则返回true
    // target不是数组，但有length属性且为0，例如{length : 0}，则返回true
    // target不是数组,但有length属性且为整数数值，target[length - 1]存在，则返回true
    return type === "array" || length === 0 || isNumber(length) && length > 0 && (length - 1) in target;
}
export function isString(target) {
    return typeOf(target) === "string";
}
export function isNumber(target) {
    return typeOf(target) === "number";
}
export function isFunction(target) {
    return typeOf(target) === "function";
}
export function isBoolean(target) {
    return typeOf(target) === "boolean";
}
export function isUndefined(target) {
    return target === void 0;
}
// 有native isNaN函数 但是 {} "abc"会是true
export function isNaN(target) {
    // return String(target) === "NaN"; // "NaN" 会被判断为true
    return isNumber(target) && target !== target;
}
// 判断是否是空object
export function isEmptyObject(target) {
    if (!isObject(target))
        return false;
    for (let i in target) {
        return i === undefined;
    }
    return true;
}
// 判断是否是空值 undefined, null, "", [], {} ,NaN都为true
export function isEmpty(target) {
    // TO DO 可以替换array里的includes
    if ([undefined, null, "", NaN].includes(target))
        return true;
    // if (includes([undefined, null, "", NaN], target)) return true;
    switch (typeOf(target)) {
        case "array":
            return !target.length;
        case "object":
            // {a(){}} 使用JSON.stringify是会判断为空的
            // return JSON.stringify(target) === "{}";
            return isEmptyObject(target);
    }
    return false;
}
// 生成start到end之间的随机数 包含start与end
// 传start不传end  end=start start=0 生成0-start之间的随机数
// start end都不传  return Math.random()
export function randomNumber(start, end, length = 1) {
    if (!arguments.length)
        return Math.random();
    if (arguments.length === 1) {
        end = start;
        start = 0;
    }
    const len = end - start + 1;
    const rand = ~~(Math.random() * len) + start;
    if (length === 1) {
        return rand;
    }
    else {
        const arr = [rand];
        forEachByLen(length - 1, () => arr.push(randomNumber(start, end)));
        return arr;
    }
}
/**
 * 随机颜色
 */
export function randomColor(len = 1) {
    const num = randomNumber(0xffffff).toString(16);
    const color = "#" + strFillPrefix(num, "0", 6);
    if (len === 1) {
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
    if (/[^\/^\d^:^ ^-]/.test(date))
        return; // 去除不符合规范的字符串
    const arr = date.split(/[- :\/]/).map(item => Number(item));
    if (arr.length < 6) {
        for (let i = arr.length; i < 6; i++) {
            arr[i] = i < 4 ? 1 : 0;
        }
    }
    return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
}
export function objectIsEqual(obj1, obj2) {
    if (obj1 === obj2)
        return true;
    for (const key in obj1) {
        const value1 = obj1[key];
        const value2 = obj2[key];
        if (!isEqual(value1, value2)) {
            return false;
        }
    }
    return true;
}
export function isEqual(a, b) {
    if (a === b)
        return true;
    const aType = typeOf(a);
    const bType = typeOf(b);
    if (aType !== bType)
        return false;
    // noinspection FallThroughInSwitchStatementJS
    switch (aType) {
        case "boolean":
        case "string":
        case "function":
            return false;
        case "number":
            return isNaN(b);
        //  只有数组或者object不相等的时候才去对比是否相等
        case "array":
        case "object":
        default:
            return objectIsEqual(a, b);
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
 * 给长度不满足要求的字符串添加前缀
 * @param target
 * @param fill
 * @param len
 */
export function strFillPrefix(target, fill, len) {
    if (target.length >= len)
        return target;
    // const fillStr = Array(len - target.length).fill(fill).join("");
    // const fillStr = createArray({len: len - target.length, fill}).join("");
    const fillStr = Array(len - target.length + 1).join(fill); // 与上面两行一样
    return fillStr + target;
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
const numberMap = { 0: "零", 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 7: "七", 8: "八", 9: "九" };
const units = { 0: "", 1: "十", 2: "百", 3: "千", 4: "万" };
const unitLen = Object.keys(units).length;
/**
 * 阿拉伯数字转为中文数字
 * @param number
 */
export function getChineseNumber(number) {
    let key = ~~number;
    let chineseNumber = "";
    let times = 0;
    // 个位数
    if (number >= 0 && number < 10)
        return numberMap[number];
    while (key >= 1 && times < unitLen) {
        let unit = units[times];
        // 11 % 10 => 一
        let end = numberMap[key % 10];
        // 101 0没有单位
        if (end !== numberMap[0]) {
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
}
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
