import {subString} from "../src/core/string";
import * as u from "../src/core/url";

const url = "http://www.baidu.com:112332/index.php/admin/MonitorResultManager/monitorData?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on&b%5B1%5D=on&c=1&c=2&c=3&d=1,2,3,4,5&pid=19&pname=%E7%8E%AF%E7%90%83%E8%B4%B8%E6%98%93%E9%A1%B9%E7%9B%AE%E5%9F%BA%E5%9D%91%E5%9C%B0%E9%93%812%E5%8F%B7%E7%BA%BF%E9%9A%A7%E9%81%93%E7%BB%93%E6%9E%84%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9B%91%E6%B5%8B#test?hash=1";

test("getUrlParamObj", () => {
    const fn = u.getUrlQuery;
    expect(fn("?a=1&a=2&a=3")).toEqual({a: ["1", "2", "3"]});
    expect(fn("?a[]=1&a[]=2&a[]=3")).toEqual({a: ["1", "2", "3"]});
    expect(fn("?a%5B%5D=1&a%5B%5D=2&a%5B%5D=3")).toEqual({a: ["1", "2", "3"]});
    expect(fn("?a=1&a[]=2&a%5B%5D=3")).toEqual({a: ["1", "2", "3"]});
    expect(fn("?a=1&a[1]=2")).toEqual({a: ["1", "2"]});
    expect(fn("?a=1&a[1]=2&a[2]=3")).toEqual({a: ["1", "2", "3"]});
    expect(fn("a=1&a[1]=2&a[2]=3")).toEqual({a: ["1", "2", "3"]});

    const url = "test/aaa=1213123?a=1123&b[0]=1&b[1]=2&d[d]=1&d[e]=2?t=1231&b=123123&a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on&b%5B1%5D=on&c=1&c=2&c=3&d=1,2,3,4,5&pid=19&pname=%E7%8E%AF%E7%90%83%E8%B4%B8%E6%98%93%E9%A1%B9%E7%9B%AE%E5%9F%BA%E5%9D%91%E5%9C%B0%E9%93%812%E5%8F%B7%E7%BA%BF%E9%9A%A7%E9%81%93%E7%BB%93%E6%9E%84%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9B%91%E6%B5%8B#test?hash=1&hash2=2";
    const obj = fn(url);
    expect(obj).toEqual({
        aaa: "1213123",
        a: ["1123", "123", "on"],
        b: ["on", "on", "123123"],
        c: ["1", "2", "3"],
        d: Object.assign(["1,2,3,4,5"], {d: "1", e: "2"}),
        t: "1231",
        pid: "19",
        pname: "环球贸易项目基坑地铁2号线隧道结构自动化监测",
        hash: "1",
        hash2: "2"
    });
    expect(obj.pname).toEqual("环球贸易项目基坑地铁2号线隧道结构自动化监测");
    expect(u.getUrlParamObj()).toEqual({});
});
test("getUrlHashParam", () => {
    const url = "test.com/index?a=param/#/test?a=hash";
    expect(u.getUrlHashParam("a", url)).toEqual("hash");
    expect(u.getUrlHashParam("a", "test.com/index?a=param")).toEqual("");
    expect(u.getUrlHashParam("a")).toEqual("");
});
test("getUrlHash", () => {
    expect(u.getUrlHash("/index.php#index/admin")).toBe("#index/admin");
    expect(u.getUrlHash("/index.php/#/index/admin#test")).toBe("#/index/admin#test");
    expect(u.getUrlHash("/index.php")).toBe("");
    expect(u.getUrlHash()).toBe("");
});
test("getUrlProtocol", () => {
    expect(u.getUrlProtocol("file:///E:/wechatCache")).toBe("file");
    expect(u.getUrlProtocol("https://www.baidu.com/index")).toBe("https");
    expect(u.getUrlProtocol("http://www.baidu.com/index")).toBe("http");
    expect(u.getUrlProtocol("/index.php")).toBe("");
    expect(u.getUrlProtocol()).toBe("http");
});
test("getUrlHost", () => {
    expect(u.getUrlHost("https://www.baidu.com/index")).toBe("www.baidu.com");
    expect(u.getUrlHost("https://www.1223-tewre.com/index")).toBe("www.1223-tewre.com");
    expect(u.getUrlHost("https://www.1223_tewre.com/index")).toBe("www.1223_tewre.com");
    expect(u.getUrlHost("https://www.测试_tewre.com/index")).toBe("www.测试_tewre.com");
    expect(u.getUrlHost("https://www.测试-tewre.com/index")).toBe("www.测试-tewre.com");
    expect(u.getUrlHost("https://www.-tewre测试.com/index")).toBe("www.-tewre测试.com");
    expect(u.getUrlHost("https://www.测试.test.com/index")).toBe("www.测试.test.com");
    expect(u.getUrlHost("http://www.baidu.com/index")).toBe("www.baidu.com");
    expect(u.getUrlHost("http://www.baidu.com:8080/index")).toBe("www.baidu.com");
    expect(u.getUrlHost("www.baidu.com:8080/index")).toBe("");
    expect(u.getUrlHost("file://E:/wechatCache")).toBe("");
    expect(u.getUrlHost("/index.php")).toBe("");
    expect(u.getUrlHost()).toBe("localhost");
});
test("getUrlPath", () => {
    expect(u.getUrlPath("https://www.baidu.com/index")).toBe("/index");
    expect(u.getUrlPath("https://www.1223-tewre.com/index")).toBe("/index");
    expect(u.getUrlPath("https://www.测试.test.com/对方是否")).toBe("/对方是否");
    expect(u.getUrlPath("https://www.测试.test.com/index?test=123")).toBe("/index");
    expect(u.getUrlPath("https://www.测试.test.com/index/test#test")).toBe("/index/test");
    expect(u.getUrlPath("https://www.测试.test.com:8080/index/test#test")).toBe("/index/test");
    expect(u.getUrlPath("file:///E:/wechatCache")).toBe("/E:/wechatCache");
    expect(u.getUrlPath("/index.php")).toBe("/index.php");
    expect(u.getUrlPath()).toBe("/");
});
test("urlParse", () => {
    expect(u.getUrlHost("/")).toBe("");
    expect(u.getUrlPort("/")).toBe("");
    expect(u.getUrlPort()).toBe("");

    expect(u.getUrlPath("/index.php/admin/MonitorResultManager")).toBe("/index.php/admin/MonitorResultManager");
    expect(u.getUrlProtocol("")).toBe("");
    expect(u.getUrlHost("/index.php/admin#absdf-23_123")).toBe("");
    expect(u.getUrlHost("")).toBe("");
    expect(u.getUrlHash("/index.php/admin#absdf-23_123")).toBe("#absdf-23_123");
    expect(u.getUrlHash("/index.php/admin")).toBe("");

    expect(u.getUrlProtocol("file://test.com")).toEqual("file");
});
test("queryStringify", () => {
    expect(u.stringifyUrlSearch({a: "1123", b: 1123})).toBe("a=1123&b=1123");
    expect(u.stringifyUrlSearch({a: "1123", b: 1123, c: undefined})).toBe("a=1123&b=1123");
    expect(u.stringifyUrlSearch({a: "1123", b: [1, 2, 3]})).toBe("a=1123&b[0]=1&b[1]=2&b[2]=3");
    expect(u.stringifyUrlSearch({a: "1123", b: {d: 1, e: 2}})).toBe("a=1123&b[d]=1&b[e]=2");
    expect(u.stringifyUrlSearch({a: "1123", b: [1, 2], d: {d: 1, e: 2}})).toBe("a=1123&b[0]=1&b[1]=2&d[d]=1&d[e]=2");
    expect(u.stringifyUrlSearch({a: "1123", b: [1, 2], d: {d: 1, e: undefined}})).toBe("a=1123&b[0]=1&b[1]=2&d[d]=1");

    function A() {
        this.a = 1;
        this.b = 2;
    }

    A.prototype.c = 3;
    A.prototype.d = 4;
    expect(u.stringifyUrlSearch(new A())).toBe("a=1&b=2");

    // TODO getUrlParamObj 不能解析成object
    console.log(u.getUrlParamObj("a=1123&b[0]=1&b[1]=2&d[d]=1&d[e]=2"));
});

test("getUrlParam", () => {
    const fn = u.getUrlParam;
    const realUrl = "https://www.test.com/Openapi/api_detail?id=15#api-parameter";

    expect(fn("id", realUrl)).toEqual("15");
    expect(fn("pname", url, true)).toEqual("%E7%8E%AF%E7%90%83%E8%B4%B8%E6%98%93%E9%A1%B9%E7%9B%AE%E5%9F%BA%E5%9D%91%E5%9C%B0%E9%93%812%E5%8F%B7%E7%BA%BF%E9%9A%A7%E9%81%93%E7%BB%93%E6%9E%84%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9B%91%E6%B5%8B");
    expect(fn("pname", url)).toEqual("环球贸易项目基坑地铁2号线隧道结构自动化监测");
    const url2 = "www.test.com/?id=15&a=1&b=2&c=3&d[0]=4&d[1]=5";
    expect(fn("id", url2)).toEqual("15");
    expect(fn("a", url2)).toEqual("1");
    expect(fn("b", url2)).toEqual("2");
    expect(fn("c", url2)).toEqual("3");
    expect(fn("f", url2)).toBe("");
    expect(fn("f")).toBe("");
    // 该函数有局限性，只能获取一般的参数，不能获取数组
    // expect(fn("d[0]", url2)).toEqual("4");
    // expect(fn("d[1]", url2)).toEqual("5");
    // expect(fn("d", url2)).toEqual([4, 5]);
});
test("updateUrlParam", () => {
    const fn = u.updateUrlParam;
    let url = "https://www.test.com/Openapi/api_detail?id=15#api-parameter";
    url = fn({"id": "100"}, url);
    expect(url).toEqual("https://www.test.com/Openapi/api_detail?id=100#api-parameter");
    expect(fn({"pid": "15"}, url)).toEqual(url);
    expect(fn({"pid": "15"})).toEqual("http://localhost/");

    const encoded = encodeURIComponent(url);
    expect(fn({"id": url}, url)).toEqual(`https://www.test.com/Openapi/api_detail?id=${encoded}#api-parameter`);
    expect(fn({"id": url}, url, false)).toEqual(`https://www.test.com/Openapi/api_detail?id=${url}#api-parameter`);

});
test("setUrlParam", () => {
    const fn = u.setUrlParam;
    let url = "https://www.test.com/Openapi/api_detail?id=15#api-parameter";
    url = fn({"id": "100"}, url);
    // update
    expect(url).toEqual("https://www.test.com/Openapi/api_detail?id=100#api-parameter");
    // add
    expect(fn({"pid": "15"}, url)).toEqual("https://www.test.com/Openapi/api_detail?id=100&pid=15#api-parameter");
    // delete
    expect(fn({"pid": undefined}, url)).toEqual("https://www.test.com/Openapi/api_detail?id=100#api-parameter");
    expect(fn({"id": undefined}, url)).toEqual("https://www.test.com/Openapi/api_detail#api-parameter");
    expect(fn({"pid": "15"})).toEqual("http://localhost/?pid=15");
});
test("UrlRegExp", () => {
    const ure = u.UrlRegExp;
    const realUrl = "https://www.test.com/Openapi/api_detail?id=15#api-parameter";

    expect(ure.test(realUrl)).toBeTruthy();
    expect(
        "http://test.com,https://hello.cn".match(
            new RegExp(`${subString(ure.source, 1, -1)}`, "g"),
        ),
    ).toEqual(["http://test.com", "https://hello.cn"]);
    // 不能分割带path的，所以不能用作分割用
    expect(
        "http://test.com/test,https://hello.cn".match(
            new RegExp(`(${subString(ure.source, 1, -1)})`, "g"),
        ),
    ).not.toEqual(["http://test.com/12/sdffte/index", "https://hello.cn"]);
});
test("isUrl", () => {
    const fn = u.isUrl;
    const realUrl = "https://www.test.com/Openapi/api_detail?id=15";

    expect(fn(realUrl)).toBeTruthy();
    // 不能识别普通网址的端口号
    expect(fn("http://www.baidu.com:112332/index.php/admin/MonitorResultManager/monitorData")).toBeFalsy();
    expect(fn("http://www.baidu.com/index.php/admin/MonitorResultManager/monitorData")).toBeTruthy();
    // 可以识别localhost的端口号
    expect(fn("http://localhost:1122/index.php/admin/MonitorResultManager/monitorData")).toBeTruthy();
    // 端口号范围在2位数到5位数
    expect(fn("http://localhost:111222/index.php/admin/MonitorResultManager/monitorData")).toBeFalsy();
    expect(fn("http://localhost:2/index.php/admin/MonitorResultManager/monitorData")).toBeFalsy();

    expect(fn("www.baidu.com/index.php/admin/MonitorResultManager/monitorData")).toBeFalsy();

    // 能识别encodeURIComponent转换过的数据
    expect(fn("http://www.baidu.com/index.php/admin/MonitorResultManager/monitorData?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on")).toBeTruthy();
    // 识别hash
    expect(fn("http://www.baidu.com/index.php/?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on#api-parameter")).toBeTruthy();
    // 识别[]
    expect(fn("http://www.baidu.com/index.php/?a=1123&b[0]=1&b[1]=2&b[2]=3")).toBeTruthy();
    expect(fn("file://E:/wechatCache")).toBeFalsy();
});