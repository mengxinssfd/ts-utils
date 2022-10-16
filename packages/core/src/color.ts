// import {isArray} from "./type";

export function isRGBColor(color: string) {
  const reg =
    /^[rR][gG][Bb][Aa]?\((\s*(2[0-4]\d|25[0-5]|[01]?\d{1,2}),){2}\s*(2[0-4]\d|25[0-5]|[01]?\d{1,2})(,\s*(0\.\d+|1|0))?\)$/;
  return reg.test(color);
}

export function isHEXColor(color: string) {
  const reg = /^#([\da-fA-F]{3}){1,2}$/;
  return reg.test(color);
}

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

export function rgbToHex(color: string) {
  if (!isRGBColor(color)) throw new TypeError();
  const rgb = color.split(',') as [string, string, string];
  const r = parseInt(rgb[0].split('(')[1] as string);
  const g = parseInt(rgb[1]);
  const b = parseInt(rgb[2].split(')')[0] as string);

  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function hslToRgb(hslValue: string): string {
  const hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) as string[];
  const h = Number(hsl[1]) / 360;
  const s = Number(hsl[2]) / 100;
  const l = Number(hsl[3]) / 100;

  function hue2rgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  let r, g, b;
  if (s == 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
}
