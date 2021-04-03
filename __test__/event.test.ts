import * as ev from "../src/event";
import {createElement} from "../src/dom";

test("onceEvent", () => {
    const fn = ev.onceEvent;
    const d = document.createElement("div");
    let c = 0, c2 = 0;
    fn(d, "click", () => {
        c2++;
    });
    d.onclick = function () {
        c++;
    };
    d.click();
    d.click();
    d.click();
    expect(c).toBe(3);
    expect(c2).toBe(1);
});
test("eventProxy", () => {
    const fn = ev.eventProxy;
    const d = document.createElement("div");
    const d2 = createElement("div", {
        props: {
            className: "test",
        },
        children: [d],
    });
    let c = 0, c2 = 0, c3 = 0;
    d.onclick = function () {
        c++;
    };
    fn(null, "click", d, () => {
        c2++;
    });
    fn(d2, "click", d, () => {
        c3++;
    });

    d.click();
    d.click();
    d.click();
    expect(c).toBe(3);
    expect(c2).toBe(3);
    expect(c3).toBe(3);
});