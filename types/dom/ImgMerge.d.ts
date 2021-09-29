declare type Style = {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    width?: number | "auto";
    height?: number | "auto";
    zIndex?: number;
    verticalAlign?: "top" | "middle" | "bottom";
    horizontalAlign?: "left" | "middle" | "right";
    background?: string;
};
declare type Radius = number | [number, number, number, number];
declare type ImgStyle = Style & {
    radius?: Radius;
};
declare type ComputedStyleExclude = "verticalAlign" | "horizontalAlign" | "right" | "bottom" | "background";
declare abstract class Node {
    parent: Node | MergeImg;
    computedStyle: {
        width: number;
        height: number;
    } & Required<Omit<Style, ComputedStyleExclude>>;
    auto: {
        width: number;
        height: number;
    };
    style: Style;
    protected constructor(parent: Node | MergeImg);
    setStyle(style: Style): void;
    get root(): MergeImg;
    get ctx(): any;
    render(): void;
    protected renderBackGround(): void;
    protected computeStyle(): void;
    protected abstract _render(): any;
}
declare class ImgElement extends Node {
    content: HTMLImageElement;
    style: ImgStyle;
    id: number;
    constructor(parent: Node, style: ImgStyle, content: HTMLImageElement);
    protected _render(): void;
}
declare class Layer extends Node {
    style: Style;
    parent: MergeImg;
    children: Node[];
    constructor(parent: MergeImg, style: Style);
    add(el: ImgElement): number;
    addImg(img: HTMLImageElement, style?: ImgStyle): Promise<ImgElement>;
    addImg(url: string, style?: ImgStyle): Promise<ImgElement>;
    addImg(promiseImg: Promise<HTMLImageElement>, style?: ImgStyle): Promise<ImgElement>;
    protected _render(): void;
    remove(el: ImgElement): ImgElement | void;
    remove(index: number): ImgElement | void;
    clear(): void;
}
export declare class MergeImg {
    readonly width: number;
    readonly height: number;
    private _ctx?;
    private canvas?;
    private readonly parent;
    private layers;
    /**
     * @param [width=0]
     * @param [height=0]
     */
    constructor(width?: number, height?: number);
    addLayer(style?: Style): Layer;
    get ctx(): CanvasRenderingContext2D | void;
    static createWithBg(url: string): Promise<MergeImg>;
    render(): void;
    clear(): void;
    toDataURL(type?: string, quality?: any): string;
    toBlob(type?: string, quality?: any): Promise<Blob>;
    drawRoundRect(r: number): Promise<void>;
    destroy(): void;
}
export {};
