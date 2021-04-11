# typescript工具函数
工欲善其事必先利其器。  
开发中积累的一些常用工具函数，减少开发时的重复编码。  
分为常用工具函数及一些es5以上功能的替代函数。  
0依赖  
目前有近200个工具函数。
## 使用方法
   es引入
```javascript
import {debounce} from "@mxssfd/ts-utils";
debounce(() => { console.log("do something") }, 1000);
```
   cdn引入
```html
<script src="https://cdn.jsdelivr.net/npm/@mxssfd/ts-utils/lib-umd/index.min.js"></script>
<script >tsUtils.debounce(() => { console.log("do something") }, 1000);</script>
```