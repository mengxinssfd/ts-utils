export class Download {
    constructor(
        {
            res,
            filename,
            onGetJSON
        }: {
            res: { status: number, data: any },
            filename: string,
            onGetJSON?: (json: {}) => void
        }
    ) {
        if (res.status === 200) {
            // Log(res);
            const blob = res.data;
            // 返回的是json
            if (res.data.type === "application/json") {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    const data = JSON.parse(e.target.result) || {};
                    if (onGetJSON) onGetJSON(data);
                };
                reader.readAsText(blob, "utf-8");
            } else {
                this.download(filename, res.data);
            }
        }
    }

    private download(filename: string, data: any) {
        const blob = new Blob([data]);
        const domA = document.createElement("a");
        if ("download" in domA) {
            const objectURL = window.URL.createObjectURL(blob);
            domA.href = objectURL;
            domA.setAttribute("download", filename); // 自定义下载文件名（如exemple.txt）
            document.body.appendChild(domA); // 火狐浏览器必须把domA放到body下才能点击
            domA.click();
            document.body.removeChild(domA);
            // domA = null;
            window.URL.revokeObjectURL(objectURL);
        } else {
            navigator.msSaveBlob(blob, filename);
        }
    }
}
