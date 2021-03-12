# typescript工具函数
工欲善其事必先利其器，此其器也
## 使用方法
   import导入
```javascript
import {debounce} from "@mxssfd/ts-utils";
debounce(() => { console.log("do something") }, 1000);
```
   cdn
```html
<script src="lib-umd/index-umd.js"></script>
<script >tsUtils.debounce(() => { console.log("do something") }, 1000);</script>
```