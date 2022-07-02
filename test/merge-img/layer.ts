import {createElement, MergeImg, loadScript, blobToBase64, imgToBlob} from "../../packages/ts-utils/src";

loadScript({
    props: {defer: true},
    url: "https://cdn.jsdelivr.net/npm/promise-polyfill@8.2.0/dist/polyfill.min.js",
    onLoad() {
        console.log("polyfill");

        // ie10及以下img标签不支持crossOrigin 兼容ie10 ie9不支持Blob
        async function getImg(url) {
            const blob = await imgToBlob(url);
            return blobToBase64(blob);
        }

        (async function () {
            await loadScript("https://cdn.jsdelivr.net/npm/promise-polyfill@8.2.0/dist/polyfill.min.js").then(script => console.log(script));
            const url = await getImg("https://cn.bing.com/th?id=OHR.MississippiRiver_ZH-CN5718433026_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp");
            // const mi = await MergeImg.createWithBg("https://cn.bing.com/th?id=OHR.MississippiRiver_ZH-CN5718433026_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp");
            const mi = await MergeImg.createWithBg(url);
            // const mi = await MergeImg.createWithBg("./static/img.png");
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
            await mi.drawRoundRect(20);
            // const blob = await mi.toBlob();
            // console.log(blob);
            createElement("img", {
                    props: {
                        crossOrigin: "anonymous",
                        src: mi.toDataURL(),
                        style: {
                            display: "block",
                        },
                    },
                    parent: document.body,
                },
            );
        })();
    }
});

loadScript({
    url: "https://cdnn.bootcdn.net/ajax/libs/vue/3.2.0-beta.1/vue.global.prod.jss",
    onError(e) {
        console.log(111111);
    }
});

console.log("2222222222222", (document.currentScript as any).alias);
