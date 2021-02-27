import { Point } from "./coordinate";
export declare class MergeImg {
    readonly width: number;
    readonly height: number;
    private ctx?;
    private canvas?;
    private readonly parent;
    constructor(width: number, height: number);
    addImg(url: string, location: Point, size?: Point): Promise<void>;
    toDataURL(type?: string): string;
    toBlob(): Blob;
    destroy(): void;
}
