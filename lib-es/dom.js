import { includes, unique } from "./array";
import { assign, forEachObj, pickByKeys } from "./object";
import { isArray, isString } from "./type";
import { isDom } from "./domType";
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
 */
export function loadImg(url) {
    return new Promise(function (resolve, reject) {
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
export function loadScript(url) {
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
/**
 * @param el
 * @return {}
 */
export function noScroll(el) {
    let target = el;
    if (isString(el)) {
        target = document.querySelector(el);
        if (!target)
            throw new Error(`el not found`);
    }
    else if (el === window) {
        if (document.documentElement.scrollTop) {
            target = document.documentElement;
        }
        else {
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
 * @tips: attribute（特性），是我们赋予某个事物的特质或对象。property（属性），是早已存在的不需要外界赋予的特质。
 * @param tagName
 * @param params
 */
export function createElement(tagName, params = {}) {
    const el = document.createElement(tagName);
    const { attrs = {}, props = {} } = params;
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
    const { parent, children } = params;
    if (parent !== false) {
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
/**
 * 获取文字缩放大小
 * 使用环境：微信浏览器调整文字大小，普通浏览器"ctr" + "+"无效
 * @param reverse
 * @return {number}
 */
export function getFontScale(reverse = false) {
    const fontSize = 10;
    const div = document.createElement("div");
    document.body.appendChild(div);
    div.style.fontSize = 10 + "px";
    const realFontSize = getComputedStyle(div).fontSize;
    document.body.removeChild(div);
    if (reverse) {
        return fontSize / parseInt(realFontSize);
    }
    return parseInt(realFontSize) / fontSize;
}
