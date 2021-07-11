import * as Num from "../src/core/number";

test("strip", () => {
    expect(Num.strip(1.0000000000041083)).toBe(1);
    expect(Num.strip(1.0000000000001563)).toBe(1);
    expect(Num.strip(20000000000.222222222)).not.toBe(20000000000.222222222);
    expect(20000000000.222222222).toBe(20000000000.222222222);
    // 不够精准，js无法表示那么长的数据,或许改考虑用bigint
    expect(20000000000.222222222.toString()).toBe("20000000000.22222");
});
test("getNumberLenAfterDot", () => {
    expect(Num.getNumberLenAfterDot(0.12345667)).toBe(8);
    expect(Num.getNumberLenAfterDot("0.123456789")).toBe(9);
    expect(Num.getNumberLenAfterDot(12345)).toBe(0);
    expect(Num.getNumberLenAfterDot("abc")).toBe(0);
    expect(Num.getNumberLenAfterDot(1.123e5)).toBe(0);
    expect(Num.getNumberLenAfterDot(1.123e2)).toBe(1);
    expect(Num.getNumberLenAfterDot(1.123e+2)).toBe(1);
    expect(Num.getNumberLenAfterDot(1e+2)).toBe(0);
});
test("toNonExponential", () => {
    const fn = Num.toNonExponential;
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

test("plus", () => {
    const fn = Num.plus;
    expect(fn(10000000000.111111111, 10000000000.111111111)).toBe(20000000000.222222222);
});


