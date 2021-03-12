import * as cm from "../src/common";

test("forEachByLen", () => {
    const arr: number[] = [];
    cm.forEachByLen(3, (index) => arr.push(index));
    expect(arr).toEqual([0, 1, 2]);
    cm.forEachByLen(7, (index) => arr.push(index));
    expect(arr.length).toEqual(10);
    cm.forEachByLen(3, (index): any | false => {
        arr.push(index);
        if (index === 1) return false;
    });
});

test("typeOf", () => {
    // 六大基本类型 string boolean number object null undefined
    expect(cm.typeOf("")).toBe("string");
    expect(cm.typeOf(true)).toBe("boolean");
    expect(cm.typeOf(0)).toBe("number");
    expect(cm.typeOf(undefined)).toBe("undefined");
    expect(cm.typeOf({})).toBe("object");
    expect(cm.typeOf(null)).toBe("null");
    // 非6
    expect(cm.typeOf(() => {
    })).toBe("function");
    expect(cm.typeOf([])).toBe("array");
    expect(cm.typeOf(NaN)).toBe("number");
    expect(cm.typeOf(/abc/)).toBe("regexp");
});

test("randomNumber", () => {
    const rand = cm.randomNumber(0, 10);
    expect(rand).toBeGreaterThanOrEqual(0);
    expect(rand).toBeLessThanOrEqual(10);
    //
    const rand2 = cm.randomNumber();
    expect(rand2).toBeGreaterThanOrEqual(0);
    expect(rand2).toBeLessThanOrEqual(1);
    // start as end
    const rand3 = cm.randomNumber(5);
    expect(rand3).toBeGreaterThanOrEqual(0);
    expect(rand3).toBeLessThanOrEqual(5);
    // arr
    const randArr: number[] = cm.randomNumber(0, 5, 4) as number[];
    expect(randArr.length).toBe(4);
    for (let i = 0; i < randArr.length; i++) {
        const item = randArr[i];
        expect(item).toBeGreaterThanOrEqual(0);
        expect(item).toBeLessThanOrEqual(5);
    }
    const randArr2: number[] = cm.randomNumber(0, 5, 0);
    expect(randArr2).toEqual([]);

    const arr3 = cm.randomNumber(0, 1, 500);
    expect(arr3.length).toBe(500);
    expect(arr3.some(i => i > 0)).toBeTruthy();
    expect(arr3.some(i => i < 1)).toBeTruthy();
    expect(arr3.some(i => i > 0.3 && i < 0.5)).toBeTruthy();
    expect(arr3.some(i => i >= 0 && i < 0.2)).toBeTruthy();
    expect(arr3.some(i => i > 0.7 && i < 0.9)).toBeTruthy();
    expect(arr3.some(i => i >= 1)).toBeFalsy();
    expect(arr3.some(i => i < 0)).toBeFalsy();

    const arr4 = cm.randomNumber(-10, 10, 200);
    expect(arr4.some(i => i > -10)).toBeTruthy();
    expect(arr4.some(i => i < 10)).toBeTruthy();
    expect(arr4.some(i => i > 5 && i < 6)).toBeTruthy();
    expect(arr4.some(i => i > -6 && i < -1)).toBeTruthy();
    expect(arr4.some(i => i > -5 && i < 5)).toBeTruthy();
    expect(arr4.some(i => i > 10)).toBeFalsy();
    expect(arr4.some(i => i < -10)).toBeFalsy();

    const arr5 = cm.randomNumber(10, 11, 520);
    expect(arr5.length).toBe(520);
    expect(arr5.some(i => i < 10)).toBeFalsy();
    expect(arr5.some(i => i < 10.1)).toBeTruthy();

    const arr6 = cm.randomNumber(0.2, 0.4, 300);
    expect(arr6.length).toBe(300);
    expect(arr6.some(i => i < 0.2)).toBeFalsy();
    expect(arr6.some(i => i < 0.4)).toBeTruthy();
    expect(arr6.some(i => i >= 0.4)).toBeFalsy();
    expect(arr3.some(i => i > 0.3 && i < 0.4)).toBeTruthy();
});
test("strPadStart", () => {
    expect(cm.strPadStart("123", 6, "0")).toBe("000123");
    expect(cm.strPadStart("123", 0, "0")).toBe("123");
    expect(cm.strPadStart("123", 4, "hello")).toBe("h123");
    expect(cm.strPadStart("123", 20, "hello")).toBe("hellohellohellohe123");
    expect(cm.strPadStart("123", -1, "0")).toBe("123");
    expect(cm.strPadStart("0", 2, "0")).toBe("00");
});
test("strPadEnd", () => {
    expect(cm.strPadEnd("123", 6, "0")).toBe("123000");
    expect(cm.strPadEnd("123", 0, "0")).toBe("123");
    expect(cm.strPadEnd("123", 4, "hello")).toBe("123h");
    expect(cm.strPadEnd("123", 20, "hello")).toBe("123hellohellohellohe");
    expect(cm.strPadEnd("123", -1, "0")).toBe("123");
});
test("randomColor", () => {
    const reg = /#[0-9a-f]{6}$/;
    expect(reg.test(cm.randomColor())).toBeTruthy();
    // array
    const arr = cm.randomColor(10);
    expect(arr.length === 10).toBeTruthy();
    cm.forEachByLen(arr.length, (i) => {
        expect(reg.test(arr[i])).toBeTruthy();
    });
});

test("thousandFormat", () => {
    expect(cm.thousandFormat(123456789)).toBe("123,456,789");
    expect(cm.thousandFormat(123)).toBe("123");
    expect(cm.thousandFormat(5763423)).toBe("5,763,423");
});
test("getChineseNumber", () => {
    expect(cm.number2Chinese(123)).toBe("一百二十三");
    expect(cm.number2Chinese(1)).toBe("一");
    expect(cm.number2Chinese(11)).toBe("十一");
    expect(cm.number2Chinese(21)).toBe("二十一");
    expect(cm.number2Chinese(101)).toBe("一百零一");
    expect(cm.number2Chinese(111)).toBe("一百一十一");
    expect(cm.number2Chinese(1001)).toBe("一千零一");
    expect(cm.number2Chinese(12345)).toBe("一万二千三百四十五");
    expect(cm.number2Chinese(23456789)).toBe("二千三百四十五万六千七百八十九");
    expect(cm.number2Chinese(123456789)).toBe("一亿二千三百四十五万六千七百八十九");
});
test("getFormatStr", () => {
    expect(cm.getFormatStr("hell%s worl%s", "o", "d")).toBe("hello world");
    expect(cm.getFormatStr("hell%s worl%s")).toBe("hell worl");
});
test("debounce", (done) => {
    let times = 0;
    const d = cm.debounce(() => {
        times++;
    }, 100);
    setTimeout(d, 10);
    setTimeout(d, 20);
    setTimeout(d, 30);
    setTimeout(d, 40);
    setTimeout(() => {
        expect(times).toBe(1);
        // 异步代码需要调用done()
        done();
    }, 500);
});

test("oneByOne", (done) => {
    const s = "hello world";
    cm.oneByOne(s, 10, (w, index) => {
        expect(w).toBe(s[index]);
        if (s.length === index + 1) {
            done();
        }
    });
    cm.oneByOne(s, 10);
});
test("generateFunction", () => {
    // const args = [1, 2, 3];
    // (new Function(generateFunctionCode(args.length)))(object, property, args);
    // expect(cm.strFillPrefix("123", "0", 6)).toBe("000123");
    const value = cm.generateFunction(cm, "strPadStart", ["123", 6, "0"]);
    expect(value).toBe("000123");
});
test("polling", (done) => {
    let t = 0;
    const cancel = cm.polling((times) => {
        return new Promise<void>((res) => {
            expect(times).toBe(t);
            t++;
            if (times === 10) {
                cancel();
                done();
            }
            res();
        });
    }, 10, false);
});

test("chinese2Number", () => {
    expect(cm.chinese2Number("一")).toBe(1);
    expect(cm.chinese2Number("十一")).toBe(11);
    expect(cm.chinese2Number("九十一")).toBe(91);
    expect(cm.chinese2Number("一百九十九")).toBe(199);
    expect(cm.chinese2Number("五千一百九十九")).toBe(5199);
    expect(cm.chinese2Number("一万零一")).toBe(10001);
    expect(cm.chinese2Number("一万零一十")).toBe(10010);
    expect(cm.chinese2Number("一万零一十三")).toBe(10013);
    expect(cm.chinese2Number("一万零一十三")).toBe(10013);
    expect(cm.chinese2Number("十万零一十三")).toBe(100013);
    expect(cm.chinese2Number("二百一十万零一十三")).toBe(2100013);
    expect(cm.chinese2Number("一千二百一十万零一十三")).toBe(12100013);
    expect(cm.chinese2Number("一千二百一十万零一")).toBe(12100001);
    expect(cm.chinese2Number("一亿零二百一十万零一十三")).toBe(102100013);
    expect(cm.chinese2Number("一亿二千三百四十五万六千七百八十九")).toBe(123456789);
    expect(cm.chinese2Number("十一亿零二百一十万零一十三")).toBe(1102100013);
    const sbq = ["拾", "佰", "仟"];
    cm.chinese2Number.units = ["", ...sbq, "萬", ...sbq, "亿"];
    cm.chinese2Number.numbers = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    // 千和百未定义
    expect(() => {
        cm.chinese2Number("壹亿贰仟叁佰肆拾伍萬陆千柒百捌拾玖");
    }).toThrow();
    expect(cm.chinese2Number("壹亿贰仟叁佰肆拾伍萬陆仟柒佰捌拾玖")).toBe(123456789);
});
test("getTreeMaxDeep", () => {
    expect(cm.getTreeMaxDeep({})).toBe(1);
    expect(cm.getTreeMaxDeep({a: 1})).toBe(2);
    expect(cm.getTreeMaxDeep(null as any)).toBe(0);
    expect(cm.getTreeMaxDeep({a: {b: 1}})).toBe(3);
    const obj: any = {a: {a2: 1}, b: 1, c: {c2: {c3: 123, c32: {}}}};
    expect(cm.getTreeMaxDeep(obj)).toBe(4);
    expect(cm.getTreeMaxDeep([])).toBe(1);
    expect(cm.getTreeMaxDeep([1, 2, 4, 5])).toBe(2);
    expect(cm.getTreeMaxDeep([1, 2, 4, 5, {a: 3}])).toBe(3);

    function Fn() {
        this.test = {a: 1, b: 2};
    }

    Fn.prototype.c = {a: {b: 2, c: {d: 123}}};

    const fn = new Fn();
    expect(cm.getTreeMaxDeep(fn)).toBe(3);
});
test("getTreeNodeLen", () => {
    expect(cm.getTreeNodeLen({}, -1)).toBe(0);
    expect(cm.getTreeNodeLen({}, 0)).toBe(1);
    expect(cm.getTreeNodeLen({})).toBe(0);
    expect(cm.getTreeNodeLen({a: 1, b: 2, c: 3})).toBe(3);
    expect(cm.getTreeNodeLen({a: 1, b: 2, c: 3, d: {d1: 123, d2: 1, d3: 123}})).toBe(4);
    expect(cm.getTreeNodeLen({a: 1, b: {b2: 2, b3: 3}, c: 3, d: {d1: 123, d2: 1, d3: 123}})).toBe(4);
    expect(cm.getTreeNodeLen({a: 1, b: {b2: 2, b3: 3}, c: 3, d: {d1: 123, d2: 1, d3: 123}}, 2)).toBe(5);
    expect(cm.getTreeNodeLen({a: {a2: 1}, b: {b2: 2}, c: {c2: 3}, d: {d1: 4}}, 2)).toBe(4);
    expect(cm.getTreeNodeLen({a: {a2: 1, a3: {a4: 4}}, b: {b2: 2}, c: {c2: 3}, d: {d1: 4}}, 3)).toBe(1);
    expect(cm.getTreeNodeLen({
        a: {a2: 1, a3: {a4: 4}},
        b: {b2: 2, b3: {b4: 4}},
        c: {c2: 3},
        d: {d1: 4},
    }, 3)).toBe(2);
    expect(cm.getTreeNodeLen([0, 1, [3, 4, 5]], 2)).toBe(3);
    expect(cm.getTreeNodeLen([0, 1, {a: 12, b: 1, c: 4}], 2)).toBe(3);

    function Fn() {
        this.test = {a: 1, b: 2};
    }

    Fn.prototype.c = {a: {b: 2, c: {d: 123}}};

    const fn = new Fn();
    expect(cm.getTreeNodeLen(fn, 2)).toBe(2);
});

test("merge", () => {
    const a = {one: 1, two: 2, three: 3};
    const b = {one: 11, four: 4, five: 5};
    expect(cm.merge(a, b)).toEqual(Object.assign({}, a, b));

    const c = {...a, test: {a: 1, b: 2, c: 3}};
    expect(cm.merge(c, b)).toEqual(Object.assign({}, c, b));
    expect(cm.merge(c, b).test === c.test && c.test === Object.assign({}, c, b).test).toEqual(true);

    function Fn() {
        this.a = 100;
    }

    Fn.prototype.b = 200;
    const d = new Fn();
    expect(cm.merge(a, d)).toEqual(Object.assign({}, a, d));
    expect(cm.merge(a, d).b).toEqual(undefined);
});
test("deepMerge", () => {
    const a = {one: 1, two: 2, three: 3};
    const b = {one: 11, four: 4, five: 5};
    expect(cm.deepMerge(a, b)).toEqual(Object.assign({}, a, b));

    const c = {...a, test: {a: 1, b: 2, c: 3}};
    expect(cm.deepMerge(c, b)).toEqual(Object.assign({}, c, b));
    expect(cm.deepMerge(c, b).test.a === 1).toEqual(true);
    expect(cm.deepMerge(c, b).test !== c.test && c.test === Object.assign({}, c, b).test).toEqual(true);

    function Fn() {
        this.a = 100;
    }

    Fn.prototype.b = 200;
    const d = new Fn();
    expect(cm.deepMerge(a, d)).toEqual(Object.assign({}, a, d));
    expect(cm.deepMerge(a, d).b).toEqual(undefined);

    expect(cm.deepMerge(a, {a: [{b: 123}]})).toEqual(Object.assign({}, a, {a: [{b: 123}]}));
});

test("sleep", async () => {
    const date = Date.now();
    await cm.sleep(100);
    expect(Date.now() - date).toBeGreaterThan(80);
});

test("createUUID", () => {
    const uuid = cm.createUUID(10);

    // 判断长度是否正确
    expect(uuid.length === 10).toBeTruthy();

    const hexDigits = "0123456789abcdef";
    // 判断每个字符是否在范围内
    for (let i = 0; i < uuid.length; i++) {
        expect(hexDigits.indexOf(uuid[i]) > -1).toBeTruthy();
    }

    // 判断100次循环中是否有相同的
    for (let i = 0; i < 100; i++) {
        const uid = cm.createUUID(10);
        expect(uid !== uuid).toBeTruthy();
    }
});

test("formatJSON", () => {
    const formatJSON = cm.formatJSON;
    const str = {a: 1, b: 2};
    expect(formatJSON(str, 4)).toBe(`{\r\n    "a":1,\r\n    "b":2\r\n}`);
    /*  const rs = formatJSON({
          ...str,
          fn: function () {
          },
      }, 4);*/
    // expect(rs).toBe(`{\r\n    "a":1,\r\n    "b":2,\r\n    "fn":"function () {\r\n        }"\r\n}`);
});
const testPickByKeys = (fn: typeof cm.pickByKeys) => {
    return () => {
        const obj = {a: 1, b: "2", c: ["12313", 111], d: false, e: {a: 1}, f: undefined};
        expect(fn(obj, [])).toEqual({});
        expect(fn(obj, ["a"])).toEqual({a: 1});
        expect(fn(obj, ["b"])).toEqual({b: obj.b});
        expect(fn(obj, ["c"])).toEqual({c: obj.c});
        expect(fn(obj, ["d"])).toEqual({d: obj.d});
        expect(fn(obj, ["e"])).toEqual({e: obj.e});
        expect(fn(obj, ["f"])).toEqual({f: obj.f});
        expect(fn(obj, ["a", "f"])).toEqual({a: obj.a, f: obj.f});
        expect(fn(obj, ["a", "f", "c"])).toEqual({a: obj.a, f: obj.f, c: obj.c});

        expect(fn(obj, ["a"], (v) => v + 1000)).toEqual({a: 1001});
        expect(fn(obj, ["a", "b"], (v, k) => {
            if (k === "a") {
                return 2;
            }
            return "test";
        })).toEqual({a: 2, b: "test"});
    };
};
test("pickByKeys", () => {
    const fn = cm.pickByKeys;
    testPickByKeys(fn)();
});
const testPickRename = (fn: typeof cm.pickRename) => {
    return () => {
        const obj = {a: 1, b: "2", c: ["12313", 111], d: false, e: {a: 1}, f: undefined};
        expect(fn(obj, {})).toEqual({});
        expect(fn(obj, {"A": "a"})).toEqual({A: 1});
        expect(fn(obj, {"B": "b"})).toEqual({B: obj.b});
        expect(fn(obj, {"C": "c"})).toEqual({C: obj.c});
        expect(fn(obj, {"D": "d"})).toEqual({D: obj.d});
        expect(fn(obj, {"E": "e"})).toEqual({E: obj.e});
        expect(fn(obj, {"E": "f"})).toEqual({F: obj.f});
        expect(fn(obj, {"A": "a", "F": "f"})).toEqual({A: obj.a, F: obj.f});
        expect(fn(obj, {"a": "a", "f": "b", "c": "d"})).toEqual({a: obj.a, f: obj.b, c: obj.d});

        expect(fn(obj, {"A": "a"}, (v) => (v + 1000))).toEqual({A: 1001});
        expect(fn(obj, {"A": "a", "B": "b"}, (v, k) => {
            if (k === "a") {
                return 2;
            }
            return "test";
        })).toEqual({A: 2, B: "test"});
    };
};
test("pickRename", () => {
    const fn = cm.pickRename;
    testPickRename(fn)();
});
test("pick", () => {
    const fn = cm.pick;
    // pickByKeys
    testPickByKeys(fn)();
    let obj = {a: 1, b: "2", c: ["12313", 111], d: false, e: {a: 1}, f: undefined};
    expect(fn(obj, ["a", "b"], (v, k) => {
        if (k === "a") {
            return 2;
        }
        return "test";
    })).toEqual({a: 2, b: "test"});

    // pickRename
    testPickRename(fn)();
    obj = {a: 1, b: "2", c: ["12313", 111], d: false, e: {a: 1}, f: undefined};
    expect(fn(obj, {"A": "a", "B": "b"}, (v, k) => {
        if (k === "a") {
            return 2;
        }
        return "test";
    })).toEqual({A: 2, B: "test"});
    const nObj = fn(obj, {"A": "a", "B": "a"}, (v, k) => {
        return 2;
    });
    expect(nObj).toEqual({A: 2, B: 2});
});

test("promiseAny", async () => {
    expect.assertions(12);
    const fn = cm.promiseAny;
    const isNotIterable = "TypeError: list is not iterable";
    await expect(fn(undefined as any)).rejects.toEqual(isNotIterable);
    await expect(fn(null as any)).rejects.toEqual(isNotIterable);
    await expect(fn(NaN as any)).rejects.toEqual(isNotIterable);
    await expect(fn(0 as any)).rejects.toEqual(isNotIterable);
    await expect(fn(true as any)).rejects.toEqual(isNotIterable);
    await expect(fn({} as any)).rejects.toEqual(isNotIterable);

    const allReject = "AggregateError: All promises were rejected";
    await expect(fn([])).rejects.toEqual(allReject);
    await expect(fn([Promise.reject(0), Promise.reject(1)])).rejects.toEqual(allReject);
    await expect(fn([0 as any, Promise.resolve(1)])).resolves.toEqual(0);
    await expect(fn([Promise.resolve(1), 0 as any])).resolves.toEqual(0);
    await expect(fn([Promise.resolve(0), Promise.resolve(1)])).resolves.toEqual(0);
    await expect(fn([Promise.reject(0), Promise.reject(1), Promise.resolve(2)])).resolves.toEqual(2);
});

test("debounceAsync", async () => {
    expect.assertions(2);
    const fn = cm.debounceAsync;
    let times = 0;
    const cb = () => {
        return new Promise(resolve => {
            resolve(times++);
        });
    };

    const dbFn = fn(cb, 100);
    await cm.promiseAny([dbFn(), dbFn(), dbFn(), dbFn()]);

    expect(times).toEqual(1);

    dbFn();
    await cm.sleep(150);
    dbFn();
    await cm.sleep(150);
    expect(times).toEqual(3);
});
test("debounceByPromise", async () => {
    expect.assertions(2);
    const fn = cm.debounceByPromise;
    let times = 0;
    const cb = (time = 50) => {
        const p = new Promise(resolve => {
            setTimeout(() => {

                resolve(time);
            }, time);
        });
        p.then(() => {
            times++;
        });
        return p;
    };

    const dbFn = fn(cb);

    await expect(cm.promiseAny([dbFn(40), dbFn(20), dbFn(60), dbFn(30)])).resolves.toEqual(30);

    dbFn(100);
    await cm.sleep(150);
    dbFn();
    await cm.sleep(150);
    // fixme 执行了6次， debounceByPromise无法阻止cb被调用 不推荐使用
    expect(times).toEqual(6);
});
test("debounceCancelable", async () => {
    expect.assertions(2);
    const fn = cm.debounceCancelable;
    let times = 0;
    const cb = () => {
        times++;
    };

    const dbFn = fn(cb, 20);

    let cancelFn = dbFn();
    cancelFn();

    await cm.sleep(30);

    expect(times).toEqual(0);

    dbFn();
    await cm.sleep(150);
    expect(times).toEqual(1);
});
test("getReverseObj", async () => {
    const fn = cm.getReverseObj;

    const obj = {a: "aa", b: "bb"};
    expect(fn(obj)).toEqual({aa: "a", bb: "b"});
});
test("createEnumByObj", async () => {
    const fn = cm.createEnumByObj;

    const obj = {a: "aa", b: "bb"};
    expect(fn(obj)).toEqual({a: "aa", b: "bb", aa: "a", bb: "b"});
    expect(fn({a: 1, b: 2})).toEqual({a: 1, b: 2, 1: "a", 2: "b"});
});
test("createEnum", async () => {
    const fn = cm.createEnum;

    enum e {
        a,
        b,
        c
    }

    expect(fn(["a", "b", "c"])).toEqual(e);
});
test("forEachObj", () => {
    const fn = cm.forEachObj;

    const testFn = (obj: object) => {
        let times = 0;
        fn(obj, (v, k, o) => {
            expect(typeof k).toEqual("string");
            expect(v).toEqual(obj[k]);
            expect(obj).toEqual(obj);
            times++;
        });
        expect(times).toEqual(Object.keys(obj).length);
    };

    testFn({a: 1, b: "2", c: true});
    testFn({a: 1, b: "2", c: {test: 1231}});
});
test("reduceObj", () => {
    const fn = cm.reduceObj;
    const obj = {a: 1, b: 2, c: "3"};
    const result = fn(obj, (r, v, k, o) => {
        r[k] = v;
        return r;
    }, {});

    expect(result).toEqual(obj);
    expect(result === obj).toEqual(false);

    const result2 = fn(obj, (r, v, k, o) => {
        r[k] = v + "1";
        return r;
    }, {});
    const result3 = Object.keys(obj).reduce((r, key, index, keyArr) => {
        const v = obj[key];
        r[key] = v + "1";
        return r;
    }, {});

    expect(result2).toEqual({
        a: "11", b: "21", c: "31",
    });
    expect(result2).toEqual(result3);
});
test("assign", () => {
    const fn = cm.assign;
    const a = {a: 1, b: 2, c: 3};
    const b = {a: 4, c: 6, d: 7};
    const c = {aa: 4, cc: 6, dd: 7};
    expect(fn({}, a)).toEqual(a);
    expect(fn({}, a)).toEqual(Object.assign({}, a));
    expect(fn({}, a, [1, 2, 3])).toEqual(Object.assign({}, a, [1, 2, 3]));
    expect(fn({}, a, b, c)).toEqual(Object.assign({}, a, b, c));
    expect(fn({}, a, b, c, a, b, c, a, b)).toEqual(Object.assign({}, a, b, c));
});
test("omit", () => {
    const fn = cm.omit;
    expect(fn({a: 12, b: true, c: "c"}, ["a"])).toEqual({b: true, c: "c"});
    expect(fn({a: 12, b: true, c: "c"}, ["a", "b"])).toEqual({c: "c"});
    expect(fn({c: "c"}, ["c"])).toEqual({});
    console.time("run");
    console.timeEnd("run");
});

