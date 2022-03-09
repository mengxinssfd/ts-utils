import {Cookie} from "../src/bom/cookie";
import {sleep} from "../src/core/time";

describe("cookie", () => {
    test("base", async () => {
        Cookie.set("test", "1", 20, "test");
        expect(document.cookie).toBe("test=1");
        expect(Cookie.get("test")).toEqual(["1"]);

        Cookie.set("test2", "2", 20);
        expect(Cookie.get("test2")).toEqual(["2"]);
        Cookie.remove("test2");
        expect(Cookie.get("test2")).toEqual([]);

        Cookie.set("test3", "3", 1);
        expect(Cookie.get("test3")).toEqual(["3"]);

        await sleep(2000);
        expect(Cookie.get("test")).toEqual(["1"]);
        expect(Cookie.get("test2")).toEqual([]);
        expect(Cookie.get("test3")).toEqual([]);
    });
    // 测不出来，实际浏览器不同path是可以重名的
    test("同名不同path", () => {
        Cookie.set("hello", "world", 2000, "/test");
        Cookie.set("hello", "w", 2000, "/test2");
        // console.log(document.cookie);
    });
    test("get", () => {
        Cookie.set("hello", "world", 2000);
        Cookie.set("test hello", "w", 2000);

        expect(Cookie.get("hello")).toEqual(["world"]);
    });
});
