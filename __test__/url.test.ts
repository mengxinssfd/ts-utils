import {subString} from "../src";
import {UrlModel} from "../src/UrlModel";
import {
    getUrlHash,
    getUrlHost,
    getUrlPath,
    getUrlPort,
    getUrlProtocol,
    getUrlParamObj,
    queryStringify,
    getUrlParam,
    UrlRegExp,
    isUrl,
} from "../src/url";

const url = "http://www.baidu.com:112332/index.php/admin/MonitorResultManager/monitorData?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on&b%5B1%5D=on&c=1&c=2&c=3&d=1,2,3,4,5&pid=19&pname=%E7%8E%AF%E7%90%83%E8%B4%B8%E6%98%93%E9%A1%B9%E7%9B%AE%E5%9F%BA%E5%9D%91%E5%9C%B0%E9%93%812%E5%8F%B7%E7%BA%BF%E9%9A%A7%E9%81%93%E7%BB%93%E6%9E%84%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9B%91%E6%B5%8B#test";


test("getUrlParamObj", () => {
    const url = "test/aaa=1213123?a=1123&b[0]=1&b[1]=2&d[d]=1&d[e]=2?t=1231&b=123123&a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on&b%5B1%5D=on&c=1&c=2&c=3&d=1,2,3,4,5&pid=19&pname=%E7%8E%AF%E7%90%83%E8%B4%B8%E6%98%93%E9%A1%B9%E7%9B%AE%E5%9F%BA%E5%9D%91%E5%9C%B0%E9%93%812%E5%8F%B7%E7%BA%BF%E9%9A%A7%E9%81%93%E7%BB%93%E6%9E%84%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9B%91%E6%B5%8B#test";
    const obj = getUrlParamObj(url);
    expect(obj).toEqual({
        aaa: "1213123",
        a: ["1123", "123", "on"],
        b: ["on", "on", "123123"],
        c: ["1", "2", "3"],
        d: Object.assign(["1,2,3,4,5"], {d: "1", e: "2"}),
        t: "1231",
        pid: "19",
        pname: "环球贸易项目基坑地铁2号线隧道结构自动化监测"
    });
    expect(obj.pname).toEqual("环球贸易项目基坑地铁2号线隧道结构自动化监测");
});
test("getUrlHash", () => {
    expect(getUrlHash("/index.php#index/admin")).toBe("#index/admin");
    expect(getUrlHash("/index.php/#/index/admin#test")).toBe("#/index/admin#test");
    expect(getUrlHash("/index.php")).toBe("");
});
test("getUrlProtocol", () => {
    expect(getUrlProtocol("file:///E:/wechatCache")).toBe("file");
    expect(getUrlProtocol("https://www.baidu.com/index")).toBe("https");
    expect(getUrlProtocol("http://www.baidu.com/index")).toBe("http");
    expect(getUrlProtocol("/index.php")).toBe("");
});
test("getUrlHost", () => {
    expect(getUrlHost("https://www.baidu.com/index")).toBe("www.baidu.com");
    expect(getUrlHost("http://www.baidu.com/index")).toBe("www.baidu.com");
    expect(getUrlHost("file:///E:/wechatCache")).toBe("");
    expect(getUrlHost("/index.php")).toBe("");
});
test("urlParse", () => {
    //  a[]=123&a[]=on&b[0]=on&b[1]=on&c=1&c=2&d=1,2,3,4,5&pid=19&pname=环球贸易项目基坑地铁2号线隧道结构自动化监测
    const urlParse = new UrlModel(url);
    // console.log(decodeURIComponent(urlParse.queryStr));
    expect(urlParse.protocol).toBe("http");
    expect(urlParse.port).toBe("112332");
    expect(urlParse.host).toBe("www.baidu.com");
    expect(urlParse.query.pname).toBe("环球贸易项目基坑地铁2号线隧道结构自动化监测");
    expect(urlParse.query.pid).toBe("19");
    expect(urlParse.query.a).toEqual(["123", "on"]);
    expect(urlParse.query.b).toEqual(["on", "on"]);
    expect(urlParse.query.c).toEqual(["1", "2", "3"]);
    expect(urlParse.query.d).toBe("1,2,3,4,5");
    expect(urlParse.hash).toBe("test");
    expect(urlParse.path).toBe("index.php/admin/MonitorResultManager/monitorData");

    expect(getUrlHost("/")).toBe("");
    expect(getUrlPort("/")).toBe("");

    expect(getUrlPath("/index.php/admin/MonitorResultManager")).toBe("index.php/admin/MonitorResultManager");
    expect(getUrlProtocol("")).toBe("");
    expect(getUrlHost("/index.php/admin#absdf-23_123")).toBe("");
    expect(getUrlHost("")).toBe("");
    expect(getUrlHash("/index.php/admin#absdf-23_123")).toBe("absdf-23_123");
    expect(getUrlHash("/index.php/admin")).toBe("");

    const realUrl = "https://www.haodanku.com/Openapi/api_detail?id=15#api-parameter";
    const real = new UrlModel(realUrl);

    expect(real.query).toEqual({id: "15"});
    expect(real.protocol).toEqual("https");
    expect(real.host).toEqual("www.haodanku.com");
    expect(real.path).toEqual("Openapi/api_detail");
    expect(real.hash).toEqual("api-parameter");
    expect(real.toString()).toBe(realUrl);
    expect(getUrlProtocol("file://test.com")).toEqual("file");

});
test("queryStringify", () => {
    expect(queryStringify({a: "1123", b: 1123})).toBe("a=1123&b=1123");
    expect(queryStringify({a: "1123", b: 1123, c: undefined})).toBe("a=1123&b=1123");
    expect(queryStringify({a: "1123", b: [1, 2, 3]})).toBe("a=1123&b[0]=1&b[1]=2&b[2]=3");
    expect(queryStringify({a: "1123", b: {d: 1, e: 2}})).toBe("a=1123&b[d]=1&b[e]=2");
    expect(queryStringify({a: "1123", b: [1, 2], d: {d: 1, e: 2}})).toBe("a=1123&b[0]=1&b[1]=2&d[d]=1&d[e]=2");
    expect(queryStringify({a: "1123", b: [1, 2], d: {d: 1, e: undefined}})).toBe("a=1123&b[0]=1&b[1]=2&d[d]=1");

    function A() {
        this.a = 1;
        this.b = 2;
    }

    A.prototype.c = 3;
    A.prototype.d = 4;
    expect(queryStringify(new A())).toBe("a=1&b=2");

    // TODO parseQuery不能解析成object
    console.log(getUrlParamObj("a=1123&b[0]=1&b[1]=2&d[d]=1&d[e]=2"));
});

test("getUrlParam", () => {
    const fn = getUrlParam;
    const realUrl = "https://www.haodanku.com/Openapi/api_detail?id=15#api-parameter";

    expect(fn("id", realUrl)).toEqual("15");
    expect(fn("pname", url, true)).toEqual("%E7%8E%AF%E7%90%83%E8%B4%B8%E6%98%93%E9%A1%B9%E7%9B%AE%E5%9F%BA%E5%9D%91%E5%9C%B0%E9%93%812%E5%8F%B7%E7%BA%BF%E9%9A%A7%E9%81%93%E7%BB%93%E6%9E%84%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9B%91%E6%B5%8B");
    expect(fn("pname", url)).toEqual("环球贸易项目基坑地铁2号线隧道结构自动化监测");
    const url2 = "www.haodanku.com/?id=15&a=1&b=2&c=3&d[0]=4&d[1]=5";
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
test("UrlRegExp", () => {
    const ure = UrlRegExp;
    const realUrl = "https://www.haodanku.com/Openapi/api_detail?id=15#api-parameter";

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
    const fn = isUrl;
    const realUrl = "https://www.haodanku.com/Openapi/api_detail?id=15";

    expect(fn(realUrl)).toBeTruthy();
    // 不能识别普通网址的端口号
    expect(fn("http://www.baidu.com:112332/index.php/admin/MonitorResultManager/monitorData")).toBeFalsy();
    expect(fn("http://www.baidu.com/index.php/admin/MonitorResultManager/monitorData")).toBeTruthy();
    // 可以识别localhost的端口号
    expect(fn("http://localhost:1122/index.php/admin/MonitorResultManager/monitorData")).toBeTruthy();
    // 端口号范围在2位数到5位数
    expect(fn("http://localhost:111222/index.php/admin/MonitorResultManager/monitorData")).toBeFalsy();
    expect(fn("http://localhost:2/index.php/admin/MonitorResultManager/monitorData")).toBeFalsy();

    // 能识别encodeURIComponent转换过的数据
    expect(fn("http://www.baidu.com/index.php/admin/MonitorResultManager/monitorData?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on")).toBeTruthy();
    // 识别hash
    expect(fn("http://www.baidu.com/index.php/?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on#api-parameter")).toBeTruthy();
    // 识别[]
    expect(fn("http://www.baidu.com/index.php/?a=1123&b[0]=1&b[1]=2&b[2]=3")).toBeTruthy();
    expect(fn("file://E:/wechatCache")).toBeFalsy();
});