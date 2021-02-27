/**
 * 复制文字或html
 * @param target {HTMLElement | string}
 * @return {Promise}
 */
export declare function copy2Clipboard(target: HTMLElement | string): Promise<void>;
export declare function supportClipboardWrite(): boolean;
/**
 * 写进剪贴板
 * @param contentList
 */
export declare function write2Clipboard(contentList: Array<string | Blob>): Promise<void>;
