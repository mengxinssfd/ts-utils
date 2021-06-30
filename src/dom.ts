import {includes, unique} from "./array";
import {assign, forEachObj, pickByKeys} from "./object";
import {SettableStyle, SettableProps} from "./TsTypes";
import {isArray, isString} from "./dataType";
import {isDom, isNodeList} from "./domType";
import {root} from "./common";
// 所有主要浏览器都支持 createElement() 方法
let elementStyle = document.createElement("div").style;
const vendor: string | false = (() => {
    let transformName: any = {
        webkit: "webkitTransform",
        Moz: "MozTransform",
        O: "OTransform",
        ms: "msTransform",
        standard: "transform",
    };
    for (let key in transformName) {
        if (elementStyle[transformName[key]] !== undefined) {
            return key;
        }
    }
    return false;
})();

export function supportClassList(): boolean {
    // classList ie9以上支持
    return !!document.documentElement.classList;
}

function name2List(className: string[] | string): string[] {
    if (!className) return [];
    let list = className as string[];
    if (isString(className)) {
        list = [className.trim()];
    }
    return list.reduce((init, v, k) => {
        const split = v.trim().split(/ +/);
        init.push(...split);
        return init;
    }, [] as string[]);
}

export function hasClassIe8(target: HTMLElement, className: string[] | string): boolean {
    const list = name2List(className);
    const originClass = target.className;
    const classList = originClass.split(/ +/);
    return list.every(i => includes(classList, i));
}

export function hasClassStandard(target: HTMLElement, className: string[] | string): boolean {
    const list = name2List(className);
    const classList = target.classList;
    return list.every(i => includes(classList, i));
}

/**
 * 判断是否有class  必须全都存在才为true
 */
export const hasClass: (target: HTMLElement, className: string[] | string) => boolean = supportClassList() ? hasClassStandard : hasClassIe8;

export function addClassStandard(target: HTMLElement, className: string[] | string): string {
    const list = name2List(className);
    const classList = target.classList;
    list.forEach(i => classList.add(i));

    return target.className;
}

export function addClassIe8(target: HTMLElement, className: string[] | string): string {
    let names = name2List(className);
    const oldClass = target.className + " " + names.join(" ");
    names = oldClass.split(" ");
    names = unique(names);
    names = names.filter(it => Boolean(it));
    target.className = names.join(" ");
    return target.className;
}

export const addClass: (target: HTMLElement, className: string[] | string) => string = supportClassList() ? addClassStandard : addClassIe8;

export function removeClassIe8(target: HTMLElement, className: string[] | string): string {
    const list = name2List(className);
    const classList = unique(target.className.split(/ +/).filter(i => {
            return !includes(list, i);
        },
    ));

    return target.className = classList.join(" ");
}

export function removeClassStandard(target: HTMLElement, className: string[] | string): string {
    const list = name2List(className);
    list.forEach(i => {
        target.classList.remove(i);
    });
    return target.className;
}

export const removeClass: (dom: HTMLElement, className: string[] | string) => string = supportClassList() ? removeClassStandard : removeClassIe8;

export function toggleClass(target: HTMLElement, className: string): string {
    if (hasClass(target, className)) {
        return removeClass(target, className);
    } else {
        return addClass(target, className);
    }
}

/**
 * 判断是什么种类的浏览器并返回拼接前缀后的数据
 * @param style
 * @returns {string}
 */
export function prefixStyle<T extends keyof CSSStyleDeclaration>(style: T): T | false {
    if (vendor === false) {
        return false;
    }
    if (vendor === "standard") {
        return style;
    }
    return vendor + (style as string).charAt(0).toUpperCase() + (style as string).substr(1) as any;
}

/**
 * 判断是否支持css
 * @param key
 * @param value
 * @returns {boolean}
 */
export function cssSupport<K extends keyof CSSStyleDeclaration, V extends CSSStyleDeclaration[K]>(key: K, value: V) {
    if (key in elementStyle) {
        elementStyle[key] = value;
        return elementStyle[key] === value;
    } else {
        return false;
    }
}

// export function setStyle(this: HTMLElement, style: SettableStyle);
// export function setStyle(style: SettableStyle, el: HTMLElement | string);
/**
 * @param style
 * @param el
 * @returns setStyle.bind(el)
 */
export function setStyle(style: SettableStyle, el?: HTMLElement | string): typeof setStyle {
    if (isString(el)) el = document.querySelector(el) as HTMLDivElement;
    let target: HTMLElement = el || this;
    if (!isDom(target)) throw new TypeError("setStyle param el | this is not HTMLElement");
    assign(target.style, style);
    return setStyle.bind(target);
}

/**
 * 手动添加img标签下载图片
 * @param url
 * @param [props = {}] img标签的属性
 */
export function loadImg(url: string, props: Partial<HTMLImageElement> = {}): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>(function (resolve, reject) {
        // const img = new Image();
        const onerror = (ev) => {
            reject(ev);
        };
        const img = createHtmlElement("img", {
            props: assign({
                // 不支持crossOrigin的浏览器（IE 10及以下版本不支持，Android 4.3 及以下版本不支持）
                // 可以使用 XMLHttprequest 和 URL.createObjectURL() 来做兼容
                // 不是所有的图片都支持 如http://gchat.qpic.cn/gchatpic_new/0/0-0-58CAD4E2605562E55627B37C15FACB65/0?term=2
                crossOrigin: "anonymous",
                onload() {
                    resolve(img);
                },
                onabort: onerror,
                onerror,
            }, props),
        });
        img.src = url;
    });
}

export function loadScript(url: string): Promise<HTMLScriptElement>;
export function loadScript<T extends (script: HTMLScriptElement) => void>(url: string, successFn: T, errorFn?: Function): void;
/**
 * 手动添加script
 * @param url
 * @param successFn {function?}
 * @param errorFn {function?}
 */
export function loadScript(url, successFn?, errorFn?) {
    const cb = (successFn, errorFn) => {
        const script = createElement("script", {
            props: {
                onload: () => successFn(script),
                onabort: errorFn,
                onerror: errorFn,
                src: url,
            },
            parent: document.body,
        });
    };
    if (successFn) {
        cb(successFn!, errorFn);
        return;
    }
    return new Promise(function (resolve, reject) {
        cb(resolve as any, reject);
    });
}

/**
 * @param [el = window]
 * @return {}
 */
export function noScroll(el: Window | HTMLElement | string = window) {
    let scroller: HTMLElement = el as HTMLElement;
    if (isString(el)) {
        scroller = document.querySelector(el) as HTMLElement;
        if (!scroller) throw new Error(`el not found`);
    } else if (el === window) {
        if (document.body.scrollTop) {
            scroller = document.body;
        } else {
            scroller = document.documentElement;
        }
    }

    const last = pickByKeys(getComputedStyle(scroller), ["marginTop", "overflow"]);
    const scrollTop = scroller.scrollTop;
    scroller.scrollTop = 0;
    scroller.style.overflow = "hidden";
    scroller.style.marginTop = (-scrollTop + parseInt(last.marginTop)) + "px";
    return function () {
        assign(scroller.style, last);
        // scrollTop必须最后传 否则可能不能回到原位
        scroller.scrollTop = scrollTop;
    };
}

/**
 * 通过object来生成html元素
 * @tips: attribute（特性），是我们赋予某个事物的特质或对象。property（属性），是早已存在的不需要外界赋予的特质。
 * @param tagName
 * @param params
 */
export function createHtmlElement<K extends keyof HTMLElementTagNameMap,
    R extends HTMLElementTagNameMap[K]>(
    tagName: K,
    params: {
        attrs?: { [k: string]: any };
        props?: SettableProps<R>;
        parent?: HTMLElement | string;
        children?: HTMLElement[] | NodeList
    } = {},
): R {
    const el = document.createElement(tagName);
    const {attrs = {}, props = {}, parent, children} = params;
    // set props
    forEachObj(props, (v, k, o) => {
        const isObjValue = typeof v === "object";
        if (k === "style" && isObjValue) {
            forEachObj(v, (value, key) => {
                el.style[key] = value;
            });
            return;
        }
        el[k] = v;
    });
    // set attrs
    forEachObj(attrs, (v, k, o) => {
        const isObjValue = typeof v === "object";
        el.setAttribute(k as string, isObjValue ? JSON.stringify(v) : v);
    });
    // set children
    if (isArray(children) || isNodeList(children)) {
        children.forEach(child => el.appendChild(child));
    }
    // set parent
    if (parent) {
        if (isDom(parent)) {
            parent.appendChild(el);
        } else if (isString(parent)) {
            const pr = document.querySelector(parent);
            if (!pr) throw new TypeError(`createHtmlElement param 'parent' => "${parent}" not founded`);
            pr.appendChild(el);
        }
    }
    return el as any;
}

/**
 * @alias createHtmlElement
 */
export const createElement = createHtmlElement;

export function createHiddenHtmlElement<E extends HTMLDivElement>(): E;
export function createHiddenHtmlElement<E extends HTMLDivElement>(props: SettableProps<E>): E;
export function createHiddenHtmlElement<K extends keyof HTMLElementTagNameMap, E extends HTMLElementTagNameMap[K]>(
    props: SettableProps<E>,
    tagName: K,
): E;
/**
 * 创建一个隐藏的html元素
 * @param props
 * @param tagName
 */
export function createHiddenHtmlElement(props?, tagName = "div") {
    return createHtmlElement(tagName as keyof HTMLElementTagNameMap, {
        props: {
            ...props,
            style: {
                position: "fixed",
                left: "-10000px",
                visibility: "hidden",
                ...props?.style,
            },
        },
        parent: document.body,
    });
}

/**
 * 获取文字缩放大小
 * 使用环境：微信浏览器调整文字大小，普通浏览器"ctr" + "+"无效,调整浏览器最小文字大小
 * @param reverse
 * @return {number}
 */
export function getFontScale(reverse = false) {
    const fontSize = 10;
    const div = createElement("div", {
        props: {style: {fontSize: fontSize + "px"}},
        parent: document.body,
    });
    const realFontSize = getComputedStyle(div).fontSize;
    document.body.removeChild(div);
    if (reverse) {
        return fontSize / parseInt(realFontSize);
    }
    return parseInt(realFontSize) / fontSize;
}

/**
 * 是否在iframe中
 */
export function inIframe(): boolean {
    /* // 方式1
     if (self.frameElement && self.frameElement.tagName == "IFRAME") {
         alert('在iframe中');
     }
     // 方式2
     if (window.frames.length != parent.frames.length) {
         alert('在iframe中');
     }
     // 方式3
     if (window.self != window.top) {
         alert('在iframe中');
     } */

    return Boolean(
        root.self.frameElement && root.self.frameElement.tagName === "IFRAME"
        || root.frames.length !== parent.frames.length
        || root.self !== root.top,
    );
}

/**
 * 判断是否固定在顶部的条件
 * @param target {HTMLElement}
 * @param {Function} cb
 * @param {number?} [top=0]
 * @param {HTMLElement|window} [container=window]
 * @return {function(): void}
 */
export function scrollFixedWatcher(
    target: HTMLElement,
    cb: (reach: boolean) => void,
    top = 0,
    container: HTMLElement | Window = window,
): () => void {
    const getScrollTop = container === window
        ? () => document.documentElement.scrollTop || document.body.scrollTop
        : () => (container as HTMLElement).scrollTop;

    const rect = target.getBoundingClientRect();
    const distanceTop = rect.top + getScrollTop() - top;
    let handler;
    // 立即判断一次
    cb(getScrollTop() >= distanceTop);
    container.addEventListener("scroll", handler = function () {
        // 当滑动距离大于等于分类距离顶部位置时，则固定定位
        cb(getScrollTop() >= distanceTop);
    });
    return function () {
        container.removeEventListener("scroll", handler);
    };
}

type Rem = "rem";
type Px = "rem";
type Percent = "rem";
type CSSLenUnit = Rem | Px | Percent;

interface CssLen {
    rem: `${number}${Rem}`,
    px: `${number}${Px}`,
    percent: `${number}${Percent}`
}

function get1rem() {
    return parseInt(getComputedStyle(document.documentElement).fontSize);
}

export function rem2px(rem: Pick<CssLen, 'rem'>): CssLen.px {
    const fs = get1rem();
    return fs * rem;
}
export function px2rem(px: CssLen.px): CssLen.rem {
    const fs = get1rem();
    return px / fs;
}

export function percent2px(p: CssLen.percent, relativePx: number): CssLen.rem {
    return relativePx * (num / 100);
}


function toPx(from: `${number}${CSSLenUnit}`, relativePx: number): number | string {
    const num = parseInt(from);
    if (/px$/.test(from)) return num;
    if (/rem$/.test(from)) {
        return rem2px(from);
    }
    if (/%$/.test(from)) {
        return relativePx * (num / 100);
    }
    return from;
}

function fromPx(px: number, to: CSSLenUnit, relativePx: number): string {
    switch (to) {
        case "px":
            return px + to;
        case "%":
            return (px / relativePx * 100) + to;
        case "rem":
            const fs = parseInt(getComputedStyle(document.documentElement).fontSize);
            return (px / fs).toFixed(2) + to;
    }
}

export function translateCssLenUnit(from: `${number}${Px | Rem}`, to: Px): string;
export function translateCssLenUnit(from: `${number}${Percent}`, to: Px | Rem, relativePx: number): string;
export function translateCssLenUnit(from: `${number}${(Px | Rem)}`, to: Percent, relativePx: number): string;
export function translateCssLenUnit(from: `${number}${CSSLenUnit}`, to: CSSLenUnit, relativePx: number): string {
    return "";
}

// translateCssLenUnit("100%", "rem");
// 管道语法
// "100px" |> ((_: any) => translateCssLenUnit(_, "rem"));