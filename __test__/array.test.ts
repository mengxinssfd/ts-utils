import * as arr from "../src/array";

test('includes', () => {
    expect(arr.includes([1, 2, 3], 10)).toBe(false);
    expect(arr.includes(["", undefined, 0, NaN, null], NaN)).toBe(true);
    expect(arr.includes(["", undefined, 0, NaN, null], null)).toBe(true);
    expect(arr.includes(["", undefined, 0, NaN, null], 0)).toBe(true);
    expect(arr.includes(["", undefined, 0, NaN, null], undefined)).toBe(true);
    expect(arr.includes(["", undefined, 0, NaN, null], "")).toBe(true);
});
test('createArray', () => {
    expect(arr.createArray({start: 0, end: 2})).toEqual([0, 1]);
    expect(arr.createArray({start: 0, len: 2})).toEqual([0, 1]);
    expect(arr.createArray({start: 3, end: 2})).toEqual([]);
    expect(arr.createArray({start: 3, len: 2})).toEqual([3, 4]);
    expect(arr.createArray({start: 3, len: 5, end: 5})).toEqual([3, 4]);
    expect(arr.createArray({
        start: 3, len: 5, end: 5, callback(item, index) {
            return item + "" + index;
        },
    })).toEqual(["30", "41"]);
});
test('filter', () => {
    expect(arr.filter((v, k, arr) => {
        return v > 10;
    }, [1, 2, 3, 4, 5, 6, 7, 8])).toEqual([]);
    expect(arr.filter((v, k, arr) => {
        return v < 7 && k > 2 && arr.length === 8;
    }, [1, 2, 3, 4, 5, 6, 7, 8])).toEqual([4, 5, 6]);
});
test('keys', () => {
    expect(arr.keys([1, 2, 3, 4])).toEqual(["0", "1", "2", "3"]);
    expect(arr.keys({a: 1, b: 2})).toEqual(["a", "b"]);
});
test('find', () => {
    expect(arr.find((v, k, arr) => {
        return v === 3 && k === 2 && arr.length === 4;
    }, [1, 2, 3, 4])).toBe(3);
    expect(arr.find((v, k, arr) => {
        return v === 3 && k === 2 && arr.length === 6;
    }, [1, 2, 3, 4])).toBe(undefined);
    expect(arr.find((v, k, arr) => {
        return v === 3 && k === 2 && arr.length === 6;
    }, [])).toBe(undefined);
});
