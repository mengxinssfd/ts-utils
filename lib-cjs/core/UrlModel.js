"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlModel = void 0;
const urlUtils = __importStar(require("./url"));
/**
 * 解析url
 * @Author: dyh
 * @Date: 2019-10-17 10:44
 * @Description:
 */
class UrlModel {
    // queryStr: string = "";
    constructor(url) {
        this.protocol = "";
        this.port = "";
        this.host = "";
        this.path = "";
        this.href = "";
        this.hash = "";
        this.query = {};
        this.href = url;
        this.parseAll(url);
    }
    parseAll(url) {
        this.protocol = urlUtils.getUrlProtocol(url);
        this.host = urlUtils.getUrlHost(url);
        this.port = urlUtils.getUrlPort(url);
        this.path = urlUtils.getUrlPath(url);
        this.hash = urlUtils.getUrlHash(url);
        this.query = urlUtils.getUrlParamObj(url);
    }
    toString(template = "{protocol}{host}{port}{pathname}{params}{hash}") {
        const match = {
            '{protocol}': () => this.protocol ? `${this.protocol}://` : '',
            '{host}': () => this.host || "",
            '{port}': () => this.port ? `:${this.port}` : '',
            '{pathname}': () => this.path || "",
            '{params}': () => {
                const query = urlUtils.stringifyUrlSearch(this.query);
                if (query) {
                    return "?" + query;
                }
                return "";
            },
            '{hash}': () => this.hash || "",
        };
        for (let k in match) {
            const fn = match[k];
            template = template.replace(new RegExp(k, "g"), fn());
        }
        return template;
    }
}
exports.UrlModel = UrlModel;
