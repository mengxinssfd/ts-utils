import {filter, includes, unique} from "@/array";
import {assign, forEachObj, pickByKeys, typeOf} from "./common";
import {isArray, isFunction, isString} from "./type";
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
export const isDom: (target: any) => target is HTMLElement = (function () {
    // HTMLElement ie8以上支持 此类库不支持ie8及以下所以意义不是很大
    return (typeof HTMLElement === "object") ?
        function (target: any): target is HTMLElement {
            return target instanceof HTMLElement;
        } :
        function (target: any): target is HTMLElement {
            return target && typeof target === "object" && target.nodeType === 1 && typeof target.nodeName === "string";
        };
})();
export const addClass: (target: HTMLElement, className: string | string[]) => string = (function () {
    // classList ie9以上支持
    return !!document.documentElement.classList ? function (target: HTMLElement, className: string | string[]) {
        target.classList.add(...isArray(className) ? className : [className]);
        return target.className;
    } : function (target: HTMLElement, className: string | string[]) {
        const originClass = target.className;
        const originClassArr = originClass.split(" ");
        className = isArray(className) ? className : [className];
        // [...new Set(array)] ts不支持这种格式 只能使用Array.from替代
        className = unique(className);
        className = filter(cname => includes(originClassArr, cname), className);
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
        dom.className = dom.className.replace(new RegExp("(^|\\s)" + className + "(\\s|$)", "gi"), "");
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

type xy = { x: number, y: number }
type OnDown = (e: MouseEvent | TouchEvent, currentXY: xy) => any
type OnMove = (e: MouseEvent | TouchEvent, currentXY: xy, lastXY: xy, downXY: xy) => any
type OnUp = (e: MouseEvent | TouchEvent, currentXY: xy, downXY: xy) => any

/**
 * 拖动事件 返回取消事件
 * @param el
 * @param onDown
 * @param onMove
 * @param onUp
 * @param capture
 */
export function addDragEventListener({el, onDown, onMove, onUp, capture = {down: false, up: true, move: false}}: {
    el?: string | HTMLElement,
    onDown?: OnDown,
    onMove?: OnMove,
    onUp?: OnUp,
    capture?: {
        down?: boolean,
        up?: boolean,
        move?: boolean
    },
}): () => void {
    let dom: HTMLElement | Window = el as HTMLElement;
    if (!isDom(el)) {
        if (isString(el)) {
            dom = document.querySelector(<string>el) as HTMLElement;
            if (!dom) {
                throw new Error("element not found!");
            }
        } else {
            dom = window;
        }
    }
    let lastXY: xy = {x: 0, y: 0};
    let downXY: xy = {x: 0, y: 0};

    // mouse获取xy
    function getXYWithMouse(e: MouseEvent): xy {
        const {screenX, screenY} = e as MouseEvent;
        const xY = {x: screenX, y: screenY};
        xY.x = ~~xY.x;
        xY.y = ~~xY.y;
        return xY;
    }

    // touch获取xy
    function getXYWithTouch(e: TouchEvent): xy {
        const touches: TouchList = e.changedTouches;
        const touch: Touch = touches[0];
        const xY = {x: touch.clientX, y: touch.clientY};
        xY.x = ~~xY.x;
        xY.y = ~~xY.y;
        return xY;
    }

    let getXY: typeof getXYWithMouse | typeof getXYWithTouch;

    // touch与mouse通用按下事件处理
    function down(event: MouseEvent | TouchEvent, mouseOrTouch: "mouse" | "touch") {
        getXY = mouseOrTouch === "mouse" ? getXYWithMouse : getXYWithTouch;
        downXY = getXY(event as any);
        lastXY = downXY;
        let backVal: any = void 0;
        if (onDown && isFunction(onDown)) {
            backVal = onDown.call(this, event, downXY);
        }
        return backVal;
    }

    // touch与mouse通用移动事件处理
    function move(e: MouseEvent | TouchEvent) {
        const moveXY = getXY(e as any);
        let backVal: any = void 0;
        if (onMove && isFunction(onMove)) {
            backVal = onMove.call(this, e, moveXY, lastXY, downXY);
        }
        lastXY = moveXY;
        return backVal;
    }

    // touch与mouse通用移开事件处理
    function up(e: MouseEvent | TouchEvent) {
        // console.log("up", e);
        const upXY = getXY(e as any);
        let backVal: any = void 0;
        lastXY = upXY;
        if (onUp && isFunction(onUp)) {
            backVal = onUp.call(this, e, upXY, downXY);
        }
        removeMoveAndUpEventListener();
        return backVal;
    }

    function mousedown(event: MouseEvent) {
        const backVal = down.call(this, event, "mouse");
        window.addEventListener("mousemove", move, capture.move);
        window.addEventListener("mouseup", up, capture.up);
        return backVal;
    }

    function touchStart(event: TouchEvent) {
        const backVal = down.call(this, event, "touch");
        window.addEventListener("touchmove", move, capture.move);
        window.addEventListener("touchend", up, capture.up);
        window.addEventListener("touchcancel", up, capture.up);
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
        dom.removeEventListener("mousedown", mousedown as any, capture.down);
        dom.removeEventListener("touchstart", touchStart as any, capture.down);
        removeMoveAndUpEventListener();
    }

    dom.addEventListener("mousedown", mousedown as any, capture.down);
    dom.addEventListener("touchstart", touchStart as any, capture.down);

    // 返回取消全部事件函数
    return removeAllEventListener;
}

// from => https://blog.crimx.com/2017/07/15/element-onresize/
// TODO 未测
/**
 * dom resize event
 * @param el
 * @param handler
 */
export function onElResize(el: HTMLElement, handler: () => void) {
    if (!(el instanceof HTMLElement)) {
        throw new TypeError("Parameter 1 is not instance of 'HTMLElement'.");
    }
    // https://www.w3.org/TR/html/syntax.html#writing-html-documents-elements
    if (/^(area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style|textarea|title)$/i.test(el.tagName)) {
        throw new TypeError("Unsupported tag type. Change the tag or wrap it in a supported tag(e.g. div).");
    }
    if (typeof handler !== "function") {
        throw new TypeError("Parameter 2 is not of type 'function'.");
    }

    let lastWidth = el.offsetWidth || 1;
    let lastHeight = el.offsetHeight || 1;
    const maxWidth = 10000 * (lastWidth);
    const maxHeight = 10000 * (lastHeight);

    const expand: HTMLElement = document.createElement("div");
    expand.className = "expand";
    expand.style.cssText = "position:absolute;top:0;bottom:0;left:0;right:0;z-index=-10000;overflow:hidden;visibility:hidden;";
    const shrink: HTMLElement = expand.cloneNode(false) as HTMLElement;
    shrink.className = "shrink";

    const expandChild: HTMLElement = document.createElement("div") as HTMLElement;
    expandChild.style.cssText = "transition:0s;animation:none;";
    const shrinkChild: HTMLElement = expandChild.cloneNode(false) as HTMLElement;

    expandChild.style.width = maxWidth + "px";
    expandChild.style.height = maxHeight + "px";
    shrinkChild.style.width = "250%";
    shrinkChild.style.height = "250%";

    expand.appendChild(expandChild);
    shrink.appendChild(shrinkChild);
    el.appendChild(expand);
    el.appendChild(shrink);

    if (expand.offsetParent !== el) {
        el.style.position = "relative";
    }

    expand.scrollTop = shrink.scrollTop = maxHeight;
    expand.scrollLeft = shrink.scrollLeft = maxWidth;

    let newWidth = 0;
    let newHeight = 0;

    function onResize() {
        if (newWidth !== lastWidth || newHeight !== lastHeight) {
            lastWidth = newWidth;
            lastHeight = newHeight;
            console.log("onResize");
            handler();
        }
    }

    function onScroll() {
        console.log("onScroll");
        newWidth = el.offsetWidth || 1;
        newHeight = el.offsetHeight || 1;
        if (newWidth !== lastWidth || newHeight !== lastHeight) {
            requestAnimationFrame(onResize);
        }
        expand.scrollTop = shrink.scrollTop = maxHeight;
        expand.scrollLeft = shrink.scrollLeft = maxWidth;
    }

    expand.addEventListener("scroll", onScroll);
    shrink.addEventListener("scroll", onScroll);
}

function getWH(el: HTMLElement | typeof window): { w: number, h: number } {
    const wh = {w: 0, h: 0};
    if (el === window) {
        wh.w = window.innerWidth;
        wh.h = window.innerHeight;
    } else {
        el = el as HTMLElement;
        wh.w = el.offsetWidth;
        wh.h = el.offsetHeight;
    }
    return wh;
}

// TODO 未完待续 参考：emergency
export function isVisible(target: HTMLElement, container: HTMLElement | typeof window = window): boolean {
    /* if (container !== window && !isVisible(container as HTMLElement, window)) {
         return false
     }*/
    const wh = getWH(container);
    const targetWh = getWH(target);

    const scrollTop = (container as HTMLElement).scrollTop;
    const top = target.offsetTop - scrollTop;
    return top >= -targetWh.h && top <= wh.h;
}

export function isScrollEnd(el: HTMLElement, direct: "vertical" | "horizontal" = "vertical", offset = 10) {
    if (direct === "vertical") {
        return el.scrollTop >= el.scrollHeight - el.clientHeight - offset;
    } else {
        return el.scrollLeft >= el.scrollWidth - el.clientWidth - offset;
    }
}

export function isScrollStart(el: HTMLElement, direct: "vertical" | "horizontal" = "vertical", offset = 10) {
    if (direct === "vertical") {
        return el.scrollTop >= offset;
    } else {
        return el.scrollLeft >= offset;
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

export function isSelectElement(el: HTMLElement): el is HTMLSelectElement {
    return el.nodeName === "SELECT";
}

export function isInputElement(el: HTMLElement): el is HTMLInputElement {
    return el.nodeName === "INPUT";
}

export function isTextAreaElement(el: HTMLElement): el is HTMLTextAreaElement {
    return el.nodeName === "TEXTAREA";
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