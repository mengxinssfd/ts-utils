import * as cm from "../src/common";

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
    expect(cm.getDateFromStr("2019-12-29 10:10:10").getTime()).toBeGreaterThan(cm.getDateFromStr("2019-12-20 10:10:10").getTime());
});
test('formatDate', () => {
    const date1 = cm.getDateFromStr("2019-12-29 10:10:10");
    expect(cm.formatDate.call(date1, "yyyy-MM-dd")).toBe("2019-12-29");
    expect(cm.formatDate.call(date1, "hh:mm:ss")).toBe("10:10:10");
    expect(cm.formatDate.call(date1, "dd-MM-yyyy")).toBe("29-12-2019");
});
test('getNumberLenAfterDot', () => {
    expect(cm.getNumberLenAfterDot(0.12345667)).toBe(8);
    expect(cm.getNumberLenAfterDot("0.123456789")).toBe(9);
    expect(cm.getNumberLenAfterDot(12345)).toBe(0);
});
