import * as urlUtils from "./url";

/**
 * 解析url
 * @Author: dyh
 * @Date: 2019-10-17 10:44
 * @Description:
 */
export class UrlModel {
    protocol: string = "";
    port: number | string = "";
    host: string = "";
    path: string = "";
    href: string = "";
    hash: string = "";
    query: any = "";
    // queryStr: string = "";

    constructor(url: string) {
        this.href = url;
        this.parseAll(url);
    }

    private parseAll(url: string) {
        this.protocol = urlUtils.getUrlProtocol(url);
        this.host = urlUtils.getUrlHost(url);
        this.port = urlUtils.getUrlPort(url);
        this.path = urlUtils.getUrlPath(url);
        this.hash = urlUtils.getUrlHash(url);
        this.query = urlUtils.getUrlQuery(url);
    }
}
