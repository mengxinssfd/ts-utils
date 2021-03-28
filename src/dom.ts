import {includes, unique} from "./array";
import {assign, forEachObj, pickByKeys} from "./object";
import {isString} from "./type";
// 所有主要浏览器都支持 createElement() 方法
let elementStyle = document.createElement("div").style;
let vendor = ((): string | false => {
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
 * @returns {*}
 */
export function prefixStyle(style: string): string | false {
    if (vendor === false) {
        return false;
    }
    if (vendor === "transform") {
        return style;
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}

/**
 * 判断是否支持css
 * @param key
 * @param value
 * @returns {boolean}
 */
export function cssSupport(key, value) {
    if (key in elementStyle) {
        elementStyle[key] = value;
        return elementStyle[key] === value;
    } else {
        return false;
    }
}

/**
 * 手动添加img标签下载图片
 * @param url
 */
export function loadImg(url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>(function (resolve, reject) {
        const img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
            resolve(img);
        };
        img.onabort = img.onerror = (ev) => {
            reject(ev);
        };
        img.src = url;
    });
}

/**
 * 手动添加script
 * @param url
 */
export function loadScript(url: string): Promise<void> {
    return new Promise(function (resolve, reject) {
        const script = document.createElement("script");
        script.onload = () => resolve();
        script.onabort = script.onerror = (ev) => {
            reject(ev);
        };
        script.src = url;
        document.body.appendChild(script);
    });
}

export function noScroll(scrollContainer: Window | HTMLElement | string) {
    let target: HTMLElement = scrollContainer as HTMLElement;
    if (isString(scrollContainer)) {
        target = document.querySelector(scrollContainer) as HTMLElement;
        if (!target) throw new TypeError();
    } else if (scrollContainer === window) {
        if (document.documentElement.scrollTop) {
            target = document.documentElement;
        } else {
            target = document.body;
        }
    }

    const last = pickByKeys(target.style, ["marginTop", "overflow"]);
    const scrollTop = target.scrollTop;
    target.scrollTop = 0;
    target.style.overflow = "hidden";
    target.style.marginTop = -scrollTop + "px";
    return function () {
        target.scrollTop = scrollTop;
        assign(target.style, last);
    };
}

/**
 * 通过object来生成html元素
 * @param tagName
 * @param attribute
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, attribute: { [k: string]: any }): HTMLElementTagNameMap[K] {
    const el = document.createElement(tagName);
    forEachObj(attribute, (v, k, o) => {
        const isObjValue = typeof v === "object";
        if (k === "style" && isObjValue) {
            forEachObj(v, (value, key) => {
                el.style[key] = value;
            });
            return;
        }
        el.setAttribute(k as string, isObjValue ? JSON.stringify(v) : v);
    });
    return el;
}