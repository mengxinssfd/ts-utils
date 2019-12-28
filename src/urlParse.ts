import {isArray} from "./common";
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
    path: string;
    href: string;
    hash: string;
    query: any;
    queryStr:string;

    constructor(url?: string) {
        if (!url) return;
        this.href = url;
        this.parse(url);
    }

    private parse(url: string) {
        this.schema = this.parseSchema(url);
        this.host = this.parseHost(url);
        this.port = this.parsePort(url);
        this.path = this.parsePath(url);
        this.hash = this.parseHash(url);
        this.query = this.parseQuery(url);
    }

    public parseSchema(url: string): string {
        const reg = /^(https?):\/\//;
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

    public parsePath(url: string): string {
        // 去掉query、hash
        url = url.split(/[\?#]/)[0];
        if (/^\//.test(url)) {
            return  url.substr(1);
        }
        // 去掉schema
        return url.replace(/(https?:\/\/)?((\w-?)+\.?)+(:\d+)?\/?/, "");
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
        this.queryStr = url;
        let params = url.split("&");

        for (const k in params) {
            const v = params[k];
            let [key, value] = v.split("=");
            key = decodeURIComponent(key);
            // a[]=0&a[]=1 || a[0]=0&a[1]=1 转成 a=0&a=1 TODO 看看vue的路由参数是怎么解析的
            key = key.replace(/\[\w*\]/g, "");
            value = decodeURIComponent(value);

            const queryValue = query[key];
            if (queryValue === undefined) {
                query[key] = value;
            } else {
                if (isArray(queryValue)) {
                    query[key].push(value);
                } else {
                    query[key] = [queryValue, value];
                }
            }
        }

        return query;
    }
}
