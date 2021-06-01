/**
 * 解析url
 * @Author: dyh
 * @Date: 2019-10-17 10:44
 * @Description:
 */
export declare class UrlModel {
    protocol: string;
    port: number | string;
    host: string;
    path: string;
    href: string;
    hash: string;
    query: {
        [key: string]: string[] | string;
    };
    constructor(url: string);
    private parseAll;
    toString(): string;
}
