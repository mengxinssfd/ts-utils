import {Point} from "./coordinate";
import {loadImg} from "./dom";

export class MergeImg {
    private _ctx?: CanvasRenderingContext2D;
    private canvas?: HTMLCanvasElement;
    private readonly parent: Element;

    constructor(readonly width = 0, readonly height = 0) {
        const parent = document.body;
        const canvas = document.createElement('canvas');
        this.canvas = canvas;
        this.parent = parent;
        Object.assign(canvas.style, {
            height: height + 'px',
            width: width + 'px',
            position: 'fixed',
            left: '-10000px',
        });
        canvas.width = width;
        canvas.height = height;
        this._ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        parent.appendChild(canvas);
    }

    get context(): CanvasRenderingContext2D | void {
        return this._ctx;
    }

    async setBg(url: string) {
        if (!this._ctx || !this.canvas) throw new Error();
        const img = await loadImg(url);
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this._ctx.drawImage(img, 0, 0, img.width, img.height);
    }

    async addImg(url: string, location: Point, size?: Point) {
        if (!this._ctx) throw new Error();
        const img = await loadImg(url);
        const ctx = this._ctx;
        const [x, y] = location;
        let dw: number;
        let dh: number;
        if (size) {
            dw = size[0];
            dh = size[1];
        } else {
            dw = img.width;
            dh = img.height;
        }
        ctx.drawImage(img, x, y, dw, dh);
    }

    toDataURL(type = 'image/png', quality?: any): string {
        if (!this.canvas) throw new Error();
        return this.canvas.toDataURL(type, quality);
    }

    toBlob(type = 'image/png', quality?: any): Promise<Blob> {
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
        const arr: string[] = dataURL.split(',');
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
        if (!this.canvas) throw new Error('destroyed');
        this.parent.removeChild(this.canvas);
        this.canvas = undefined;
        this._ctx = undefined;
    }
}