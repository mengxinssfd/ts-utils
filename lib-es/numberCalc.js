// 数字计算
import { isArray } from "./type";
/**
 * 把错误的数据转正  from number-precision
 * strip(0.09999999999999998)=0.1
 */
export function strip(num, precision = 12) {
    return +parseFloat(num.toPrecision(precision));
}
// 获取小数点后面数字的长度  // 支持科学计数法from number-precision
export function getNumberLenAfterDot(num) {
    Number(1000).toPrecision();
    const eSplit = String(num).split(/[eE]/);
    const len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
    return len > 0 ? len : 0;
}
// (10.10, 1.00001) => 100000
function getPow(a, b) {
    let aLen = getNumberLenAfterDot(a);
    let bLen = getNumberLenAfterDot(b);
    return Math.pow(10, Math.max(aLen, bLen));
}
// 链式计算
export class NumberCalc {
    constructor(initNumber) {
        this.initNumber = initNumber;
        this.plus = this["+"];
        this.minus = this["-"];
        this.times = this["*"];
        this.divide = this["/"];
        this.setValue(initNumber);
    }
    // 初始化一个实例
    static init(num) {
        return new NumberCalc(num);
    }
    calcArr(num, callback) {
        num.forEach(b => {
            const a = this.value;
            let pow = getPow(a, b);
            this.setValue(callback(a, b, pow));
        });
    }
    calc(callback, num, others) {
        if (!isArray(num)) {
            const a = this.value;
            const b = num;
            let pow = getPow(a, b);
            this.setValue(callback(a, b, pow));
        }
        else {
            this.calcArr(num, callback);
        }
        if (others.length) {
            this.calcArr(others, callback);
        }
    }
    // 加
    ["+"](num, ...others) {
        this.calc((a, b, pow) => (a * pow + b * pow) / pow, num, others);
        return this;
    }
    // 减
    ["-"](num, ...others) {
        this.calc((a, b, pow) => (a * pow - b * pow) / pow, num, others);
        return this;
    }
    // 乘
    ["*"](num, ...others) {
        this.calc((a, b, pow) => pow * a * (b * pow) / (pow * pow), num, others);
        return this;
    }
    // 除
    ["/"](num, ...others) {
        this.calc((a, b, pow) => a * pow / (b * pow), num, others);
        return this;
    }
    // 100 - 20 * 2; <==>  Calc.create(20)["*"](2).before(100, "-")
    by(num, calcLabel) {
        const value = this.value;
        this.setValue(num);
        this[calcLabel](value);
        return this;
    }
    setValue(value) {
        this.value = value;
    }
    // 获取当前值
    get curVal() {
        return strip(this.value);
    }
    // 设置当前值
    set curVal(num) {
        this.setValue(num);
    }
    // 重置为初始值
    reset() {
        this.value = this.initNumber;
        return this;
    }
}
