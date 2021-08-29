"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Download = void 0;
class Download {
    static downloadOrJSON({ res, filename, onGetJSON }) {
        if (res.status === 200) {
            // Log(res);
            const blob = res.data;
            // 返回的是json
            if (res.data.type === 'application/json') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = JSON.parse(e.target.result) || {};
                    if (onGetJSON)
                        onGetJSON(data);
                };
                reader.readAsText(blob, 'utf-8');
            }
            else {
                Download.download(filename, window.URL.createObjectURL(new Blob([res.data])));
            }
        }
    }
    // 下载简单实现
    static download(filename, objectURL) {
        let domA = document.createElement('a');
        if ('download' in domA) {
            domA.href = objectURL;
            domA.setAttribute('download', filename); // 自定义下载文件名（如exemple.txt）
            document.body.appendChild(domA); // 火狐浏览器必须把domA放到body下才能点击
            domA.click();
            document.body.removeChild(domA);
            // domA = null;
            window.URL.revokeObjectURL(objectURL);
        }
        else {
            navigator.msSaveBlob(objectURL, filename);
        }
        window.URL.revokeObjectURL(objectURL);
    }
}
exports.Download = Download;
