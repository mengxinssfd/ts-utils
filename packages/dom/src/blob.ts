import { Tuple } from '@mxssfd/types';

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      resolve(e.target.result);
    };
    // readAsDataURL
    fileReader.readAsDataURL(blob);
    fileReader.onerror = fileReader.onabort = () => {
      reject(new Error('blobToBase64 error'));
    };
  });
}

export function parseBase64(dataURL: string): { mime: string; uint8Array: Uint8Array } {
  const arr = dataURL.split(',') as Tuple<string, 2>;
  const mime = (arr[0].match(/:(.*?);/) ?? [])[1] as string;
  const atob1 = window.atob(arr[1]);
  let n = atob1.length;
  const uint8Array = new Uint8Array(n);
  while (n--) {
    uint8Array[n] = atob1.charCodeAt(n);
  }
  return { mime, uint8Array };
}

export function base64ToBlob(dataURL: string): Blob {
  const { mime, uint8Array } = parseBase64(dataURL);
  return new Blob([uint8Array], { type: mime });
}
export function base64ToFile(dataURL: string, filename?: string): File {
  const { mime, uint8Array } = parseBase64(dataURL);
  const fileName = filename ? filename : Date.now() + '.' + mime.replace(/^.*\//, '');
  return new File([uint8Array], fileName, { type: mime });
}

export function imgToBlob(url: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (this.status == 200) {
        resolve(this.response);
      } else {
        reject();
      }
    };
    xhr.onerror = xhr.onabort = reject;
    xhr.send();
  });
}

// tips ie9不支持Blob
