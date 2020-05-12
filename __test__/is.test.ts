import * as is from "../src/is";
import * as cm from "../src/common";

test('isArrayLike', () => {
    expect(is.isArrayLike([1, 2, 3])).toBe(true);
    expect(is.isArrayLike([])).toBe(true);
    expect(is.isArrayLike({length: 1, 0: 1})).toBe(true);
    expect(is.isArrayLike({length: 2, 0: 1})).toBe(false);
    expect(is.isArrayLike("")).toBe(false);
    expect(is.isArrayLike(1)).toBe(false);
    expect(is.isArrayLike(true)).toBe(false);
    expect(is.isArrayLike(undefined)).toBe(false);
    expect(is.isArrayLike(null)).toBe(false);
    expect(is.isArrayLike({})).toBe(false);
    expect(is.isArrayLike(() => {
    })).toBe(false);
});
test('isArray', () => {
    expect(is.isArray(0.12345667)).toBeFalsy();
    expect(is.isArray("")).toBeFalsy();
    expect(is.isArray({})).toBeFalsy();
    expect(is.isArray({0: 1, 1: 2, length: 2})).toBeFalsy();
    expect(is.isArray(() => {
    })).toBeFalsy();
    expect(is.isArray(true)).toBeFalsy();
    expect(is.isArray(NaN)).toBeFalsy();
    expect(is.isArray(undefined)).toBeFalsy();
    expect(is.isArray(null)).toBeFalsy();
    expect(is.isArray([1, 2, 3])).toBeTruthy();
    expect(is.isArray([])).toBeTruthy();
});
test('isNumber', () => {
    expect(is.isNumber("")).toBeFalsy();
    expect(is.isNumber({})).toBeFalsy();
    expect(is.isNumber({0: 1, 1: 2, length: 2})).toBeFalsy();
    expect(is.isNumber(() => {
    })).toBeFalsy();
    expect(is.isNumber(true)).toBeFalsy();
    expect(is.isNumber(undefined)).toBeFalsy();
    expect(is.isNumber(null)).toBeFalsy();
    expect(is.isNumber([1, 2, 3])).toBeFalsy();
    expect(is.isNumber([])).toBeFalsy();
    expect(is.isNumber(NaN)).toBeTruthy();
    expect(is.isNumber(123)).toBeTruthy();
});
test('isFunction', () => {
    expect(is.isFunction("")).toBeFalsy();
    expect(is.isFunction(() => {
    })).toBeTruthy();
});
test('isString', () => {
    expect(is.isString(123123)).toBeFalsy();
    expect(is.isString("")).toBeTruthy();
});
test('isObject', () => {
    expect(is.isObject(123123)).toBeFalsy();
    expect(is.isObject(undefined)).toBeFalsy();
    expect(is.isObject(123123)).toBeFalsy();
    expect(is.isObject("")).toBeFalsy();
    // null
    expect(typeof null === "object").toBeTruthy();
    expect(is.isObject(null)).toBeFalsy();
    // array
    expect(typeof [] === "object").toBeTruthy();
    expect(is.isObject([])).toBeFalsy();
    //
    expect(is.isObject({})).toBeTruthy();
    // function
    const f = function () {
    };
    expect(typeof f === "object").toBeFalsy();
    expect(is.isObject(f)).toBeFalsy();
});
test('isBoolean', () => {
    expect(is.isBoolean(0)).toBeFalsy();
    expect(is.isBoolean(123123)).toBeFalsy();
    expect(is.isBoolean(undefined)).toBeFalsy();
    expect(is.isBoolean("")).toBeFalsy();
    expect(is.isBoolean(null)).toBeFalsy();
    expect(is.isBoolean([])).toBeFalsy();
    expect(is.isBoolean({})).toBeFalsy();
});
test('is', () => {
    expect(is.is(0, "string")).toBeFalsy();
    expect(is.is(0, "number")).toBe(true);
    expect(is.is(0, ["string", "number"])).toBe(true);
    expect(is.is(0, ["string", "function", "object"])).toBe(false);
});
test('isUndefined', () => {
    expect(is.isUndefined(0)).toBeFalsy();
    expect(is.isUndefined(123123)).toBeFalsy();
    expect(is.isUndefined("")).toBeFalsy();
    expect(is.isUndefined(null)).toBeFalsy();
    expect(is.isUndefined([])).toBeFalsy();
    expect(is.isUndefined(undefined)).toBeTruthy();
    let a;
    expect(is.isUndefined(a)).toBeTruthy();
});
test('isNaN', () => {
    expect(NaN === NaN).toBeFalsy();
    expect(is.isNaN(NaN)).toBeTruthy();
    expect(is.isNaN({a: 1})).toBeFalsy();
    expect(is.isNaN(1)).toBeFalsy();
    expect(is.isNaN(0)).toBeFalsy();
    expect(is.isNaN(-1)).toBeFalsy();
    expect(is.isNaN(false)).toBeFalsy();
    expect(is.isNaN(undefined)).toBeFalsy();
    expect(is.isNaN(null)).toBeFalsy();
    expect(is.isNaN("")).toBeFalsy();
    expect(is.isNaN({})).toBeFalsy();
    expect(is.isNaN({a: 1})).toBeFalsy();
    expect(is.isNaN([])).toBeFalsy();
    expect(is.isNaN([1, 2, 3])).toBeFalsy();
    expect(is.isNaN(["bdsdf", 12323])).toBeFalsy();
    expect(is.isNaN("123")).toBeFalsy();
    expect(is.isNaN("NaN")).toBeFalsy();
});
test('isEmptyObject', () => {
    expect(is.isEmptyObject({})).toBeTruthy();
    expect(is.isEmptyObject({a: 1})).toBeFalsy();
    expect(is.isEmptyObject({true: 1})).toBeFalsy();
    expect(is.isEmptyObject({false: 1})).toBeFalsy();
    expect(is.isEmptyObject({0: 1})).toBeFalsy();
    expect(is.isEmptyObject({undefined: 1})).toBeFalsy();
    expect(is.isEmptyObject({null: 1})).toBeFalsy();
    expect(is.isEmptyObject([])).toBeFalsy();
    expect(is.isEmptyObject(function () {
    })).toBeFalsy();
});
test('isEmpty', () => {
    expect(is.isEmpty(NaN)).toBeTruthy();
    expect(is.isEmpty("")).toBeTruthy();
    expect(is.isEmpty({})).toBeTruthy();
    expect(is.isEmpty([])).toBeTruthy();
    expect(is.isEmpty({a: 1})).toBeFalsy();
    expect(is.isEmpty([1])).toBeFalsy();
    expect(is.isEmpty(0)).toBeFalsy();
    expect(is.isEmpty(function () {

    })).toBeFalsy();
    expect(is.isEmpty({
        a: function () {

        },
    })).toBeFalsy();
});
test("isPromiseLike", () => {
    expect(is.isPromiseLike({})).toBe(false);
    expect(is.isPromiseLike(Promise.resolve())).toBe(true);
    expect(is.isPromiseLike(null)).toBe(false);
    expect(is.isPromiseLike(null)).toBe(false);
    expect(is.isPromiseLike(undefined)).toBe(false);
    expect(is.isPromiseLike(0)).toBe(false);
    expect(is.isPromiseLike(-42)).toBe(false);
    expect(is.isPromiseLike(42)).toBe(false);
    expect(is.isPromiseLike('')).toBe(false);
    expect(is.isPromiseLike('then')).toBe(false);
    expect(is.isPromiseLike(false)).toBe(false);
    expect(is.isPromiseLike(true)).toBe(false);
    expect(is.isPromiseLike({})).toBe(false);
    expect(is.isPromiseLike({then: true})).toBe(false);
    expect(is.isPromiseLike([])).toBe(false);
    expect(is.isPromiseLike([true])).toBe(false);
    expect(is.isPromiseLike(() => {
    })).toBe(false);

    const promise = {
        then: function () {
        },
    };
    expect(is.isPromiseLike(promise)).toBe(true);

    const fn = () => {
    };
    fn.then = () => {
    };
    expect(is.isPromiseLike(fn)).toBe(true);
});
test('isEqual', () => {
    expect(is.isEqual({a: 1}, {a: 1})).toBeTruthy();
    expect(is.isEqual({a: 1}, {a: 2})).toBeFalsy();
    expect(is.isEqual(1, 1)).toBeTruthy();
    expect(is.isEqual(1, 2)).toBeFalsy();
    expect(is.isEqual(1, "1")).toBeFalsy();
    expect(is.isEqual(0, "")).toBeFalsy();
    expect(is.isEqual(0, false)).toBeFalsy();
    expect(is.isEqual(0, null)).toBeFalsy();
    expect(is.isEqual(0, undefined)).toBeFalsy();
    expect(is.isEqual(null, undefined)).toBeFalsy();
    expect(is.isEqual(false, undefined)).toBeFalsy();
    expect(is.isEqual(false, null)).toBeFalsy();
    expect(is.isEqual(false, true)).toBeFalsy();
    expect(is.isEqual([1, 2], {0: 1, 1: 2, length: 2})).toBeFalsy();
    expect(is.isEqual(() => {
    }, () => {
    })).toBeFalsy();
    expect(is.isEqual(cm.polling, cm.polling)).toBeTruthy();
    expect(is.isEqual([1, 2], [1, 2])).toBeTruthy();
    expect(is.isEqual(null, null)).toBeTruthy();
    expect(is.isEqual(undefined, undefined)).toBeTruthy();
    expect(is.isEqual(false, false)).toBeTruthy();
    expect(is.isEqual(NaN, NaN)).toBeTruthy();
    expect(is.isEqual("", "")).toBeTruthy();
});
test('objectIsEqual', () => {
    expect(is.objectIsEqual(cm, cm)).toBeTruthy();
    expect(is.objectIsEqual({a: 1}, {a: 1})).toBeTruthy();
    expect(is.objectIsEqual({a: 1}, {a: 2})).toBeFalsy();
});