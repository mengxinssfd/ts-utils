export class Download {
  static downloadOrJSON({
    res,
    filename,
    onGetJSON,
  }: {
    res: { status: number; data: any };
    filename: string;
    onGetJSON?: (json: {}) => void;
  }) {
    if (res.status === 200) {
      // Log(res);
      const blob = res.data;
      // 返回的是json
      if (res.data.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = JSON.parse(e.target.result) || {};
          if (onGetJSON) onGetJSON(data);
        };
        reader.readAsText(blob, 'utf-8');
      } else {
        Download.download(filename, window.URL.createObjectURL(new Blob([res.data])));
      }
    }
  }

  // 下载简单实现
  static download(filename: string, objectURL: ReturnType<typeof window.URL.createObjectURL>) {
    const domA = document.createElement('a');
    if ('download' in domA) {
      domA.href = objectURL;
      domA.setAttribute('download', filename); // 自定义下载文件名（如exemple.txt）
      document.body.appendChild(domA); // 火狐浏览器必须把domA放到body下才能点击
      domA.click();
      document.body.removeChild(domA);
      // domA = null;
      window.URL.revokeObjectURL(objectURL);
    } else {
      // TODO 这一段可以去掉了
      (navigator as any).msSaveBlob(objectURL, filename);
    }
    window.URL.revokeObjectURL(objectURL);
  }
}
