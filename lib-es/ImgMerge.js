import { loadImg } from "./dom";
export class MergeImg {
    constructor(width, height) {
        this.width = width;
        this.height = height;
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
        this.ctx = canvas.getContext('2d');
        parent.appendChild(canvas);
    }
    async addImg(url, location, size) {
        if (!this.ctx)
            throw new Error();
        const img = await loadImg(url);
        const ctx = this.ctx;
        const [x, y] = location;
        let dw;
        let dh;
        if (size) {
            dw = size[0];
            dh = size[1];
        }
        else {
            dw = img.width;
            dh = img.height;
        }
        ctx.drawImage(img, x, y, dw, dh);
    }
    toDataURL(type = 'image/png') {
        if (!this.canvas)
            throw new Error();
        return this.canvas.toDataURL(type);
    }
    toBlob() {
        const arr = this.toDataURL().split(',');
        const mime = (arr[0].match(/:(.*?);/) ?? [])[1];
        const atob1 = window.atob(arr[1]);
        let n = atob1.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = atob1.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    destroy() {
        if (!this.canvas)
            throw new Error('destroyed');
        this.parent.removeChild(this.canvas);
        this.canvas = undefined;
        this.ctx = undefined;
    }
}
