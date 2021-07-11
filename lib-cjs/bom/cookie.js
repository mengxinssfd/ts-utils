"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookie = void 0;
class Cookie {
    /**
     * @param name cookie name
     * @param value cookie value
     * @param expire 过期秒数
     * @param path cookie path
     */
    static set(name, value, expire, path) {
        const date = new Date();
        date.setSeconds(date.getSeconds() + expire);
        const time = !expire ? "" : ";expires=" + date.toUTCString();
        path = !path ? ";path=/" : ";path=" + path;
        document.cookie = name + "=" + escape(value) + time + path;
    }
    static get(name) {
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(name + "=");
            if (c_start !== -1) {
                c_start = c_start + name.length + 1;
                let c_end = document.cookie.indexOf(";", c_start);
                if (c_end === -1)
                    c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }
    //删除 cookie
    static remove(name) {
        Cookie.set(name, "", -1);
    }
}
exports.Cookie = Cookie;
