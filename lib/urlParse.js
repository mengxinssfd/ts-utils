"use strict";
/**
 * 解析url
 * @Author: dyh
 * @Date: 2019-10-17 10:44
 * @Description:
 */
Object.defineProperty(exports, "__esModule", { value: true });
class UrlParse {
    constructor(url) {
        if (!url)
            return;
        this.href = url;
        this.parse(url);
    }
    parse(url) {
        this.schema = this.parseSchema(url);
        this.host = this.parseHost(url);
        this.port = this.parsePort(url);
        this.pathname = this.parsePathname(url);
        this.hash = this.parseHash(url);
        this.query = this.parseQuery(url);
    }
    parseSchema(url) {
        url = url.split("?")[0];
        const reg = /(https?):\/\//;
        let schema = "";
        if (reg.test(url)) {
            schema = RegExp.$1;
        }
        return schema;
    }
    parseHost(url) {
        url = url.split("?")[0];
        let host = "";
        if (/^\//.test(url)) {
            return host;
        }
        if (/(?:https?\:\/\/)?(((\w-?)+\.?)+)/.test(url)) {
            host = RegExp.$1;
        }
        return host;
    }
    parsePort(url) {
        url = url.split("?")[0];
        if (/:(\d+)/.test(url)) {
            return RegExp.$1;
        }
        return "";
    }
    parsePathname(url) {
        url = url.split("?")[0];
        let pathname = "";
        if (/^\//.test(url)) {
            return url.substr(1);
        }
        pathname = url.split(/[\?#]/)[0].replace(/(https?:\/\/)?((\w-?)+\.?)+(:\d+)?\/?/, "");
        return pathname;
    }
    parseHash(url) {
        let hash = "";
        if (/#((\w+-?)+)/.test(url))
            hash = RegExp.$1;
        return hash;
    }
    parseQuery(url) {
        let query = {};
        // 去除?号前的
        url = url.split("?")[1];
        // 去掉hash
        url = url.split("#")[0];
        let params = url.split("&");
        for (const index in params) {
            let [key, value] = params[index].split("=");
            key = decodeURIComponent(key);
            // a[]=0&a[]=1 || a[0]=0&a[1]=1 转成 a=0&a=1 TODO 看看vue的路由参数是怎么解析的
            key = key.replace(/\[\w*\]/g, "");
            value = decodeURIComponent(value);
            if (query[key] === undefined) {
                query[key] = value;
            }
            else {
                if (Object.prototype.toString.call(query[key]) === "[object Array]") {
                    query[key].push(value);
                }
                else {
                    query[key] = [query[key], value];
                }
            }
        }
        return query;
    }
}
exports.UrlParse = UrlParse;
const url = "http://www.baidu.com:112332/index.php/admin/MonitorResultManager/monitorData?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on&b%5B1%5D=on&c=1&c=2&d=1,2,3,4,5&pid=19&pname=%E7%8E%AF%E7%90%83%E8%B4%B8%E6%98%93%E9%A1%B9%E7%9B%AE%E5%9F%BA%E5%9D%91%E5%9C%B0%E9%93%812%E5%8F%B7%E7%BA%BF%E9%9A%A7%E9%81%93%E7%BB%93%E6%9E%84%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9B%91%E6%B5%8B#test";
const urlParse = new UrlParse(url);
console.log(urlParse);
