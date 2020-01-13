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
    expect(newArr).toEqual([1, 2, 3]);
    expect(arr === newArr).toBeFalsy();
    const obj = {a: [2, 3], c: 1, d: {f: 123}};
    const newObj = cm.deepCopy(obj);
    expect(newObj).toEqual({a: [2, 3], c: 1, d: {f: 123}});
    expect(arr === newObj).toBeFalsy();
});
test('getDateFromStr', () => {
    const t1 = (cm.getDateFromStr("2019-12-29 10:10:10") as Date).getTime();
    const t2 = (cm.getDateFromStr("2019-12-20 10:10:10") as Date).getTime();
    expect(t1).toBeGreaterThan(t2);
    expect(cm.getDateFromStr("abcd")).toBeUndefined();
});
test('formatDate', () => {
    const date1 = cm.getDateFromStr("2019-12-29 10:10:10");
    expect(cm.formatDate.call(date1, "yyyy-MM-dd")).toBe("2019-12-29");
    expect(cm.formatDate.call(date1, "hh:mm:ss")).toBe("10:10:10");
    expect(cm.formatDate.call(date1, "dd-MM-yyyy")).toBe("29-12-2019");
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
});
test('isArrayLike', () => {
    expect(cm.isArrayLike([1, 2, 3])).toBe(true);
    expect(cm.isArrayLike([])).toBe(true);
    expect(cm.isArrayLike({length: 1, 0: 1})).toBe(true);
    expect(cm.isArrayLike({length: 2, 0: 1})).toBe(false);
    expect(cm.isArrayLike("")).toBe(false);
    expect(cm.isArrayLike(1)).toBe(false);
    expect(cm.isArrayLike(true)).toBe(false);
    expect(cm.isArrayLike(undefined)).toBe(false);
    expect(cm.isArrayLike(null)).toBe(false);
    expect(cm.isArrayLike({})).toBe(false);
    expect(cm.isArrayLike(() => {
    })).toBe(false);
});
test('isArray', () => {
    expect(cm.isArray(0.12345667)).toBeFalsy();
    expect(cm.isArray("")).toBeFalsy();
    expect(cm.isArray({})).toBeFalsy();
    expect(cm.isArray({0: 1, 1: 2, length: 2})).toBeFalsy();
    expect(cm.isArray(() => {
    })).toBeFalsy();
    expect(cm.isArray(true)).toBeFalsy();
    expect(cm.isArray(NaN)).toBeFalsy();
    expect(cm.isArray(undefined)).toBeFalsy();
    expect(cm.isArray(null)).toBeFalsy();
    expect(cm.isArray([1, 2, 3])).toBeTruthy();
    expect(cm.isArray([])).toBeTruthy();
});
test('isNumber', () => {
    expect(cm.isNumber("")).toBeFalsy();
    expect(cm.isNumber({})).toBeFalsy();
    expect(cm.isNumber({0: 1, 1: 2, length: 2})).toBeFalsy();
    expect(cm.isNumber(() => {
    })).toBeFalsy();
    expect(cm.isNumber(true)).toBeFalsy();
    expect(cm.isNumber(undefined)).toBeFalsy();
    expect(cm.isNumber(null)).toBeFalsy();
    expect(cm.isNumber([1, 2, 3])).toBeFalsy();
    expect(cm.isNumber([])).toBeFalsy();
    expect(cm.isNumber(NaN)).toBeTruthy();
    expect(cm.isNumber(123)).toBeTruthy();
});
test('isFunction', () => {
    expect(cm.isFunction("")).toBeFalsy();
    expect(cm.isFunction(() => {
    })).toBeTruthy();
});
test('isString', () => {
    expect(cm.isString(123123)).toBeFalsy();
    expect(cm.isString("")).toBeTruthy();
});
test('isObject', () => {
    expect(cm.isObject(123123)).toBeFalsy();
    expect(cm.isObject(undefined)).toBeFalsy();
    expect(cm.isObject(123123)).toBeFalsy();
    expect(cm.isObject("")).toBeFalsy();
    // null
    expect(typeof null === "object").toBeTruthy();
    expect(cm.isObject(null)).toBeFalsy();
    // array
    expect(typeof [] === "object").toBeTruthy();
    expect(cm.isObject([])).toBeFalsy();
    //
    expect(cm.isObject({})).toBeTruthy();
});
test('isBoolean', () => {
    expect(cm.isBoolean(0)).toBeFalsy();
    expect(cm.isBoolean(123123)).toBeFalsy();
    expect(cm.isBoolean(undefined)).toBeFalsy();
    expect(cm.isBoolean("")).toBeFalsy();
    expect(cm.isBoolean(null)).toBeFalsy();
    expect(cm.isBoolean([])).toBeFalsy();
    expect(cm.isBoolean({})).toBeFalsy();
});
test('isUndefined', () => {
    expect(cm.isUndefined(0)).toBeFalsy();
    expect(cm.isUndefined(123123)).toBeFalsy();
    expect(cm.isUndefined("")).toBeFalsy();
    expect(cm.isUndefined(null)).toBeFalsy();
    expect(cm.isUndefined([])).toBeFalsy();
    expect(cm.isUndefined(undefined)).toBeTruthy();
    let a;
    expect(cm.isUndefined(a)).toBeTruthy();
});
test('isNaN', () => {
    expect(NaN === NaN).toBeFalsy();
    expect(cm.isNaN(NaN)).toBeTruthy();
    expect(cm.isNaN({a: 1})).toBeFalsy();
    expect(cm.isNaN(1)).toBeFalsy();
    expect(cm.isNaN(0)).toBeFalsy();
    expect(cm.isNaN(-1)).toBeFalsy();
    expect(cm.isNaN(false)).toBeFalsy();
    expect(cm.isNaN(undefined)).toBeFalsy();
    expect(cm.isNaN(null)).toBeFalsy();
    expect(cm.isNaN("")).toBeFalsy();
    expect(cm.isNaN({})).toBeFalsy();
    expect(cm.isNaN([])).toBeFalsy();
    expect(cm.isNaN("123")).toBeFalsy();
    expect(cm.isNaN(["bdsdf", 12323])).toBeFalsy();
    expect(cm.isNaN("NaN")).toBeFalsy();
});
test('isEmpty', () => {
    expect(cm.isEmpty(NaN)).toBeTruthy();
    expect(cm.isEmpty("")).toBeTruthy();
    expect(cm.isEmpty({})).toBeTruthy();
    expect(cm.isEmpty([])).toBeTruthy();
    expect(cm.isEmpty({a: 1})).toBeFalsy();
    expect(cm.isEmpty([1])).toBeFalsy();
    expect(cm.isEmpty(0)).toBeFalsy();
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
});
test('strFillPrefix', () => {
    expect(cm.strFillPrefix("123", "0", 6)).toBe("000123");
});
test('randomColor', () => {
    const reg = /#[0-9a-f]{6}/;
    expect(reg.test(cm.randomColor() as string)).toBeTruthy();
    // array
    const arr = cm.randomColor(10);
    expect(arr.length === 10).toBeTruthy();
    cm.forEachByLen(arr.length, (i) => {
        expect(reg.test(arr[i])).toBeTruthy();
    });
});
test('objectIsEqual', () => {
    expect(cm.objectIsEqual(cm, cm)).toBeTruthy();
    expect(cm.objectIsEqual({a: 1}, {a: 1})).toBeTruthy();
    expect(cm.objectIsEqual({a: 1}, {a: 2})).toBeFalsy();
});
test('isEqual', () => {
    expect(cm.isEqual({a: 1}, {a: 1})).toBeTruthy();
    expect(cm.isEqual({a: 1}, {a: 2})).toBeFalsy();
    expect(cm.isEqual(1, 1)).toBeTruthy();
    expect(cm.isEqual(1, 2)).toBeFalsy();
    expect(cm.isEqual(1, "1")).toBeFalsy();
    expect(cm.isEqual(0, "")).toBeFalsy();
    expect(cm.isEqual(0, false)).toBeFalsy();
    expect(cm.isEqual(0, null)).toBeFalsy();
    expect(cm.isEqual(0, undefined)).toBeFalsy();
    expect(cm.isEqual(null, undefined)).toBeFalsy();
    expect(cm.isEqual(false, undefined)).toBeFalsy();
    expect(cm.isEqual(false, null)).toBeFalsy();
    expect(cm.isEqual(false, true)).toBeFalsy();
    expect(cm.isEqual([1, 2], {0: 1, 1: 2, length: 2})).toBeFalsy();
    expect(cm.isEqual(() => {
    }, () => {
    })).toBeFalsy();
    expect(cm.isEqual(cm.polling, cm.polling)).toBeTruthy();
    expect(cm.isEqual([1, 2], [1, 2])).toBeTruthy();
    expect(cm.isEqual(null, null)).toBeTruthy();
    expect(cm.isEqual(undefined, undefined)).toBeTruthy();
    expect(cm.isEqual(false, false)).toBeTruthy();
    expect(cm.isEqual(NaN, NaN)).toBeTruthy();
    expect(cm.isEqual("", "")).toBeTruthy();
});
test('thousandFormat', () => {
    expect(cm.thousandFormat(123456789)).toBe("123,456,789");
    expect(cm.thousandFormat(123)).toBe("123");
    expect(cm.thousandFormat(5763423)).toBe("5,763,423");
});
test('getChineseNumber', () => {
    expect(cm.getChineseNumber(123)).toBe("一百二十三");
    expect(cm.getChineseNumber(1)).toBe("一");
    expect(cm.getChineseNumber(11)).toBe("十一");
    expect(cm.getChineseNumber(21)).toBe("二十一");
    expect(cm.getChineseNumber(101)).toBe("一百零一");
    expect(cm.getChineseNumber(111)).toBe("一百一十一");
    expect(cm.getChineseNumber(1001)).toBe("一千零一");
    expect(cm.getChineseNumber(12345)).toBe("一万二千三百四十五");
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
    const value = cm.generateFunction(cm, "strFillPrefix", ["123", "0", 6]);
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
