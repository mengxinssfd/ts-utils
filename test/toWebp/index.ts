import { base64ToFile, blobToBase64, toWebp } from '../../packages/dom/src';
import { loadImg } from '../../packages/dom';

function bitSize(value: number): string {
  const k = 1024;
  const m = k * k;
  const g = k * m;
  if (value < m) return (value / k).toFixed(2) + 'k';
  if (value < g) return (value / m).toFixed(2) + 'm';
  return (value / g).toFixed(2) + 'g';
}

const input = document.querySelector('#imgLoader') as HTMLInputElement;
input.addEventListener('change', async (e) => {
  const target = e.currentTarget as HTMLInputElement;
  const file = (target.files as FileList)[0];
  if (!file) return;
  console.log('\n原图大小：', bitSize(file.size));
  console.log('转成base64再转会blob大小', bitSize(base64ToFile(await blobToBase64(file)).size));

  toWebp(file, 0.98).then((img) => {
    const newFile = base64ToFile(img, file.name);
    console.log('filename:', newFile.name);
    console.log('webp大小：', bitSize(newFile.size));
    loadImg(img).then((img) => {
      document.body.appendChild(img);
    });
  });
});

const url =
  'https://s.cn.bing.net/th?id=OHR.WychwoodForest_ZH-CN6560180288_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp';
console.log('bing图大小：346k');
loadImg(url).then(async (img) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  canvas.getContext('2d')?.drawImage(img, 0, 0);
  // type如果改成自动识别的，函数名就可以改为叫压缩图片了
  const base64 = canvas.toDataURL('image/jpg', 1);
  console.log('bing图计算大小：', bitSize((await base64ToFile(base64)).size));
});
toWebp(url, 0.98).then((img) => {
  const newFile = base64ToFile(img);
  console.log('filename:', newFile.name);
  console.log('webp大小：', bitSize(newFile.size));
  loadImg(img).then((img) => {
    document.body.appendChild(img);
  });
});
