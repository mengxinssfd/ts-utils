"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// 与dom有关的工具函数
__exportStar(require("./dom"), exports);
__exportStar(require("./download"), exports);
__exportStar(require("./ImgMerge"), exports);
__exportStar(require("./domType"), exports);
__exportStar(require("./event"), exports);
__exportStar(require("./blob"), exports);
__exportStar(require("./color"), exports);
