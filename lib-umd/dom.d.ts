export declare const addClass: (target: HTMLElement, className: string | string[]) => string;
export declare function removeClass(dom: any, className: string): string;
/**
 * 判断是什么种类的浏览器并返回拼接前缀后的数据
 * @param style
 * @returns {*}
 */
export declare function prefixStyle(style: string): string | false;
/**
 * 判断是否支持css
 * @param key
 * @param value
 * @returns {boolean}
 */
export declare function cssSupport(key: any, value: any): boolean;
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
export declare function onElResize(el: HTMLElement, handler: () => void): void;
export declare function isVisible(target: HTMLElement, container?: HTMLElement | typeof window): boolean;
export declare function isScrollEnd(el: HTMLElement, direct?: "vertical" | "horizontal", offset?: number): boolean;
export declare function isScrollStart(el: HTMLElement, direct?: "vertical" | "horizontal", offset?: number): boolean;
/**
 * 手动添加img标签下载图片
 * @param url
 */
export declare function loadImg(url: string): Promise<HTMLImageElement>;
/**
 * 手动添加script
 * @param url
 */
export declare function loadScript(url: string): Promise<void>;
export declare function noScroll(scrollContainer: Window | HTMLElement | string): () => void;
/**
 * 通过object来生成html元素
 * @param tagName
 * @param attribute
 */
export declare function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, attribute: {
    [k: string]: any;
}): HTMLElementTagNameMap[K];
export {};
