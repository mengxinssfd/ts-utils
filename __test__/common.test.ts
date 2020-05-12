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
test('deepCopy', () => {
    const arr = [1, 2, 3];
    const newArr = cm.deepCopy(arr);
    // copy == arr
    expect(newArr).toEqual(arr);
    // copy !== arr
    expect(arr === newArr).toBeFalsy();
    const obj = {a: [2, 3], c: 1, d: {f: 123}};
    const newObj = cm.deepCopy(obj);
    // copy == obj
    expect(newObj).toEqual(obj);
    // copy !== obj
    expect(obj === newObj).toBeFalsy();
    // copy.a == obj.a
    expect(obj.a).toEqual(newObj.a);
    // copy.a !== obj.a
    expect(obj.a === newObj.a).toBeFalsy();
    // 0 === 0
    expect(cm.deepCopy(0)).toBe(0);

    const arr2 = [
        () => 100,
        () => 200,
    ];
    const newArr2 = cm.deepCopy(arr2);
    // copy == arr2
    expect(arr2 == newArr2).toBe(false);
    // copy !== arr2
    expect(newArr2 === arr2).toBeFalsy();
    // copy[0] == arr2[0]
    expect(newArr2[0] == arr2[0]).toBe(false);
    expect(newArr2[1] == arr2[1]).toEqual(false);
    // copy[0] === arr2[0]
    expect(newArr2[0] !== arr2[0]).toBeTruthy();
    expect(newArr2[1] !== arr2[1]).toBeTruthy();
    // copy[0]() === arr2[0]()
    expect(newArr2[1]() === arr2[1]()).toBeTruthy();
    expect(newArr2[1]()).toEqual(arr2[1]());

    function Foo() {
        this.name = 'foo';
        this.sayHi = function () {
            console.log('Say Hi');
        };
    }

    Foo.prototype.sayGoodBy = function () {
        console.log('Say Good By');
    };
    let myPro = new Foo();
    expect(myPro.hasOwnProperty('name')).toBeTruthy();//true
    expect(myPro.hasOwnProperty('toString')).toBeFalsy();//false
    expect(myPro.hasOwnProperty('hasOwnProperty')).toBeFalsy();//fasle
    expect(myPro.hasOwnProperty('sayHi')).toBeTruthy();// true
    expect(myPro.hasOwnProperty('sayGoodBy')).toBeFalsy();//false
    expect('sayGoodBy' in myPro).toBeTruthy();// true

    // test cov if (!(target as any).hasOwnProperty(k)) continue;
    const copyFoo = cm.deepCopy(myPro);
    expect(copyFoo.hasOwnProperty("sayGoodBy")).toBeFalsy();

    // copy function
    function fn(arg: number) {
        return arg + fn.data;
    }

    fn.data = 100;

    const nFn = cm.deepCopy(fn);

    expect(fn(100)).toBe(200);
    expect(fn === nFn).toBe(false);
    expect(nFn(100)).toBe(200);
    expect(nFn.data).toBe(100);
    nFn.data = 200;
    expect(nFn.data).toBe(200);
    expect(fn.data).toBe(100);
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
test('getNumberLenAfterDot', () => {
    expect(cm.getNumberLenAfterDot(0.12345667)).toBe(8);
    expect(cm.getNumberLenAfterDot("0.123456789")).toBe(9);
    expect(cm.getNumberLenAfterDot(12345)).toBe(0);
    expect(cm.getNumberLenAfterDot("abc")).toBe(0);
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
test('FloatCalc', () => {
    const calc = cm.FloatCalc;
    // 0.1 + 0.2 = 0.30000000000000004
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(calc.add(0.1, 0.2)).toBe(0.3);
    // 0.3 - 0.1 = 0.19999999999999998
    expect(0.3 - 0.1).not.toBe(0.2);
    expect(calc.minus(0.3, 0.1)).toBe(0.2);
    // 0.2 * 0.1 = 0.020000000000000004
    expect(0.2 * 0.1).not.toBe(0.02);
    expect(calc.mul(0.2, 0.1)).toBe(0.02);
    // 0.3 / 0.1 = 2.9999999999999996
    expect(0.3 / 0.1).not.toBe(3);
    expect(calc.division(0.3, 0.1)).toBe(3);
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
    expect(cm.dateDiff(new Date("2020-05-01"), new Date("2020-05-06"))).toBe("0年5天 0时0分0秒");
    expect(cm.dateDiff(new Date("2020-05-01"), new Date("2020-05-06"), "d天 H时m分s秒")).toBe("5天 0时0分0秒");
    expect(cm.dateDiff(new Date("2020-05-06"), new Date("2020-05-01 3:20:10"), "d天 H时m分s秒")).toBe("-5天 -4时-39分-50秒");
});
test("getTreeMaxDeep", () => {
    expect(cm.getTreeMaxDeep({})).toBe(1);
    expect(cm.getTreeMaxDeep(null as any)).toBe(0);
    expect(cm.getTreeMaxDeep({a: {b: 1}})).toBe(3);
    const obj: any = {a: {a2: 1}, b: 1, c: {c2: {c3: 123, c32: {}}}};
    expect(cm.getTreeMaxDeep(obj)).toBe(4);
    expect(cm.getTreeMaxDeep([])).toBe(1);
    expect(cm.getTreeMaxDeep([1, 2, 4, 5])).toBe(2);
    expect(cm.getTreeMaxDeep([1, 2, 4, 5, {a: 3}])).toBe(3);
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
});
test("cloneFunction", () => {
    function test(a, b) {
        return a + b;
    }

    expect(cm.cloneFunction(test)(50, 50)).toBe(100);

    const test2 = (a, b) => a + b;
    expect(cm.cloneFunction(test2)(50, 50)).toBe(100);
    expect((function (a, b) {
        return a + b;
    })(50, 50)).toBe(100);
});



