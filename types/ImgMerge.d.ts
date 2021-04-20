declare type Style = {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    width?: number;
    height?: number;
    zIndex?: number;
};
declare class LayerElement {
    style: Style;
    content: HTMLImageElement;
    id: number;
    constructor(style: Style, content: HTMLImageElement);
}
export declare class MergeImg {
    readonly width: number;
    readonly height: number;
    private _ctx?;
    private canvas?;
    private readonly parent;
    private layer;
    constructor(width?: number, height?: number);
    get context(): CanvasRenderingContext2D | void;
    static createWithBg(url: string): Promise<MergeImg>;
    render(item: LayerElement): void;
    reRender(): void;
    clear(): void;
    addImg(url: string, style?: Style): Promise<HTMLImageElement>;
    addImg(promiseImg: Promise<HTMLImageElement>, style?: Style): Promise<HTMLImageElement>;
    toDataURL(type?: string, quality?: any): string;
    toBlob(type?: string, quality?: any): Promise<Blob>;
    dataURLToBlob(dataURL: string): Blob;
    destroy(): void;
}
export {};
