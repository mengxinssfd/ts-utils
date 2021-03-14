import { __awaiter } from "tslib";
import { assign } from "./common";
import { isPromiseLike } from "./type";
import { loadImg } from "./dom";
export class MergeImg {
    constructor(width = 0, height = 0) {
        this.width = width;
        this.height = height;
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
        this._ctx = canvas.getContext("2d");
        parent.appendChild(canvas);
    }
    get context() {
        return this._ctx;
    }
    // 根据背景图创建一个MergeImg类 好处是可以根据背景图宽高设置canvas宽高，不用再额外设置
    static createWithBg(url) {
        return __awaiter_1(this, void 0, void 0, function* () {
            const promise = loadImg(url);
            const img = yield promise;
            const mi = new MergeImg(img.width, img.height);
            yield mi.addImg(promise);
            return mi;
        });
    }
    addImg(urlOrPromiseImg, location = {}, size = []) {
        var _a, _b;
        return __awaiter_1(this, void 0, void 0, function* () {
            if (!this._ctx)
                throw new Error();
            let img;
            if (isPromiseLike(urlOrPromiseImg)) {
                img = yield urlOrPromiseImg;
            }
            else {
                img = yield loadImg(urlOrPromiseImg);
            }
            const ctx = this._ctx;
            let { left, top, right, bottom } = location;
            let dw;
            let dh;
            let x = 0;
            let y = 0;
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
            }
            else {
                if (left !== undefined) {
                    x = left;
                }
                else if (right !== undefined) {
                    x = this.width - right - dw;
                }
            }
            if (top !== undefined && bottom !== undefined) {
                y = top;
                if (size[1] === undefined) {
                    dh = this.height - top - bottom;
                }
            }
            else if (top !== undefined) {
                y = top;
            }
            else if (bottom !== undefined) {
                y = this.height - bottom - dh;
            }
            ctx.drawImage(img, x, y, (_a = size[0]) !== null && _a !== void 0 ? _a : dw, (_b = size[1]) !== null && _b !== void 0 ? _b : dh);
            return img;
        });
    }
    toDataURL(type = "image/png", quality) {
        if (!this.canvas)
            throw new Error();
        return this.canvas.toDataURL(type, quality);
    }
    toBlob(type = "image/png", quality) {
        const canvas = this.canvas;
        if (!canvas)
            throw new Error();
        return new Promise((resolve, reject) => {
            // canvas.toBlob ie10
            canvas.toBlob((blob) => {
                blob ? resolve(blob) : reject(blob);
            }, type, quality);
        });
    }
    dataURLToBlob(dataURL) {
        var _a;
        const arr = dataURL.split(",");
        const mime = ((_a = arr[0].match(/:(.*?);/)) !== null && _a !== void 0 ? _a : [])[1];
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
            throw new Error("destroyed");
        this.parent.removeChild(this.canvas);
        this.canvas = undefined;
        this._ctx = undefined;
    }
}
