import {Point} from "./coordinate";
import {loadImg} from "./dom";
import {isPromiseLike} from "type";

type Location = {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number
}

export class MergeImg {
    private _ctx?: CanvasRenderingContext2D;
    private canvas?: HTMLCanvasElement;
    private readonly parent: Element;

    constructor(readonly width = 0, readonly height = 0) {
        const parent = document.body;
        const canvas = document.createElement("canvas");
        this.canvas = canvas;
        this.parent = parent;
        Object.assign(canvas.style, {
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

    async addImg(url: string, location?: Location, size?: Point): Promise<HTMLImageElement>
    async addImg(promiseImg: Promise<HTMLImageElement>, location?: Location, size?: Point): Promise<HTMLImageElement>
    async addImg(urlOrPromiseImg, location: Location = {}, size?) {
        if (!this._ctx) throw new Error();
        let img: HTMLImageElement;
        if (isPromiseLike(urlOrPromiseImg as Promise<HTMLImageElement>)) {
            img = await urlOrPromiseImg;
        } else {
            img = await loadImg(urlOrPromiseImg);
        }
        const ctx = this._ctx;
        let {left, top, right, bottom} = location;
        let dw: number;
        let dh: number;
        let x: number = 0;
        let y: number = 0;
        if (size) {
            dw = size[0];
            dh = size[1];
        } else {
            dw = img.width;
            dh = img.height;
        }
        // TODO 未完成
        if (left !== undefined && right !== undefined) {
            x = left;
            if (!size) {
                dw = this.width - right - left;
            }
        } else if (left !== undefined) {
            x = left;
        } else if (right !== undefined) {
            x = this.width - right - dw;
        }

        if (top !== undefined && bottom !== undefined) {
            y = top;
            if (!size) {
                dw = this.height - top - bottom;
            }
        } else if (top !== undefined) {

        } else if (bottom !== undefined) {

        }

        ctx.drawImage(img, x, y, dw, dh);
        return img;
    }

    toDataURL(type = "image/png", quality?: any): string {
        if (!this.canvas) throw new Error();
        return this.canvas.toDataURL(type, quality);
    }

    toBlob(type = "image/png", quality?: any): Promise<Blob> {
        const canvas = this.canvas;
        if (!canvas) throw new Error();
        return new Promise((resolve, reject) => {
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
