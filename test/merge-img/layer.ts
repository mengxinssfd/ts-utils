import {createElement, MergeImg} from "../../src";

(async function () {
    const mi = await MergeImg.createWithBg("https://cn.bing.com/th?id=OHR.MississippiRiver_ZH-CN5718433026_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp");
    const mainLayer = mi.addLayer({
        background: "rgba(0,0,0,0.5)",
    });
    // verticalAlign
    const img = await mainLayer.addImg("./static/img2.png", {
        width: "auto",
        height: 60,
        verticalAlign: "top",
        zIndex: 0,
    });
    mainLayer.addImg(img.content, {
        width: "auto",
        height: 60,
        verticalAlign: "middle",
        zIndex: 0,
    });
    mainLayer.addImg(img.content, {
        width: "auto",
        height: 60,
        verticalAlign: "bottom",
        zIndex: 0,
    });
    const layer = mi.addLayer({
        // width: 600,
        // height: 500,
        width: "auto",
        height: 200,
        verticalAlign: "bottom",
        horizontalAlign: "left",
        zIndex: 1000,
        background: "rgba(255,255,255,0.4)",
    });

    layer.addImg(img.content, {
        width: "auto",
        height: 60,
        left: 30,
        verticalAlign: "middle",
        zIndex: 0,
    });
    layer.addImg(img.content, {
        width: "auto",
        height: 60,
        verticalAlign: "top",
        horizontalAlign: "left",
        zIndex: 0,
    });
    layer.addImg(img.content, {
        width: "auto",
        height: 60,
        verticalAlign: "bottom",
        horizontalAlign: "left",
        zIndex: 0,
    });
    layer.addImg(img.content, {
        width: "auto",
        height: 60,
        verticalAlign: "top",
        horizontalAlign: "middle",
        zIndex: 1000,
    });
    layer.addImg(img.content, {
        width: "auto",
        height: 60,
        verticalAlign: "top",
        horizontalAlign: "right",
        zIndex: 1000,
    });
    layer.addImg(img.content, {
        width: "auto",
        height: 60,
        verticalAlign: "middle",
        horizontalAlign: "middle",
        zIndex: 1000,
    });
    layer.addImg(img.content, {
        width: "auto",
        height: 60,
        verticalAlign: "middle",
        horizontalAlign: "right",
        zIndex: 1000,
    });
    layer.addImg(img.content, {
        width: "auto",
        height: 60,
        verticalAlign: "bottom",
        horizontalAlign: "middle",
        zIndex: 1000,
    });
    // img.content.style.borderRadius = "20px";
    layer.addImg(img.content, {
        width: "auto",
        height: 60,
        verticalAlign: "bottom",
        horizontalAlign: "right",
        zIndex: 1000,
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