import {isRGBColor} from "./color";
import {randomInt} from "./random";
import {isArray} from "./type";

function getLimitValue(value: number) {
    return Math.max(0, Math.min(value, 255));
}

abstract class RGBSuper {
    protected _r!: number;
    protected _g!: number;
    protected _b!: number;

    protected constructor(r = 0, g = 0, b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    get r(): number {
        return this._r;
    }

    set r(value: number) {
        this._r = getLimitValue(value);
    }

    get g(): number {
        return this._g;
    }

    set g(value: number) {
        this._g = getLimitValue(value);
    }

    get b(): number {
        return this._b;
    }

    set b(value: number) {
        this._b = getLimitValue(value);
    }

    abstract toString(): string;

    static validate = isRGBColor;

    toHEX(): string {
        const {r, g, b} = this;
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
}

export class RGB extends RGBSuper {
    constructor(r ?: number, g?: number, b?: number) {
        super(r, g, b);
    }

    static random(): RGB {
        const num = randomInt(0, 255, 3);
        return new RGB(num[0], num[1], num[2]);
    }

    static fromStr(color: string) {
        if (!RGB.validate(color)) throw new TypeError("color is not rgb");
        color = color.replace(/(rgba?\(|\))/g, "");
        const rgb = color.split(",");
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        return new RGB(r, g, b);
    }

    static fromHEX(hexColor: string): RGB {
        const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const hex = hexColor.replace(rgx, (m, r, g, b) => r + r + g + g + b + b);
        const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) as string[];
        if (!isArray(rgb) || rgb.length < 4) throw new TypeError();
        const r = parseInt(rgb[1], 16);
        const g = parseInt(rgb[2], 16);
        const b = parseInt(rgb[3], 16);
        return new RGB(r, g, b);
    }

    toRGBA(): RGBA {
        const {r, g, b} = this;
        return new RGBA(r, g, b);
    }

    toString(): string {
        const {r, g, b} = this;
        return `rgb(${r},${g},${b})`;
    }
}

export class RGBA extends RGBSuper {
    constructor(r ?: number, g?: number, b?: number, a = 1) {
        super(r, g, b);
        this.a = a;
    }

    private _a!: number;

    get a(): number {
        return this._a;
    }

    set a(value: number) {
        const a = Math.max(0, Math.min(value, 1));
        this._a = Number(a.toFixed(2));
    }

    static random(): RGBA {
        const num = randomInt(0, 255, 3);
        return new RGBA(num[0], num[1], num[2], randomInt());
    }

    static fromStr(color: string): RGBA {
        if (!RGBA.validate(color)) throw new TypeError("color is not rgb");
        color = color.replace(/(rgba?\(|\))/g, "");
        const rgb = color.split(",");
        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);
        const a = parseInt(rgb[3]);
        return new RGBA(r, g, b, a);
    }

    toRGB(): RGB {
        const {r, g, b} = this;
        return new RGB(r, g, b);
    }

    toString() {
        const {r, g, b, a} = this;
        return `rgba(${r},${g},${b},${a})`;
    }
}