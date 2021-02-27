/**
 * 把错误的数据转正  from number-precision
 * strip(0.09999999999999998)=0.1
 */
export declare function strip(num: number, precision?: number): number;
export declare function getNumberLenAfterDot(num: number | string): number;
export declare class NumberCalc {
    private readonly initNumber;
    private value;
    constructor(initNumber: number);
    static init(num: number): NumberCalc;
    private calcArr;
    private calc;
    ["+"](num: number[] | number, ...others: number[]): NumberCalc;
    plus: (num: number[] | number, ...others: number[]) => NumberCalc;
    ["-"](num: number[] | number, ...others: number[]): NumberCalc;
    minus: (num: number[] | number, ...others: number[]) => NumberCalc;
    ["*"](num: number[] | number, ...others: number[]): NumberCalc;
    times: (num: number[] | number, ...others: number[]) => NumberCalc;
    ["/"](num: number[] | number, ...others: number[]): NumberCalc;
    divide: (num: number[] | number, ...others: number[]) => NumberCalc;
    by(num: number, calcLabel: "+" | "-" | "*" | "/"): this;
    private setValue;
    get curVal(): number;
    set curVal(num: number);
    reset(): NumberCalc;
}
