import * as clone from '../src/clone';
import { hasOwn } from '../src/object';

test('deepClone', () => {
  const arr = [1, 2, 3];
  const newArr = clone.deepClone(arr);
  // copy == arr
  expect(newArr).toEqual(arr);
  // copy !== arr
  expect(arr === newArr).toBeFalsy();
  const obj = { a: [2, 3], c: 1, d: { f: 123 } };
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

  const arr2 = [() => 100, () => 200];
  const newArr2 = clone.deepClone(arr2);
  // copy == arr2
  expect(arr2 == newArr2).toBe(false);
  // copy !== arr2
  expect(newArr2 === arr2).toBeFalsy();
  // copy[0] == arr2[0]
  expect(newArr2[0] == arr2[0]).toBeTruthy();
  expect(newArr2[1] == arr2[1]).toBeTruthy();
  // copy[0] === arr2[0]
  expect(newArr2[0] === arr2[0]).toBeTruthy();
  expect(newArr2[1] === arr2[1]).toBeTruthy();
  // copy[0]() === arr2[0]()
  expect(newArr2[1]!() === arr2[1]!()).toBeTruthy();
  expect(newArr2[1]!()).toEqual(arr2[1]!());

  function Foo(this: any) {
    this.name = 'foo';
    this.sayHi = function () {
      console.log('Say Hi');
    };
  }

  Foo.prototype.sayGoodBy = function () {
    console.log('Say Good By');
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const myPro = new Foo();
  expect(hasOwn(myPro, 'name')).toBeTruthy(); //true
  expect(hasOwn(myPro, 'toString')).toBeFalsy(); //false
  expect(hasOwn(myPro, 'hasOwnProperty')).toBeFalsy(); //fasle
  expect(hasOwn(myPro, 'sayHi')).toBeTruthy(); // true
  expect(hasOwn(myPro, 'sayGoodBy')).toBeFalsy(); //false
  expect('sayGoodBy' in myPro).toBeTruthy(); // true

  // test cov if (!(target as any).hasOwnProperty(k)) continue;
  const copyFoo = clone.deepClone(myPro);
  expect(hasOwn(copyFoo, 'sayGoodBy')).toBeFalsy();

  // copy function
  function fn(arg: number) {
    return arg + fn.data;
  }

  fn.data = 100;

  const nFn = clone.deepClone(fn);

  expect(fn(100)).toBe(200);
  expect(fn === nFn).toBeTruthy();
  expect(nFn(100)).toBe(200);
  expect(nFn.data).toBe(100);
  nFn.data = 200;
  expect(nFn.data).toBe(200);
  expect(fn.data).toBe(200);

  // copy date
  const date = new Date('2020-06-05 12:00:00');
  const o = clone.deepClone({ date });
  expect(o.date.getFullYear()).toBe(date.getFullYear());
  expect(o.date === date).toBe(false);

  // copy regExp
  const re = new RegExp('\\d+', 'g');
  const o2 = clone.deepClone({ re });
  expect(o2.re.test('123')).toBe(true);
  expect(o2.re === re).toBe(false);

  const o3: any = { a: 1, b: 2, c: 3, e: { a: 1 } };
  o3.d = o3;
  const c = clone.deepClone(o3);
  expect(c).toEqual(o3);
  expect(o3).toBe(c.d);
  expect(o3.e).toEqual(c.e);
  expect(o3.e).not.toBe(c.e);
});

test('cloneFunction', () => {
  const fn = clone.cloneFunction;

  function test(a: number, b: number) {
    return a + b;
  }

  expect(fn(test)(50, 50)).toBe(100);

  const test2 = (a: number, b: number) => a + b;
  expect(fn(test2)(50, 50)).toBe(100);
  expect(
    (function (a, b) {
      return a + b;
    })(50, 50),
  ).toBe(100);

  expect(fn(1 as any)).toBe(1);

  const obj: any = {
    a: 1,
    fn1() {
      return this.a++;
    },
    fn2: () => {
      return obj.a++;
    },
    fn3: function () {
      return this.a++;
    },
  };
  obj.clone1 = fn(obj.fn1);
  expect(obj.fn1()).toBe(1);
  expect(obj.clone1()).toBe(2);

  obj.clone2 = fn(obj.fn2);
  expect(() => obj.clone2()).toThrowError();
  obj.clone3 = fn(obj.fn3);
  expect(obj.clone3()).toBe(3);
});
test('deepCloneBfs', () => {
  const obj10086 = { a: 1, b: 2, c: 3, d: 4 };
  const nObj = clone.deepCloneBfs(obj10086);
  expect(obj10086).toEqual(nObj);
  expect(nObj.c).toEqual(3);
  expect(nObj === obj10086).toBe(false);

  const obj10000 = { a: 1, b: { c: '123' } };
  const nObj2 = clone.deepCloneBfs(obj10000);
  expect(nObj2).toEqual(obj10000);

  const arr = [1, 2, 3];
  const newArr = clone.deepCloneBfs(arr);
  // copy == arr
  expect(newArr).toEqual(arr);
  // copy !== arr
  expect(arr === newArr).toBeFalsy();
  const obj = { a: [2, 3], c: 1, d: { f: 123 } };
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

  function Ext(this: any) {
    this.a = 1;
  }

  Ext.prototype.b = '2';

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(clone.deepCloneBfs(new Ext())).toEqual({ a: 1 });

  const obj2 = { a: 1, b: [1, 2] };
  expect(clone.deepCloneBfs(obj2)).toEqual({ a: 1, b: [1, 2] });
  expect(obj2 !== clone.deepCloneBfs(obj2)).toBeTruthy();

  const obj3 = { a: null, b: undefined, c: NaN };
  expect(clone.deepCloneBfs(obj3)).toEqual({ a: null, b: undefined, c: NaN });
});
