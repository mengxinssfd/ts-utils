/**
 * @param element
 * @return string
 */
export declare function select(element: HTMLElement): any;
/**
 * 复制文字或html
 * @param target {HTMLElement | string}
 * @return {Promise}
 */
export declare function copy2Clipboard(target: HTMLElement | string): Promise<void>;
export declare function supportClipboardWrite(): boolean;
export declare function supportCopySetData2Clipboard(): void;
/**
 * 写进剪贴板
 * @desc notice - 只有在https或者localhost上可以用
 * @param contentList
 */
export declare function write2Clipboard(contentList: Array<string | Blob>): Promise<void>;
