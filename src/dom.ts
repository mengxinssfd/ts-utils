// 所有主要浏览器都支持 createElement() 方法
import {isArray, isFunction, typeOf} from "common";

let elementStyle = document.createElement('div').style;
let vendor = ((): string | false => {
    let transformName: any = {
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
export const isDom: (target: any) => target is HTMLElement = (function () {
    // HTMLElement ie8以上支持 此类库不支持ie8及以下所以意义不是很大
    return (typeof HTMLElement === 'object') ?
        function (target: any): target is HTMLElement {
            return target instanceof HTMLElement;
        } :
        function (target: any): target is HTMLElement {
            return target && typeof target === 'object' && target.nodeType === 1 && typeof target.nodeName === 'string';
        };
})();
export const addClass: (target: HTMLElement, className: string | string[]) => string = (function () {
    // classList ie9以上支持
    return !!document.documentElement.classList ? function (target: HTMLElement, className: string | string[]) {
        target.classList.add(...Array.isArray(className) ? className : [className]);
        return target.className;
    } : function (target: HTMLElement, className: string | string[]) {
        const originClass = target.className;
        const originClassArr = originClass.split(" ");
        className = Array.isArray(className) ? className : [className];
        // [...new Set(array)] ts不支持这种格式 只能使用Array.from替代
        className = Array.from(new Set(className));
        className = className.filter(cname => !originClassArr.includes(cname));
        if (!className.length) return originClass;
        className = className.join(" ");
        target.className = !!originClass ? originClass + " " + className : className;
        return target.className;
    };
})();

export function removeClass(dom: any, className: string): string {
    if (dom.classList) {
        dom.classList.remove(className);
    } else {
        dom.className = dom.className.replace(new RegExp('(^|\\s)' + className + '(\\s|$)', "gi"), "");
    }
    return dom.className;
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
export function eventProxy(
    containerEl: string | HTMLElement | null,
    eventType: string,
    targetEl: string | HTMLElement,
    callback: (e: Event) => void,
): null | (() => void) {
    let containsDom: HTMLElement | null;
    if (!containerEl) {
        containsDom = document.documentElement;
    } else if (isDom(containerEl)) {
        containsDom = containerEl;
    } else {
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
        (containsDom as HTMLElement).removeEventListener(eventType, handle);
    };
}

/**
 * 一次性事件
 * @param el
 * @param eventType
 * @param callback
 * @param capture 捕获还是冒泡，默认冒泡
 */
export function onceEvent(
    el: Window | HTMLElement | string | null | undefined,
    eventType: string,
    callback: (e: Event) => false | undefined,
    capture = false,
) {
    let dom: HTMLElement | Window | null = el as HTMLElement;
    if (typeOf(el) === "string") {
        dom = document.querySelector(<string>el) as HTMLElement;
        if (!dom) {
            throw new Error("element not found!");
        }
    } else {
        dom = window;
    }
    let handler = (e) => {
        let istRemove: false | undefined = false;
        if (callback && isFunction(callback)) {
            // callback 返回false的时候不remove事件
            istRemove = callback(e);
        }
        // 移除的时候也要带上捕获还是冒泡
        (istRemove !== false) && (<HTMLElement>dom).removeEventListener(eventType, handler, capture);
    };
    // 使用捕获优先度高，冒泡的话会在同一个事件里执行
    dom.addEventListener(eventType, handler, capture);
}

// TODO 未完成
type xy = { x: number, y: number }

export function dragEvent({el, onDown, onMove, onUp, capture = false}: {
    el: string | HTMLElement | undefined | null,
    onDown: (e: MouseEvent | TouchEvent, downXY: xy) => void,
    onMove: (e: MouseEvent | TouchEvent, moveXY: xy, lastXY: xy, downXY: xy) => void,
    onUp: (e: MouseEvent | TouchEvent, downXY: xy, upXY: xy) => void,
    capture: boolean,
}) {
    let dom: HTMLElement | Window = el as HTMLElement;
    if (typeOf(el) === "string") {
        dom = document.querySelector(<string>el) as HTMLElement;
        if (!dom) {
            throw new Error("element not found!");
        }
    } else {
        dom = window;
    }
    let lastXY: xy = {x: 0, y: 0};
    let downXY: xy = {x: 0, y: 0};

    function getXY(e: MouseEvent | TouchEvent): xy {
        let xY: xy;
        const touches = (e as TouchEvent).touches;
        if (touches && isArray(touches) && touches.length) {
            const touch = touches[0];
            xY = {x: touch.screenX, y: touch.screenY};
        } else {
            const {screenX, screenY} = e as MouseEvent;
            xY = {x: screenX, y: screenY};
        }
        return xY;
    }

    function move(e: MouseEvent | TouchEvent) {
        const moveXY = getXY(e);
        if (onMove && isFunction(onMove)) {
            onMove.call(this, e, moveXY, lastXY, downXY);
        }
        lastXY = moveXY;
    }

    function up(e: MouseEvent | TouchEvent) {
        const upXY = getXY(e);
        lastXY = upXY;
        if (onUp && isFunction(onUp)) {
            onUp.call(this, e, downXY, upXY);
        }
        dom.removeEventListener("mousemove", move, capture);
        dom.removeEventListener("mouseup", up, capture);
        dom.removeEventListener("touchmove", move, capture);
        dom.removeEventListener("touchend", up, capture);
        dom.removeEventListener("touchcancel", up, capture);
    }

    function mousedown(event: MouseEvent) {
        downXY = getXY(event);
        dom.addEventListener("mousemove", move, capture);
        dom.addEventListener("mouseup", up, capture);
    }

    function touchStart(event: TouchEvent) {
        downXY = getXY(event);
        dom.addEventListener("touchmove", move, capture);
        dom.addEventListener("touchend", up, capture);
        dom.addEventListener("touchcancel", up, capture);
    }

    dom.addEventListener("mousedown", mousedown, capture);
    dom.addEventListener("touchstart", touchStart, capture);
    return function () {
        dom.removeEventListener("mousedown", mousedown, capture);
        dom.removeEventListener("touchstart", touchStart, capture);
    };
}