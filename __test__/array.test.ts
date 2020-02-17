import * as arr from "../src/array";

test('forEach', () => {
    const arr1: any[] = [1, 2, 3];
    arr.forEach((v, k) => arr1[k] = k, arr1);
    expect(arr1).toEqual([0, 1, 2]);
    // ArrayLike
    arr.forEach((v, k) => arr1[k] = k + k, {0: 1, 1: 2, length: 2});
    expect(arr1).toEqual([0, 2, 2]);
    // const arr = thisArg || this;
    arr.forEach.call(arr1, (v, k) => arr1[k] = k + 2);
    expect(arr1).toEqual([2, 3, 4]);
    // if (callbackfn(arr[i], i, arr) === false) break;
    arr.forEach((v, k) => {
        arr1[k] = k + 1;
        return k !== 1;
    }, arr1);
    expect(arr1).toEqual([1, 2, 4]);

    const arr2: (number | string)[] = [2, 3, 4];
    arr.forEach((v, k) => arr2[k] = "a" + v, arr2);
    expect(arr2).toEqual(["a2", "a3", "a4"]);
    arr.forEach((v, k) => arr2[k] = "a" + k, arr2);
    expect(arr2).toEqual(["a0", "a1", "a2"]);
});
test('from', () => {
    expect(arr.from([1, 2, 3])).toEqual([1, 2, 3]);
    // ArrayLike
    expect(arr.from({0: 2, 1: 1, length: 2})).toEqual([2, 1]);
    // mapFn
    expect(arr.from([1, 2, 3], (v, k) => v + "" + k)).toEqual(["10", "21", "32"]);
});
test('includes', () => {
    const list: any[] = ["", undefined, 0, NaN, null];
    expect(arr.includes([1, 2, 3], 10)).toBe(false);
    expect(arr.includes(list, NaN)).toBe(true);
    expect(arr.includes(list, null)).toBe(true);
    expect(arr.includes(list, 0)).toBe(true);
    expect(arr.includes(list, undefined)).toBe(true);
    expect(arr.includes(list, "")).toBe(true);
    expect(arr.includes(list, true)).toBeFalsy();
    expect(arr.includes(list, {})).toBeFalsy();
    expect(arr.includes(list, (item) => !item)).toBe(true);
    expect(arr.includes(list, (item) => item === undefined)).toBe(true);
    expect(arr.includes.call(list, undefined, NaN)).toBe(true);
});
test('createArray', () => {
    expect(arr.createArray({start: 0, end: 2})).toEqual([0, 1]);
    expect(arr.createArray({start: 0, len: 2})).toEqual([0, 1]);
    expect(arr.createArray({len: 2})).toEqual([0, 1]);
    expect(arr.createArray({len: 5, end: 3})).toEqual([0, 1, 2]);
    expect(arr.createArray({start: 3, end: 2})).toEqual([]);
    expect(arr.createArray({start: 3, len: 2})).toEqual([3, 4]);
    expect(arr.createArray({start: 3, len: 5, end: 5})).toEqual([3, 4]);
    expect(arr.createArray({start: 3, len: 1, end: 5})).toEqual([3]);
    expect(arr.createArray({
        start: 3,
        len: 5,
        end: 5,
        fill(item, index) {
            return item + "" + index;
        },
    })).toEqual(["30", "41"]);
    expect(arr.createArray({start: 3, len: 5, end: 6, fill: 0})).toEqual([0, 0, 0]);
});
test('filter', () => {
    // 未找到
    expect(arr.filter((v, k, arr) => {
        return v > 10;
    }, [1, 2, 3, 4, 5, 6, 7, 8])).toEqual([]);
    // 找到
    expect(arr.filter((v, k, arr) => {
        return v < 7 && k > 2 && arr.length === 8;
    }, [1, 2, 3, 4, 5, 6, 7, 8])).toEqual([4, 5, 6]);
    // call
    expect(arr.filter.call([1, 2, 3, 4, 5, 6, 7, 8], (v, k, arr) => {
        return v < 7 && k > 2 && arr.length === 8;
    })).toEqual([4, 5, 6]);
});
test('keys', () => {
    // array
    expect(arr.keys([1, 2, 3, 4])).toEqual(["0", "1", "2", "3"]);
    // object
    const keys = arr.keys({a: 1, b: 2});
    const [a, b, c] = keys;
    expect(a).toEqual("a");
    expect(b).toEqual("b");
    expect(c).toEqual(undefined);

    expect(arr.keys({a: 1, b: 2})).toEqual(["a", "b"]);
    // if (isEmpty(target)) return [];
    expect(arr.keys([])).toEqual([]);
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
    expect(arr.find((v, k, arr) => {
        return v === 3 && k === 2 && arr.length === 6;
    })).toBeUndefined();
});
