"use strict";
/**
 * @Author: dyh
 * @Date: 2019-10-17 10:44
 * @Description:
 */
exports.__esModule = true;
var UrlParse = /** @class */ (function () {
    function UrlParse(url) {
        if (!url)
            return;
        this.href = url;
        if (/^\//.test(url)) {
            url = url.substr(1);
        }
        this.url = url;
        this.parse();
    }
    UrlParse.prototype.parse = function () {
        this.schema = this.parseSchema(this.href);
        this.host = this.parseHost(this.href);
        this.port = this.parsePort(this.href);
    };
    UrlParse.prototype.parseSchema = function (url) {
        url = url.split("?")[0];
        var reg = /(https?):\/\//;
        var schema = "";
        if (reg.test(url)) {
            schema = RegExp.$1;
        }
        return schema;
    };
    UrlParse.prototype.parseHost = function (url) {
        url = url.split("?")[0];
        var host = "";
        if (/^\//.test(url)) {
            return host;
        }
        if (/((\w+\.)+\w+)\b/.test(url)) {
            host = RegExp.$1;
        }
        return host;
    };
    UrlParse.prototype.parsePort = function (url) {
        url = url.split("?")[0];
        if (/(?!(?!\w+\.)+\w+):(\d+)\b/.test(url)) {
            return RegExp.$1;
        }
        return "";
    };
    UrlParse.prototype.parsePathname = function (url) {
        url = url.split("?")[0];
        var pathname = "";
        if (/^\//.test(url)) {
            return url.substr(1);
        }
        return pathname;
    };
    return UrlParse;
}());
exports.UrlParse = UrlParse;
