import {isDom, isInputElement, isSelectElement, isTextAreaElement} from "./domType";
import {onceEvent} from "./event";
import {createElement} from "./dom";
import {castArray} from "./array";

/**
 * @param element
 * @return string
 */
export function select(element: HTMLElement) {
    let selectedText;
    if (isSelectElement(element)) {
        element.focus();
        selectedText = element.value;
    } else if (isInputElement(element) || isTextAreaElement(element)) {
        const isReadOnly = element.hasAttribute("readonly");
        if (!isReadOnly) {
            element.setAttribute("readonly", "");
        }
        element.select();
        element.setSelectionRange(0, element.value.length);
        if (!isReadOnly) {
            element.removeAttribute("readonly");
        }
        selectedText = element.value;
    } else {
        if (element.hasAttribute("contenteditable")) {
            element.focus();
        }
        const selection = window.getSelection() as Selection;
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
        selectedText = selection.toString();
    }
    return selectedText;
}

export function isSupportedClipboardCommand<T extends "cut" | "copy">(
    action: Array<T> | T = ["cut", "copy"] as Array<T>
): boolean {
    const actions = castArray(action) as T[];

    if (!!document.queryCommandSupported) return false;

    return actions.every((act) => document.queryCommandSupported(act));
}

/**
 * 复制文字或html
 * @param target {HTMLElement | string}
 * @return {Promise}
 */
export function copy2Clipboard(this: HTMLElement | void, target: HTMLElement | string): Promise<void> {
    let el: HTMLElement;
    const isText = typeof target === "string";
    const isBindThis = isDom(this)
    const p = new Promise<void>((resolve, reject) => {
        if (isBindThis) {
            onceEvent((this as HTMLElement).parentNode as HTMLElement, "click", () => {
                copy2Clipboard(target).then(resolve, reject)
            })
            return;
        }
        let el: HTMLElement;
        const isText = typeof target === "string";
        if (isText) {
            const text = target as string;
            el = createElement("div", {
                props: {
                    innerText: text,
                    style: {
                        position: "fixed",
                        left: "-100000px",
                    }
                },
                parent: document.body
            })
        } else {
            el = target as HTMLElement;
        }

        select(el);
        let succeeded;
        let error: any;
        try {
            succeeded = document.execCommand("copy");
        } catch (err) {
            succeeded = false;
            error = err;
        }
        if (succeeded) {
            resolve();
            return;
        }
        reject(error);
    });
    p.finally(function () {
        if (isBindThis) return;
        (window.getSelection() as Selection).removeAllRanges();
        if (isText) {
            document.body.removeChild(el);
        }
    });
    return p;
}

const cb = window.navigator.clipboard;

export function supportClipboardWrite() {
    return Boolean((cb as any)?.write);
}

export function supportCopySetData2Clipboard() {
    const source = document.querySelector('.source') as HTMLDivElement;
    source.addEventListener('copy', (event: ClipboardEvent) => {
        // event.clipboardData.setData('text/plain',);
        event.preventDefault();
    });
}

declare const ClipboardItem: any;

/**
 * 写进剪贴板
 * @desc notice - 只有在https或者localhost上可以用
 * @param contentList
 */
export async function write2Clipboard(contentList: Array<string | Blob>) {
    if (!supportClipboardWrite()) throw new Error("unsupported navigator.clipboard.write");
    const clipboardItems = contentList.map(item => {
        const blob = item instanceof Blob ? item : new Blob([item], {type: 'text/plain'});
        return new ClipboardItem({
            [blob.type]: blob,
        });
    });
    await (cb as any).write(clipboardItems);
}