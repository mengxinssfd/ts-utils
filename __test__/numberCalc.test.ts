import * as numCalc from "../src/numberCalc";

test("strip", () => {
    expect(numCalc.strip(1.0000000000041083)).toBe(1);
    expect(numCalc.strip(1.0000000000001563)).toBe(1);
});
test("getNumberLenAfterDot", () => {
    expect(numCalc.getNumberLenAfterDot(0.12345667)).toBe(8);
    expect(numCalc.getNumberLenAfterDot("0.123456789")).toBe(9);
    expect(numCalc.getNumberLenAfterDot(12345)).toBe(0);
    expect(numCalc.getNumberLenAfterDot("abc")).toBe(0);
    expect(numCalc.getNumberLenAfterDot(1.123e5)).toBe(0);
    expect(numCalc.getNumberLenAfterDot(1.123e2)).toBe(1);
    expect(numCalc.getNumberLenAfterDot(1.123e+2)).toBe(1);
    expect(numCalc.getNumberLenAfterDot(1e+2)).toBe(0);
});
test("toNonExponential", () => {
    const fn = numCalc.toNonExponential;
    expect(fn(1e+2)).toBe("100");
    expect(fn(0.0000001)).toBe("0.0000001");
    expect(fn(0.0000000001)).toBe("0.0000000001");
    const num = 100_000_000_000_000_000_000_000;
    expect(num.toString()).toBe("1e+23");
    expect(num > Number.MAX_SAFE_INTEGER).toBe(true);
    expect(fn(num)).toBe("1e+23");

    const num2 = (1_000_000_000_000_000).toExponential();
    expect(num2.toString()).toBe("1e+15");
    expect(+num2 > Number.MAX_SAFE_INTEGER).toBe(false);
    expect(fn(+num2)).toBe("1000000000000000");
});

test("Calc", () => {
    const Calc = numCalc.NumberCalc;
    // 0.1 + 0.2 = 0.30000000000000004
    expect(0.1 + 0.2).not.toBe(0.3);
    const c = new Calc(1);

    // 0.3 - 0.1 = 0.19999999999999998
    expect(0.3 - 0.1).not.toBe(0.2);
    expect(Calc.init(0.3).minus(0.1).curVal).toBe(0.2);
    // 0.2 * 0.1 = 0.020000000000000004
    expect(0.2 * 0.1).not.toBe(0.02);
    expect(Calc.init(0.2).times(0.1).curVal).toBe(0.02);
    // 0.3 / 0.1 = 2.9999999999999996
    expect(0.3 / 0.1).not.toBe(3);
    expect(Calc.init(0.3).divide(0.1).curVal).toBe(3);

    // 100 / 10 + 5 - 2 = 13
    expect(c.times(100).divide(10).plus(5).minus(2).curVal).toBe(13);

    // 0.3 - 0.1 = 0.19999999999999998
    expect(0.3 - 0.1).not.toBe(0.2);
    expect(Calc.init(0.3)["-"](0.1).curVal).toBe(0.2);
    // 0.2 * 0.1 = 0.020000000000000004
    expect(0.2 * 0.1).not.toBe(0.02);
    expect(Calc.init(0.2)["*"](0.1).curVal).toBe(0.02);
    // 0.3 / 0.1 = 2.9999999999999996
    expect(0.3 / 0.1).not.toBe(3);
    expect(Calc.init(0.3)["/"](0.1).curVal).toBe(3);

    c.reset();
    // 100 / 10 + 5 - 2 = 13
    expect(c["*"](100)["/"](10)["+"](5)["-"](2).curVal).toBe(13);
    c.curVal = 0.1;
    // 0.1 + 0.2 - 0.1 = 0.2
    expect(c["+"](0.2)["-"](0.1).curVal).toBe(0.2);

    //  100 - 20 * 2 = 60
    expect(Calc.init(20)["*"](2).by(100, "-").curVal).toBe(60);

    // 100 - 10 - 20 - 30 - 100 = -60
    expect(Calc.init(100)["-"](...[10, 20, 30, 100]).curVal).toBe(-60);
    expect(Calc.init(100)["-"](...[10, 20, 30, 100]).curVal).toBe(-60);
    expect(Calc.init(100)["-"](10, 20, 30, 100).curVal).toBe(-60);
    expect(Calc.init(100)["-"](...[10, 20], 30, 100).curVal).toBe(-60);
    expect(Calc.init(100)["-"](...[10, 20, 30], 100).curVal).toBe(-60);
});

