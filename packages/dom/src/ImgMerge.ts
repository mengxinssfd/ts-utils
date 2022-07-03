import { isNumber, isPromiseLike, assign, arrayRemoveItem, insertToArray } from '@mxssfd/core';
import { isImgElement } from './domType';
import { loadImg, createElement } from './dom';

// TODO 加上百分比和rem
interface Style {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  width?: number | 'auto';
  height?: number | 'auto';
  zIndex?: number;
  verticalAlign?: 'top' | 'middle' | 'bottom';
  horizontalAlign?: 'left' | 'middle' | 'right';
  background?: string;
}

type Radius = number | [number, number, number, number];
type ImgStyle = Style & {
  radius?: Radius;
};

let id = 0;

type ComputedStyleExclude = 'verticalAlign' | 'horizontalAlign' | 'right' | 'bottom' | 'background';

abstract class Node {
  computedStyle!: { width: number; height: number } & Required<Omit<Style, ComputedStyleExclude>>;
  auto!: {
    width: number;
    height: number;
  };
  public style: Style = {};

  protected constructor(public parent: Node | MergeImg) {
    const style = parent instanceof MergeImg ? parent : parent.computedStyle;
    this.auto = {
      width: style.width,
      height: style.height,
    };
  }

  setStyle(style: Style) {
    assign(this.style, style);
    this.computeStyle();
  }

  get root(): MergeImg {
    const parent = this.parent;
    if (parent instanceof MergeImg) {
      return parent;
    }
    return (this.parent as Node).root;
  }

  get ctx() {
    return this.parent.ctx;
  }

  render() {
    this.renderBackGround();
    this._render();
  }

  protected renderBackGround() {
    const { background } = this.style;
    if (!background) return;
    this.ctx.fillStyle = background;
    const { left, top, width, height } = this.computedStyle;
    this.ctx.fillRect(left, top, width, height);
  }

  protected computeStyle() {
    const { left, top, right, bottom, width, height, horizontalAlign, verticalAlign, zIndex } =
      this.style;
    let dw: number;
    let dh: number;
    let x = 0;
    let y = 0;

    const parent = this.parent;
    const { width: w, height: h } = parent instanceof MergeImg ? parent : parent.computedStyle;

    dw = (width as number) || w;
    dh = (height as number) || h;

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
    } else {
      if (left !== undefined) {
        x = left;
      } else if (right !== undefined) {
        x = w - right - dw;
      }
    }

    if (top !== undefined && bottom !== undefined) {
      y = top;
      if (height === undefined) {
        dh = h - top - bottom;
      }
    } else if (top !== undefined) {
      y = top;
    } else if (bottom !== undefined) {
      y = h - bottom - dh;
    }

    if (width === 'auto') {
      dw = this.auto.width;
    }
    if (height === 'auto') {
      dh = this.auto.height;
    }

    if ((left === undefined || right === undefined) && horizontalAlign) {
      switch (horizontalAlign) {
        case 'left':
          x = 0;
          break;
        case 'middle':
          x = ~~((w - dw) / 2);
          break;
        case 'right':
          x = w - dw;
      }
    }

    if ((top === undefined || bottom === undefined) && verticalAlign) {
      switch (verticalAlign) {
        case 'top':
          y = 0;
          break;
        case 'middle':
          y = ~~((h - dh) / 2);
          break;
        case 'bottom':
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

  protected abstract _render();
}

class ImgElement extends Node {
  public declare style: ImgStyle;
  id!: number;

  constructor(parent: Node, style: ImgStyle, public content: HTMLImageElement) {
    super(parent);
    this.id = id++;
    const img = content;
    const { width, height } = style;
    let dw = (width as number) || img.width;
    let dh = (height as number) || img.height;

    if (width === 'auto') {
      dw = (dh / img.height || 1) * img.width;
    }
    if (height === 'auto') {
      dh = (dw / img.width || 1) * img.height;
    }

    this.auto = {
      width: dw,
      height: dh,
    };
    this.setStyle(style);
  }

  protected _render() {
    if (!this.ctx) throw new Error();
    const ctx = this.ctx;
    const s = this.computedStyle;
    ctx.drawImage(this.content, s.left, s.top, s.width, s.height);
  }
}

class Layer extends Node {
  declare parent: MergeImg;
  children: Node[] = [];

  constructor(parent: MergeImg, public style: Style) {
    super(parent);
    this.setStyle(style);
  }

  add(el: ImgElement) {
    el.style.zIndex = el.style.zIndex ?? 0;
    const list = this.children;
    if (!list.length) {
      return this.children.push(el);
    } else {
      return insertToArray(
        el,
        (v, k) => {
          return (v.style.zIndex as number) <= (el.style.zIndex as number) || k === 0;
        },
        list,
        { after: true, reverse: true },
      );
    }
  }

  async addImg(img: HTMLImageElement, style?: ImgStyle): Promise<ImgElement>;
  async addImg(url: string, style?: ImgStyle): Promise<ImgElement>;
  async addImg(promiseImg: Promise<HTMLImageElement>, style?: ImgStyle): Promise<ImgElement>;
  async addImg(urlOrPromiseImg, style: ImgStyle = {}) {
    let img: HTMLImageElement;
    if (isImgElement(urlOrPromiseImg)) {
      img = urlOrPromiseImg;
    } else if (isPromiseLike(urlOrPromiseImg as Promise<HTMLImageElement>)) {
      img = await urlOrPromiseImg;
    } else {
      img = await loadImg(urlOrPromiseImg);
    }
    const item = new ImgElement(this, style, img);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const layer = this;
    const index = layer.add(item);
    if (layer.children.length === 1) {
      this.render();
    } else if (index !== layer.children.length - 1) {
      this.root.render();
    } else {
      item.render();
    }

    return item;
  }

  protected _render() {
    this.children.forEach((child) => child.render());
  }

  remove(el: ImgElement): ImgElement | void;
  remove(index: number): ImgElement | void;
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
  private _ctx?: CanvasRenderingContext2D;
  private canvas?: HTMLCanvasElement;
  private readonly parent: Element;
  private layers: Layer[] = [];

  /**
   * @param [width=0]
   * @param [height=0]
   */
  constructor(readonly width = 0, readonly height = 0) {
    const parent = document.body;
    const canvas = createElement('canvas', {
      props: {
        style: {
          height: height + 'px',
          width: width + 'px',
          // position: "fixed",
          // left: "-10000px",
          display: 'none',
        },
        width,
        height,
      },
      parent,
    });
    this.canvas = canvas;
    this.parent = parent;
    this._ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    parent.appendChild(canvas);
    this.addLayer();
  }

  addLayer(style?: Style) {
    const layer = new Layer(this, assign({ width: this.width, height: this.height }, style));
    layer.style.zIndex = layer.style.zIndex ?? 0;
    const list = this.layers;
    if (!list.length) {
      list.push(layer);
    } else {
      insertToArray(
        layer,
        (v, k) => {
          return (v.style.zIndex as number) <= (layer.style.zIndex as number) || k === 0;
        },
        list,
        { after: true, reverse: true },
      );
    }
    return layer;
  }

  get ctx(): CanvasRenderingContext2D | void {
    return this._ctx;
  }

  // 根据背景图创建一个MergeImg类 好处是可以根据背景图宽高设置canvas宽高，不用再额外设置
  static async createWithBg(url: string): Promise<MergeImg> {
    const promise = loadImg(url);
    const img = await promise;
    const mi = new MergeImg(img.width, img.height);
    await mi.addLayer().addImg(promise);
    return mi;
  }

  render() {
    console.count('render count');
    this.clear();
    this.layers.forEach((layer) => {
      layer.render();
    });
  }

  clear() {
    this._ctx?.clearRect(0, 0, this.width, this.height);
  }

  // base64
  toDataURL(type = 'image/png', quality?: any): string {
    if (!this.canvas) throw new Error();
    return this.canvas.toDataURL(type, quality);
  }

  // ie10不支持canvas.toBlob
  toBlob(type = 'image/png', quality?: any): Promise<Blob> {
    const canvas = this.canvas;
    if (!canvas) throw new Error();
    return new Promise<Blob>((resolve, reject) => {
      // canvas.toBlob ie10
      canvas.toBlob(
        (blob) => {
          blob ? resolve(blob) : reject(blob);
        },
        type,
        quality,
      );
    });
  }

  // todo 可以作用于单个图片
  async drawRoundRect(r: number) {
    const img = await loadImg(this.toDataURL());
    const ctx = this.ctx as CanvasRenderingContext2D;
    this.clear();
    // 不能缩放图片
    const pattern = ctx.createPattern(img, 'no-repeat') as CanvasPattern;
    const x = 0;
    const y = 0;
    const w = this.width;
    const h = this.height;
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    // ctx.drawImage(img, x, y, w, h);

    // 如果要绘制一个圆，使用下面代码
    // context.arc(obj.width / 2, obj.height / 2, Math.max(obj.width, obj.height) / 2, 0, 2 * Math.PI);
    // 这里使用圆角矩形

    // 填充绘制的圆
    ctx.fillStyle = pattern;
    ctx.fill();
  }

  destroy() {
    if (!this.canvas) throw new Error('destroyed');
    this._ctx = undefined;
    this.layers = [];
    this.parent.removeChild(this.canvas);
    this.canvas = undefined;
  }
}
