// 数字计算
/**
 * 把错误的数据转正  from number-precision
 * strip(0.09999999999999998)=0.1
 */
export function strip(num: number, precision = 12): number {
    return +parseFloat(num.toPrecision(precision));
}

// 获取小数点后面数字的长度  // 支持科学计数法from number-precision
export function getNumberLenAfterDot(num: number | string): number {
    Number(1000).toPrecision();
    const eSplit = String(num).split(/[eE]/);
    const len = (eSplit[0].split(".")[1] || "").length - (+(eSplit[1] || 0));
    return len > 0 ? len : 0;
}

// (10.10, 1.00001) => 100000
export function getCommonPow(a: number, b: number): number {
    let aLen = getNumberLenAfterDot(a);
    let bLen = getNumberLenAfterDot(b);
    return Math.pow(10, Math.max(aLen, bLen));
}

function calcArr(num: number, nums: number[], callback: (a: number, b: number, pow: number) => number): number {
    return nums.reduce<number>((a, b) => {
        const pow = getCommonPow(a, b);
        return callback(a, b, pow);
    }, num);
}

/**
 * 科学计数法转普通小数
 * @note 不能转太大的数 比如大于Number.MAX_SAFE_INTEGER
 * @param num
 */
export function toNonExponential(num: number): string {
    // toExponential 转为科学计数法
    // const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
    const sNum = String(num);
    const m = sNum.match(/\d(?:\.(\d*))?e([+-]\d+)/);
    if (num > Number.MAX_SAFE_INTEGER || !m || m.length < 3) return sNum;
    return num.toFixed(Math.max(0, (m[1] || "").length - Number(m[2])));
}

export function plus(num: number, ...nums: Array<number>) {
    return calcArr(num, nums, (a, b, pow) => (a * pow + b * pow) / pow);
}

export function minus(num: number, ...nums: Array<number>) {
    return calcArr(num, nums, (a, b, pow) => (a * pow - b * pow) / pow);
}

export function times(num: number, ...nums: Array<number>) {
    return calcArr(num, nums, (a, b, pow) => pow * a * (b * pow) / (pow * pow));
}

export function divide(num: number, ...nums: Array<number>) {
    return calcArr(num, nums, (a, b, pow) => a * pow / (b * pow));
}

// 链式计算
export class NumberCalc {
    private value!: number;

    constructor(private readonly initNumber: number) {
        this.setValue(initNumber);
    }

    // 初始化一个实例
    public static init(num: number): NumberCalc {
        return new NumberCalc(num);
    }

    // 加
    public ["+"](...nums: number[]): NumberCalc {
        // this.calc((a, b, pow) => (a * pow + b * pow) / pow, num, others);
        this.setValue(plus(this.value, ...nums));
        return this;
    }

    public plus = this["+"];

    // 减
    public ["-"](...nums: number[]): NumberCalc {
        this.setValue(minus(this.value, ...nums));
        return this;
    }

    public minus = this["-"];

    // 乘
    public ["*"](...nums: number[]): NumberCalc {
        this.setValue(times(this.value, ...nums));
        return this;
    }

    public times = this["*"];

    // 除
    public ["/"](...nums: number[]): NumberCalc {
        this.setValue(divide(this.value, ...nums));
        return this;
    }

    public divide = this["/"];

    // 100 - 20 * 2; <==>  Calc.create(20)["*"](2).before(100, "-")
    public by(num: number, calcLabel: "+" | "-" | "*" | "/") {
        const value = this.value;
        this.setValue(num);
        this[calcLabel](value);
        return this;
    }

    private setValue(value: number) {
        this.value = value;
    }

    // 获取当前值
    public get curVal(): number {
        return strip(this.value);
    }

    // 设置当前值
    public set curVal(num) {
        this.setValue(num);
    }

    // 重置为初始值
    public reset(): NumberCalc {
        this.value = this.initNumber;
        return this;
    }

    valueOf(): number {
        return this.value;
    }
}