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
    path: string;
    href: string;
    hash: string;
    query: any;
    queryStr: string;
    constructor(url?: string);
    private parseAll;
    parseSchema(url: string): string;
    parseHost(url: string): string;
    parsePort(url: string): string;
    parsePath(url: string): string;
    parseHash(url: string): string;
    parseQuery(url: string): {
        [key: string]: string;
    };
}
