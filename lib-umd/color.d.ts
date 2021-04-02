export declare function isRGBColor(color: string): boolean;
export declare function isHEXColor(color: string): boolean;
export declare function rgbToHex(color: string): string;
export declare function hslToRgb(hslValue: any): string;
/**
 * 获取平均色
 * @param imgEl
 */
export declare function getAverageRGB(imgEl: HTMLImageElement): {
    r: number;
    g: number;
    b: number;
};
export declare function getReverseRGB(): void;
