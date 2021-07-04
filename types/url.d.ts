/**
 * @param {string} [url = location.href]
 */
export declare function getUrlProtocol(url?: string): string;
/**
 * @param {string} [url = location.href]
 */
export declare function getUrlHost(url?: string): string;
/**
 * @param {string} [url = location.href]
 */
export declare function getUrlPort(url?: string): string;
/**
 * @param {string} [url = location.href]
 */
export declare function getUrlPath(url?: string): string;
/**
 * @param {string} [url = location.href]
 */
export declare function getUrlHash(url?: string): string;
/**
 * 获取hash中的param
 * @example
 * getUrlHashParam("a", "test.com/index?a=param/#/test?a=hash") // returns "hash"
 * getUrlHashParam("a", "test.com/index?a=param") // returns ""
 * @param name
 * @param {string} [url = location.href]
 * @param noDecode
 */
export declare function getUrlHashParam(name: string, url?: string, noDecode?: boolean): string;
/**
 * @alias getUrlQuery
 * @param {string} [url = location.href]
 */
export declare function getUrlParamObj(url?: string): {
    [key: string]: string | string[];
};
export declare const getUrlQuery: typeof getUrlParamObj;
export declare function stringifyUrlSearch(query: {
    [k: string]: any;
}): string;
/**
 * 来源于网页调起qq 只获取url参数的话可以使用这个
 * @tips 该函数有局限性，只能获取一般的参数，不能获取数组
 * @param name
 * @param [url=location.href]
 * @param [noDecode=false]
 */
export declare function getUrlParam(name: string, url?: string, noDecode?: boolean): string;
/**
 * 修改url参数，不能新增或删除参数
 * @param param
 * @param url
 * @param noDecode
 */
export declare function updateUrlParam(param: {
    [k: string]: any;
}, url?: string, noDecode?: boolean): string;
/**
 * 设置url参数，可新增或删除参数
 * @param param
 * @param url
 */
export declare function setUrlParam(param: {
    [k: string]: any;
}, url?: string): string;
export declare const UrlRegExp: RegExp;
export declare function isUrl(url: string): boolean;
