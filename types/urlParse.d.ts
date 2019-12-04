/**
 * 解析url
 * @Author: dyh
 * @Date: 2019-10-17 10:44
 * @Description:
 */
export declare class UrlParse {
    schema: string;
    port: number | string;
    host: string;
    pathname: string;
    href: string;
    hash: string;
    query: object;
    constructor(url?: string);
    private parse;
    parseSchema(url: string): string;
    parseHost(url: string): string;
    parsePort(url: string): string;
    parsePathname(url: string): string;
    parseHash(url: string): string;
    parseQuery(url: string): object;
}
