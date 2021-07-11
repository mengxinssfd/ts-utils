declare type xy = {
    x: number;
    y: number;
};
declare type OnDown = (e: MouseEvent | TouchEvent, currentXY: xy) => any;
declare type OnMove = (e: MouseEvent | TouchEvent, currentXY: xy, lastXY: xy, downXY: xy) => any;
declare type OnUp = (e: MouseEvent | TouchEvent, currentXY: xy, downXY: xy) => any;
/**
 * 拖动事件 返回取消事件
 * @param el
 * @param onDown
 * @param onMove
 * @param onUp
 * @param capture
 */
export declare function addDragEventListener({ el, onDown, onMove, onUp, capture }: {
    el?: string | HTMLElement | Window;
    onDown?: OnDown;
    onMove?: OnMove;
    onUp?: OnUp;
    capture?: {
        down?: boolean;
        up?: boolean;
        move?: boolean;
    };
}): () => void;
declare type DragHook<T> = (cb: T) => void;
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
export declare function onDragEvent(hook: ({ onDown, onMove, onUp }: {
    onDown: DragHook<OnDown>;
    onMove: DragHook<OnMove>;
    onUp: DragHook<OnUp>;
}) => void, { el, capture }?: {
    el?: string | HTMLElement | Window;
    capture?: {
        down?: boolean;
        up?: boolean;
        move?: boolean;
    };
}): () => void;
/**
 * 缩放
 * @param el
 * @param onScale
 * @param capture
 */
export declare function addScaleEventListener(el: HTMLElement | string, onScale: (distance: number, startDistance: number) => void, capture?: {
    down?: boolean;
    up?: boolean;
    move?: boolean;
}): () => void;
/**
 * dom resize event
 * @param el
 * @param handler
 */
export declare function addResizeListener(el: HTMLElement, handler: () => void): void;
/**
 * 事件代理
 * @param containerEl
 * @param eventType
 * @param targetEl
 * @param callback
 */
export declare function eventProxy<K extends keyof HTMLElementEventMap>(containerEl: string | HTMLElement | null, eventType: K, targetEl: string | HTMLElement, callback: (e: Event) => void): null | (() => void);
/**
 * 一次性事件
 * @param el
 * @param eventType
 * @param callback
 * @param [capture=false] 捕获还是冒泡，默认冒泡
 */
export declare function onceEvent<K extends keyof HTMLElementEventMap>(el: Window | HTMLElement | string | null | void, eventType: K, callback: (e: Event) => any, capture?: boolean): void;
export declare function isVisible(target: HTMLElement, container?: HTMLElement | typeof window): boolean;
/**
 * 判断dom是否滚动到底了
 * @param el
 * @param [direct="vertical"]
 * @param [offset=10]
 */
export declare function isScrollEnd(el: HTMLElement | Window, direct?: string, offset?: number): boolean;
/**
 * 判断dom是否滚动到顶了
 * @param el
 * @param [direct="vertical"]
 * @param [offset=10]
 */
export declare function isScrollStart(el: HTMLElement, direct?: "vertical" | "horizontal", offset?: number): boolean;
export {};
