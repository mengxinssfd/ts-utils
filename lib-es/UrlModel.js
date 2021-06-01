import * as urlUtils from "./url";
import { isEmptyObject } from "./dataType";
/**
 * 解析url
 * @Author: dyh
 * @Date: 2019-10-17 10:44
 * @Description:
 */
export class UrlModel {
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
        if (!isEmptyObject(this.query)) {
            url += "?" + urlUtils.stringifyUrlSearch(this.query);
        }
        if (this.hash) {
            url += this.hash;
        }
        return url;
    }
}
