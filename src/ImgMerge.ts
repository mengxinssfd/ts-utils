import {arrayRemoveItem, insertToArray} from "./array";
import {isImgElement} from "./domType";
import {isNumber, isPromiseLike} from "./type";
import {loadImg, createElement} from "./dom";

// TODO 加上百分比和rem
type Style = {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    width?: number | "auto";
    height?: number | "auto";
    zIndex?: number;
    verticalAlign?: "top" | "middle" | "bottom";
    horizontalAlign?: "left" | "middle" | "right";
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
            return insertToArray(el, (v, k) => {
                return v.style.zIndex! <= el.style.zIndex! || k === 0;
            }, list, {after: true, reverse: true});
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
        const canvas = createElement("canvas", {
            props: {
                style: {
                    height: height + "px",
                    width: width + "px",
                    position: "fixed",
                    left: "-10000px",
                },
                width,
                height,
            },
            parent,
        });
        this.canvas = canvas;
        this.parent = parent;
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
            horizontalAlign,
            verticalAlign,
        } = item.style;
        let dw: number;
        let dh: number;
        let x: number = 0;
        let y: number = 0;
        dw = width as number || img.width;
        dh = height as number || img.height;

        // 1.如果设定了宽高，则以设定的宽高为准
        // 2.如果设定了left和right，宽=canvas宽 - left - right
        // 3.如果设定了top和bottom，高=canvas高 - top - bottom
        // 5.如果设定了left和right，没有设定top和bottom，也没设定size，则高按比例
        // 6.如果设定了top和bottom，没有设定left和right，也没设定size，则宽按比例

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

        if (width === "auto") {
            dw = ((dh / img.height) || 1) * img.width;
        }
        if (height === "auto") {
            dh = ((dw / img.width) || 1) * img.height;
        }

        if ((left === undefined || right === undefined) && horizontalAlign) {
            switch (horizontalAlign) {
                case "left":
                    x = 0;
                    break;
                case "middle":
                    x = ~~((this.width - dw) / 2);
                    break;
                case "right":
                    x = this.width - dw;
            }
        }
        if ((top === undefined || bottom === undefined) && verticalAlign) {
            switch (verticalAlign) {
                case "top":
                    y = 0;
                    break;
                case "middle":
                    y = ~~((this.height - dh) / 2);
                    break;
                case "bottom":
                    y = this.height - dh;
            }
        }

        ctx.drawImage(img, x, y, dw, dh);
    }

    reRender() {
        console.count();
        this.clear();
        this.layer.list.forEach(item => this.render(item));
    }

    clear() {
        this._ctx!.clearRect(0, 0, this.width, this.height);
    }

    async addImg(img: HTMLImageElement, style?: Style): Promise<HTMLImageElement>
    async addImg(url: string, style?: Style): Promise<HTMLImageElement>
    async addImg(promiseImg: Promise<HTMLImageElement>, style?: Style): Promise<HTMLImageElement>
    async addImg(urlOrPromiseImg, style: Style = {}) {
        let img: HTMLImageElement;
        if (isImgElement(urlOrPromiseImg)) {
            img = urlOrPromiseImg;
        } else if (isPromiseLike(urlOrPromiseImg as Promise<HTMLImageElement>)) {
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
