// 所有主要浏览器都支持 createElement() 方法
import { isFunction, isString, typeOf } from "./common";
let elementStyle = document.createElement('div').style;
let vendor = (() => {
    let transformName = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'transform',
    };
    for (let key in transformName) {
        if (elementStyle[transformName[key]] !== undefined) {
            return key;
        }
    }
    return false;
})();
export const isDom = (function () {
    // HTMLElement ie8以上支持 此类库不支持ie8及以下所以意义不是很大
    return (typeof HTMLElement === 'object') ?
        function (target) {
            return target instanceof HTMLElement;
        } :
        function (target) {
            return target && typeof target === 'object' && target.nodeType === 1 && typeof target.nodeName === 'string';
        };
})();
export const addClass = (function () {
    // classList ie9以上支持
    return !!document.documentElement.classList ? function (target, className) {
        target.classList.add(...Array.isArray(className) ? className : [className]);
        return target.className;
    } : function (target, className) {
        const originClass = target.className;
        const originClassArr = originClass.split(" ");
        className = Array.isArray(className) ? className : [className];
        // [...new Set(array)] ts不支持这种格式 只能使用Array.from替代
        className = Array.from(new Set(className));
        className = className.filter(cname => !originClassArr.includes(cname));
        if (!className.length)
            return originClass;
        className = className.join(" ");
        target.className = !!originClass ? originClass + " " + className : className;
        return target.className;
    };
})();
export function removeClass(dom, className) {
    if (dom.classList) {
        dom.classList.remove(className);
    }
    else {
        dom.className = dom.className.replace(new RegExp('(^|\\s)' + className + '(\\s|$)', "gi"), "");
    }
    return dom.className;
}
/**
 * 判断是什么种类的浏览器并返回拼接前缀后的数据
 * @param style
 * @returns {*}
 */
export function prefixStyle(style) {
    if (vendor === false) {
        return false;
    }
    if (vendor === 'transform') {
        return style;
    }
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
/**
 * 事件代理
 * @param containerEl
 * @param eventType
 * @param targetEl
 * @param callback
 */
export function eventProxy(containerEl, eventType, targetEl, callback) {
    let containsDom;
    if (!containerEl) {
        containsDom = document.documentElement;
    }
    else if (isDom(containerEl)) {
        containsDom = containerEl;
    }
    else {
        containsDom = document.querySelector(containerEl);
    }
    function handle(e) {
        e = e || window.event;
        // TODO 通过document.querySelectorAll匹配  并且该函数被滥用的话，会有性能问题
        let targetDom = isDom(targetEl) ? [targetEl] : Array.from(document.querySelectorAll(targetEl));
        if (targetDom.includes(e.target)) {
            callback(e);
        }
    }
    // document.querySelector未查找到dom的情况
    if (containsDom === null) {
        return null;
    }
    containsDom.addEventListener(eventType, handle);
    return function () {
        containsDom.removeEventListener(eventType, handle);
    };
}
/**
 * 一次性事件
 * @param el
 * @param eventType
 * @param callback
 * @param capture 捕获还是冒泡，默认冒泡
 */
export function onceEvent(el, eventType, callback, capture = false) {
    let dom = el;
    if (typeOf(el) === "string") {
        dom = document.querySelector(el);
        if (!dom) {
            throw new Error("element not found!");
        }
    }
    else {
        dom = window;
    }
    let handler = (e) => {
        let istRemove = false;
        if (callback && isFunction(callback)) {
            // callback 返回false的时候不remove事件
            istRemove = callback(e);
        }
        // 移除的时候也要带上捕获还是冒泡
        (istRemove !== false) && dom.removeEventListener(eventType, handler, capture);
    };
    // 使用捕获优先度高，冒泡的话会在同一个事件里执行
    dom.addEventListener(eventType, handler, capture);
}
/**
 * 拖动事件 返回取消事件
 */
export function addDragEventListener({ el, onDown, onMove, onUp, capture = { down: false, up: true, move: false } }) {
    let dom = el;
    if (!isDom(el)) {
        if (isString(el)) {
            dom = document.querySelector(el);
            if (!dom) {
                throw new Error("element not found!");
            }
        }
        else {
            dom = window;
        }
    }
    let lastXY = { x: 0, y: 0 };
    let downXY = { x: 0, y: 0 };
    // mouse获取xy
    function getXYWithMouse(e) {
        const { screenX, screenY } = e;
        const xY = { x: screenX, y: screenY };
        xY.x = ~~xY.x;
        xY.y = ~~xY.y;
        return xY;
    }
    // touch获取xy
    function getXYWithTouch(e) {
        const touches = e.changedTouches;
        const touch = touches[0];
        const xY = { x: touch.clientX, y: touch.clientY };
        xY.x = ~~xY.x;
        xY.y = ~~xY.y;
        return xY;
    }
    let getXY;
    // touch与mouse通用按下事件处理
    function down(event, mouseOrTouch) {
        getXY = mouseOrTouch === "mouse" ? getXYWithMouse : getXYWithTouch;
        downXY = getXY(event);
        lastXY = downXY;
        let backVal = void 0;
        if (onDown && isFunction(onDown)) {
            backVal = onDown.call(this, event, downXY, downXY);
        }
        return backVal;
    }
    // touch与mouse通用移动事件处理
    function move(e) {
        const moveXY = getXY(e);
        let backVal = void 0;
        if (onMove && isFunction(onMove)) {
            backVal = onMove.call(this, e, moveXY, lastXY, downXY);
        }
        lastXY = moveXY;
        return backVal;
    }
    // touch与mouse通用移开事件处理
    function up(e) {
        // console.log("up", e);
        const upXY = getXY(e);
        let backVal = void 0;
        lastXY = upXY;
        if (onUp && isFunction(onUp)) {
            backVal = onUp.call(this, e, upXY, downXY);
        }
        removeMoveAndUpEventListener();
        return backVal;
    }
    // 移除touch与mouse 的move与up事件
    function removeMoveAndUpEventListener() {
        window.removeEventListener("mousemove", move, capture.move);
        window.removeEventListener("mouseup", up, capture.up);
        window.removeEventListener("touchmove", move, capture.move);
        window.removeEventListener("touchend", up, capture.up);
        window.removeEventListener("touchcancel", up, capture.up);
    }
    // 移除全部事件
    function removeAllEventListener() {
        dom.removeEventListener("mousedown", mousedown, capture.down);
        dom.removeEventListener("touchstart", touchStart, capture.down);
        removeMoveAndUpEventListener();
    }
    function mousedown(event) {
        const backVal = down.call(this, event, "mouse");
        window.addEventListener("mousemove", move, capture.move);
        window.addEventListener("mouseup", up, capture.up);
        return backVal;
    }
    function touchStart(event) {
        const backVal = down.call(this, event, "touch");
        window.addEventListener("touchmove", move, capture.move);
        window.addEventListener("touchend", up, capture.up);
        window.addEventListener("touchcancel", up, capture.up);
        return backVal;
    }
    dom.addEventListener("mousedown", mousedown, capture.down);
    dom.addEventListener("touchstart", touchStart, capture.down);
    // 返回取消全部事件函数
    return removeAllEventListener;
}
