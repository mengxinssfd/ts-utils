import { arrayRemoveItem, insertToArray } from "./array";
import { isImgElement } from "./domType";
import { assign } from "./object";
import { isNumber, isPromiseLike } from "./type";
import { loadImg, createElement } from "./dom";
let id = 0;
class Node {
    constructor(parent) {
        this.parent = parent;
        this.style = {};
        const style = parent instanceof MergeImg ? parent : parent.computedStyle;
        this.auto = {
            width: style.width,
            height: style.height,
        };
    }
    setStyle(style) {
        assign(this.style, style);
        this.computeStyle();
    }
    get root() {
        const parent = this.parent;
        if (parent instanceof MergeImg) {
            return parent;
        }
        return this.parent.root;
    }
    get ctx() {
        return this.parent.ctx;
    }
    render() {
        this.renderBackGround();
        this._render();
    }
    renderBackGround() {
        const { background } = this.style;
        if (!background)
            return;
        this.ctx.fillStyle = background;
        const { left, top, width, height } = this.computedStyle;
        this.ctx.fillRect(left, top, width, height);
    }
    computeStyle() {
        const { left, top, right, bottom, width, height, horizontalAlign, verticalAlign, zIndex, } = this.style;
        let dw;
        let dh;
        let x = 0;
        let y = 0;
        const parent = this.parent;
        const { width: w, height: h } = parent instanceof MergeImg ? parent : parent.computedStyle;
        dw = width || w;
        dh = height || h;
        // 1.如果设定了宽高，则以设定的宽高为准
        // 2.如果设定了left和right，宽=canvas宽 - left - right
        // 3.如果设定了top和bottom，高=canvas高 - top - bottom
        // 5.如果设定了left和right，没有设定top和bottom，也没设定size，则高按比例
        // 6.如果设定了top和bottom，没有设定left和right，也没设定size，则宽按比例
        if (left !== undefined && right !== undefined) {
            x = left;
            if (width === undefined) {
                dw = w - right - left;
            }
        }
        else {
            if (left !== undefined) {
                x = left;
            }
            else if (right !== undefined) {
                x = w - right - dw;
            }
        }
        if (top !== undefined && bottom !== undefined) {
            y = top;
            if (height === undefined) {
                dh = h - top - bottom;
            }
        }
        else if (top !== undefined) {
            y = top;
        }
        else if (bottom !== undefined) {
            y = h - bottom - dh;
        }
        if (width === "auto") {
            dw = this.auto.width;
        }
        if (height === "auto") {
            dh = this.auto.height;
        }
        if ((left === undefined || right === undefined) && horizontalAlign) {
            switch (horizontalAlign) {
                case "left":
                    x = 0;
                    break;
                case "middle":
                    x = ~~((w - dw) / 2);
                    break;
                case "right":
                    x = w - dw;
            }
        }
        if ((top === undefined || bottom === undefined) && verticalAlign) {
            switch (verticalAlign) {
                case "top":
                    y = 0;
                    break;
                case "middle":
                    y = ~~((h - dh) / 2);
                    break;
                case "bottom":
                    y = h - dh;
            }
        }
        if (!(parent instanceof MergeImg)) {
            const parentStyle = parent.computedStyle;
            x += parentStyle.left;
            y += parentStyle.top;
        }
        this.computedStyle = {
            width: dw,
            height: dh,
            zIndex: zIndex || 0,
            left: x,
            top: y,
        };
    }
}
class ImgElement extends Node {
    constructor(parent, style, content) {
        super(parent);
        this.content = content;
        this.id = id++;
        const img = content;
        const { width, height, } = style;
        let dw = width || img.width;
        let dh = height || img.height;
        if (width === "auto") {
            dw = ((dh / img.height) || 1) * img.width;
        }
        if (height === "auto") {
            dh = ((dw / img.width) || 1) * img.height;
        }
        this.auto = {
            width: dw,
            height: dh,
        };
        this.setStyle(style);
    }
    _render() {
        if (!this.ctx)
            throw new Error();
        const ctx = this.ctx;
        const s = this.computedStyle;
        ctx.drawImage(this.content, s.left, s.top, s.width, s.height);
    }
}
class Layer extends Node {
    constructor(parent, style) {
        super(parent);
        this.style = style;
        this.children = [];
        this.setStyle(style);
    }
    add(el) {
        var _a;
        el.style.zIndex = (_a = el.style.zIndex) !== null && _a !== void 0 ? _a : 0;
        const list = this.children;
        if (!list.length) {
            return this.children.push(el);
        }
        else {
            return insertToArray(el, (v, k) => {
                return v.style.zIndex <= el.style.zIndex || k === 0;
            }, list, { after: true, reverse: true });
        }
    }
    async addImg(urlOrPromiseImg, style = {}) {
        let img;
        if (isImgElement(urlOrPromiseImg)) {
            img = urlOrPromiseImg;
        }
        else if (isPromiseLike(urlOrPromiseImg)) {
            img = await urlOrPromiseImg;
        }
        else {
            img = await loadImg(urlOrPromiseImg);
        }
        const item = new ImgElement(this, style, img);
        const layer = this;
        const index = layer.add(item);
        if (layer.children.length === 1) {
            this.render();
        }
        else if (index !== layer.children.length - 1) {
            this.root.render();
        }
        else {
            item.render();
        }
        return item;
    }
    _render() {
        this.children.forEach(child => child.render());
    }
    remove(value) {
        if (isNumber(value)) {
            return this.children.splice(value, 1)[0];
        }
        return arrayRemoveItem(value, this.children);
    }
    clear() {
        this.children = [];
    }
}
export class MergeImg {
    /**
     * @param [width=0]
     * @param [height=0]
     */
    constructor(width = 0, height = 0) {
        this.width = width;
        this.height = height;
        this.layers = [];
        const parent = document.body;
        const canvas = createElement("canvas", {
            props: {
                style: {
                    height: height + "px",
                    width: width + "px",
                    // position: "fixed",
                    // left: "-10000px",
                    display: "none",
                },
                width,
                height,
            },
            parent,
        });
        this.canvas = canvas;
        this.parent = parent;
        this._ctx = canvas.getContext("2d");
        parent.appendChild(canvas);
        this.addLayer();
    }
    addLayer(style) {
        var _a;
        const layer = new Layer(this, assign({ width: this.width, height: this.height }, style));
        layer.style.zIndex = (_a = layer.style.zIndex) !== null && _a !== void 0 ? _a : 0;
        const list = this.layers;
        if (!list.length) {
            list.push(layer);
        }
        else {
            insertToArray(layer, (v, k) => {
                return v.style.zIndex <= layer.style.zIndex || k === 0;
            }, list, { after: true, reverse: true });
        }
        return layer;
    }
    get ctx() {
        return this._ctx;
    }
    // 根据背景图创建一个MergeImg类 好处是可以根据背景图宽高设置canvas宽高，不用再额外设置
    static async createWithBg(url) {
        const promise = loadImg(url);
        const img = await promise;
        const mi = new MergeImg(img.width, img.height);
        await mi.addLayer().addImg(promise);
        return mi;
    }
    render() {
        console.count("render count");
        this.clear();
        this.layers.forEach(layer => {
            layer.render();
        });
    }
    clear() {
        this._ctx.clearRect(0, 0, this.width, this.height);
    }
    // base64
    toDataURL(type = "image/png", quality) {
        if (!this.canvas)
            throw new Error();
        return this.canvas.toDataURL(type, quality);
    }
    // ie10不支持canvas.toBlob
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
    destroy() {
        if (!this.canvas)
            throw new Error("destroyed");
        this.parent.removeChild(this.canvas);
        this.layers = [];
        this.canvas = undefined;
        this._ctx = undefined;
    }
}
