/**
 * 把错误的数据转正  from number-precision
 * strip(0.09999999999999998)=0.1
 */
export declare function strip(num: number, precision?: number): number;
export declare function getNumberLenAfterDot(num: number | string): number;
export declare function getCommonPow(a: number, b: number): number;
/**
 * 科学计数法转普通小数
 * @note 不能转太大的数 比如大于Number.MAX_SAFE_INTEGER
 * @param num
 */
export declare function toNonExponential(num: number): string;
export declare function plus(num: number, ...nums: Array<number>): number;
export declare function minus(num: number, ...nums: Array<number>): number;
export declare function times(num: number, ...nums: Array<number>): number;
export declare function divide(num: number, ...nums: Array<number>): number;
export declare class NumberCalc {
    private readonly initNumber;
    private value;
    constructor(initNumber: number);
    static init(num: number): NumberCalc;
    ["+"](...nums: number[]): NumberCalc;
    plus: (...nums: number[]) => NumberCalc;
    ["-"](...nums: number[]): NumberCalc;
    minus: (...nums: number[]) => NumberCalc;
    ["*"](...nums: number[]): NumberCalc;
    times: (...nums: number[]) => NumberCalc;
    ["/"](...nums: number[]): NumberCalc;
    divide: (...nums: number[]) => NumberCalc;
    by(num: number, calcLabel: "+" | "-" | "*" | "/"): this;
    private setValue;
    get curVal(): number;
    set curVal(num: number);
    reset(): NumberCalc;
    valueOf(): number;
}
