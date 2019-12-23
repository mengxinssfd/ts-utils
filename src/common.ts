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
 * @param interval
 * @param immediate
 */
export function polling(callback: (...args: any[]) => void | Promise<any>, interval: number, immediate = true): () => void {
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

    if (immediate) {
        status = state.running;
        handle();
    } else {
        timeout();
    }
    return function () {
        status = state.stopped;
        clearTimeout(timer);
    };
}

// 对象深拷贝办法
export function deepCopy(obj: any): any {
    let result: [] | any = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]);   //递归复制
            } else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}

/**
 * 格式化日期  到date原型上用 不能import导入调用 或者用call apply
 * @param formatStr
 * @returns String
 */
export function formatDate(formatStr: string): string {
    let o: any = {
        "M+": this.getMonth() + 1,                    //月份
        "d+": this.getDate(),                         //日
        "h+": this.getHours(),                        //小时
        "m+": this.getMinutes(),                      //分
        "s+": this.getSeconds(),                      //秒
        "q+": Math.floor((this.getMonth() + 3) / 3),  //季度
        "S": this.getMilliseconds(),                   //毫秒
    };
    if (/(y+)/.test(formatStr)) {
        formatStr = formatStr.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(formatStr)) {
            formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return formatStr;
}

// 获取小数点后面数字的长度
export function getNumberLenAfterDot(num: number | string): number {
    num = Number(num);
    if (Number.isNaN(num)) return 0;
    let item = String(num).split(".")[1];
    return item ? item.length : 0;
}

function getPow(a: number | string, b: number | string): number {
    a = Number(a);
    b = Number(b);
    if (Number.isNaN(a) || Number.isNaN(b)) return 1;
    let aLen = getNumberLenAfterDot(a);
    let bLen = getNumberLenAfterDot(b);
    return Math.pow(10, Math.max(aLen, bLen));
}

// 小数运算 小数位不能太长，整数位不能太大
export const FloatCalc = {
    add(a: number, b: number): number {
        let pow = getPow(a, b);
        return (a * pow + b * pow) / pow;
    },
    minus(a: number, b: number): number {
        let pow = getPow(a, b);
        return (a * pow - b * pow) / pow;
    },
    mul(a: number, b: number): number {
        let pow = getPow(a, b);
        return pow * a * (b * pow) / (pow * pow);
    },
    division(a: number, b: number): number {
        let pow = getPow(a, b);
        return a * pow / (b * pow);
    },
};

// 获取数据类型
export function typeOf(target: any): string {
    if (typeof target !== 'object') return typeof target;
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

export function isObject(target: any): target is Object {
    return typeOf(target) === "object";
}

export function isArray(target: any): target is Array<any> {
    return typeOf(target) === "array";
}

// 类数组对象 jq的实现方式
export function isArrayLike(target: any): boolean {
    // 检测target的类型
    const type = typeOf(target);
    if (["string", "null", "undefined", "number", "boolean"].indexOf(type) > -1) return false;
    // 如果target非null、undefined等，有length属性，则length等于target.length
    // 否则，length为false
    const length = !!target && "length" in target && target.length;
    // 如果target是function类型 或者是window对象 则返回false
    if (type === "function" || window === target) {
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

export function isNaN(target: any): boolean {
    return isNumber(target) && target !== target;
}

// 判断是否是空值 undefined, null, "", [], {} ,NaN都为true
export function isEmpty(target: any): boolean {
    // TODO 可以替换array里的includes
    if ([undefined, null, "", NaN].includes(target)) return true;
    switch (typeOf(target)) {
        case "array":
            return !target.length;
        case "object":
            return JSON.stringify(target) === "{}";
    }
    return false;
}

// 生成start到end之间的随机数 包含start与end
// 传start不传end  end=start start=0 生成0-start之间的随机数
// start end都不传  return Math.random()
export function randomNumber(start?: number, end?: number): number {
    if (!arguments.length) return Math.random();
    if (arguments.length === 1) {
        end = start;
        start = 0;
    }
    const len = (end as number) - (start as number) + 1;
    return ~~(Math.random() * len) + (start as number);
}

/**
 * 随机颜色
 */
export function randomColor() {
    const num = randomNumber(0xffffff).toString(16);
    return "#" + strFillPrefix(num, 0, 6);
}

/**
 * 字符串转为date对象 因为苹果手机无法直接new Date("2018-08-01 10:20:10")获取date
 * @param date
 * @returns {Date}
 */
export function getDateFromStr(date: string): Date {
    const arr: number[] = date.split(/[- :\/]/).map(item => Number(item) || 0);
    return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
}

export function objectIsEqual(obj1: any, obj2: any): boolean {
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
    switch (aType) {
        case "boolean":
        case "number":
        case "string":
        case "function":
            return false;
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
export function qwFormat(num: string | number): string {
    return String(num).replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}

// 给不能用``模板字符串的环境使用
// es5的格式化字符串 example: getFormatStr("11%s111%s", 3, 4) => "1131114"
export function getFormatStr() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (!args.length) return "";
    var str = args[0];
    var params = args.slice(1);
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
export function strFillPrefix(target: string, fill: any, len: number): string {
    if (target.length >= len) return target;
    const fillStr = Array(len - target.length).fill(fill).join("");
    return fillStr + target;
}

/**
 * 每隔一段事件返回字符串中的一个单词
 * @param words
 * @param delay
 * @param callback
 */
export function oneByOne(words: string, delay: number, callback?: (word: string, words: string) => boolean | undefined) {
    let cancel: () => void;
    const wordArr = words.split("");
    cancel = polling(() => {
        const word = wordArr.shift();
        let keepRun = !!wordArr.length;
        if (callback) {
            const flag = callback(word as string, words);
            keepRun = keepRun && flag !== false;
        } else {
            console.log(word);
        }
        if (!keepRun) cancel();
    }, delay);
}

const numberMap: any = {0: "零", 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 7: "七", 8: "八", 9: "九"};
const units: any = {0: "", 1: "十", 2: "百", 3: "千", 4: "万"};
const unitLen: number = Object.keys(units).length;

/**
 * 阿拉伯数字转为中文数字
 * @param number
 */
export function getChineseNumber(number: number) {
    let key = ~~number;
    let chineseNumber = "";
    let times = 0;
    // 个位数
    if (number >= 0 && number < 10) return numberMap[number];
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
export function generateFunctionCode(argsArrayLength: number) {
    let code = 'return arguments[0][arguments[1]](';
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

