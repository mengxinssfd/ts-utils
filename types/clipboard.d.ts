/**
 * @param element
 * @return string
 */
export declare function select(element: HTMLElement): any;
export declare function isSupportedClipboardCommand<T extends "cut" | "copy">(action?: Array<T> | T): boolean;
/**
 * 复制文字或html
 * 如果copy2Clipboard的this是一个html元素的话，
 * 不会马上执行，而是在该html元素被点击之后执行
 * @param target {HTMLElement | string}
 * @return {Promise}
 */
export declare function copy2Clipboard(target: HTMLElement | string): Promise<void>;
export declare namespace copy2Clipboard {
    var once: (el: HTMLElement, target: () => string | HTMLElement, eventType?: keyof HTMLElementEventMap, capture?: boolean) => Promise<void>;
}
export declare function supportClipboardWrite(): boolean;
export declare function setData2Clipboard(): void;
/**
 * 写进剪贴板
 * @desc notice - 只有在https或者localhost上可以用
 * @param contentList
 */
export declare function write2Clipboard(contentList: Array<string | Blob>): Promise<void>;
