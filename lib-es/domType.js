import { isUndefined } from "./type";
export function isDomIe8(target) {
    // 节点类型常用的有3种，元素节点Node.ELEMENT_NODE(1)；属性节点Node.ATTRIBUTE_NODE(2)以及文本节点Node.TEXT_NODE(3)
    return target && typeof target === "object" && target.nodeType === 1 && typeof target.nodeName === "string";
}
export function isDomStandard(target) {
    return target instanceof HTMLElement;
}
// 在ie HTMLElement类型是object 在chrome/firefox HTMLElement是function ie9以下HTMLElement为undefined
// 不论object还是function都能用instanceof
export const isDom = isUndefined(window.HTMLElement) ? isDomIe8 : isDomStandard;
export function isElementOf(nodeName, el) {
    return isDom(el) && el.nodeName === nodeName.toUpperCase();
}
export function isSelectElement(el) {
    return isElementOf("SELECT", el);
}
export function isInputElement(el) {
    return isElementOf("INPUT", el);
}
export function isTextAreaElement(el) {
    return isElementOf("TEXTAREA", el);
}
export function isImgElement(el) {
    return isElementOf("IMG", el);
}
export function isDivElement(el) {
    return isElementOf("DIV", el);
}
export function isSpanElement(el) {
    return isElementOf("SPAN", el);
}
export function isUlElement(el) {
    return isElementOf("UL", el);
}
export function supportTouch() {
    return "ontouchstart" in window;
}
