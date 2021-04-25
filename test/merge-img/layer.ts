import {createElement} from "../../src";
import {MergeImg} from "../../src/ImgMerge";

(async function () {
    const mi = await MergeImg.createWithBg("https://cn.bing.com/th?id=OHR.MississippiRiver_ZH-CN5718433026_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp");
    // verticalAlign
    const img = await mi.mainLayer.addImg("./static/img2.png", {
        width: "auto",
        height: 60,
        verticalAlign: "top",
        zIndex: 0,
    });
    mi.mainLayer.addImg(img, {
        width: "auto",
        height: 60,
        verticalAlign: "middle",
        zIndex: 0,
    });
    mi.mainLayer.addImg(img, {
        width: "auto",
        height: 60,
        verticalAlign: "bottom",
        zIndex: 0,
    });
    const layer = mi.addLayer({zIndex: 1000});

    layer.addImg(img, {
        width: "auto",
        height: 60,
        left: 30,
        verticalAlign: "middle",
        zIndex: 0,
    });

    createElement("img", {
            props: {
                src: mi.toDataURL(),
                style: {
                    display: "block",
                },
            },
            parent: document.body,
        },
    );
})();