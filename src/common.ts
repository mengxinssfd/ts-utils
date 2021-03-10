import {isArray, isString, isObject, isPromiseLike} from "./type";
import {createArray} from "./array";

/**
 * 防抖函数
 * @param callback 回调
 * @param delay 延时
 * @returns {Function}
 */
export function debounce<CB extends (...args: any[]) => void>(callback: CB, delay: number): CB {
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
    } as CB;
}

/**
 * 如果callback执行了的话，那么不论是否resolved都不会再被reject
 * @param callback
 * @param delay
 */
export function debounceAsync<T, CB extends (...args: any[]) => Promise<T>>(callback: CB, delay: number): CB {
    let timer: any = null;
    let rej;

    return function (...args: any[]) {
        return new Promise<T>((resolve, reject) => {
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
    } as CB;
}

/**
 * 可取消防抖函数
 * @param callback 回调
 * @param delay 延时
 * @returns {Function}
 */
export function debounceCancelable(callback: (...args: any[]) => void, delay: number) {
    let timer: any = null;

    function cancel() {
        if (!timer) return;
        clearTimeout(timer);
        timer = null;
    }

    return function (...args: any[]) {
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
export function debounceByPromise<T, CB extends (...args: any[]) => Promise<T>>(callback: CB): CB {
    let rejectFn;
    return function (...args: any[]): Promise<T> {
        rejectFn && rejectFn();
        return new Promise(async (res, rej) => {
            rejectFn = rej;
            const result = await callback.apply(this, args);
            res(result);
        });
    } as CB;
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
export function forEachByLen(len: number, callback: (index: number) => (any | false)) {
    for (let i = 0; i < len; i++) {
        if (callback(i) !== false) continue;
        break;
    }
}

// 获取数据类型
export function typeOf(target: any): string {
    const tp = typeof target;
    if (tp !== "object") return tp;
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

// start end都不传  return Math.random()
export function randomNumber(): number
// start = 0 生成0-end之间的随机数
export function randomNumber(end: number): number
// 生成start到end之间的随机数 包含start不包含end
export function randomNumber(start: number, end: number): number
// 生成start到end之间的随机数组 包含start不包含end length：数组长度
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
        const len = (end as number) - (start as number);
        return (Math.random() * len) + (start as number);
    } else {
        return createArray({len: length, fill: () => randomNumber(start, end)});
    }
}

/**
 * 随机颜色
 */
export function randomColor(): string
export function randomColor(len: number): string[]
export function randomColor(len?) {
    const num = (~~randomNumber(0xffffff)).toString(16);
    const color = "#" + strPadStart(num, 6, "0");
    if (len === undefined) {
        return color;
    } else {
        return createArray({len, fill: () => randomColor()});
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

export interface Number2Chinese {
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

export interface Chinese2Number {
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
export function generateFunction(obj: object, property: string, args: any[]) {
    return (new Function(generateFunctionCode(args.length)))(obj, property, args);
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

// 合并两个object
export function merge<T extends object, U extends object>(first: T, second: U): T & U {
    const result: any = {};

    function assign(receive: object, obj: object) {
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
export function deepMerge<T extends object, U extends object>(first: T, second: U): T & U {
    function assign(receive: object, obj: any) {
        for (const k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            const v = obj[k];
            if (v && typeof v === "object") {
                receive[k] = new v.constructor();
                assign(receive[k], v);
            } else
                receive[k] = v;
        }
    }

    const result: any = {};
    assign(result, first);
    assign(result, second);
    return result;
}

export function sleep(delay: number): Promise<void> {
    return new Promise(res => setTimeout(res, delay));
}

/**
 * 生成不重复的字符串
 * @param length
 * @returns {string}
 */
export function createUUID(length: number): string {
    const uuidArr: string[] = [];
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
export function formatJSON(json: object | string, indent = 2): string {
    if (typeof json === "string") {
        try {
            json = JSON.parse(json);
        } catch (e) {
            throw new TypeError();
        }

    }

    function foreach(js: any, floor = 0): string {
        switch (typeof js) {
            case "object":
                const isArr = isArray(js);

                let space = " ".repeat(indent * floor);
                const start = isArr ? "[\r\n" : "{\r\n";
                const end = "\r\n" + space + (isArr ? "]" : "}");
                let times = 0;

                let result = start;
                for (const key in js) {
                    if (!js.hasOwnProperty(key)) continue;
                    const value = js[key];

                    // 如果改行不是第一行，则给上一行的末尾添加逗号，并且换行
                    if (times) result += ",\r\n";

                    // 拼接空格
                    const childSpace = " ".repeat(indent * floor + indent);
                    const child = foreach(value, floor + 1);

                    if (isArr) {
                        result += `${childSpace}${child}`;
                    } else {
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
export function createEnum<T extends string>(items: T[]): { [k in T]: number } & { [k: number]: T } {
    const result: any = {};
    items.forEach((item, index) => {
        result[item] = index;
        result[index] = item;
    });
    Object.freeze(result); // freeze值不可变
    // Object.seal(result); // seal值可以变
    return result;
}

export function createEnumByObj<T extends object, K extends keyof T, O extends { [k: string]: K }>(obj: T): T & { [k: string]: K } {
    /* const res: any = {};
     for (let k in obj) {
         if (res.hasOwnProperty(k)) throw new Error("key multiple");
         res[res[k] = obj[k]] = k;
     }

     Object.freeze(res); // freeze值不可变
     // Object.seal(result); // seal值可以变
     return res;*/
    return assign({}, obj, getReverseObj(obj as any)) as any;
}

/**
 * @param originObj
 * @param pickKeys
 * @param cb
 */
export function pickByKeys<T extends object, K extends keyof T, O extends Pick<T, K>>(
    originObj: T,
    pickKeys: K[],
    cb?: (value: T[K], key: K, originObj: T) => Pick<T, K>[K],
): Pick<T, K> {
    const callback = cb || (v => v);
    return pickKeys.reduce((res, key) => {
        if (originObj.hasOwnProperty(key)) res[key] = callback(originObj[key], key, originObj);
        return res;
    }, {} as any);
}

// TODO 不完美的地方：k === "a"时应该限定返回值类型为number
/*pickByKeys({a: 123, b: "111", c: false}, ["a", "b"], (v, k, o) => {
    if(k === "a"){
        return "123123"
    }
    return v;
});*/

// 新属性名作为键名的好处是可以多个属性对应一个值
export function pickRename<T extends object, K extends keyof T, O extends { [k: string]: K }>(
    originObj: T,
    renamePickObj: O,
    cb?: (value: T[O[keyof O]], key: O[keyof O], originObj: T) => T[O[keyof O]],
): { [k in keyof O]: T[O[k]] } {
    const callback = cb || (v => v);
    /* const renames = Object.keys(renamePickObj) as (keyof O)[];
     return renames.reduce((result, rename) => {
         const pick = renamePickObj[rename];
         if (originObj.hasOwnProperty(pick)) {
             result[rename] = callback(originObj[pick], pick, originObj);
         }
         return result;
     }, {} as any);*/
    return reduceObj(renamePickObj, (result, pick, rename) => {
        if (originObj.hasOwnProperty(pick)) {
            result[rename] = callback(originObj[pick], pick, originObj);
        }
        return result;
    }, {} as any);
}

/*
export function pickRename2<T extends object,
    K extends keyof T,
    O extends { [k: string]: K | ((t: T) => T[K]) }>(
    originObj: T,
    renamePickObj: O,
): { [k in keyof O]: O[k] extends K ? T[O[k]] : T[K] } {
    return {} as any;
}

pickRename2({a: 123, b: "222"}, {
    c: 'a',
    d: (obj) => obj.a,
});
*/

/**
 * 功能与pickByKeys函数一致
 * @param originObj
 * @param pickKeys
 * @param cb
 */
export function pick<T extends object, K extends keyof T, KS extends K[]>(
    originObj: T,
    pickKeys: KS,
    cb?: (value: T[K], key: K, fromObj: T) => T[K],
): { [key in K]: T[key] }
/**
 * 功能与pickRename函数一致
 * @param originObj
 * @param renamePickObj
 * @param cb
 */
export function pick<T extends object, K extends keyof T, O extends { [k: string]: K }>(
    originObj: T,
    renamePickObj: O,
    cb?: (value: T[O[keyof O]], key: O[keyof O], fromObj: T) => T[O[keyof O]],
): { [k in keyof O]: T[O[k]] }
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
export function getReverseObj(obj: { [k: string]: string }): { [k: string]: string } {
    return reduceObj(obj, (res, v, k) => {
        res[v] = k;
        return res;
    }, {});
}

export function promiseAny<T>(list: Promise<T>[]): Promise<T> {
    return new Promise<T>(((resolve, reject) => {
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
                } else {
                    resolve(p);
                }
            }
            !list.length && reject("AggregateError: All promises were rejected");
        } catch (e) {
            reject(e.toString());
        }

    }));
}

/**
 * 代替Object.keys(obj).forEach，减少循环次数
 * @param obj
 * @param callbackFn 返回false的时候中断
 */
export function forEachObj<T extends object>(obj: T, callbackFn: (value: T[keyof T], key: keyof T, obj: T) => (void | false)) {
    for (const k in obj) {
        if (!obj.hasOwnProperty(k)) continue;
        const v = obj[k];
        if (callbackFn(v, k, obj) === false) return;
    }
}

/**
 * 代替Object.keys(obj).reduce，减少循环次数
 * @param obj
 * @param callbackFn
 * @param initialValue 初始值
 */
export function reduceObj<T extends object, R>(
    obj: T,
    callbackFn: (previousValue: R, value: T[keyof T], key: keyof T, obj: T) => R,
    initialValue: R,
): R {
    let result = initialValue;
    forEachObj(obj, (v, k, o) => {
        result = callbackFn(result, v, k, o);
    });
    return result;
}

export function assign<T, U>(target: T, source: U): T & U;
export function assign<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export function assign<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export function assign(target: object, ...args: object[]);
export function assign(target, ...args) {
    args.forEach(arg => {
        for (const key in arg) {
            if (!arg.hasOwnProperty(key)) continue;
            target[key] = arg[key];
        }
    });
    return target;
}