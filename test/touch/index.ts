import * as utils from "../../src";

const dom = document.querySelector(".test") as HTMLDivElement;
/*
addEventListener("touchstart", function (e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
});
addEventListener("touchmove", (e) => {
    dom.innerText = e.changedTouches.length + "";
    console.log(e);
});
addEventListener("touchcancel", (e) => {
    dom.innerText = e.changedTouches.length + "";
    console.log(e);
});
*/
console.log(123);
utils.addScaleEventListener(document.documentElement, function (scale) {
    dom.innerText = scale + "";
});

addEventListener("click", () => {
    // dom.innerText = String(utils.randomInt(100, 10000));
    utils.copy2Clipboard(String(utils.randomInt(100, 10000))).then((text) => {
    // utils.copy2Clipboard(dom).then((text) => {
        console.log(text);
    });
});