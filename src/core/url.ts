import {assign, forEachObj, objForEach, reduceObj, revertObjFromPath} from "./object";
import {UrlModel} from "./UrlModel";

// url规则文档：https://datatracker.ietf.org/doc/html/rfc3986

const protocolReg = /^(\w+):\/\//;

/**
 * @param {string} [url = location.href]
 */
export function getUrlProtocol(url: string = location.href): string {
    const reg = new RegExp(protocolReg);
    let schema = "";
    if (reg.test(url)) {
        schema = RegExp.$1;
    }
    return schema;
}

export const hostReg = /(?:\w+:\/\/|\/\/)((?:[\w\-\u4e00-\u9fa5]+\.?)+\w+)/;

/**
 * @param {string} [url = location.href]
 */
export function getUrlHost(url: string = location.href): string {
    const exec = new RegExp(hostReg).exec(url);
    return exec ? exec[1] : "";
}

/**
 * @param {string} [url = location.href]
 */
export function getUrlPort(url: string = location.href): string {
    url = url.split("?")[0];
    if (/:(\d+)/.test(url)) {
        return RegExp.$1;
    }
    return "";
}

/**
 * @param {string} [url = location.href]
 */
export function getUrlPath(url: string = location.href): string {
    // 去掉query、hash
    url = url.split(/[?#]/)[0];
    // 去掉schema
    return url.replace(new RegExp(`(${hostReg.source}(?::\\d+)?)|${protocolReg.source}`), "");
}

/**
 * @param {string} [url = location.href]
 */
export function getUrlHash(url: string = location.href): string {
    const index = url.indexOf("#");
    if (index < 0) return "";
    return url.substring(index);
}

/**
 * 获取hash中的param
 * @example
 * getUrlHashParam("a", "test.com/index?a=param/#/test?a=hash") // returns "hash"
 * getUrlHashParam("a", "test.com/index?a=param") // returns ""
 * @param name
 * @param {string} [url = location.href]
 * @param noDecode
 */
export function getUrlHashParam(name: string, url = location.href, noDecode = false): string {
    return getUrlParam(name, getUrlHash(url), noDecode);
}

/**
 * @alias getUrlQuery
 * @param {string} [url = location.href]
 */
export function getUrlParamObj(url: string = location.href): { [key: string]: string | string[] } {
    const params = url.match(/[^&#?/]+=[^&#?/]+/g);

    if (!params) return {};

    return revertObjFromPath(params) as any;
}

export const getUrlQuery = getUrlParamObj;

export function stringifyUrlSearch(query: { [k: string]: any }): string {
    return reduceObj(query, (initValue, v, k) => {
        if (v === undefined) return initValue;
        if (typeof v === "object") {
            forEachObj(v, (val, key) => {
                if (val === undefined) return;
                initValue.push(`${k}[${key as string}]=${encodeURIComponent(val)}`);
            });
        } else {
            initValue.push(`${k}=${encodeURIComponent(v)}`);
        }
        return initValue;
    }, [] as string[]).join("&");
}

/**
 * 来源于网页调起qq 只获取url参数的话可以使用这个
 * @tips 该函数有局限性，只能获取一般的参数，不能获取数组
 * @param name
 * @param [url=location.href]
 * @param [noDecode=false]
 */
export function getUrlParam(name: string, url = location.href/* node也有 */, noDecode = false): string {
    // 原代码hash也会获取
    // const re = new RegExp("(?:\\?|#|&)" + name + "=([^&]*)(?:$|&|#)", "i"),
    // 修改后不会获取到hash
    const re = new RegExp("(?:\\?|#|&)" + name + "=([^&#]*)(?:$|&|#)", "i");
    const m = re.exec(url);
    const ret = m ? m[1] : "";
    return noDecode ? ret : decodeURIComponent(ret);
}

/**
 * 修改url参数，不能新增或删除参数
 * @param param
 * @param [url=location.href]
 * @param [encode=true]
 */
export function updateUrlParam(param: { [k: string]: any }, url = location.href, encode = true): string {
    objForEach(param, (value, name) => {
        const re = new RegExp("(?:\\?|#|&)" + name + "=([^&#]*)(?:$|&|#)", "i");
        if (re.test(url)) {
            const s = encode ? encodeURIComponent(value) : value;
            url = url.replace(`${name}=${RegExp.$1}`, `${name}=${s}`);
        }
    });
    return url;
}

/**
 * 设置url参数，可新增或删除参数
 * @param param
 * @param url
 */
export function setUrlParam(param: { [k: string]: any }, url = location.href): string {
    const model = new UrlModel(url);
    assign(model.query, param);
    return model.toString();
}

// 参考async-validator
export const UrlRegExp = new RegExp("^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4])|(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*\\.[a-z\\u00a1-\\uffff]{2,})|localhost)(?::\\d{2,5})?(?:([/?#])[^\\s]*)?$", "i");

export function isUrl(url: string): boolean {
    return UrlRegExp.test(url);
}