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
    el?: string | HTMLElement;
    onDown?: OnDown;
    onMove?: OnMove;
    onUp?: OnUp;
    capture?: {
        down?: boolean;
        up?: boolean;
        move?: boolean;
    };
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
 * @param capture 捕获还是冒泡，默认冒泡
 */
export declare function onceEvent<K extends keyof HTMLElementEventMap>(el: Window | HTMLElement | string | null | void, eventType: K, callback: (e: Event) => any, capture?: boolean): void;
export declare function isVisible(target: HTMLElement, container?: HTMLElement | typeof window): boolean;
export declare function isScrollEnd(el: HTMLElement, direct?: "vertical" | "horizontal", offset?: number): boolean;
export declare function isScrollStart(el: HTMLElement, direct?: "vertical" | "horizontal", offset?: number): boolean;
export {};
