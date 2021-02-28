import { Point } from "./coordinate";
export declare class MergeImg {
    readonly width: number;
    readonly height: number;
    private _ctx?;
    private canvas?;
    private readonly parent;
    constructor(width?: number, height?: number);
    get context(): CanvasRenderingContext2D | void;
    setBg(url: string): Promise<void>;
    addImg(url: string, location: Point, size?: Point): Promise<void>;
    toDataURL(type?: string, quality?: any): string;
    toBlob(type?: string, quality?: any): Promise<Blob | null>;
    dataURLToBlob(dataURL: string): Blob;
    destroy(): void;
}
