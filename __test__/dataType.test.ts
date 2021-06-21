import * as type from "../src/dataType";
import * as cm from "../src/common";

test("typeOf", () => {
    const fn = type.typeOf;
    // 六大基本类型 string boolean number object null undefined
    expect(fn("")).toBe("string");
    expect(fn(true)).toBe("boolean");
    expect(fn(0)).toBe("number");
    expect(fn(undefined)).toBe("undefined");
    expect(fn({})).toBe("object");
    expect(fn(null)).toBe("null");
    // 非6
    expect(fn(() => {
    })).toBe("function");
    expect(fn([])).toBe("array");
    expect(fn(NaN)).toBe("number");
    expect(fn(/abc/)).toBe("regexp");
});
test("isArrayLike", () => {
    expect(type.isArrayLike([1, 2, 3])).toBe(true);
    expect(type.isArrayLike([])).toBe(true);
    expect(type.isArrayLike({length: 1, 0: 1})).toBe(true);
    expect(type.isArrayLike({length: 2, 0: 1})).toBe(false);
    expect(type.isArrayLike("")).toBe(false);
    expect(type.isArrayLike(1)).toBe(false);
    expect(type.isArrayLike(true)).toBe(false);
    expect(type.isArrayLike(undefined)).toBe(false);
    expect(type.isArrayLike(null)).toBe(false);
    expect(type.isArrayLike({})).toBe(false);
    expect(type.isArrayLike(() => {
    })).toBe(false);
});
test("isArray", () => {
    expect(type.isArray(0.12345667)).toBeFalsy();
    expect(type.isArray("")).toBeFalsy();
    expect(type.isArray({})).toBeFalsy();
    expect(type.isArray({0: 1, 1: 2, length: 2})).toBeFalsy();
    expect(type.isArray(() => {
    })).toBeFalsy();
    expect(type.isArray(true)).toBeFalsy();
    expect(type.isArray(NaN)).toBeFalsy();
    expect(type.isArray(undefined)).toBeFalsy();
    expect(type.isArray(null)).toBeFalsy();
    expect(type.isArray([1, 2, 3])).toBeTruthy();
    expect(type.isArray([])).toBeTruthy();
});
test("isNumber", () => {
    expect(type.isNumber("")).toBeFalsy();
    expect(type.isNumber({})).toBeFalsy();
    expect(type.isNumber({0: 1, 1: 2, length: 2})).toBeFalsy();
    expect(type.isNumber(() => {
    })).toBeFalsy();
    expect(type.isNumber(true)).toBeFalsy();
    expect(type.isNumber(undefined)).toBeFalsy();
    expect(type.isNumber(null)).toBeFalsy();
    expect(type.isNumber([1, 2, 3])).toBeFalsy();
    expect(type.isNumber([])).toBeFalsy();
    expect(type.isNumber(NaN)).toBeTruthy();
    expect(type.isNumber(123)).toBeTruthy();
});
test("isFunction", () => {
    expect(type.isFunction("")).toBeFalsy();
    expect(type.isFunction(() => {
    })).toBeTruthy();
});
test("isString", () => {
    expect(type.isString(123123)).toBeFalsy();
    expect(type.isString("")).toBeTruthy();
});
test("isObject", () => {
    expect(type.isObject(123123)).toBeFalsy();
    expect(type.isObject(undefined)).toBeFalsy();
    expect(type.isObject(123123)).toBeFalsy();
    expect(type.isObject("")).toBeFalsy();
    // null
    expect(typeof null === "object").toBeTruthy();
    expect(type.isObject(null)).toBeFalsy();
    // array
    expect(typeof [] === "object").toBeTruthy();
    expect(type.isObject([])).toBeFalsy();
    //
    expect(type.isObject({})).toBeTruthy();
    // function
    const f = function () {
    };
    expect(typeof f === "object").toBeFalsy();
    expect(type.isObject(f)).toBeFalsy();
});
test("isBoolean", () => {
    expect(type.isBoolean(0)).toBeFalsy();
    expect(type.isBoolean(123123)).toBeFalsy();
    expect(type.isBoolean(undefined)).toBeFalsy();
    expect(type.isBoolean("")).toBeFalsy();
    expect(type.isBoolean(null)).toBeFalsy();
    expect(type.isBoolean([])).toBeFalsy();
    expect(type.isBoolean({})).toBeFalsy();
});
test("inTypes", () => {
    expect(() => type.inTypes(0, "number" as any)).toThrowError();
    // expect(type.typeIn(0, "number" as any)).toBe(true);
    expect(type.inTypes(0, ["string", "number"])).toBe(true);
    expect(type.inTypes(0, ["string", "function", "object"])).toBe(false);
});
test("isUndefined", () => {
    expect(type.isUndefined(0)).toBeFalsy();
    expect(type.isUndefined(123123)).toBeFalsy();
    expect(type.isUndefined("")).toBeFalsy();
    expect(type.isUndefined(null)).toBeFalsy();
    expect(type.isUndefined([])).toBeFalsy();
    expect(type.isUndefined(undefined)).toBeTruthy();
    let a;
    expect(type.isUndefined(a)).toBeTruthy();
});
test("isNaN", () => {
    expect(NaN === NaN).toBeFalsy();
    expect(type.isNaN(NaN)).toBeTruthy();
    expect(type.isNaN({a: 1})).toBeFalsy();
    expect(type.isNaN(1)).toBeFalsy();
    expect(type.isNaN(0)).toBeFalsy();
    expect(type.isNaN(-1)).toBeFalsy();
    expect(type.isNaN(false)).toBeFalsy();
    expect(type.isNaN(undefined)).toBeFalsy();
    expect(type.isNaN(null)).toBeFalsy();
    expect(type.isNaN("")).toBeFalsy();
    expect(type.isNaN({})).toBeFalsy();
    expect(type.isNaN({a: 1})).toBeFalsy();
    expect(type.isNaN([])).toBeFalsy();
    expect(type.isNaN([1, 2, 3])).toBeFalsy();
    expect(type.isNaN(["bdsdf", 12323])).toBeFalsy();
    expect(type.isNaN("123")).toBeFalsy();
    expect(type.isNaN("NaN")).toBeFalsy();
});
test("isEmptyObject", () => {
    expect(type.isEmptyObject({})).toBeTruthy();
    expect(type.isEmptyObject({a: 1})).toBeFalsy();
    expect(type.isEmptyObject({true: 1})).toBeFalsy();
    expect(type.isEmptyObject({false: 1})).toBeFalsy();
    expect(type.isEmptyObject({0: 1})).toBeFalsy();
    expect(type.isEmptyObject({undefined: 1})).toBeFalsy();
    expect(type.isEmptyObject({null: 1})).toBeFalsy();
    expect(type.isEmptyObject([])).toBeFalsy();
    expect(type.isEmptyObject(function () {
    })).toBeFalsy();
});
test("isEmpty", () => {
    expect(type.isEmpty(NaN)).toBeTruthy();
    expect(type.isEmpty("")).toBeTruthy();
    expect(type.isEmpty({})).toBeTruthy();
    expect(type.isEmpty([])).toBeTruthy();
    expect(type.isEmpty({a: 1})).toBeFalsy();
    expect(type.isEmpty([1])).toBeFalsy();
    expect(type.isEmpty(0)).toBeFalsy();
    expect(type.isEmpty(function () {

    })).toBeFalsy();
    expect(type.isEmpty({
        a: function () {

        },
    })).toBeFalsy();
});
test("isPromiseLike", () => {
    expect(type.isPromiseLike({})).toBe(false);
    expect(type.isPromiseLike(Promise.resolve())).toBe(true);
    expect(type.isPromiseLike(null)).toBe(false);
    expect(type.isPromiseLike(null)).toBe(false);
    expect(type.isPromiseLike(undefined)).toBe(false);
    expect(type.isPromiseLike(0)).toBe(false);
    expect(type.isPromiseLike(-42)).toBe(false);
    expect(type.isPromiseLike(42)).toBe(false);
    expect(type.isPromiseLike("")).toBe(false);
    expect(type.isPromiseLike("then")).toBe(false);
    expect(type.isPromiseLike(false)).toBe(false);
    expect(type.isPromiseLike(true)).toBe(false);
    expect(type.isPromiseLike({})).toBe(false);
    expect(type.isPromiseLike({then: true})).toBe(false);
    expect(type.isPromiseLike([])).toBe(false);
    expect(type.isPromiseLike([true])).toBe(false);
    expect(type.isPromiseLike(() => {
    })).toBe(false);

    const promise = {
        then: function () {
        },
    };
    expect(type.isPromiseLike(promise)).toBe(true);

    const fn = () => {
    };
    fn.then = () => {
    };
    expect(type.isPromiseLike(fn)).toBe(true);
});
test("isEqual", () => {
    expect(type.isEqual({a: 1}, {a: 1})).toBeTruthy();
    expect(type.isEqual({a: 1}, {a: 2})).toBeFalsy();
    expect(type.isEqual(1, 1)).toBeTruthy();
    expect(type.isEqual(1, 2)).toBeFalsy();
    expect(type.isEqual(1, "1")).toBeFalsy();
    expect(type.isEqual(0, "")).toBeFalsy();
    expect(type.isEqual(0, false)).toBeFalsy();
    expect(type.isEqual(0, null)).toBeFalsy();
    expect(type.isEqual(0, undefined)).toBeFalsy();
    expect(type.isEqual(null, undefined)).toBeFalsy();
    expect(type.isEqual(false, undefined)).toBeFalsy();
    expect(type.isEqual(false, null)).toBeFalsy();
    expect(type.isEqual(false, true)).toBeFalsy();
    expect(type.isEqual([1, 2], {0: 1, 1: 2, length: 2})).toBeFalsy();
    expect(type.isEqual(() => {
    }, () => {
    })).toBeFalsy();
    expect(type.isEqual(cm.polling, cm.polling)).toBeTruthy();
    expect(type.isEqual([1, 2], [1, 2])).toBeTruthy();
    expect(type.isEqual(null, null)).toBeTruthy();
    expect(type.isEqual(undefined, undefined)).toBeTruthy();
    expect(type.isEqual(false, false)).toBeTruthy();
    expect(type.isEqual(NaN, NaN)).toBeTruthy();
    expect(type.isEqual("", "")).toBeTruthy();
});
test("objectIsEqual", () => {
    expect(type.objectIsEqual(cm, cm)).toBeTruthy();
    expect(type.objectIsEqual({a: 1}, {a: 1})).toBeTruthy();
    expect(type.objectIsEqual({a: 1}, {a: 2})).toBeFalsy();
});
test("isSameType", () => {
    const fn = type.isSameType;
    expect(fn(cm, cm)).toBeTruthy();
    expect(fn(1, 2)).toBeTruthy();
    expect(fn("", new String(123))).toBeTruthy();
    expect(fn(1, NaN)).toBeTruthy();
    expect(fn(1, "")).toBeFalsy();
    expect(fn({}, [])).toBeFalsy();
    expect(fn({}, () => 0)).toBeFalsy();
    expect(fn({}, null)).toBeFalsy();
});
test("isIterable", () => {
    const fn = type.isIterable;
    expect(fn(null)).toBeFalsy();
    expect(fn(undefined)).toBeFalsy();
    expect(fn(0)).toBeFalsy();
    expect(fn(true)).toBeFalsy();
    expect(fn({})).toBeFalsy();
    expect(fn(Symbol("123"))).toBeFalsy();
    expect(fn("")).toBeTruthy();
    expect(fn([])).toBeTruthy();
    expect(fn([0, 1])).toBeTruthy();
    expect(fn(new Map())).toBeTruthy();
    expect(fn(new Set())).toBeTruthy();
});

test("isNative", function () {
    const fn = type.isNative;
    let forEach = Array.prototype.forEach;
    expect(fn(forEach)).toBeTruthy();
    forEach = () => {
    };
    expect(fn(forEach)).toBeFalsy();
});
test("isPercent", function () {
    const fn = type.isPercent;
    expect(fn("123$%")).toBeFalsy();
    expect(fn("3%")).toBeTruthy();
    expect(fn("3.0%")).toBeTruthy();
    expect(fn("3.1%")).toBeTruthy();
    expect(fn("100%")).toBeTruthy();
    expect(fn("100%")).toBeTruthy();
    expect(fn("100%1")).toBeFalsy();
    expect(fn("100% ")).toBeTruthy();
    expect(fn("10..0% ")).toBeFalsy();
    expect(fn("10.0.0% ")).toBeFalsy();
    expect(fn(".1% ")).toBeFalsy();
    expect(fn("")).toBeFalsy();
    expect(fn(" ")).toBeFalsy();
});
test("isIncludeChinese", function () {
    const fn = type.isIncludeChinese;
    expect(fn("哈")).toBeTruthy();
    expect(fn("哈水电费第三方")).toBeTruthy();
    expect(fn("哈水电费1第三方")).toBeTruthy();
    expect(fn("哈水电费.第三方")).toBeTruthy();
    expect(fn("哈水电费_第三方")).toBeTruthy();
    expect(fn("哈水电费 第三方")).toBeTruthy();
    expect(fn("")).toBeFalsy();
    expect(fn("1231")).toBeFalsy();
    expect(fn("-=")).toBeFalsy();
    expect(fn(" ")).toBeFalsy();
    expect(fn("$$%%")).toBeFalsy();
});
test("isInteger", function () {
    const fn = type.isInteger;
    expect(fn(1)).toBeTruthy();
    expect(fn(Number.MAX_SAFE_INTEGER)).toBeTruthy();
    expect(fn(Number.MIN_SAFE_INTEGER)).toBeTruthy();
    expect(fn(0)).toBeTruthy();
    expect(fn(-0)).toBeTruthy();
    expect(fn(0.1)).toBeFalsy();
    expect(fn(-0.1)).toBeFalsy();
    expect(fn(-1.1)).toBeFalsy();
});
test("isArrayObj", function () {
    const fn = type.isArrayObj;
    expect(fn(Object.assign([1, 2], {b: "1", c: "2"}))).toBeTruthy();
    expect(fn([])).toBeFalsy();
    expect(fn({0: 1, 1: 2, length: 2, a: 1, b: 2})).toBeFalsy();
});