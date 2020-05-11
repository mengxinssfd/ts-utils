import {createArray} from "./array";

/**
 * 防抖函数
 * @param callback 回调
 * @param delay 延时
 * @returns {Function}
 */
export function debounce(callback: (...args: any[]) => void, delay: number) {
    let timer: any = null;
    return function (...args: any[]) {
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
export function polling(callback: (times: number) => void | Promise<any>, interval: number, immediate = true): () => void {
    enum state {running, stopped}

    let timer: number;
    let status: state;
    let times = 0;

    function handle() {
        const back = callback(times++);
        if (status === state.running) {
            (back instanceof Promise) ? (back as Promise<any>).then(function () {
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
    } else {
        timeout();
    }
    return function () {
        status = state.stopped;
        clearTimeout(timer);
    };
}

// 代替for循环
export function forEachByLen(len, callback: (index: number) => any | false) {
    for (let i = 0; i < len; i++) {
        if (callback(i) !== false) continue;
        break;
    }
}

// 对象深拷贝办法
export function deepCopy<T>(target: T): T {
    if (typeof target !== "object") return target;
    const tar: any = target;
    const result: any = isArray(target) ? [] : {};
    // 虽然array使用for i++比for in遍历快，但是如果在数组里面有非number类型的键的话，就无法复制，所以统一用for in遍历
    for (let k in tar) {
        //prototype继承的不复制  es6继承的不会被拦截
        if (!tar.hasOwnProperty(k)) continue;
        result[k] = deepCopy(tar[k]);   //递归复制
    }
    return result;
}

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
export const formatDate: formatDateInterface = function (format) {
    let o: any = {
        "M+": this.getMonth() + 1,                    //月份
        "d+": this.getDate(),                         //日
        "h+": this.getHours(),                        //小时
        "m+": this.getMinutes(),                      //分
        "s+": this.getSeconds(),                      //秒
        "q": (function (__this) {          //季度
            const q = Math.floor((__this.getMonth() + 3) / 3) - 1;
            return formatDate.seasonText[q];
        })(this),
        "S+": this.getMilliseconds(),                   //毫秒
        "w": (function (__this) {        //周
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

// 获取小数点后面数字的长度
export function getNumberLenAfterDot(num: number | string): number {
    num = Number(num);
    if (isNaN(num)) return 0;
    let item = String(num).split(".")[1];
    return item ? item.length : 0;
}

function getPow(a: number, b: number): number {
    let aLen = getNumberLenAfterDot(a);
    let bLen = getNumberLenAfterDot(b);
    return Math.pow(10, Math.max(aLen, bLen));
}

// 小数运算 小数位不能太长，整数位不能太大
export const FloatCalc = {
    // 加
    add(a: number, b: number): number {
        let pow = getPow(a, b);
        return (a * pow + b * pow) / pow;
    },
    // 减
    minus(a: number, b: number): number {
        let pow = getPow(a, b);
        return (a * pow - b * pow) / pow;
    },
    // 乘
    mul(a: number, b: number): number {
        let pow = getPow(a, b);
        return pow * a * (b * pow) / (pow * pow);
    },
    // 除
    division(a: number, b: number): number {
        let pow = getPow(a, b);
        return a * pow / (b * pow);
    },
};

// 获取数据类型
export function typeOf(target: any): string {
    const tp = typeof target;
    if (tp !== 'object') return tp;
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

export function isObject(target: any): target is object {
    return typeOf(target) === "object";
}

export function isArray(target: any): target is Array<any> {
    return typeOf(target) === "array";
}

// 类数组对象 jq的实现方式
export function isArrayLike(target: any): target is ArrayLike<any> {
    // 检测target的类型
    const type = typeOf(target);
    if (["string", "null", "undefined", "number", "boolean"].indexOf(type) > -1) return false;
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

export function isString(target: any): target is string {
    return typeOf(target) === "string";
}

export function isNumber(target: any): target is number {
    return typeOf(target) === "number";
}

export function isFunction(target: any): target is Function {
    return typeOf(target) === "function";
}

export function isBoolean(target: any): target is boolean {
    return typeOf(target) === "boolean";
}

export function isUndefined(target: any): target is undefined {
    return target === void 0;
}

// 参考is-promise
export function isPromiseLike<T, S>(target: PromiseLike<T> | S): target is PromiseLike<T> {
    const type = typeof target;
    return !!target/*null也是object*/
        && (type === "object" || type === "function")
        && typeof (target as any).then === "function";
}

// 有native isNaN函数 但是 {} "abc"会是true
export function isNaN(target: any): boolean {
    // return String(target) === "NaN"; // "NaN" 会被判断为true
    return isNumber(target) && target !== target;
}

// 判断是否是空object
export function isEmptyObject(target: object): boolean {
    if (!isObject(target)) return false;
    for (let i in target) {
        return i === undefined;
    }
    return true;
}

// 判断是否是空值 undefined, null, "", [], {} ,NaN都为true
export function isEmpty(target: any): boolean {
    // TO DO 可以替换array里的includes
    if ([undefined, null, "", NaN].includes(target)) return true;
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
export function randomNumber(): number
// start = 0
export function randomNumber(end: number): number
export function randomNumber(start: number, end: number): number
export function randomNumber(start: number, end: number, length: number): number[]
export function randomNumber(start?, end?, length?) {
    // randomNumber()
    if (!arguments.length) return Math.random();
    // randomNumber(end)
    if (arguments.length === 1) {
        end = start;
        start = 0;
    }

    // randomNumber(start, end)
    if (length === undefined) {
        const len = (end as number) - (start as number) + 1;
        return ~~(Math.random() * len) + (start as number);
    } else {
        // randomNumber(start, end, length)
        const arr: number[] = [];
        forEachByLen(length, () => arr.push(randomNumber(start, end)));
        return arr;
    }
}

/**
 * 随机颜色
 */
export function randomColor(): string
export function randomColor(len: number): string[]
export function randomColor(len?) {
    const num = randomNumber(0xffffff).toString(16);
    const color = "#" + strPadStart(num, 6, "0");
    if (len === undefined) {
        return color;
    } else {
        const colorList: string[] = [];
        forEachByLen(len, () => colorList.push(randomColor() as string));
        return colorList;
    }
}

/**
 * 字符串转为date对象 因为苹果手机无法直接new Date("2018-08-01 10:20:10")获取date
 * @param date 格式：yyyy-MM-dd hh:mm:ss
 * @returns {Date}
 */
export function getDateFromStr(date: string): Date | null {
    // 检测非数字、非/、非:、非-
    if (/[^\/^\d^:^ ^-]/.test(date)) return null; // 去除不符合规范的字符串
    const arr: number[] = date.split(/[- :\/]/).map(item => Number(item));
    if (arr.length < 6) {
        for (let i = arr.length; i < 6; i++) {
            arr[i] = i < 3 ? 1 : 0; // 年月日最小为1
        }
    }
    return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
}

export function objectIsEqual(obj1: object, obj2: object): boolean {
    if (obj1 === obj2) return true;
    for (const key in obj1) {
        const value1 = obj1[key];
        const value2 = obj2[key];
        if (!isEqual(value1, value2)) {
            return false;
        }
    }
    return true;
}

export function isEqual(a: any, b: any): boolean {
    if (a === b) return true;
    const aType = typeOf(a);
    const bType = typeOf(b);
    if (aType !== bType) return false;
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
export function thousandFormat(num: string | number): string {
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
export function strPadStart(target: string, len: number, fill: string): string {
    if (target.length >= len) return target;
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
export function strPadEnd(target: string, len: number, fill: string): string {
    if (target.length >= len) return target;
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
export function oneByOne(words: string, delay: number, callback?: (word: string, index: number, words: string) => false | void) {
    let cancel: () => void;
    const wordArr = words.split("");
    cancel = polling((index) => {
        const word = wordArr.shift();
        let keepRun = !!wordArr.length;
        if (callback) {
            const flag = callback(word as string, index, words);
            keepRun = keepRun && flag !== false;
        } else {
            console.log(word);
        }
        if (!keepRun) cancel();
    }, delay);
    return cancel;
}

const numberArr: any = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const sbq = ["十", "百", "千"];
const units: any = ["", ...sbq, "万", ...sbq, "亿"];
const unitLen: number = units.length;

interface Number2Chinese {
    (number: number): string

    units: string[];
    numbers: string [];
}

/**
 * 阿拉伯数字转为中文数字
 * @param number
 */
export const number2Chinese: Number2Chinese = function (number) {
    let key = ~~number;
    let chineseNumber = "";
    let times = 0;
    // 个位数
    if (number >= 0 && number < 10) return number2Chinese.numbers[number];
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


interface Chinese2Number {
    (chineseNumber: string): number

    units: string[];
    numbers: string [];
}

/**
 * 中文转为阿拉伯数字
 * @param chineseNumber
 */
export const chinese2Number: Chinese2Number = function (chineseNumber) {
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
export function generateFunctionCode(argsArrayLength: number) {
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
export function generateFunction(obj: object, property: string, args: any[]) {
    return (new Function(generateFunctionCode(args.length)))(obj, property, args);
}

// 比较两个日期相差年天时分秒  用于倒计时等
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

// 获取object树的最大层数 tree是object的话，tree就是层数1
export function getTreeMaxDeep(tree: object): number {
    function deeps(obj: object, num: number = 0): number {
        if (typeof tree !== "object" || tree === null) return num;
        let arr: number[] = [++num];
        for (const k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            arr.push(deeps(obj[k], num));
        }
        return Math.max(...arr);
    }

    return deeps(tree);
}

// 获取树某层的节点数 0是tree本身
export function getTreeNodeLen(tree: object, nodeNumber: number = 1): number {
    let result = 0;
    if (typeof tree !== "object" || tree === null || nodeNumber < 0) return result;

    function deeps(obj: object, num: number = 0) {
        if (nodeNumber === num++) {
            result++;
            return;
        }
        for (const k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            deeps(obj[k], num);
        }
    }

    deeps(tree);
    return result;
}