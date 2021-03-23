import * as  color from "../src/color";

test("isRGB", () => {
    const fn = color.isRGBColor;
    expect(fn("rgb(0,0,0)")).toBeTruthy();
    expect(fn("rgba(0,0,0,0)")).toBeTruthy();
    expect(fn("rgba(255,255,255,0)")).toBeTruthy();
    expect(fn("rgba(0,0,0,-1)")).toBeFalsy();
    expect(fn("rgba(266,0,0,0)")).toBeFalsy();
    expect(fn("rgba(0,266,0,0)")).toBeFalsy();
    expect(fn("rgba(0,0,266,0)")).toBeFalsy();
    expect(fn("rgba(0,0,266,2)")).toBeFalsy();
});
test("isHEXColor", () => {
    const fn = color.isHEXColor;
    expect(fn("#ffffff")).toBeTruthy();
    expect(fn("#7d1919")).toBeTruthy();
    expect(fn("#7d19199")).toBeFalsy();
    expect(fn("#7d191g")).toBeFalsy();
    expect(fn("rgba(0,0,266,2)")).toBeFalsy();
});
test("hexToRgb", () => {
    const fn = color.hexToRgb;
    expect(fn("#000000")).toBe("rgb(0,0,0)");
    expect(fn("#840707")).toBe("rgb(132,7,7)");
    expect(fn("#654D4D")).toBe("rgb(101,77,77)");
    expect(() => fn("#hhhhhh")).toThrowError();
});
test("rgbToHex", () => {
    const fn = color.rgbToHex;
    expect(fn("rgb(0,0,0)")).toBe("#000000");
    expect(fn("rgb(132,7,7)")).toBe("#840707");
    expect(fn("rgb(101,77,77)")).toBe("#654d4d");
    expect(() => fn("#hhhhhh")).toThrowError();
});
test("hslToRgb", () => {
    const fn = color.hslToRgb;
    expect(fn("hsl(220,13%,18%)")).toBe("rgb(40,44,52)");
    expect(fn("hsl(0,0%,14%)")).toBe("rgb(36,36,36)");
});