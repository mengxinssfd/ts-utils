import {isUndefined, typeOf} from "../core/dataType";

export function isDomIe8(target: any): target is HTMLElement {
    // 节点类型常用的有3种，元素节点Node.ELEMENT_NODE(1)；属性节点Node.ATTRIBUTE_NODE(2)以及文本节点Node.TEXT_NODE(3)
    return target && typeof target === "object" && target.nodeType === 1 && typeof target.nodeName === "string";
}

export function isDomStandard(target: any): target is HTMLElement {
    return target instanceof HTMLElement;
}

// 在ie HTMLElement类型是object 在chrome/firefox HTMLElement是function ie9以下HTMLElement为undefined
// 不论object还是function都能用instanceof
export const isDom: (target: any) => target is HTMLElement = isUndefined(window.HTMLElement) ? isDomIe8 : isDomStandard;

export function isElementOf(nodeName: string, el: any): boolean {
    return isDom(el) && el.nodeName === nodeName.toUpperCase();
}

export function isSelectElement(el: HTMLElement): el is HTMLSelectElement {
    return isElementOf("SELECT", el);
}

export function isInputElement(el: HTMLElement): el is HTMLInputElement {
    return isElementOf("INPUT", el);
}

export function isTextAreaElement(el: HTMLElement): el is HTMLTextAreaElement {
    return isElementOf("TEXTAREA", el);
}

export function isImgElement(el: HTMLElement): el is HTMLImageElement {
    return isElementOf("IMG", el);
}

export function isDivElement(el: HTMLElement): el is HTMLDivElement {
    return isElementOf("DIV", el);
}

export function isSpanElement(el: HTMLElement): el is HTMLSpanElement {
    return isElementOf("SPAN", el);
}

export function isUlElement(el: HTMLElement): el is HTMLUListElement {
    return isElementOf("UL", el);
}

export function supportTouch(): boolean {
    return "ontouchstart" in window;
}

export function isNodeList(target: any): target is NodeList {
    return typeOf(target) === "nodelist";
}