import * as cm from "../src/object";
import * as arr from "../src/array";
import {forEachByLen} from "../src/common";

function TestExtends() {
    this.a = 1;
    this.b = 2;
}

TestExtends.prototype.c = 3;
TestExtends.prototype.d = 4;
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

        expect(fn(new TestExtends(), ["a", "c"])).toEqual({a: 1});
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

        expect(fn(new TestExtends(), {aa: "a", cc: "c"})).toEqual({aa: 1});
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
test("getReverseObj", async () => {
    const fn = cm.getReverseObj;

    const obj = {a: "aa", b: "bb"};
    expect(fn(obj)).toEqual({aa: "a", bb: "b"});
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
    let times = 0;
    fn({a: 1, b: 2, c: 3}, () => {
        times++;
        return times == 2 ? false : void 0;
    });
    expect(times).toBe(2);
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

    const objArr1 = [{a: 12, b: undefined, c: 3}, {a: 1}, {b: 2}, {d: 4}];
    expect(fn({}, ...objArr1)).toEqual(Object.assign({}, ...objArr1));
    expect(fn(objArr1[0], ...objArr1.slice(1))).toEqual({a: 1, b: 2, c: 3, d: 4});

    const objArr2 = [{a: 12, b: undefined, c: 3}, {a: 1}, {b: 2}, {c: undefined}];
    expect(fn({}, ...objArr2)).toEqual(Object.assign({}, ...objArr2));
    expect(fn(objArr2[0], ...objArr2.slice(1))).toEqual({a: 1, b: 2, c: undefined});
    expect(fn({}, new TestExtends())).toEqual({a: 1, b: 2});
});
test("omit", () => {
    const fn = cm.omit;
    expect(fn({a: 12, b: true, c: "c"}, ["a"])).toEqual({b: true, c: "c"});
    expect(fn({a: 12, b: true, c: "c"}, ["a", "b"])).toEqual({c: "c"});
    expect(fn({c: "c"}, ["c"])).toEqual({});

    const obj: { [k: string]: number } = {};
    forEachByLen(10000, index => obj[index] = index);
    const keys = arr.createArray({len: 500, fill: v => String(v)});
    console.time("run");
    const result = fn(obj, keys);
    expect(Object.keys(result).length).toEqual(9500);
    console.timeEnd("run");
});
test("createObj", () => {
    const fn = cm.createObj;
    const obj = fn(["a", 123], ["b", 111]);
    expect(obj).toEqual({a: 123, b: 111});
    expect(fn(["a", 123], ["b", 111], ["c", undefined])).toEqual({a: 123, b: 111, c: undefined});
    expect(fn(["a", 123], ["b", 111], ["c", null])).toEqual({a: 123, b: 111, c: null});
    expect(fn(["a", 123], ["b", 111], ["c", false])).toEqual({a: 123, b: 111, c: false});
    expect(fn(["a", 123], ["b", 111], ["c", NaN])).toEqual({a: 123, b: 111, c: NaN});
    expect(fn(["a", 123], ["b", 111], ["c", {aa: 1}])).toEqual({a: 123, b: 111, c: {aa: 1}});
    // 不会自动转换值
    expect(fn(["a", 123], ["b", 111], ["c", ["ca", 123]])).toEqual({a: 123, b: 111, c: ["ca", 123]});
    // 转换值为object,使用createObj嵌套
    expect(fn(["a", 123], ["b", 111], ["c", fn(["ca", 123])])).toEqual({a: 123, b: 111, c: {ca: 123}});

    expect(() => {
        fn([] as any);
    }).toThrowError();
    expect(() => {
        fn(undefined as any);
    }).toThrowError();
    expect(fn([undefined, undefined] as any)).toEqual({});
});
test("defaults", () => {
    const fn = cm.defaults;
    expect(fn({a: 12, b: undefined, c: 3}, {a: 1}, {b: 2}, {d: 4})).toEqual({a: 12, b: 2, c: 3, d: 4});
    expect(fn({a: 12, b: undefined, c: 3}, {a: 1}, {b: 2}, {c: undefined})).toEqual({a: 12, b: 2, c: 3});
});
