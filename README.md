# typescript工具函数
工欲善其事必先利其器
## 使用方法
   es6引入
```javascript
import {debounce} from "@mxssfd/ts-utils";
debounce(() => { console.log("do something") }, 1000);
```
   cdn引入
```html
<script src="lib-umd/index.js"></script>
<script >tsUtils.debounce(() => { console.log("do something") }, 1000);</script>
```