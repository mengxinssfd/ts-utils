export declare const isDom: (target: any) => target is HTMLElement;
export declare const addClass: (target: HTMLElement, className: string | string[]) => string;
export declare function removeClass(dom: any, className: string): string;
/**
 * 判断是什么种类的浏览器并返回拼接前缀后的数据
 * @param style
 * @returns {*}
 */
export declare function prefixStyle(style: string): string | false;
/**
 * 事件代理
 * @param containerEl
 * @param eventType
 * @param targetEl
 * @param callback
 */
export declare function eventProxy(containerEl: string | HTMLElement | null, eventType: string, targetEl: string | HTMLElement, callback: (e: Event) => void): null | (() => void);
/**
 * 一次性事件
 * @param el
 * @param eventType
 * @param callback
 * @param capture 捕获还是冒泡，默认冒泡
 */
export declare function onceEvent(el: Window | HTMLElement | string | null | undefined, eventType: string, callback: (e: Event) => false | undefined, capture?: boolean): void;
declare type xy = {
    x: number;
    y: number;
};
export declare function addDragEventListener({ el, onDown, onMove, onUp, capture }: {
    el: string | HTMLElement | undefined | null;
    onDown: (e: MouseEvent | TouchEvent, downXY: xy) => void;
    onMove: (e: MouseEvent | TouchEvent, moveXY: xy, lastXY: xy, downXY: xy) => void;
    onUp: (e: MouseEvent | TouchEvent, downXY: xy, upXY: xy) => void;
    capture: boolean;
}): () => void;
export {};
