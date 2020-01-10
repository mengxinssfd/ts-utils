export class Download {
    constructor({ res, filename, onGetJSON }) {
        if (res.status === 200) {
            // Log(res);
            const blob = res.data;
            // 返回的是json
            if (res.data.type === "application/json") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = JSON.parse(e.target.result) || {};
                    if (onGetJSON)
                        onGetJSON(data);
                };
                reader.readAsText(blob, "utf-8");
            }
            else {
                this.download(filename, res);
            }
        }
    }
    // 下载简单实现
    download(filename, res) {
        let url = window.URL.createObjectURL(new Blob([res.data]));
        let domA = document.createElement("a");
        if ("download" in domA) {
            domA.href = url;
            domA.setAttribute("download", filename); // 自定义下载文件名（如exemple.txt）
            document.body.appendChild(domA); // 火狐浏览器必须把domA放到body下才能点击
            domA.click();
            document.body.removeChild(domA);
            // domA = null;
        }
        else {
            navigator.msSaveBlob(url, filename);
        }
    }
}
