declare type Location = {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
};
declare type Size = [number?, number?];
export declare class MergeImg {
    readonly width: number;
    readonly height: number;
    private _ctx?;
    private canvas?;
    private readonly parent;
    constructor(width?: number, height?: number);
    get context(): CanvasRenderingContext2D | void;
    static createWithBg(url: string): Promise<MergeImg>;
    addImg(url: string, location?: Location, size?: Size): Promise<HTMLImageElement>;
    addImg(promiseImg: Promise<HTMLImageElement>, location?: Location, size?: Size): Promise<HTMLImageElement>;
    toDataURL(type?: string, quality?: any): string;
    toBlob(type?: string, quality?: any): Promise<Blob>;
    dataURLToBlob(dataURL: string): Blob;
    destroy(): void;
}
export {};
