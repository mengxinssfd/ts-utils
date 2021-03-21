import * as clone from "../src/clone";

test("deepClone", () => {
    const arr = [1, 2, 3];
    const newArr = clone.deepClone(arr);
    // copy == arr
    expect(newArr).toEqual(arr);
    // copy !== arr
    expect(arr === newArr).toBeFalsy();
    const obj = {a: [2, 3], c: 1, d: {f: 123}};
    const newObj = clone.deepClone(obj);
    // copy == obj
    expect(newObj).toEqual(obj);
    // copy !== obj
    expect(obj === newObj).toBeFalsy();
    // copy.a == obj.a
    expect(obj.a).toEqual(newObj.a);
    // copy.a !== obj.a
    expect(obj.a === newObj.a).toBeFalsy();
    // 0 === 0
    expect(clone.deepClone(0)).toBe(0);

    const arr2 = [
        () => 100,
        () => 200,
    ];
    const newArr2 = clone.deepClone(arr2);
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
        this.name = "foo";
        this.sayHi = function () {
            console.log("Say Hi");
        };
    }

    Foo.prototype.sayGoodBy = function () {
        console.log("Say Good By");
    };
    let myPro = new Foo();
    expect(myPro.hasOwnProperty("name")).toBeTruthy();//true
    expect(myPro.hasOwnProperty("toString")).toBeFalsy();//false
    expect(myPro.hasOwnProperty("hasOwnProperty")).toBeFalsy();//fasle
    expect(myPro.hasOwnProperty("sayHi")).toBeTruthy();// true
    expect(myPro.hasOwnProperty("sayGoodBy")).toBeFalsy();//false
    expect("sayGoodBy" in myPro).toBeTruthy();// true

    // test cov if (!(target as any).hasOwnProperty(k)) continue;
    const copyFoo = clone.deepClone(myPro);
    expect(copyFoo.hasOwnProperty("sayGoodBy")).toBeFalsy();

    // copy function
    function fn(arg: number) {
        return arg + fn.data;
    }

    fn.data = 100;

    const nFn = clone.deepClone(fn);

    expect(fn(100)).toBe(200);
    expect(fn === nFn).toBe(false);
    expect(nFn(100)).toBe(200);
    expect(nFn.data).toBe(100);
    nFn.data = 200;
    expect(nFn.data).toBe(200);
    expect(fn.data).toBe(100);

    // copy date
    const date = new Date("2020-06-05 12:00:00");
    const o = clone.deepClone({date});
    expect(o.date.getFullYear()).toBe(date.getFullYear());
    expect(o.date === date).toBe(false);

    // copy regExp
    const re = new RegExp("\\d+", "g");
    const o2 = clone.deepClone({re});
    expect(o2.re.test("123")).toBe(true);
    expect(o2.re === re).toBe(false);
});

test("cloneFunction", () => {
    function test(a, b) {
        return a + b;
    }

    expect(clone.cloneFunction(test)(50, 50)).toBe(100);

    const test2 = (a, b) => a + b;
    expect(clone.cloneFunction(test2)(50, 50)).toBe(100);
    expect((function (a, b) {
        return a + b;
    })(50, 50)).toBe(100);

    expect(clone.cloneFunction(1 as any)).toBe(1);
});
test("deepCloneBfs", () => {
    const obj10086 = {a: 1, b: 2, c: 3, d: 4};
    const nObj = clone.deepCloneBfs(obj10086);
    expect(obj10086).toEqual(nObj);
    expect(nObj.c).toEqual(3);
    expect(nObj === obj10086).toBe(false);

    const obj10000 = {a: 1, b: {c: "123"}};
    const nObj2 = clone.deepCloneBfs(obj10000);
    expect(nObj2).toEqual(obj10000);

    const arr = [1, 2, 3];
    const newArr = clone.deepCloneBfs(arr);
    // copy == arr
    expect(newArr).toEqual(arr);
    // copy !== arr
    expect(arr === newArr).toBeFalsy();
    const obj = {a: [2, 3], c: 1, d: {f: 123}};
    const newObj = clone.deepCloneBfs(obj);
    // copy == obj
    expect(newObj).toEqual(obj);
    // copy !== obj
    expect(obj === newObj).toBeFalsy();
    // copy.a == obj.a
    expect(obj.a).toEqual(newObj.a);
    // copy.a !== obj.a
    expect(obj.a === newObj.a).toBeFalsy();
    // 0 === 0
    expect(clone.deepCloneBfs(0)).toBe(0);

    function Ext() {
        this.a = 1;
    }

    Ext.prototype.b = "2";

    expect(clone.deepCloneBfs(new Ext())).toEqual({a: 1});

    const obj2 = {a: 1, b: [1, 2]};
    expect(clone.deepCloneBfs(obj2)).toEqual({a: 1, b: [1, 2]});
    expect(obj2 !== clone.deepCloneBfs(obj2)).toBeTruthy();
});