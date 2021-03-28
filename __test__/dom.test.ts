import * as dom from "../src/dom";
import {isDivElement} from "../src/domType";

test("supportClassList", () => {
    const fn = dom.supportClassList;

    expect(fn()).toBeTruthy();
});

function testHasClass(fn: typeof dom.hasClass) {
    const div = document.createElement("div");

    expect(div.className).toBe("");
    div.className = "test test";
    expect(fn(div, "test")).toBeTruthy();
    expect(fn(div, "test ")).toBeTruthy();
    expect(fn(div, "test test")).toBeTruthy();
    expect(fn(div, "test test test2")).toBeFalsy();
    expect(fn(div, ["test", "test", "test2"])).toBeFalsy();
    expect(fn(div, "test2")).toBeFalsy();
    expect(fn(div, "test t")).toBeFalsy();
}

test("hasClassIe8", () => {
    const fn = dom.hasClassIe8;
    testHasClass(fn);
});
test("hasClass", () => {
    const fn = dom.hasClass;
    expect(fn === dom.hasClassStandard).toBeTruthy();
    testHasClass(fn);
});

function addClass(fn: typeof dom.addClass) {
    const div = document.createElement("div");
    expect(div.className).toBe("");
    div.className = "test test";
    expect(div.className).toBe("test test");
    fn(div, "test");
    expect(div.className).toBe("test");
    fn(div, "test test2");
    expect(div.className).toBe("test test2");
    fn(div, ["test ", " test3"]);
    expect(div.className).toBe("test test2 test3");
    fn(div, "a b   c");
    expect(div.className).toBe("test test2 test3 a b c");
}

test("addClassIe8", () => {
    const fn = dom.addClassIe8;
    addClass(fn);
});
test("addClass", () => {
    const fn = dom.addClass;
    expect(fn === dom.addClassStandard).toBeTruthy();
    addClass(fn);
});

function rmClass(fn: typeof dom.removeClass) {
    const div = document.createElement("div");
    div.className = "test test";
    expect(div.className).toBe("test test");
    fn(div, "test");
    expect(div.className).toBe("");
    div.className = "test test2 test3";
    fn(div, "test3");
    expect(div.className).toBe("test test2");
    div.className = "test test test2 test3";
    fn(div, "test2");
    expect(div.className).toBe("test test3");
    fn(div, "test test3");
    expect(div.className).toBe("");
    div.className = "test test test2 test3";
    fn(div, ["test", "test2"]);
    expect(div.className).toBe("test3");
}

test("removeClassIe8", () => {
    const fn = dom.removeClassIe8;
    rmClass(fn);
});
test("removeClass", () => {
    const fn = dom.removeClass;
    rmClass(fn);
    expect(fn === dom.removeClassStandard).toBeTruthy();
});
test("toggleClass", () => {
    const fn = dom.toggleClass;
    const div = document.createElement("div");
    div.className = "test test";
    expect(div.className).toBe("test test");
    fn(div, "test2");
    expect(div.className).toBe("test test2");
    fn(div, "test2");
    expect(div.className).toBe("test");
    div.className = "test test test3";
    fn(div, "test2");
    expect(div.className).toBe("test test3 test2");
});
test("prefixStyle", () => {
    const fn = dom.prefixStyle;
    expect(fn("transform")).toBe("webkitTransform");
});
test("cssSupport", () => {
    const fn = dom.cssSupport;
    expect(fn("position", "sticky")).toBeTruthy();
    expect(fn("ppppp", "test")).toBeFalsy();
});
test("createElement", () => {
    const fn = dom.createElement;
    let clickTest = 0;
    const div = fn("div", {
        class: "a b c",
        style: {
            "fontSize": "20px",
            color: "red",
        },
        onclick() {
            clickTest = 1;
        },
    });
    document.body.appendChild(div);
    // div.click();
    expect(isDivElement(div)).toBeTruthy();
    expect(div.className).toBe("a b c");
    expect(clickTest).toBe(0);
    expect(div.style.fontSize).toBe("20px");
    expect(div.style.color).toBe("red");
});
