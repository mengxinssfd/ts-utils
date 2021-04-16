import { __awaiter } from "tslib";
import { isDom, isInputElement, isSelectElement, isTextAreaElement } from "./domType";
import { onceEvent } from "./event";
import { createElement } from "./dom";
import { castArray } from "./array";
/**
 * @param element
 * @return string
 */
export function select(element) {
    let selectedText;
    if (isSelectElement(element)) {
        element.focus();
        selectedText = element.value;
    }
    else if (isInputElement(element) || isTextAreaElement(element)) {
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
    }
    else {
        if (element.hasAttribute("contenteditable")) {
            element.focus();
        }
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
        selectedText = selection.toString();
    }
    return selectedText;
}
export function isSupportedClipboardCommand(action = ["cut", "copy"]) {
    const actions = castArray(action);
    if (!!document.queryCommandSupported)
        return false;
    return actions.every((act) => document.queryCommandSupported(act));
}
/**
 * 复制文字或html
 * @param target {HTMLElement | string}
 * @return {Promise}
 */
export function copy2Clipboard(target) {
    let el;
    const isText = typeof target === "string";
    const isBindThis = isDom(this);
    const p = new Promise((resolve, reject) => {
        if (isBindThis) {
            onceEvent(this.parentNode, "click", () => {
                copy2Clipboard(target).then(resolve, reject);
            });
            return;
        }
        let el;
        const isText = typeof target === "string";
        if (isText) {
            const text = target;
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
        }
        else {
            el = target;
        }
        select(el);
        let succeeded;
        let error;
        try {
            succeeded = document.execCommand("copy");
        }
        catch (err) {
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
        if (isBindThis)
            return;
        window.getSelection().removeAllRanges();
        if (isText) {
            document.body.removeChild(el);
        }
    });
    return p;
}
const cb = window.navigator.clipboard;
export function supportClipboardWrite() {
    var _a;
    return Boolean((_a = cb) === null || _a === void 0 ? void 0 : _a.write);
}
export function supportCopySetData2Clipboard() {
    const source = document.querySelector('.source');
    source.addEventListener('copy', (event) => {
        // event.clipboardData.setData('text/plain',);
        event.preventDefault();
    });
}
/**
 * 写进剪贴板
 * @desc notice - 只有在https或者localhost上可以用
 * @param contentList
 */
export function write2Clipboard(contentList) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!supportClipboardWrite())
            throw new Error("unsupported navigator.clipboard.write");
        const clipboardItems = contentList.map(item => {
            const blob = item instanceof Blob ? item : new Blob([item], { type: 'text/plain' });
            return new ClipboardItem({
                [blob.type]: blob,
            });
        });
        yield cb.write(clipboardItems);
    });
}
