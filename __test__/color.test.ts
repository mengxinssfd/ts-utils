import * as  color from "../src/core/color";
import {randomColor} from "../src/core/random";

test("isRGB", () => {
    const fn = color.isRGBColor;
    expect(fn("rgb(0,0,0)")).toBeTruthy();
    expect(fn("rgb(0, 0, 0)")).toBeTruthy();
    expect(fn("rgba(0,0,0,0)")).toBeTruthy();
    expect(fn("rgba(255,255,255,0)")).toBeTruthy();
    expect(fn("rgba(255, 255, 255, 0)")).toBeTruthy();
    expect(fn("rgba(-1,0,0,1)")).toBeFalsy();
    expect(fn("rgba(0,-1,0,1)")).toBeFalsy();
    expect(fn("rgba(0,0,-1,1)")).toBeFalsy();
    expect(fn("rgba(0,0,0,-1)")).toBeFalsy();
    expect(fn("rgba(.,.,.,.)")).toBeFalsy();
    expect(fn("rga(0,0,0)")).toBeFalsy();
    expect(fn("rgba(266,0,0,0)")).toBeFalsy();
    expect(fn("rgba(0,266,0,0)")).toBeFalsy();
    expect(fn("rgba(0,0,266,0)")).toBeFalsy();
    expect(fn("rgba(0,0,266,2)")).toBeFalsy();
    expect(fn("rgba(1000,100,100)")).toBeFalsy();
    expect(fn("rgba(100,1000,100)")).toBeFalsy();
    expect(fn("rgba(100,100,1000)")).toBeFalsy();

    expect(fn("rgba(256,100,100)")).toBeFalsy();
    expect(fn("rgba(100,256,100)")).toBeFalsy();
    expect(fn("rgba(100,100,256)")).toBeFalsy();

    expect(fn("rgba(100,100,256,0)")).toBeFalsy();
});
test("isHEXColor", () => {
    const fn = color.isHEXColor;
    // console.time("t")
    expect(fn("#ffffff")).toBeTruthy();
    expect(fn("#fff")).toBeTruthy();
    expect(fn("#ffff")).toBeFalsy();
    expect(fn("#fffff")).toBeFalsy();
    expect(fn("#FFFFFF")).toBeTruthy();
    expect(fn("#7d1919")).toBeTruthy();
    expect(fn("#7D1919")).toBeTruthy();
    expect(fn("#7d19199")).toBeFalsy();
    expect(fn("#7d191g")).toBeFalsy();
    expect(fn("rgba(0,0,266,2)")).toBeFalsy();
    const arr = randomColor(1000);
    expect(arr.every(i=>fn(i))).toBeTruthy();
    // console.timeEnd("t")
});
/*test("hexToRgb", () => {
    const fn = color.hexToRgb;
    expect(fn("#000000")).toBe("rgb(0,0,0)");
    expect(fn("#840707")).toBe("rgb(132,7,7)");
    expect(fn("#654D4D")).toBe("rgb(101,77,77)");
    expect(fn("#000")).toBe("rgb(0,0,0)");
    expect(fn("#00f")).toBe("rgb(0,0,255)");
    expect(() => fn("#hhhhhh")).toThrowError();
});*/
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