import { typeOf } from "./type";
import { reduceObj } from "./object";
export function getUrlProtocol(url) {
    const reg = /^(\w+):\/\//;
    let schema = "";
    if (reg.test(url)) {
        schema = RegExp.$1;
    }
    return schema;
}
export function getUrlHost(url) {
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
export function getUrlPort(url) {
    url = url.split("?")[0];
    if (/:(\d+)/.test(url)) {
        return RegExp.$1;
    }
    return "";
}
export function getUrlPath(url) {
    // 去掉query、hash
    url = url.split(/[\?#]/)[0];
    if (/^\//.test(url)) {
        return url.substr(1);
    }
    // 去掉schema
    return url.replace(/(https?:\/\/)?((\w-?)+\.?)+(:\d+)?\/?/, "");
}
export function getUrlHash(url) {
    let hash = "";
    if (/#((\w+-?)+)/.test(url))
        hash = RegExp.$1;
    return hash;
}
export function getUrlQuery(url) {
    let result = {};
    const sp = url.split("?");
    // 去除?号前的
    url = sp.length > 1 ? sp[1] : sp[0];
    // 去掉hash
    url = url.split("#")[0];
    // this.queryStr = url;
    let params = url.split("&");
    for (const k in params) {
        const v = params[k];
        let [key, value] = v.split("=").map(item => decodeURIComponent(item));
        // fixme a[1]=0&a[0]=1 顺序会不对
        // a[]=0&a[]=1 || a[0]=0&a[1]=1 转成 a=0&a=1 TODO 看看vue的路由参数是怎么解析的
        key = key.replace(/\[\w*\]/g, "");
        const resultValue = result[key];
        switch (typeOf(resultValue)) {
            case "undefined":
                result[key] = value;
                break;
            case "array":
                result[key].push(value);
                break;
            default:
                result[key] = [resultValue, value];
        }
    }
    return result;
}
export function queryStringify(query) {
    return reduceObj(query, (initValue, v, k, obj) => {
        if (typeof v === "object") {
            for (const key in v) {
                let val;
                if (!v.hasOwnProperty(key) || undefined === (val = v[key]))
                    continue;
                initValue.push(`${k}[${key}]=${encodeURIComponent(val)}`);
            }
        }
        else {
            initValue.push(`${k}=${v}`);
        }
        return initValue;
    }, []).join("&");
}
/**
 * 来源于网页调起qq 只获取url参数的话可以使用这个
 * @tips 该函数有局限性，只能获取一般的参数，不能获取数组
 * @param name
 * @param [url=location.href]
 * @param [noDecode=false]
 */
export function getUrlParam(name, url = location.href /* node也有 */, noDecode = false) {
    // 原代码hash也会获取
    // const re = new RegExp("(?:\\?|#|&)" + name + "=([^&]*)(?:$|&|#)", "i"),
    // 修改后不会获取到hash
    const re = new RegExp("(?:\\?|#|&)" + name + "=([^&#]*)(?:$|&|#)", "i");
    const m = re.exec(url);
    const ret = m ? m[1] : "";
    return !noDecode ? decodeURIComponent(ret) : ret;
}
