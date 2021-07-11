"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const number_1 = require("./number");
// 链式计算
class CalcChain {
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
        return new CalcChain(num);
    }
    // 加
    ["+"](...nums) {
        // this.calc((a, b, pow) => (a * pow + b * pow) / pow, num, others);
        this.setValue(number_1.plus(this._value, ...nums));
        return this;
    }
    // 减
    ["-"](...nums) {
        this.setValue(number_1.minus(this._value, ...nums));
        return this;
    }
    // 乘
    ["*"](...nums) {
        this.setValue(number_1.times(this._value, ...nums));
        return this;
    }
    // 除
    ["/"](...nums) {
        this.setValue(number_1.divide(this._value, ...nums));
        return this;
    }
    // 100 - 20 * 2; <==>  Calc.create(20)["*"](2).before(100, "-")
    by(num, calcLabel) {
        const value = this._value;
        this.setValue(num);
        this[calcLabel](value);
        return this;
    }
    setValue(value) {
        this._value = value;
    }
    // 获取当前值
    get value() {
        return number_1.strip(this._value);
    }
    // 设置当前值
    set value(num) {
        this.setValue(num);
    }
    // 重置为初始值
    reset() {
        this._value = this.initNumber;
        return this;
    }
    valueOf() {
        return this._value;
    }
}
exports.default = CalcChain;
