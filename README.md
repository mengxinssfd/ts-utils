# typescript 工具函数

[![](https://data.jsdelivr.com/v1/package/npm/@mxssfd/ts-utils/badge)](https://www.jsdelivr.com/package/npm/@mxssfd/ts-utils)
[![](https://img.shields.io/github/languages/count/mengxinssfd/ts-utils)](https://img.shields.io/github/languages/count/mengxinssfd/ts-utils)
![](https://img.shields.io/github/languages/top/mengxinssfd/ts-utils)
![](https://img.shields.io/npms-io/quality-score/@mxssfd/ts-utils)
![](https://img.shields.io/npms-io/final-score/@mxssfd/ts-utils)
![](https://img.shields.io/github/license/mengxinssfd/ts-utils)
![](https://img.shields.io/github/commit-activity/y/mengxinssfd/ts-utils)
![](https://img.shields.io/github/commit-activity/m/mengxinssfd/ts-utils)
![](https://img.shields.io/github/commit-activity/w/mengxinssfd/ts-utils)
![](https://img.shields.io/github/contributors/mengxinssfd/ts-utils)
![](https://img.shields.io/github/last-commit/mengxinssfd/ts-utils)
![](https://img.shields.io/github/package-json/v/mengxinssfd/ts-utils)
![](https://img.shields.io/github/languages/code-size/mengxinssfd/ts-utils)
![](https://img.shields.io/github/directory-file-count/mengxinssfd/ts-utils)
![](https://img.shields.io/github/repo-size/mengxinssfd/ts-utils)
![](https://img.shields.io/github/package-json/keywords/mengxinssfd/ts-utils)
![](https://img.shields.io/github/hacktoberfest/2019/mengxinssfd/ts-utils)

**工欲善其事必先利其器。**

开发中积累的一些常用工具函数，减少开发时的重复编码。
分为常用工具函数及一些 es5 以上功能的替代函数。
0 依赖
目前有 200 多个工具函数。

## 使用方法

`npm`引入

```shell
pnpm add @mxssfd/ts-utils -S
```

```javascript
import { debounce } from '@mxssfd/ts-utils';
debounce(() => {
  console.log('do something');
}, 1000);
```

`cdn`引入

```html
<script src="https://cdn.jsdelivr.net/npm/@mxssfd/ts-utils/dist/ts-utils.global.js"></script>
<script>
  tsUtils.debounce(() => {
    console.log('do something');
  }, 1000);
</script>
```
