export function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            resolve(e.target.result);
        };
        // readAsDataURL
        fileReader.readAsDataURL(blob);
        fileReader.onerror = fileReader.onabort = () => {
            reject(new Error("blobToBase64 error"));
        };
    });
}
export function base64ToBlob(dataURL) {
    var _a;
    const arr = dataURL.split(",");
    const mime = ((_a = arr[0].match(/:(.*?);/)) !== null && _a !== void 0 ? _a : [])[1];
    const atob1 = window.atob(arr[1]);
    let n = atob1.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = atob1.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
export function imgToBlob(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
            if (this.status == 200) {
                resolve(this.response);
            }
            else {
                reject();
            }
        };
        xhr.onerror = xhr.onabort = reject;
        xhr.send();
    });
}
// tips ie9不支持Blob
