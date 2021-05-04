import {UrlModel} from "../src/UrlModel";
import {
    getUrlHash,
    getUrlHost,
    getUrlPath,
    getUrlPort,
    getUrlProtocol,
    getUrlQuery,
    queryStringify,
    getUrlParam,
} from "../src/url";

const url = "http://www.baidu.com:112332/index.php/admin/MonitorResultManager/monitorData?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on&b%5B1%5D=on&c=1&c=2&c=3&d=1,2,3,4,5&pid=19&pname=%E7%8E%AF%E7%90%83%E8%B4%B8%E6%98%93%E9%A1%B9%E7%9B%AE%E5%9F%BA%E5%9D%91%E5%9C%B0%E9%93%812%E5%8F%B7%E7%BA%BF%E9%9A%A7%E9%81%93%E7%BB%93%E6%9E%84%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9B%91%E6%B5%8B#test";

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
    console.log(getUrlQuery("a=1123&b[0]=1&b[1]=2&d[d]=1&d[e]=2"));
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