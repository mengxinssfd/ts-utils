"use strict";
// import {isArray} from "./type";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hslToRgb = exports.rgbToHex = exports.isHEXColor = exports.isRGBColor = void 0;
function isRGBColor(color) {
    const reg = /^[rR][gG][Bb][Aa]?\((\s*(2[0-4]\d|25[0-5]|[01]?\d{1,2}),){2}\s*(2[0-4]\d|25[0-5]|[01]?\d{1,2})(,\s*(0\.\d+|1|0))?\)$/;
    return reg.test(color);
}
exports.isRGBColor = isRGBColor;
function isHEXColor(color) {
    const reg = /^#([\da-fA-F]{3}){1,2}$/;
    return reg.test(color);
}
exports.isHEXColor = isHEXColor;
// 移动到RGB.fromHEX
/*export function hexToRgb(hexValue: string) {
    // if (!isHEXColor(hexValue)) throw new TypeError("hexValue is not hex color");
    const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const hex = hexValue.replace(rgx, (m, r, g, b) => {
        return r + r + g + g + b + b;
    });
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) as string[];
    if (!isArray(rgb) || rgb.length < 4) throw new TypeError();
    const r = parseInt(rgb[1], 16);
    const g = parseInt(rgb[2], 16);
    const b = parseInt(rgb[3], 16);
    return `rgb(${r},${g},${b})`;
}*/
function rgbToHex(color) {
    if (!isRGBColor(color))
        throw new TypeError();
    const rgb = color.split(",");
    const r = parseInt(rgb[0].split("(")[1]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2].split(")")[0]);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
exports.rgbToHex = rgbToHex;
function hslToRgb(hslValue) {
    const hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue);
    const h = +hsl[1] / 360;
    const s = +hsl[2] / 100;
    const l = +hsl[3] / 100;
    function hue2rgb(p, q, t) {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    let r, g, b;
    if (s == 0) {
        r = g = b = l;
    }
    else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
}
exports.hslToRgb = hslToRgb;
