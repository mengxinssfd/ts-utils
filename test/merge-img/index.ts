/*
import {createElement, loadScript} from "../../src/dom";
import {MergeImg} from "../../src/ImgMerge";

declare const Vue: any;
(async function () {
    const script = await loadScript("https://cdn.bootcdn.net/ajax/libs/vue/3.0.11/vue.global.js");
    console.log(script, Vue);
})();
/!*(async function () {
    const mi = await MergeImg.createWithBg("./static/img.png");
    console.log(mi);
    // await mi.addImg("./static/img2.png", {left: 20, top: 20});
    // await mi.addImg("./static/img2.png", {right: 20, bottom: 20});
    // await mi.addImg("./static/img2.png", {left: 20, right: 20});
    // await mi.addImg("./static/img2.png", {top: 0, bottom: 0});
    // await mi.addImg("./static/img2.png", {left: 20, right: 20, top: 20, bottom: 20});
    // await mi.addImg("./static/img2.png", {left: 20, right: 20, top: 20, bottom: 20}, [100, undefined]);
    // await mi.addImg("./static/img2.png", {left: 20, right: 20, top: 20, bottom: 20}, [, 100]);
    // await mi.addImg("./static/img2.png", {left: 20, right: 20, top: 20, bottom: 20}, [100, 50]);
    // await mi.addImg("./static/img2.png", {left: 200, right: 200});
    // await mi.addImg("./static/img2.png", {top: 20, bottom: 20});
    await mi.addImg("./static/img2.png", {top: 20, bottom: 20, left: 20, right: 20});
    createElement("img", {
        props: {
            src: mi.toDataURL(),
        },
        parent: document.body,
    });
})();*!/
(async function () {
    const mi = await MergeImg.createWithBg("./static/img.png");

    console.log(mi);
    await mi.addImg("./static/img2.png", {
        left: 0,
        top: 0,
        width: 120,
        height: 120,
        zIndex: 120,
    });
    await mi.addImg("./static/img2.png", {bottom: 0, right: 0, width: 60, height: 60, zIndex: 100});
    await mi.addImg("./static/img2.png", {top: 100, left: 100, width: 60, height: 60, zIndex: 100});
    await mi.addImg("./static/img2.png", {top: 20, bottom: 20, left: 20, right: 20});
    const img = createElement("img", {
            props: {src: mi.toDataURL()},
            parent: document.body,
        },
    );
    addEventListener("keyup", e => {
        console.log(e.key);
        if (e.key === "c") {
            mi.clear();
            img.src = mi.toDataURL();
        }
        if (e.key === "r") {
            mi.reRender();
            img.src = mi.toDataURL();
        }
    });
})();
// auto
(async function () {
    const mi = await MergeImg.createWithBg("./static/img.png");
    await mi.addImg("./static/img2.png", {
        left: 0,
        top: 0,
        width: 120,
        height: "auto",
        zIndex: 120,
    });
    await mi.addImg("./static/img2.png", {
        left: 0,
        top: 0,
        zIndex: 0,
    });
    await mi.addImg("./static/img2.png", {
        left: 0,
        top: 0,
        width: "auto",
        height: "auto",
        zIndex: 0,
    });
    createElement("img", {
            props: {src: mi.toDataURL()},
            parent: document.body,
        },
    );
})();
(async function () {
    const mi = await MergeImg.createWithBg("./static/img.png");
    await mi.addImg("./static/img2.png", {
        left: 0,
        top: 0,
        width: "auto",
        height: 200,
        zIndex: 0,
    });
    createElement("img", {
            props: {src: mi.toDataURL()},
            parent: document.body,
        },
    );
})();
// align
(async function () {
    const mi = await MergeImg.createWithBg("https://cn.bing.com/th?id=OHR.MississippiRiver_ZH-CN5718433026_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp");
    // verticalAlign
    const img = await mi.addImg("./static/img2.png", {
        width: "auto",
        height: 60,
        verticalAlign: "top",
        zIndex: 0,
    });
    mi.addImg(img, {
        width: "auto",
        height: 60,
        verticalAlign: "middle",
        zIndex: 0,
    });
    mi.addImg(img, {
        width: "auto",
        height: 60,
        verticalAlign: "bottom",
        zIndex: 0,
    });
    // horizontalAlign
    mi.addImg(img, {
        width: "auto",
        height: 50,
        horizontalAlign: "left",
        zIndex: 10,
    });
    mi.addImg(img, {
        width: "auto",
        height: 60,
        horizontalAlign: "middle",
        zIndex: 0,
    });
    mi.addImg(img, {
        width: "auto",
        height: 60,
        horizontalAlign: "right",
        zIndex: 0,
    });
    // horizontalAlign & verticalAlign
    mi.addImg(img, {
        width: "auto",
        height: 300,
        horizontalAlign: "middle",
        verticalAlign: "middle",
        zIndex: 10,
    });
    mi.addImg(img, {
        width: "auto",
        height: 50,
        horizontalAlign: "middle",
        verticalAlign: "bottom",
        zIndex: 10,
    });
    mi.addImg(img, {
        width: "auto",
        height: 50,
        horizontalAlign: "right",
        verticalAlign: "middle",
        zIndex: 10,
    });
    mi.addImg(img, {
        width: "auto",
        height: 50,
        horizontalAlign: "right",
        verticalAlign: "bottom",
        zIndex: 10,
    });
    createElement("img", {
            props: {
                src: mi.toDataURL(),
                style: {
                    display: "block",
                },
            },
            parent: createElement("div", {
                props: {
                    innerText: "align",
                },
                parent: document.body,
            }),
        },
    );
})();
*/
import {debounce} from "../../packages/ts-utils";

let time = Date.now();
addEventListener("keyup", debounce(() => {
    const now = Date.now();
    console.log(now - time);
    time = now;
}, 1000));