import {arrayRemoveItem, insertToArrayRight} from "./array";
import {assign} from "./object";
import {isNumber, isPromiseLike} from "./type";
import {loadImg} from "./dom";

type Style = {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    width?: number;
    height?: number;
    zIndex?: number;
}
let id = 0;

class LayerElement {
    id!: number;

    constructor(public style: Style, public content: HTMLImageElement) {
        this.id = id++;
    }
}

class Layer {
    list: LayerElement[] = [];

    add(el: LayerElement) {
        el.style.zIndex = el.style.zIndex ?? 0;
        const list = this.list;
        if (!list.length) {
            return this.list.push(el);
        } else {
            return insertToArrayRight(el, (v, k) => {
                return v.style.zIndex! <= el.style.zIndex! || k === 0;
            }, list, true);
        }
    }

    remove(el: LayerElement): LayerElement | void
    remove(index: number): LayerElement | void
    remove(value) {
        if (isNumber(value)) {
            return this.list.splice(value, 1)[0];
        }

        return arrayRemoveItem(value, this.list);
    }

    clear() {
        this.list = [];
    }
}

export class MergeImg {
    private _ctx?: CanvasRenderingContext2D;
    private canvas?: HTMLCanvasElement;
    private readonly parent: Element;
    private layer = new Layer();

    constructor(readonly width = 0, readonly height = 0) {
        const parent = document.body;
        const canvas = document.createElement("canvas");
        this.canvas = canvas;
        this.parent = parent;
        assign(canvas.style, {
            height: height + "px",
            width: width + "px",
            position: "fixed",
            left: "-10000px",
        });
        canvas.width = width;
        canvas.height = height;
        this._ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        parent.appendChild(canvas);
    }

    get context(): CanvasRenderingContext2D | void {
        return this._ctx;
    }

    // 根据背景图创建一个MergeImg类 好处是可以根据背景图宽高设置canvas宽高，不用再额外设置
    static async createWithBg(url: string): Promise<MergeImg> {
        const promise = loadImg(url);
        const img = await promise;
        const mi = new MergeImg(img.width, img.height);
        await mi.addImg(promise);
        return mi;
    }

    render(item: LayerElement) {
        if (!this._ctx) throw new Error();
        const ctx = this._ctx;
        const img = item.content;
        const {
            left,
            top,
            right,
            bottom,
            width,
            height,
        } = item.style;
        let dw: number;
        let dh: number;
        let x: number = 0;
        let y: number = 0;
        dw = width || img.width;
        dh = height || img.height;

        // 1.如果设定了宽高，则以设定的宽高为准
        // 2.如果设定了left和right，宽=canvas宽 - left - right
        // 3.如果设定了top和bottom，高=canvas高 - top - bottom
        // 5.如果设定了left和right，没有设定top和bottom，也没设定size，则高按比例
        // 6.如果设定了top和bottom，没有设定left和right，也没设定size，则宽按比例
        // TODO 缺少了自动居中

        if (left !== undefined && right !== undefined) {
            x = left;
            if (width === undefined) {
                dw = this.width - right - left;
            }
        } else {
            if (left !== undefined) {
                x = left;
            } else if (right !== undefined) {
                x = this.width - right - dw;
            }
        }

        if (top !== undefined && bottom !== undefined) {
            y = top;
            if (height === undefined) {
                dh = this.height - top - bottom;
            }
        } else if (top !== undefined) {
            y = top;
        } else if (bottom !== undefined) {
            y = this.height - bottom - dh;
        }

        ctx.drawImage(img, x, y, width ?? dw, height ?? dh);
    }

    reRender() {
        console.count();
        this.clear();
        this.layer.list.forEach(item => this.render(item));
    }

    clear() {
        this._ctx!.clearRect(0, 0, this.width, this.height);
    }

    async addImg(url: string, style?: Style): Promise<HTMLImageElement>
    async addImg(promiseImg: Promise<HTMLImageElement>, style?: Style): Promise<HTMLImageElement>
    async addImg(urlOrPromiseImg, style: Style = {}) {
        let img: HTMLImageElement;
        if (isPromiseLike(urlOrPromiseImg as Promise<HTMLImageElement>)) {
            img = await urlOrPromiseImg;
        } else {
            img = await loadImg(urlOrPromiseImg);
        }
        const item = new LayerElement(style, img);
        if (this.layer.add(item) !== this.layer.list.length - 1) {
            this.reRender();
        } else {
            this.render(item);
        }

        return img;
    }

    toDataURL(type = "image/png", quality?: any): string {
        if (!this.canvas) throw new Error();
        return this.canvas.toDataURL(type, quality);
    }

    toBlob(type = "image/png", quality?: any): Promise<Blob> {
        const canvas = this.canvas;
        if (!canvas) throw new Error();
        return new Promise<Blob>((resolve, reject) => {
            // canvas.toBlob ie10
            canvas.toBlob((blob) => {
                blob ? resolve(blob) : reject(blob);
            }, type, quality);
        });
    }

    dataURLToBlob(dataURL: string): Blob {
        const arr: string[] = dataURL.split(",");
        const mime = (arr[0].match(/:(.*?);/) ?? [])[1];
        const atob1 = window.atob(arr[1]);
        let n = atob1.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = atob1.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
    }

    destroy() {
        if (!this.canvas) throw new Error("destroyed");
        this.parent.removeChild(this.canvas);
        this.canvas = undefined;
        this._ctx = undefined;
    }
}
