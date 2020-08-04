/**
 *
 * @param name cookie name
 * @param value cookie value
 * @param expire 过期秒数
 * @param path
 */
export function setCookie(name: string, value: string, expire: number, path?: string) {
    let date = new Date();
    date.setSeconds(date.getSeconds() + expire);
    let time = !expire ? "" : (";expires=" + date.toUTCString());
    path = !path ? ";path=/" : (";path=" + path);
    document.cookie = name + "=" + escape(value) + time + path;
}

export function getCookie(name: string): string {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(name + "=");
        if (c_start !== -1) {
            c_start = c_start + name.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

//删除 cookie
export function deleteCookie(c_name) {
    setCookie(c_name, "", -1);
}
