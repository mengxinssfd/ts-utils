/**
 * @Author: dyh
 * @Date: 2019-10-17 10:44
 * @Description:
 */

export class UrlParse {
    schema: string;
    port: number | string;
    host: string;
    pathname: string;
    href: string;
    hash: string;
    query: object;
    private url: string;

    constructor(url?: string) {
        if (!url) return;
        this.href = url;
        if (/^\//.test(url)) {
            url = url.substr(1);
        }
        this.url = url;
        this.parse();
    }

    private parse() {
        this.schema = this.parseSchema(this.href);
        this.host = this.parseHost(this.href);
        this.port = this.parsePort(this.href);
    }

    public parseSchema(url: string): string {
        url = url.split("?")[0];
        const reg = /(https?):\/\//;
        let schema = "";
        if (reg.test(url)) {
            schema = RegExp.$1;
        }
        return schema;
    }

    public parseHost(url: string): string {
        url = url.split("?")[0];
        let host = "";
        if (/^\//.test(url)) {
            return host;
        }

        if (/((\w+\.)+\w+)\b/.test(url)) {
            host = RegExp.$1;
        }
        return host;
    }

    public parsePort(url: string): string {
        url = url.split("?")[0];
        if (/(?!(?!\w+\.)+\w+):(\d+)\b/.test(url)) {
            return RegExp.$1;
        }
        return "";
    }

    public parsePathname(url: string): string {
        url = url.split("?")[0];
        let pathname = "";
        if (/^\//.test(url)) {
            return url.substr(1);
        }

        return pathname;
    }
}

