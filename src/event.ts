import {includes} from "./array";
import {getDistance} from "./coordinate";
import {isDom} from "./domType";
import {isFunction, isString} from "./dataType";

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
    el?: string | HTMLElement | Window;
    onDown?: OnDown;
    onMove?: OnMove;
    onUp?: OnUp;
    capture?: {
        down?: boolean;
        up?: boolean;
        move?: boolean;
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
        const touches: TouchList = ["touchcancel", "touchend"].indexOf(e.type) > -1 ? e.changedTouches : e.touches;
        const touch: Touch = touches[0];
        const xY = {x: touch.clientX, y: touch.clientY};
        xY.x = ~~xY.x;
        xY.y = ~~xY.y;
        return xY;
    }

    let getXY: typeof getXYWithMouse | typeof getXYWithTouch;

    // touch与mouse通用按下事件处理
    function down(e: MouseEvent | TouchEvent, mouseOrTouch: "mouse" | "touch") {
        // 大于1个触点就不是拖动事件，而是缩放事件了
        if ((e as TouchEvent).touches && (e as TouchEvent).touches.length > 1) {
            removeMoveAndUpEventListener();
            return;
        }
        getXY = mouseOrTouch === "mouse" ? getXYWithMouse : getXYWithTouch;
        downXY = getXY(e as any);
        lastXY = downXY;
        let backVal: any = void 0;
        if (onDown && isFunction(onDown)) {
            backVal = onDown.call(this, e, downXY);
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

    // touchstart事件会优先于mousedown事件，touchmove后不会触发mousedown事件
    // 所以move和up的事件不会同时触发两次，也不用去专门处理触发事件
    dom.addEventListener("mousedown", mousedown as any, capture.down);
    dom.addEventListener("touchstart", touchStart as any, capture.down);

    // 返回取消全部事件函数
    return removeAllEventListener;
}

type DragHook<T> = (cb: T) => void

/**
 * addDragEventListener的函数式用法.
 * 使用addDragEventListener的时候，如果onDown,onMove,onUp之间有联系的话必须在外面写上通用数据,
 * 改成这样可以把数据控制在函数内部
 * @example
 *   onDragEvent(({onDown, onMove, onUp}) => {
 *       // 目前只有第一次挂载的函数有效，后面的都无效。 那么是否应该可以更改呢
 *       onDown((e, currentXY) => {
 *           console.log("down", e, currentXY);
 *       });
 *       onMove((e, currentXY, lastXY, downXY) => {
 *           console.log("move", e, currentXY, lastXY, downXY);
 *       });
 *       onUp((e, currentXY, downXY) => {
 *           console.log("up", e, currentXY, downXY);
 *       });
 *   });
 * @param hook
 * @param el
 * @param capture
 */
export function onDragEvent(
    hook: ({onDown, onMove, onUp}: {
        onDown: DragHook<OnDown>;
        onMove: DragHook<OnMove>;
        onUp: DragHook<OnUp>
    }) => void,
    {el = window, capture = {down: false, up: true, move: false}}: {
        el?: string | HTMLElement | Window;
        capture?: {
            down?: boolean;
            up?: boolean;
            move?: boolean;
        },
    } = {}): () => void {
    const param: any = {el, capture};
    const onDown = (cb: OnDown) => {
        param.onDown = cb;
    };
    const onMove = (cb: OnMove) => {
        param.onMove = cb;
    };
    const onUp = (cb: OnUp) => {
        param.onUp = cb;
    };
    hook({onDown, onMove, onUp});
    return addDragEventListener(param);
}

/**
 * 缩放
 * @param el
 * @param onScale
 * @param capture
 */
export function addScaleEventListener(el: HTMLElement | string, onScale: (distance: number, startDistance: number) => void, capture: {
    down?: boolean;
    up?: boolean;
    move?: boolean;
} = {down: false, up: true, move: false}) {
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

    let startDistance = 0;

    function getDis(touches: TouchList) {
        const t1 = touches[0];
        const t2 = touches[1];
        return getDistance([t1.pageX, t1.pageY], [t2.pageX, t2.pageY]);
    }

    function move(e: TouchEvent) {
        if (e.touches.length < 2) return;
        onScale(+getDis(e.touches).toFixed(2), startDistance);
    }

    function up(e: TouchEvent) {
        removeEvent();
    }

    function touchStart(e: TouchEvent) {
        if (e.touches.length < 2) return;
        window.addEventListener("touchmove", move, capture.move);
        window.addEventListener("touchend", up, capture.up);
        window.addEventListener("touchcancel", up, capture.up);
        startDistance = +getDis(e.touches).toFixed(2);
    }

    function removeEvent() {
        window.removeEventListener("touchmove", move, capture.move);
        window.removeEventListener("touchend", up, capture.up);
        window.removeEventListener("touchcancel", up, capture.up);
    }

    // 移除全部事件
    function removeAllEventListener() {
        dom.removeEventListener("touchstart", touchStart as any, capture.down);
        removeEvent();
    }

    dom.addEventListener("touchstart", touchStart as any, capture.down);
    return removeAllEventListener;
}

// from => https://blog.crimx.com/2017/07/15/element-onresize/
// TODO 未测
/**
 * dom resize event
 * @param el
 * @param handler
 */
export function addResizeListener(el: HTMLElement, handler: () => void) {
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

/**
 * 事件代理
 * @param containerEl
 * @param eventType
 * @param targetEl
 * @param callback
 */
export function eventProxy<K extends keyof HTMLElementEventMap>(
    containerEl: string | HTMLElement | null,
    eventType: K,
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
        const targetDom = isDom(targetEl)
            ? [targetEl]
            : document.querySelectorAll(targetEl);
        if (includes(targetDom, e.target)) {
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
 * @param [capture=false] 捕获还是冒泡，默认冒泡
 */
export function onceEvent<K extends keyof HTMLElementEventMap>(
    el: Window | HTMLElement | string | null | void,
    eventType: K,
    callback: (e: Event) => any,
    capture = false,
) {
    let dom: HTMLElement | Window;

    if (isString(el)) {
        dom = document.querySelector(el) as HTMLElement;
        if (!dom) {
            throw new Error("element not found!");
        }
    } else if (isDom(el)) {
        dom = el;
    } else {
        dom = window;
    }
    let handler = (e) => {
        // 移除的时候也要带上捕获还是冒泡
        dom.removeEventListener(eventType, handler, capture);
        if (callback && isFunction(callback)) {
            return callback(e);
        }
    };
    // 使用捕获优先度高，冒泡的话会在同一个事件里执行
    dom.addEventListener(eventType, handler, capture);
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

/**
 * 判断dom是否滚动到底了
 * @param el
 * @param [direct="vertical"]
 * @param [offset=10]
 */
export function isScrollEnd(el: HTMLElement | Window, direct = "vertical", offset = 10) {
    let width: number, height: number;
    let scrollEl = el as HTMLElement;
    if (el === window) {
        let rootEl = document.documentElement;
        scrollEl = document.body.scrollTop ? document.body : rootEl;
        width = rootEl.clientWidth;
        height = rootEl.clientHeight;
    } else {
        width = scrollEl.clientWidth;
        height = scrollEl.clientHeight;
    }

    const {scrollTop, scrollLeft, scrollHeight, scrollWidth} = scrollEl;

    if (direct === "vertical") {
        return scrollTop >= scrollHeight - height - offset;
    } else {
        return scrollLeft >= scrollWidth - width - offset;
    }
}

/**
 * 判断dom是否滚动到顶了
 * @param el
 * @param [direct="vertical"]
 * @param [offset=10]
 */
export function isScrollStart(el: HTMLElement, direct: "vertical" | "horizontal" = "vertical", offset = 10) {
    if (direct === "vertical") {
        return el.scrollTop >= offset;
    } else {
        return el.scrollLeft >= offset;
    }
}