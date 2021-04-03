import * as ev from "../src/event";

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