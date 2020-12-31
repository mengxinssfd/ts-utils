import * as cm from "../src/common";

test('forEachByLen', () => {
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

test('getDateFromStr', () => {
    const t1 = (cm.getDateFromStr("2020-02-02 10:10:10") as Date).getTime();
    const t2 = (cm.getDateFromStr("2020-02-20 10:10:10") as Date).getTime();
    expect(t2).toBeGreaterThan(t1);
    expect(cm.getDateFromStr("abcd")).toBeNull();

    function fn(date: string, format: string) {
        return cm.formatDate.call(cm.getDateFromStr(date), format);
    }

    expect(fn("2020-02-02", "yyyy")).toBe("2020");
    expect(fn("2020-02-02", "MM")).toBe("02");
    expect(fn("2020-02-02", "dd")).toBe("02");
    expect(fn("2020-02-02", "yy")).toBe("20");
    expect(fn("2020-02-02", "hh")).toBe("00");
    expect(fn("2020-02-02", "mm")).toBe("00");
    expect(fn("2020-02-02", "ss")).toBe("00");
    expect(fn("2019-03", "dd")).toBe("01");
    expect(fn("2020-02-02 12:00:00", "hh")).toBe("12");
    expect(fn("2020-02-02 12:00:00", "mm")).toBe("00");
    expect(fn("2020-02-02 12:00:00", "ss")).toBe("00");
    expect(fn("2020-02-02 12:00:10", "ss")).toBe("10");
    expect(fn("2020-02-02 12:11:10", "mm")).toBe("11");
});
test('formatDate', () => {
    const date1 = cm.getDateFromStr("2020-02-02 10:10:10");
    expect(cm.formatDate.call(date1, "yyyy-MM-dd")).toBe("2020-02-02");
    expect(cm.formatDate.call(date1, "hh:mm:ss")).toBe("10:10:10");
    expect(cm.formatDate.call(date1, "dd-MM-yyyy")).toBe("02-02-2020");
    // week start
    expect(cm.formatDate.call(new Date("2020-01-12"), "周w")).toBe("周日");
    expect(cm.formatDate.call(new Date("2020-01-12"), "w")).toBe("日");
    expect(cm.formatDate.call(new Date("2020-01-13"), "w")).toBe("一");
    expect(cm.formatDate.call(new Date("2020-01-14"), "w")).toBe("二");
    expect(cm.formatDate.call(new Date("2020-01-15"), "w")).toBe("三");
    expect(cm.formatDate.call(new Date("2020-01-16"), "w")).toBe("四");
    expect(cm.formatDate.call(new Date("2020-01-17"), "w")).toBe("五");
    expect(cm.formatDate.call(new Date("2020-01-18"), "w")).toBe("六");
    // week end
    // season start
    expect(cm.formatDate.call(new Date("2020-01-12"), "q")).toBe("春");
    expect(cm.formatDate.call(new Date("2020-02-12"), "q")).toBe("春");
    expect(cm.formatDate.call(new Date("2020-03-13"), "q")).toBe("春");
    expect(cm.formatDate.call(new Date("2020-04-14"), "q")).toBe("夏");
    expect(cm.formatDate.call(new Date("2020-05-15"), "q")).toBe("夏");
    expect(cm.formatDate.call(new Date("2020-06-16"), "q")).toBe("夏");
    expect(cm.formatDate.call(new Date("2020-07-17"), "q")).toBe("秋");
    expect(cm.formatDate.call(new Date("2020-08-18"), "q")).toBe("秋");
    expect(cm.formatDate.call(new Date("2020-09-18"), "q")).toBe("秋");
    expect(cm.formatDate.call(new Date("2020-10-18"), "q")).toBe("冬");
    expect(cm.formatDate.call(new Date("2020-11-18"), "q")).toBe("冬");
    expect(cm.formatDate.call(new Date("2020-12-18"), "q")).toBe("冬");

    cm.formatDate.seasonText = ["spring"];
    expect(cm.formatDate.call(new Date("2020-01-12"), "q")).toBe("spring");
    // season end
    const date2 = cm.getDateFromStr("2019-12-1 10:10:10");
    expect(cm.formatDate.call(date2, "d-MM-yy")).toBe("1-12-19");
});

test('typeOf', () => {
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

test('randomNumber', () => {
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
});
test('strPadStart', () => {
    expect(cm.strPadStart("123", 6, "0")).toBe("000123");
    expect(cm.strPadStart("123", 0, "0")).toBe("123");
    expect(cm.strPadStart("123", 4, "hello")).toBe("h123");
    expect(cm.strPadStart("123", 20, "hello")).toBe("hellohellohellohe123");
    expect(cm.strPadStart("123", -1, "0")).toBe("123");
    expect(cm.strPadStart("0", 2, "0")).toBe("00");
});
test('strPadEnd', () => {
    expect(cm.strPadEnd("123", 6, "0")).toBe("123000");
    expect(cm.strPadEnd("123", 0, "0")).toBe("123");
    expect(cm.strPadEnd("123", 4, "hello")).toBe("123h");
    expect(cm.strPadEnd("123", 20, "hello")).toBe("123hellohellohellohe");
    expect(cm.strPadEnd("123", -1, "0")).toBe("123");
});
test('randomColor', () => {
    const reg = /#[0-9a-f]{6}/;
    expect(reg.test(cm.randomColor())).toBeTruthy();
    // array
    const arr = cm.randomColor(10);
    expect(arr.length === 10).toBeTruthy();
    cm.forEachByLen(arr.length, (i) => {
        expect(reg.test(arr[i])).toBeTruthy();
    });
});


test('thousandFormat', () => {
    expect(cm.thousandFormat(123456789)).toBe("123,456,789");
    expect(cm.thousandFormat(123)).toBe("123");
    expect(cm.thousandFormat(5763423)).toBe("5,763,423");
});
test('getChineseNumber', () => {
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
test('getFormatStr', () => {
    expect(cm.getFormatStr("hell%s worl%s", "o", "d")).toBe("hello world");
    expect(cm.getFormatStr("hell%s worl%s")).toBe("hell worl");
});
test('debounce', (done) => {
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

test('oneByOne', (done) => {
    const s = "hello world";
    cm.oneByOne(s, 10, (w, index) => {
        expect(w).toBe(s[index]);
        if (s.length === index + 1) {
            done();
        }
    });
    cm.oneByOne(s, 10);
});
test('generateFunction', () => {
    // const args = [1, 2, 3];
    // (new Function(generateFunctionCode(args.length)))(object, property, args);
    // expect(cm.strFillPrefix("123", "0", 6)).toBe("000123");
    const value = cm.generateFunction(cm, "strPadStart", ["123", 6, "0"]);
    expect(value).toBe("000123");
});
test('polling', (done) => {
    let t = 0;
    const cancel = cm.polling((times) => {
        return new Promise((res) => {
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
test("dateDiff", () => {
    const v = cm.dateDiff(new Date("2020-05-01"), new Date("2020-05-06"));
    expect(v).toBe("0年5天 00时00分00秒");
    expect(cm.dateDiff(new Date("2020-05-01"), new Date("2020-05-06"), "dd天 hh时mm分ss秒")).toBe("05天 00时00分00秒");
    expect(cm.dateDiff(new Date("2020-05-06"), new Date("2020-05-01 3:20:10"), "d天 hh时mm分ss秒")).toBe("5天 04时39分50秒");

    // expect(cm.dateDiff(new Date("2020-05-01"), new Date("2020-05-06"), "d天 H时m分s秒")).toBe("5天 0时0分0秒");
    // expect(cm.dateDiff(new Date("2020-05-06"), new Date("2020-05-01 3:20:10"), "d天 H时m分s秒")).toBe("-5天 -4时-39分-50秒");
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

