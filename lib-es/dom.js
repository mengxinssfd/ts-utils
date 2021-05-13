import { includes, unique } from "./array";
import { assign, forEachObj, pickByKeys } from "./object";
import { isArray, isString } from "./dataType";
import { isDom } from "./domType";
import { root } from "./common";
// 所有主要浏览器都支持 createElement() 方法
let elementStyle = document.createElement("div").style;
const vendor = (() => {
    let transformName = {
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
export function supportClassList() {
    // classList ie9以上支持
    return !!document.documentElement.classList;
}
function name2List(className) {
    if (!className)
        return [];
    let list = className;
    if (isString(className)) {
        list = [className.trim()];
    }
    return list.reduce((init, v, k) => {
        const split = v.trim().split(/ +/);
        init.push(...split);
        return init;
    }, []);
}
export function hasClassIe8(target, className) {
    const list = name2List(className);
    const originClass = target.className;
    const classList = originClass.split(/ +/);
    return list.every(i => includes(classList, i));
}
export function hasClassStandard(target, className) {
    const list = name2List(className);
    const classList = target.classList;
    return list.every(i => includes(classList, i));
}
/**
 * 判断是否有class  必须全都存在才为true
 */
export const hasClass = supportClassList() ? hasClassStandard : hasClassIe8;
export function addClassStandard(target, className) {
    const list = name2List(className);
    const classList = target.classList;
    list.forEach(i => classList.add(i));
    return target.className;
}
export function addClassIe8(target, className) {
    let names = name2List(className);
    const oldClass = target.className + " " + names.join(" ");
    names = oldClass.split(" ");
    names = unique(names);
    names = names.filter(it => Boolean(it));
    target.className = names.join(" ");
    return target.className;
}
export const addClass = supportClassList() ? addClassStandard : addClassIe8;
export function removeClassIe8(target, className) {
    const list = name2List(className);
    const classList = unique(target.className.split(/ +/).filter(i => {
        return !includes(list, i);
    }));
    return target.className = classList.join(" ");
}
export function removeClassStandard(target, className) {
    const list = name2List(className);
    list.forEach(i => {
        target.classList.remove(i);
    });
    return target.className;
}
export const removeClass = supportClassList() ? removeClassStandard : removeClassIe8;
export function toggleClass(target, className) {
    if (hasClass(target, className)) {
        return removeClass(target, className);
    }
    else {
        return addClass(target, className);
    }
}
/**
 * 判断是什么种类的浏览器并返回拼接前缀后的数据
 * @param style
 * @returns {string}
 */
export function prefixStyle(style) {
    if (vendor === false) {
        return false;
    }
    if (vendor === "standard") {
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
    }
    else {
        return false;
    }
}
/**
 * 手动添加img标签下载图片
 * @param url
 * @param [props = {}] img标签的属性
 */
export function loadImg(url, props = {}) {
    return new Promise(function (resolve, reject) {
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
            parent: null,
        });
        img.src = url;
    });
}
/**
 * 手动添加script
 * @param url
 * @param successFn {function?}
 * @param errorFn {function?}
 */
export function loadScript(url, successFn, errorFn) {
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
        cb(successFn, errorFn);
        return;
    }
    return new Promise(function (resolve, reject) {
        cb(resolve, reject);
    });
}
/**
 * @param [el = window]
 * @return {}
 */
export function noScroll(el = window) {
    let scroller = el;
    if (isString(el)) {
        scroller = document.querySelector(el);
        if (!scroller)
            throw new Error(`el not found`);
    }
    else if (el === window) {
        if (document.body.scrollTop) {
            scroller = document.body;
        }
        else {
            scroller = document.documentElement;
        }
    }
    const last = pickByKeys(scroller.style, ["marginTop", "overflow"]);
    const scrollTop = scroller.scrollTop;
    scroller.scrollTop = 0;
    scroller.style.overflow = "hidden";
    scroller.style.marginTop = (-scrollTop + scroller.style.marginTop) + "px";
    return function () {
        scroller.scrollTop = scrollTop;
        assign(scroller.style, last);
    };
}
/**
 * 通过object来生成html元素
 * @tips: attribute（特性），是我们赋予某个事物的特质或对象。property（属性），是早已存在的不需要外界赋予的特质。
 * @param tagName
 * @param params
 */
export function createHtmlElement(tagName, params = {}) {
    const el = document.createElement(tagName);
    const { attrs = {}, props = {}, parent, children } = params;
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
    forEachObj(attrs, (v, k, o) => {
        const isObjValue = typeof v === "object";
        el.setAttribute(k, isObjValue ? JSON.stringify(v) : v);
    });
    if (parent !== null) {
        if (isDom(parent)) {
            parent.appendChild(el);
        }
        else {
            document.body.appendChild(el);
        }
    }
    if (isArray(children)) {
        children.forEach(child => el.appendChild(child));
    }
    return el;
}
export const createElement = createHtmlElement;
/**
 * 获取文字缩放大小
 * 使用环境：微信浏览器调整文字大小，普通浏览器"ctr" + "+"无效
 * @param reverse
 * @return {number}
 */
export function getFontScale(reverse = false) {
    const fontSize = 10;
    const div = createElement("div", {
        props: { style: { fontSize: fontSize + "px" } },
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
export function inIframe() {
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
    return Boolean(root.self.frameElement && root.self.frameElement.tagName === "IFRAME"
        || root.frames.length !== parent.frames.length
        || root.self !== root.top);
}
