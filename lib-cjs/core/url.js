"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUrl = exports.UrlRegExp = exports.setUrlParam = exports.updateUrlParam = exports.getUrlParam = exports.stringifyUrlSearch = exports.getUrlQuery = exports.getUrlParamObj = exports.getUrlHashParam = exports.getUrlHash = exports.getUrlPath = exports.getUrlPort = exports.getUrlHost = exports.getUrlProtocol = void 0;
const object_1 = require("./object");
const UrlModel_1 = require("./UrlModel");
// url规则文档：https://datatracker.ietf.org/doc/html/rfc3986
const protocolReg = /^(\w+):\/\//;
/**
 * @param {string} [url = location.href]
 */
function getUrlProtocol(url = location.href) {
    const reg = new RegExp(protocolReg);
    let schema = "";
    if (reg.test(url)) {
        schema = RegExp.$1;
    }
    return schema;
}
exports.getUrlProtocol = getUrlProtocol;
const hostReg = /(?:(?:\w+):\/\/|\/\/)((?:(?:[\w\-\u4e00-\u9fa5])+\.?)+\w+)/;
/**
 * @param {string} [url = location.href]
 */
function getUrlHost(url = location.href) {
    const exec = new RegExp(hostReg).exec(url);
    return exec ? exec[1] : "";
}
exports.getUrlHost = getUrlHost;
/**
 * @param {string} [url = location.href]
 */
function getUrlPort(url = location.href) {
    url = url.split("?")[0];
    if (/:(\d+)/.test(url)) {
        return RegExp.$1;
    }
    return "";
}
exports.getUrlPort = getUrlPort;
/**
 * @param {string} [url = location.href]
 */
function getUrlPath(url = location.href) {
    // 去掉query、hash
    url = url.split(/[?#]/)[0];
    // 去掉schema
    return url.replace(new RegExp(`(${hostReg.source}(?::\\d+)?)|${protocolReg.source}`), "");
}
exports.getUrlPath = getUrlPath;
/**
 * @param {string} [url = location.href]
 */
function getUrlHash(url = location.href) {
    const index = url.indexOf("#");
    if (index < 0)
        return "";
    return url.substring(index);
}
exports.getUrlHash = getUrlHash;
/**
 * 获取hash中的param
 * @example
 * getUrlHashParam("a", "test.com/index?a=param/#/test?a=hash") // returns "hash"
 * getUrlHashParam("a", "test.com/index?a=param") // returns ""
 * @param name
 * @param {string} [url = location.href]
 * @param noDecode
 */
function getUrlHashParam(name, url = location.href, noDecode = false) {
    return getUrlParam(name, getUrlHash(url), noDecode);
}
exports.getUrlHashParam = getUrlHashParam;
/**
 * @alias getUrlQuery
 * @param {string} [url = location.href]
 */
function getUrlParamObj(url = location.href) {
    const params = url.match(/[^&#?/]+=[^&#?/]+/g);
    if (!params)
        return {};
    return object_1.revertObjFromPath(params);
}
exports.getUrlParamObj = getUrlParamObj;
exports.getUrlQuery = getUrlParamObj;
function stringifyUrlSearch(query) {
    return object_1.reduceObj(query, (initValue, v, k, obj) => {
        if (v === undefined)
            return initValue;
        if (typeof v === "object") {
            object_1.forEachObj(v, (val, key) => {
                if (val === undefined)
                    return;
                initValue.push(`${k}[${key}]=${encodeURIComponent(val)}`);
            });
        }
        else {
            initValue.push(`${k}=${encodeURIComponent(v)}`);
        }
        return initValue;
    }, []).join("&");
}
exports.stringifyUrlSearch = stringifyUrlSearch;
/**
 * 来源于网页调起qq 只获取url参数的话可以使用这个
 * @tips 该函数有局限性，只能获取一般的参数，不能获取数组
 * @param name
 * @param [url=location.href]
 * @param [noDecode=false]
 */
function getUrlParam(name, url = location.href /* node也有 */, noDecode = false) {
    // 原代码hash也会获取
    // const re = new RegExp("(?:\\?|#|&)" + name + "=([^&]*)(?:$|&|#)", "i"),
    // 修改后不会获取到hash
    const re = new RegExp("(?:\\?|#|&)" + name + "=([^&#]*)(?:$|&|#)", "i");
    const m = re.exec(url);
    const ret = m ? m[1] : "";
    return noDecode ? ret : decodeURIComponent(ret);
}
exports.getUrlParam = getUrlParam;
/**
 * 修改url参数，不能新增或删除参数
 * @param param
 * @param url
 * @param noDecode
 */
function updateUrlParam(param, url = location.href, noDecode = false) {
    object_1.objForEach(param, (value, name) => {
        const re = new RegExp("(?:\\?|#|&)" + name + "=([^&#]*)(?:$|&|#)", "i");
        if (re.test(url)) {
            const s = noDecode ? value : encodeURIComponent(value);
            url = url.replace(`${name}=${RegExp.$1}`, `${name}=${s}`);
        }
    });
    return url;
}
exports.updateUrlParam = updateUrlParam;
/**
 * 设置url参数，可新增或删除参数
 * @param param
 * @param url
 */
function setUrlParam(param, url = location.href) {
    const model = new UrlModel_1.UrlModel(url);
    object_1.assign(model.query, param);
    return model.toString();
}
exports.setUrlParam = setUrlParam;
// 参考async-validator
exports.UrlRegExp = new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$", "i");
function isUrl(url) {
    return exports.UrlRegExp.test(url);
}
exports.isUrl = isUrl;
