import {createElement} from "@/dom";
import {MergeImg} from "../../src/ImgMerge";

(async function () {
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
    document.body.append(createElement("img", {src: mi.toDataURL()}));
})();