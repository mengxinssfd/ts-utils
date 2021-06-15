import {UrlModel} from "../src/UrlModel";

const url = "http://www.baidu.com:112332/index.php/admin/MonitorResultManager/monitorData?a%5B%5D=123&a%5B%5D=on&b%5B0%5D=on&b%5B1%5D=on&c=1&c=2&c=3&d=1,2,3,4,5&pid=19&pname=%E7%8E%AF%E7%90%83%E8%B4%B8%E6%98%93%E9%A1%B9%E7%9B%AE%E5%9F%BA%E5%9D%91%E5%9C%B0%E9%93%812%E5%8F%B7%E7%BA%BF%E9%9A%A7%E9%81%93%E7%BB%93%E6%9E%84%E8%87%AA%E5%8A%A8%E5%8C%96%E7%9B%91%E6%B5%8B#test";
test("UrlModel", () => {
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
    expect(urlParse.hash).toBe("#test");
    expect(urlParse.path).toBe("/index.php/admin/MonitorResultManager/monitorData");

    const realUrl = "https://www.test.com:80/Openapi/api_detail?id=15#api-parameter";
    const real = new UrlModel(realUrl);

    expect(real.query).toEqual({id: "15"});
    expect(real.protocol).toEqual("https");
    expect(real.host).toEqual("www.test.com");
    expect(real.path).toEqual("/Openapi/api_detail");
    expect(real.hash).toEqual("#api-parameter");
    expect(real.port).toEqual("80");
    expect(real.toString()).toBe(realUrl);

    const empty = new UrlModel("");
    expect(empty.query).toEqual({});
    expect(empty.protocol).toEqual("");
    expect(empty.host).toEqual("");
    expect(empty.path).toEqual("");
    expect(empty.hash).toEqual("");
    expect(empty.port).toEqual("");
    expect(empty.toString()).toBe("");

    const m = new UrlModel("https://www.test.com/detail?id=15#app-parameter");
    m.query.id = undefined;
    expect(m.toString()).toBe("https://www.test.com/detail#app-parameter");
    const m2 = new UrlModel("https://www.test.com/detail?id=15&name=test#app-parameter");
    m2.query.id = undefined;
    m2.hash = "";
    expect(m2.toString()).toBe("https://www.test.com/detail?name=test");

    const test = new UrlModel("hello world");
    expect(test.protocol).toBe("");
});
test("UrlModel not url", () => {
    const test = new UrlModel("hello world");
    expect(test.protocol).toBe("");
    expect(test.hash).toBe("");
    expect(test.host).toBe("");
    expect(test.port).toBe("");
    expect(test.path).toBe("hello world");
    expect(test.href).toBe("hello world");
    expect(test.query).toEqual({});
    expect(test.toString()).toBe("hello world");
});