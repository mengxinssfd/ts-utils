import * as domType from "../src/domType";

test("isDomIe8", () => {
    const fn = domType.isDomIe8;
    const a = {nodeType: 1, nodeName: "DIV"};

    expect(fn(a)).toBeTruthy();
    expect(fn(document.createElement("div"))).toBeTruthy();
    expect(fn(new Image())).toBeTruthy();
    expect(fn({nodeName: "DIV"})).toBeFalsy();
});

test("isDom", () => {
    const fn = domType.isDom;
    const a = {nodeName: "DIV"};

    expect(fn(a)).toBeFalsy();
    expect(fn(document.createElement("div"))).toBeTruthy();
    expect(fn(new Image())).toBeTruthy();
});
test("isElementOf", () => {
    const fn = domType.isElementOf;
    const a = {nodeName: "DIV"};
    expect(fn("DIV", a)).toBeFalsy();
    expect(fn("SPAN", document.createElement("div"))).toBeFalsy();
    expect(fn("SELECT", document.createElement("div"))).toBeFalsy();
    expect(fn("DIV", document.createElement("div"))).toBeTruthy();
    expect(fn("div", document.createElement("div"))).toBeTruthy();
});
test("isDivElement", () => {
    const fn = domType.isDivElement;
    const a = {nodeName: "DIV"};

    expect(fn(a as HTMLElement)).toBeFalsy();
    expect(fn(document.createElement("span"))).toBeFalsy();
    expect(fn(document.createElement("select"))).toBeFalsy();
    expect(fn(document.createElement("div"))).toBeTruthy();
});
test("isSelectElement", () => {
    const fn = domType.isSelectElement;
    const a = {nodeName: "SELECT"};

    expect(fn(a as HTMLElement)).toBeFalsy();
    expect(fn(document.createElement("span"))).toBeFalsy();
    expect(fn(document.createElement("div"))).toBeFalsy();
    expect(fn(document.createElement("select"))).toBeTruthy();
});
test("isInputElement", () => {
    const fn = domType.isInputElement;
    const a = {nodeName: "INPUT"};

    expect(fn(a as HTMLElement)).toBeFalsy();
    expect(fn(document.createElement("span"))).toBeFalsy();
    expect(fn(document.createElement("div"))).toBeFalsy();
    expect(fn(document.createElement("input"))).toBeTruthy();
});
test("isTextAreaElement", () => {
    const fn = domType.isTextAreaElement;
    const a = {nodeName: "TEXTAREA"};

    expect(fn(a as HTMLElement)).toBeFalsy();
    expect(fn(document.createElement("span"))).toBeFalsy();
    expect(fn(document.createElement("div"))).toBeFalsy();
    expect(fn(document.createElement("textarea"))).toBeTruthy();
});
test("isImgElement", () => {
    const fn = domType.isImgElement;
    const a = {nodeName: "IMG"};

    expect(fn(a as HTMLElement)).toBeFalsy();
    expect(fn(document.createElement("span"))).toBeFalsy();
    expect(fn(document.createElement("div"))).toBeFalsy();
    expect(fn(document.createElement("img"))).toBeTruthy();
    expect(fn(new Image())).toBeTruthy();
});
test("isSpanElement", () => {
    const fn = domType.isSpanElement;
    const a = {nodeName: "SPAN"};

    expect(fn(a as HTMLElement)).toBeFalsy();
    expect(fn(document.createElement("span"))).toBeTruthy();
    expect(fn(document.createElement("div"))).toBeFalsy();
    expect(fn(document.createElement("img"))).toBeFalsy();
    expect(fn(new Image())).toBeFalsy();
});
test("isUlElement", () => {
    const fn = domType.isUlElement;
    const a = {nodeName: "UL"};

    expect(fn(a as HTMLElement)).toBeFalsy();
    expect(fn(document.createElement("ul"))).toBeTruthy();
    expect(fn(document.createElement("div"))).toBeFalsy();
    expect(fn(document.createElement("img"))).toBeFalsy();
    expect(fn(new Image())).toBeFalsy();
});
test("supportTouch", () => {
    const fn = domType.supportTouch;
    expect(fn()).toBeFalsy();
});
