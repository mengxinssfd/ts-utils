export class Cookie {
    /**
     * 设置cookie
     * @param {string} name cookie name
     * @param {string} value cookie value
     * @param {number} expire 过期秒数
     * @param {string} path cookie path
     */
    static set(name: string, value: string, expire: number, path?: string) {
        const date = new Date();
        date.setSeconds(date.getSeconds() + expire);
        const time = expire ? ";expires=" + date.toUTCString() : "";
        path = ";path=" + (path || "/");
        document.cookie = name + "=" + encodeURIComponent(value) + time + path;
    }

    /**
     * 获取cookie
     * 不同path下可以重名，但无法根据path获取
     * @param {string} name
     * @returns {string[]}
     */
    static get(name: string): string[] {
        const res: string[] = [];
        if (document.cookie.length > 0) {
            const reg = new RegExp(`(?:^${name}|; ${name})=([^;]+)`, "g");
            let exec: RegExpExecArray | null = null;
            while ((exec = reg.exec(document.cookie))) {
                res.push(decodeURIComponent(exec[1]));
            }
        }
        return res;
    }

    /**
     * 删除 cookie
     * @param {string} name
     * @param {string} path
     */
    static remove(name: string, path = "/") {
        Cookie.set(name, "", -1, path);
    }
}
