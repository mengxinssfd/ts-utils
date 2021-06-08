"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollFixedWatcher = exports.inIframe = exports.getFontScale = exports.createHiddenHtmlElement = exports.createElement = exports.createHtmlElement = exports.noScroll = exports.loadScript = exports.loadImg = exports.setStyle = exports.cssSupport = exports.prefixStyle = exports.toggleClass = exports.removeClass = exports.removeClassStandard = exports.removeClassIe8 = exports.addClass = exports.addClassIe8 = exports.addClassStandard = exports.hasClass = exports.hasClassStandard = exports.hasClassIe8 = exports.supportClassList = void 0;
const array_1 = require("./array");
const object_1 = require("./object");
const dataType_1 = require("./dataType");
const domType_1 = require("./domType");
const common_1 = require("./common");
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
function supportClassList() {
    // classList ie9以上支持
    return !!document.documentElement.classList;
}
exports.supportClassList = supportClassList;
function name2List(className) {
    if (!className)
        return [];
    let list = className;
    if (dataType_1.isString(className)) {
        list = [className.trim()];
    }
    return list.reduce((init, v, k) => {
        const split = v.trim().split(/ +/);
        init.push(...split);
        return init;
    }, []);
}
function hasClassIe8(target, className) {
    const list = name2List(className);
    const originClass = target.className;
    const classList = originClass.split(/ +/);
    return list.every(i => array_1.includes(classList, i));
}
exports.hasClassIe8 = hasClassIe8;
function hasClassStandard(target, className) {
    const list = name2List(className);
    const classList = target.classList;
    return list.every(i => array_1.includes(classList, i));
}
exports.hasClassStandard = hasClassStandard;
/**
 * 判断是否有class  必须全都存在才为true
 */
exports.hasClass = supportClassList() ? hasClassStandard : hasClassIe8;
function addClassStandard(target, className) {
    const list = name2List(className);
    const classList = target.classList;
    list.forEach(i => classList.add(i));
    return target.className;
}
exports.addClassStandard = addClassStandard;
function addClassIe8(target, className) {
    let names = name2List(className);
    const oldClass = target.className + " " + names.join(" ");
    names = oldClass.split(" ");
    names = array_1.unique(names);
    names = names.filter(it => Boolean(it));
    target.className = names.join(" ");
    return target.className;
}
exports.addClassIe8 = addClassIe8;
exports.addClass = supportClassList() ? addClassStandard : addClassIe8;
function removeClassIe8(target, className) {
    const list = name2List(className);
    const classList = array_1.unique(target.className.split(/ +/).filter(i => {
        return !array_1.includes(list, i);
    }));
    return target.className = classList.join(" ");
}
exports.removeClassIe8 = removeClassIe8;
function removeClassStandard(target, className) {
    const list = name2List(className);
    list.forEach(i => {
        target.classList.remove(i);
    });
    return target.className;
}
exports.removeClassStandard = removeClassStandard;
exports.removeClass = supportClassList() ? removeClassStandard : removeClassIe8;
function toggleClass(target, className) {
    if (exports.hasClass(target, className)) {
        return exports.removeClass(target, className);
    }
    else {
        return exports.addClass(target, className);
    }
}
exports.toggleClass = toggleClass;
/**
 * 判断是什么种类的浏览器并返回拼接前缀后的数据
 * @param style
 * @returns {string}
 */
function prefixStyle(style) {
    if (vendor === false) {
        return false;
    }
    if (vendor === "standard") {
        return style;
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
exports.prefixStyle = prefixStyle;
/**
 * 判断是否支持css
 * @param key
 * @param value
 * @returns {boolean}
 */
function cssSupport(key, value) {
    if (key in elementStyle) {
        elementStyle[key] = value;
        return elementStyle[key] === value;
    }
    else {
        return false;
    }
}
exports.cssSupport = cssSupport;
// export function setStyle(this: HTMLElement, style: SettableStyle);
// export function setStyle(style: SettableStyle, el: HTMLElement | string);
/**
 * @param style
 * @param el
 * @returns setStyle.bind(el)
 */
function setStyle(style, el) {
    if (dataType_1.isString(el))
        el = document.querySelector(el);
    let target = el || this;
    if (!domType_1.isDom(target))
        throw new TypeError("setStyle param el | this is not HTMLElement");
    object_1.assign(target.style, style);
    return setStyle.bind(target);
}
exports.setStyle = setStyle;
/**
 * 手动添加img标签下载图片
 * @param url
 * @param [props = {}] img标签的属性
 */
function loadImg(url, props = {}) {
    return new Promise(function (resolve, reject) {
        // const img = new Image();
        const onerror = (ev) => {
            reject(ev);
        };
        const img = createHtmlElement("img", {
            props: object_1.assign({
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
exports.loadImg = loadImg;
/**
 * 手动添加script
 * @param url
 * @param successFn {function?}
 * @param errorFn {function?}
 */
function loadScript(url, successFn, errorFn) {
    const cb = (successFn, errorFn) => {
        const script = exports.createElement("script", {
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
exports.loadScript = loadScript;
/**
 * @param [el = window]
 * @return {}
 */
function noScroll(el = window) {
    let scroller = el;
    if (dataType_1.isString(el)) {
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
    const last = object_1.pickByKeys(getComputedStyle(scroller), ["marginTop", "overflow"]);
    const scrollTop = scroller.scrollTop;
    scroller.scrollTop = 0;
    scroller.style.overflow = "hidden";
    scroller.style.marginTop = (-scrollTop + parseInt(last.marginTop)) + "px";
    return function () {
        object_1.assign(scroller.style, last);
        // scrollTop必须最后传 否则可能不能回到原位
        scroller.scrollTop = scrollTop;
    };
}
exports.noScroll = noScroll;
/**
 * 通过object来生成html元素
 * @tips: attribute（特性），是我们赋予某个事物的特质或对象。property（属性），是早已存在的不需要外界赋予的特质。
 * @param tagName
 * @param params
 */
function createHtmlElement(tagName, params = {}) {
    const el = document.createElement(tagName);
    const { attrs = {}, props = {}, parent, children } = params;
    // set props
    object_1.forEachObj(props, (v, k, o) => {
        const isObjValue = typeof v === "object";
        if (k === "style" && isObjValue) {
            object_1.forEachObj(v, (value, key) => {
                el.style[key] = value;
            });
            return;
        }
        el[k] = v;
    });
    // set attrs
    object_1.forEachObj(attrs, (v, k, o) => {
        const isObjValue = typeof v === "object";
        el.setAttribute(k, isObjValue ? JSON.stringify(v) : v);
    });
    // set children
    if (dataType_1.isArray(children) || domType_1.isNodeList(children)) {
        children.forEach(child => el.appendChild(child));
    }
    // set parent
    if (parent) {
        if (domType_1.isDom(parent)) {
            parent.appendChild(el);
        }
        else if (dataType_1.isString(parent)) {
            const pr = document.querySelector(parent);
            if (!pr)
                throw new TypeError(`createHtmlElement param 'parent' => "${parent}" not founded`);
            pr.appendChild(el);
        }
    }
    return el;
}
exports.createHtmlElement = createHtmlElement;
/**
 * @alias createHtmlElement
 */
exports.createElement = createHtmlElement;
/**
 * 创建一个隐藏的html元素
 * @param props
 * @param tagName
 */
function createHiddenHtmlElement(props, tagName = "div") {
    return createHtmlElement(tagName, {
        props: Object.assign(Object.assign({}, props), { style: Object.assign({ position: "fixed", left: "-10000px", visibility: "hidden" }, props === null || props === void 0 ? void 0 : props.style) }),
        parent: document.body,
    });
}
exports.createHiddenHtmlElement = createHiddenHtmlElement;
/**
 * 获取文字缩放大小
 * 使用环境：微信浏览器调整文字大小，普通浏览器"ctr" + "+"无效,调整浏览器最小文字大小
 * @param reverse
 * @return {number}
 */
function getFontScale(reverse = false) {
    const fontSize = 10;
    const div = exports.createElement("div", {
        props: { style: { fontSize: fontSize + "px" } },
        parent: document.body,
    });
    const realFontSize = getComputedStyle(div).fontSize;
    document.body.removeChild(div);
    if (reverse) {
        return fontSize / parseInt(realFontSize);
    }
    return parseInt(realFontSize) / fontSize;
}
exports.getFontScale = getFontScale;
/**
 * 是否在iframe中
 */
function inIframe() {
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
    return Boolean(common_1.root.self.frameElement && common_1.root.self.frameElement.tagName === "IFRAME"
        || common_1.root.frames.length !== parent.frames.length
        || common_1.root.self !== common_1.root.top);
}
exports.inIframe = inIframe;
/**
 * 判断是否固定在顶部的条件
 * @param target {HTMLElement}
 * @param {Function} cb
 * @param {number?} [top=0]
 * @param {HTMLElement|window} [container=window]
 * @return {function(): void}
 */
function scrollFixedWatcher(target, cb, top = 0, container = window) {
    const getScrollTop = container === window
        ? () => document.documentElement.scrollTop || document.body.scrollTop
        : () => container.scrollTop;
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
exports.scrollFixedWatcher = scrollFixedWatcher;
