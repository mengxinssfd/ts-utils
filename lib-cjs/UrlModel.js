"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlModel = void 0;
const tslib_1 = require("tslib");
const urlUtils = tslib_1.__importStar(require("./url"));
const dataType_1 = require("./dataType");
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
    toString() {
        let url = this.host;
        if (this.protocol) {
            url = `${this.protocol}://${url}`;
        }
        if (this.port) {
            url += ":" + this.port;
        }
        if (this.path) {
            url += this.path;
        }
        if (!dataType_1.isEmptyObject(this.query)) {
            url += "?" + urlUtils.stringifyUrlSearch(this.query);
        }
        if (this.hash) {
            url += this.hash;
        }
        return url;
    }
}
exports.UrlModel = UrlModel;
