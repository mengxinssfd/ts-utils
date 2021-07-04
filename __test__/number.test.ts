import * as Num from "../src/number";

test("strip", () => {
    expect(Num.strip(1.0000000000041083)).toBe(1);
    expect(Num.strip(1.0000000000001563)).toBe(1);
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

