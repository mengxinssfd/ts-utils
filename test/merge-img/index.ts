import {createElement} from "../../src/dom";
import {MergeImg} from "../../src/ImgMerge";

/*(async function () {
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
})();*/
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