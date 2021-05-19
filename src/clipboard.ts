import {isInputElement, isSelectElement, isTextAreaElement} from "./domType";
import {createElement} from "./dom";
import {castArray} from "./array";
import {onceEvent} from "./event";

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
 * 如果copy2Clipboard的this是一个html元素的话，
 * 不会马上执行，而是在该html元素被点击之后执行
 * @param target {HTMLElement | string}
 * @return {Promise}
 */
export function copy2Clipboard(target: HTMLElement | string): Promise<void> {
    let el: HTMLElement;
    const isText = typeof target === "string";
    const p = new Promise<void>((resolve, reject) => {
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
            });
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
        (window.getSelection() as Selection).removeAllRanges();
        if (isText) {
            document.body.removeChild(el);
        }
    });
    return p;
}


// 原来通过绑定this的方式实际使用时获取不到准确的target值
copy2Clipboard.async = function (el: HTMLElement, target: () => HTMLElement | string) {
    return new Promise(((resolve, reject) => {
        onceEvent(el, "click", () => {
            copy2Clipboard(target()).then(resolve, reject);
        });
    }));
};

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