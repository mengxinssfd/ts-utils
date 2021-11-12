"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.write2Clipboard = exports.setData2Clipboard = exports.supportClipboardWrite = exports.copy2Clipboard = exports.isSupportedClipboardCommand = exports.select = void 0;
const domType_1 = require("../dom/domType");
const dom_1 = require("../dom/dom");
const array_1 = require("../core/array");
const event_1 = require("../dom/event");
const common_1 = require("../core/common");
/**
 * @param element
 * @return string
 */
function select(element) {
    let selectedText;
    if (domType_1.isSelectElement(element)) {
        element.focus();
        selectedText = element.value;
    }
    else if (domType_1.isInputElement(element) || domType_1.isTextAreaElement(element)) {
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
exports.select = select;
function isSupportedClipboardCommand(action = ["cut", "copy"]) {
    const actions = array_1.castArray(action);
    if (!!document.queryCommandSupported)
        return false;
    return actions.every((act) => document.queryCommandSupported(act));
}
exports.isSupportedClipboardCommand = isSupportedClipboardCommand;
/**
 * 复制文字或html
 * 如果copy2Clipboard的this是一个html元素的话，
 * 不会马上执行，而是在该html元素被点击之后执行
 * @param target {HTMLElement | string}
 * @return {Promise}
 */
function copy2Clipboard(target) {
    const isDoc = domType_1.isDom(target);
    const el = isDoc ?
        target :
        dom_1.createHiddenHtmlElement({ innerText: String(target) });
    const p = new Promise((resolve, reject) => {
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
        // execCommand可能返回false
        if (succeeded) {
            resolve(target);
            return;
        }
        reject(error);
    });
    p.finally(function () {
        window.getSelection && window.getSelection().removeAllRanges();
        !isDoc && el && document.body.removeChild(el);
    });
    return p;
}
exports.copy2Clipboard = copy2Clipboard;
/* if (window.Promise && !window.Promise.prototype.finally) {
    Promise.prototype.finally = function (cb?: (() => void)) {
        return this.then().then(cb, cb);
    };
}*/
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
        event_1.onceEvent(el, eventType, () => {
            copy2Clipboard(target()).then(resolve, reject);
        }, capture);
    }));
};
const cb = (_a = common_1.root === null || common_1.root === void 0 ? void 0 : common_1.root.navigator) === null || _a === void 0 ? void 0 : _a.clipboard;
function supportClipboardWrite() {
    var _a;
    return Boolean((_a = cb) === null || _a === void 0 ? void 0 : _a.write);
}
exports.supportClipboardWrite = supportClipboardWrite;
function setData2Clipboard(data, el = document.documentElement, format = 'text/plain') {
    function cb(event) {
        var _a;
        (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.setData(format, data);
        event.preventDefault();
        el.removeEventListener("copy", cb);
    }
    el.addEventListener("copy", cb);
    return document.execCommand("copy");
}
exports.setData2Clipboard = setData2Clipboard;
/**
 * 写进剪贴板
 * @desc notice - 只有在https或者localhost上可以用
 * @param contentList
 */
async function write2Clipboard(contentList) {
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
exports.write2Clipboard = write2Clipboard;
