export declare function randomFloat(): number;
export declare function randomFloat(max: number): number;
export declare function randomFloat(min: number, max: number): number;
export declare function randomFloat(min: number, max: number, len: number): number[];
export declare function randomInt(): number;
export declare function randomInt(end: number): number;
export declare function randomInt(min: number, max: number): number;
export declare function randomInt(min: number, max: number, len: number): number[];
/**
 * 随机获取数组中的一个
 * @param arr
 */
export declare function randomItem<T>(arr: T[]): T;
/**
 * 洗牌
 * @param arr
 */
export declare function shuffle<T>(arr: ArrayLike<T>): T[];
export declare function randomRGB(): string;
export declare function randomRGBA(): string;
export declare function randomHEX(): string;
declare type ColorType = "HEX" | "RGB" | "RGBA";
/**
 * 随机颜色
 */
export declare function randomColor(): string;
export declare function randomColor(type: ColorType): string;
export declare function randomColor(len: number): string;
export declare function randomColor(type: ColorType, len: number): string[];
export {};
