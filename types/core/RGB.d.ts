import { isRGBColor } from "./color";
declare abstract class RGBSuper {
    protected _r: number;
    protected _g: number;
    protected _b: number;
    protected constructor(r?: number, g?: number, b?: number);
    get r(): number;
    set r(value: number);
    get g(): number;
    set g(value: number);
    get b(): number;
    set b(value: number);
    abstract toString(): string;
    static validate: typeof isRGBColor;
    toHEX(): string;
}
export declare class RGB extends RGBSuper {
    constructor(r?: number, g?: number, b?: number);
    static random(): RGB;
    static fromStr(color: string): RGB;
    static fromHEX(hexColor: string): RGB;
    toRGBA(): RGBA;
    toString(): string;
}
export declare class RGBA extends RGBSuper {
    constructor(r?: number, g?: number, b?: number, a?: number);
    private _a;
    get a(): number;
    set a(value: number);
    static random(): RGBA;
    static fromStr(color: string): RGBA;
    toRGB(): RGB;
    toString(): string;
}
export {};
