"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportTouch = exports.isUlElement = exports.isSpanElement = exports.isDivElement = exports.isImgElement = exports.isTextAreaElement = exports.isInputElement = exports.isSelectElement = exports.isElementOf = exports.isDom = exports.isDomStandard = exports.isDomIe8 = void 0;
const dataType_1 = require("./dataType");
function isDomIe8(target) {
    // 节点类型常用的有3种，元素节点Node.ELEMENT_NODE(1)；属性节点Node.ATTRIBUTE_NODE(2)以及文本节点Node.TEXT_NODE(3)
    return target && typeof target === "object" && target.nodeType === 1 && typeof target.nodeName === "string";
}
exports.isDomIe8 = isDomIe8;
function isDomStandard(target) {
    return target instanceof HTMLElement;
}
exports.isDomStandard = isDomStandard;
// 在ie HTMLElement类型是object 在chrome/firefox HTMLElement是function ie9以下HTMLElement为undefined
// 不论object还是function都能用instanceof
exports.isDom = dataType_1.isUndefined(window.HTMLElement) ? isDomIe8 : isDomStandard;
function isElementOf(nodeName, el) {
    return exports.isDom(el) && el.nodeName === nodeName.toUpperCase();
}
exports.isElementOf = isElementOf;
function isSelectElement(el) {
    return isElementOf("SELECT", el);
}
exports.isSelectElement = isSelectElement;
function isInputElement(el) {
    return isElementOf("INPUT", el);
}
exports.isInputElement = isInputElement;
function isTextAreaElement(el) {
    return isElementOf("TEXTAREA", el);
}
exports.isTextAreaElement = isTextAreaElement;
function isImgElement(el) {
    return isElementOf("IMG", el);
}
exports.isImgElement = isImgElement;
function isDivElement(el) {
    return isElementOf("DIV", el);
}
exports.isDivElement = isDivElement;
function isSpanElement(el) {
    return isElementOf("SPAN", el);
}
exports.isSpanElement = isSpanElement;
function isUlElement(el) {
    return isElementOf("UL", el);
}
exports.isUlElement = isUlElement;
function supportTouch() {
    return "ontouchstart" in window;
}
exports.supportTouch = supportTouch;
