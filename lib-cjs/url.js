"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUrl = exports.UrlRegExp = exports.getUrlParam = exports.stringifyUrlSearch = exports.getUrlQuery = exports.getUrlParamObj = exports.getUrlHashParam = exports.getUrlHash = exports.getUrlPath = exports.getUrlPort = exports.getUrlHost = exports.getUrlProtocol = void 0;
const dataType_1 = require("./dataType");
const object_1 = require("./object");
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
    let result = {};
    const params = url.match(/[^&#?/]+=[^&#?/]+/g);
    if (!params)
        return result;
    for (const k in params) {
        const v = params[k];
        let [key, value] = v.split("=").map(item => decodeURIComponent(item));
        let innerKey = "";
        const reg = /\[(\w*)]/g;
        if (reg.test(key)) {
            innerKey = RegExp.$1;
            key = key.replace(reg, "");
        }
        key = key.replace(/\[(\w*)\]/g, "");
        const resultValue = result[key];
        switch (dataType_1.typeOf(resultValue)) {
            case "undefined":
                if (!innerKey) {
                    result[key] = value;
                }
                else {
                    const arr = [];
                    arr[innerKey] = value;
                    result[key] = arr;
                }
                break;
            case "string":
                result[key] = [resultValue];
            case "array":
                if (!innerKey) {
                    result[key].push(value);
                }
                else {
                    result[key][innerKey] = value;
                }
        }
    }
    return result;
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
// 参考async-validator
exports.UrlRegExp = new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$", "i");
function isUrl(url) {
    return exports.UrlRegExp.test(url);
}
exports.isUrl = isUrl;
