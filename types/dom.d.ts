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
/**
 * 拖动事件 返回取消事件
 */
export declare function addDragEventListener({ el, onDown, onMove, onUp, capture }: {
    el?: string | HTMLElement;
    onDown?: (e: MouseEvent | TouchEvent, currentXY: xy) => any;
    onMove?: (e: MouseEvent | TouchEvent, currentXY: xy, lastXY: xy, downXY: xy) => any;
    onUp?: (e: MouseEvent | TouchEvent, currentXY: xy, downXY: xy) => any;
    capture?: {
        down?: boolean;
        up?: boolean;
        move?: boolean;
    };
}): () => void;
export {};
