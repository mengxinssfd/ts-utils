import {assign} from "@/common";
import {isPromiseLike} from "./type";
import {loadImg} from "./dom";

type Location = {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
}

type Size = [number?, number?]

export class MergeImg {
    private _ctx?: CanvasRenderingContext2D;
    private canvas?: HTMLCanvasElement;
    private readonly parent: Element;

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

    async addImg(url: string, location?: Location, size?: Size): Promise<HTMLImageElement>
    async addImg(promiseImg: Promise<HTMLImageElement>, location?: Location, size?: Size): Promise<HTMLImageElement>
    async addImg(urlOrPromiseImg, location: Location = {}, size: Size = []) {
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
        dw = img.width;
        dh = img.height;

        // 1.如果设定了宽高，则以设定的宽高为准
        // 2.如果设定了left和right，宽=canvas宽 - left - right
        // 3.如果设定了top和bottom，高=canvas高 - top - bottom
        // 5.如果设定了left和right，没有设定top和bottom，也没设定size，则高按比例
        // 6.如果设定了top和bottom，没有设定left和right，也没设定size，则宽按比例
        // TODO 缺少了自动居中

        if (left !== undefined && right !== undefined) {
            x = left;
            if (size[0] === undefined) {
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
            if (size[1] === undefined) {
                dh = this.height - top - bottom;
            }
        } else if (top !== undefined) {
            y = top;
        } else if (bottom !== undefined) {
            y = this.height - bottom - dh;
        }

        ctx.drawImage(img, x, y, size[0] ?? dw, size[1] ?? dh);
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
