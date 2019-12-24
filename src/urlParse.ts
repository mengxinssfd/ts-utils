/**
 * 解析url
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

    constructor(url?: string) {
        if (!url) return;
        this.href = url;
        this.parse(url);
    }

    private parse(url: string) {
        this.schema = this.parseSchema(url);
        this.host = this.parseHost(url);
        this.port = this.parsePort(url);
        this.pathname = this.parsePathname(url);
        this.hash = this.parseHash(url);
        this.query = this.parseQuery(url);
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

        if (/(?:https?\:\/\/)?(((\w-?)+\.?)+)/.test(url)) {
            host = RegExp.$1;
        }
        return host;
    }

    public parsePort(url: string): string {
        url = url.split("?")[0];
        if (/:(\d+)/.test(url)) {
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
        pathname = url.split(/[\?#]/)[0].replace(/(https?:\/\/)?((\w-?)+\.?)+(:\d+)?\/?/, "");
        return pathname;
    }

    public parseHash(url: string): string {
        let hash = "";
        if (/#((\w+-?)+)/.test(url)) hash = RegExp.$1;
        return hash;
    }

    public parseQuery(url: string): object {
        let query: any = {};
        // 去除?号前的
        url = url.split("?")[1];
        // 去掉hash
        url = url.split("#")[0];
        let params = url.split("&");

        for (const index in params) {
            let [key, value] = params[index].split("=");
            key = decodeURIComponent(key);
            // a[]=0&a[]=1 || a[0]=0&a[1]=1 转成 a=0&a=1 TODO 看看vue的路由参数是怎么解析的
            key = key.replace(/\[\w*\]/g, "");
            value = decodeURIComponent(value);

            if (query[key] === undefined) {
                query[key] = value;
            } else {
                if (Object.prototype.toString.call(query[key]) === "[object Array]") {
                    query[key].push(value);
                } else {
                    query[key] = [query[key], value];
                }
            }
        }

        return query;
    }
}
