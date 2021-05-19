import { isInputElement, isSelectElement, isTextAreaElement } from "./domType";
import { createElement } from "./dom";
import { castArray } from "./array";
import { onceEvent } from "./event";
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
 * 如果copy2Clipboard的this是一个html元素的话，
 * 不会马上执行，而是在该html元素被点击之后执行
 * @param target {HTMLElement | string}
 * @return {Promise}
 */
export function copy2Clipboard(target) {
    let el;
    const isText = typeof target === "string";
    const p = new Promise((resolve, reject) => {
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
                    },
                },
                parent: document.body,
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
        window.getSelection().removeAllRanges();
        if (isText) {
            document.body.removeChild(el);
        }
    });
    return p;
}
/**
 * 原来通过绑定this的方式实际使用时获取不到准确的target值
 *
 * 用法：
 *      1.触发事件（最好是捕获阶段的事件）
 *      2.使用该函数并接收触发事件的parentNode作为el参数（与步骤1同一事件，最好绑定在冒泡阶段）
 *      3.请求数据（必须同步请求，否则可能复制失败）（是否请求视使用场景而定）
 *      4.冒泡触发事件并复制
 *      5.自动清除事件
 *
 * @param el
 * @param target 复制的目标
 * @param [eventType="click"]
 * @param [capture=false]
 */
copy2Clipboard.once = function (el, target, eventType = "click", capture = false) {
    return new Promise(((resolve, reject) => {
        onceEvent(el, eventType, () => {
            copy2Clipboard(target()).then(resolve, reject);
        }, capture);
    }));
};
const cb = window.navigator.clipboard;
export function supportClipboardWrite() {
    var _a;
    return Boolean((_a = cb) === null || _a === void 0 ? void 0 : _a.write);
}
export function setData2Clipboard() {
    const source = document.querySelector(".source");
    source.addEventListener("copy", (event) => {
        // event.clipboardData.setData('text/plain',);
        event.preventDefault();
    });
}
/**
 * 写进剪贴板
 * @desc notice - 只有在https或者localhost上可以用
 * @param contentList
 */
export async function write2Clipboard(contentList) {
    if (!supportClipboardWrite())
        throw new Error("unsupported navigator.clipboard.write");
    const clipboardItems = contentList.map(item => {
        const blob = item instanceof Blob ? item : new Blob([item], { type: "text/plain" });
        return new ClipboardItem({
            [blob.type]: blob,
        });
    });
    await cb.write(clipboardItems);
}
