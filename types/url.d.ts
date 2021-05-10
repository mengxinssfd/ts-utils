export declare function getUrlProtocol(url: string): string;
export declare function getUrlHost(url: string): string;
export declare function getUrlPort(url: string): string;
export declare function getUrlPath(url: string): string;
export declare function getUrlHash(url: string): string;
export declare function getUrlQuery(url: string): {
    [key: string]: string;
};
export declare function queryStringify(query: {
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
export declare const UrlRegExp: RegExp;
export declare function isUrl(url: string): boolean;
