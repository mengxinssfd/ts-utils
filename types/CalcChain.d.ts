export default class CalcChain {
    private readonly initNumber;
    private _value;
    constructor(initNumber: number);
    static init(num: number): CalcChain;
    ["+"](...nums: number[]): CalcChain;
    plus: (...nums: number[]) => CalcChain;
    ["-"](...nums: number[]): CalcChain;
    minus: (...nums: number[]) => CalcChain;
    ["*"](...nums: number[]): CalcChain;
    times: (...nums: number[]) => CalcChain;
    ["/"](...nums: number[]): CalcChain;
    divide: (...nums: number[]) => CalcChain;
    by(num: number, calcLabel: "+" | "-" | "*" | "/"): this;
    private setValue;
    get value(): number;
    set value(num: number);
    reset(): CalcChain;
    valueOf(): number;
}
