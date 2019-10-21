declare const Promise: any;
declare const Object: any;
declare const Number: any;
declare const Array: any;

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


// 判断是否是空值 undefined, null, "", [], {} ,NaN都为true
export function isEmpty(target: any): boolean {
    // @ts-ignore
    if ([undefined, null, "", NaN].includes(target)) return true;
    switch (typeOf(target)) {
        case "array":
            return !!target.length;
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
    const len = end - start + 1;
    return ~~(Math.random() * len) + start;
}

/**
 * 字符串转为date对象 因为苹果手机无法直接new Date("2018-08-01 10:20:10")获取date
 * @param dateString
 * @returns {Date}
 */
export function getDateFromStr(dateString: string): Date {
    const arr: number[] = dateString.split(/[- :\/]/).map(item => Number(item) || 0);
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
            return objectIsEqual(a, b);
    }
}

/**
 * 千位分隔 1,234,567,890
 * @param num
 */
export function qwSplit(num: string | number): string {
    return String(num).replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}

// es5的格式化字符串 example: getFormatStr("11%s111%s", 3, 4) => "1131114"
export function getFormatStr() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (!args.length) return "";
    var str = args[0];
    var params = args.slice(1);
    return str.replace(/%s/g, function () {
        return params.shift();
    });
}

/**
 * 给长度不满足要求的字符串添加前缀
 * @param target
 * @param fill
 * @param len
 */
export function strAddPrefix(target: string, fill: any, len: number): string {
    if (target.length >= len) return target;
    const fillStr = Array(len - target.length).fill(fill).join("");
    return fillStr + target;
}