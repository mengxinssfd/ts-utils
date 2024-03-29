import * as cm from '../src/object';
import * as arr from '../src/array';
import { forEachByLen } from '../src/common';

function TestExtends(this: any) {
  this.a = 1;
  this.b = 2;
}

TestExtends.prototype.c = 3;
TestExtends.prototype.d = 4;
test('getTreeMaxDeep', () => {
  expect(cm.getTreeMaxDeep({})).toBe(1);
  expect(cm.getTreeMaxDeep({ a: 1 })).toBe(2);
  expect(cm.getTreeMaxDeep(null as any)).toBe(0);
  expect(cm.getTreeMaxDeep({ a: { b: 1 } })).toBe(3);
  const obj: any = { a: { a2: 1 }, b: 1, c: { c2: { c3: 123, c32: {} } } };
  expect(cm.getTreeMaxDeep(obj)).toBe(4);
  expect(cm.getTreeMaxDeep([])).toBe(1);
  expect(cm.getTreeMaxDeep([1, 2, 4, 5])).toBe(2);
  expect(cm.getTreeMaxDeep([1, 2, 4, 5, { a: 3 }])).toBe(3);

  function Fn(this: any) {
    this.test = { a: 1, b: 2 };
  }

  Fn.prototype.c = { a: { b: 2, c: { d: 123 } } };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const fn = new Fn();
  expect(cm.getTreeMaxDeep(fn)).toBe(3);
});
test('getTreeNodeLen', () => {
  expect(cm.getTreeNodeLen({}, -1)).toBe(0);
  expect(cm.getTreeNodeLen({}, 0)).toBe(1);
  expect(cm.getTreeNodeLen({})).toBe(0);
  expect(cm.getTreeNodeLen({ a: 1, b: 2, c: 3 })).toBe(3);
  expect(cm.getTreeNodeLen({ a: 1, b: 2, c: 3, d: { d1: 123, d2: 1, d3: 123 } })).toBe(4);
  expect(
    cm.getTreeNodeLen({ a: 1, b: { b2: 2, b3: 3 }, c: 3, d: { d1: 123, d2: 1, d3: 123 } }),
  ).toBe(4);
  expect(
    cm.getTreeNodeLen({ a: 1, b: { b2: 2, b3: 3 }, c: 3, d: { d1: 123, d2: 1, d3: 123 } }, 2),
  ).toBe(5);
  expect(cm.getTreeNodeLen({ a: { a2: 1 }, b: { b2: 2 }, c: { c2: 3 }, d: { d1: 4 } }, 2)).toBe(4);
  expect(
    cm.getTreeNodeLen({ a: { a2: 1, a3: { a4: 4 } }, b: { b2: 2 }, c: { c2: 3 }, d: { d1: 4 } }, 3),
  ).toBe(1);
  expect(
    cm.getTreeNodeLen(
      {
        a: { a2: 1, a3: { a4: 4 } },
        b: { b2: 2, b3: { b4: 4 } },
        c: { c2: 3 },
        d: { d1: 4 },
      },
      3,
    ),
  ).toBe(2);
  expect(cm.getTreeNodeLen([0, 1, [3, 4, 5]], 2)).toBe(3);
  expect(cm.getTreeNodeLen([0, 1, { a: 12, b: 1, c: 4 }], 2)).toBe(3);

  function Fn(this: any) {
    this.test = { a: 1, b: 2 };
  }

  Fn.prototype.c = { a: { b: 2, c: { d: 123 } } };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const fn = new Fn();
  expect(cm.getTreeNodeLen(fn, 2)).toBe(2);
});

test('deepMerge', () => {
  const a = { one: 1, two: 2, three: 3 };
  const b = { one: 11, four: 4, five: 5 };
  expect(cm.deepMerge(a, b)).toEqual(Object.assign({}, a, b));

  const c = { ...a, test: { a: 1, b: 2, c: 3 } };
  expect(cm.deepMerge(c, b)).toEqual(Object.assign({}, c, b));
  expect(cm.deepMerge(c, b).test.a === 1).toEqual(true);
  expect(cm.deepMerge(c, b).test !== c.test && c.test === Object.assign({}, c, b).test).toEqual(
    true,
  );

  function Fn(this: any) {
    this.a = 100;
  }

  Fn.prototype.b = 200;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const d = new Fn();
  expect(cm.deepMerge(a, d)).toEqual(Object.assign({}, a, d));
  expect(cm.deepMerge(a, d).b).toEqual(undefined);

  expect(cm.deepMerge(a, { a: [{ b: 123 }] })).toEqual(Object.assign({}, a, { a: [{ b: 123 }] }));
});

const testPickByKeys = (fn: typeof cm.pickByKeys) => {
  return () => {
    const obj = { a: 1, b: '2', c: ['12313', 111], d: false, e: { a: 1 }, f: undefined };
    expect(fn(obj, [])).toEqual({});
    expect(fn(obj, ['a'])).toEqual({ a: 1 });
    expect(fn(obj, ['b'])).toEqual({ b: obj.b });
    expect(fn(obj, ['c'])).toEqual({ c: obj.c });
    expect(fn(obj, ['d'])).toEqual({ d: obj.d });
    expect(fn(obj, ['e'])).toEqual({ e: obj.e });
    expect(fn(obj, ['f'])).toEqual({ f: obj.f });
    expect(fn(obj, ['a', 'f'])).toEqual({ a: obj.a, f: obj.f });
    expect(fn(obj, ['a', 'f', 'c'])).toEqual({ a: obj.a, f: obj.f, c: obj.c });

    expect(fn(obj, ['a'], (v) => v + 1000)).toEqual({ a: 1001 });
    expect(
      fn(obj, ['a', 'b'], (_v, k) => {
        if (k === 'a') {
          return 2;
        }
        return 'test';
      }),
    ).toEqual({ a: 2, b: 'test' });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(fn(new TestExtends(), ['a', 'c'])).toEqual({ a: 1 });
  };
};
test('pickByKeys', () => {
  const fn = cm.pickByKeys;
  testPickByKeys(fn)();
});
const testPickRename = (fn: typeof cm.pickRename) => {
  return () => {
    const obj = { a: 1, b: '2', c: ['12313', 111], d: false, e: { a: 1 }, f: undefined };
    expect(fn(obj, {})).toEqual({});
    expect(fn(obj, { A: 'a' })).toEqual({ A: 1 });
    expect(fn(obj, { B: 'b' })).toEqual({ B: obj.b });
    expect(fn(obj, { C: 'c' })).toEqual({ C: obj.c });
    expect(fn(obj, { D: 'd' })).toEqual({ D: obj.d });
    expect(fn(obj, { E: 'e' })).toEqual({ E: obj.e });
    expect(fn(obj, { E: 'f' })).toEqual({ F: obj.f });
    expect(fn(obj, { A: 'a', F: 'f' })).toEqual({ A: obj.a, F: obj.f });
    expect(fn(obj, { a: 'a', f: 'b', c: 'd' })).toEqual({ a: obj.a, f: obj.b, c: obj.d });

    expect(fn(obj, { A: 'a' }, (v) => v + 1000)).toEqual({ A: 1001 });
    expect(
      fn(obj, { A: 'a', B: 'b' }, (_v, k) => {
        if (k === 'a') {
          return 2;
        }
        return 'test';
      }),
    ).toEqual({ A: 2, B: 'test' });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(fn(new TestExtends(), { aa: 'a', cc: 'c' })).toEqual({ aa: 1 });
  };
};
test('pickRename', () => {
  const fn = cm.pickRename;
  testPickRename(fn)();
});
test('pick', () => {
  const fn = cm.pick;
  // pickByKeys
  testPickByKeys(fn)();
  let obj = { a: 1, b: '2', c: ['12313', 111], d: false, e: { a: 1 }, f: undefined };
  expect(
    fn(obj, ['a', 'b'], (_v, k) => {
      if (k === 'a') {
        return 2;
      }
      return 'test';
    }),
  ).toEqual({ a: 2, b: 'test' });

  // pickRename
  testPickRename(fn)();
  obj = { a: 1, b: '2', c: ['12313', 111], d: false, e: { a: 1 }, f: undefined };
  expect(
    fn(obj, { A: 'a', B: 'b' }, (_v, k) => {
      if (k === 'a') {
        return 2;
      }
      return 'test';
    }),
  ).toEqual({ A: 2, B: 'test' });
  const nObj = fn(obj, { A: 'a', B: 'a' }, () => {
    return 2;
  });
  expect(nObj).toEqual({ A: 2, B: 2 });
});
test('getReverseObj', async () => {
  const fn = cm.getReverseObj;

  const obj = { a: 'aa', b: 'bb' };
  expect(fn(obj)).toEqual({ aa: 'a', bb: 'b' });
});
test('forEachObj', () => {
  const fn = cm.forEachObj;

  const testFn = (obj: object) => {
    let times = 0;
    fn(obj, (v, k) => {
      expect(typeof k).toEqual('string');
      expect(v).toEqual(obj[k]);
      expect(obj).toEqual(obj);
      times++;
    });
    expect(times).toEqual(Object.keys(obj).length);
  };

  testFn({ a: 1, b: '2', c: true });
  testFn({ a: 1, b: '2', c: { test: 1231 } });
  let times = 0;
  const done = fn({ a: 1, b: 2, c: 3 }, () => {
    times++;
    return times == 2 ? false : void 0;
  });
  expect(done).toBeFalsy();
  expect(times).toBe(2);
  expect(fn([], () => {})).toBeTruthy();
  let ec = 0;
  expect(
    fn(
      [1, 2],
      (i) => (i > 0 ? false : undefined),
      () => (ec = 1),
    ),
  ).toBeFalsy();
  expect(ec).toBe(0);
  expect(
    fn(
      [1, 2],
      () => {},
      () => (ec = 2),
    ),
  ).toBeTruthy();
  expect(ec).toBe(2);
});
test('reduceObj', () => {
  const fn = cm.reduceObj;
  const obj = { a: 1, b: 2, c: '3' };
  const result = fn(
    obj,
    (r, v, k) => {
      r[k] = v;
      return r;
    },
    {} as Record<string, any>,
  );

  expect(result).toEqual(obj);
  expect(result === obj).toEqual(false);

  const result2 = fn(
    obj,
    (r, v, k) => {
      r[k] = v + '1';
      return r;
    },
    {} as Record<string, any>,
  );
  const result3 = Object.keys(obj).reduce((r, key) => {
    const v = obj[key as keyof typeof obj];
    r[key] = v + '1';
    return r;
  }, {} as Record<string, any>);

  expect(result2).toEqual({
    a: '11',
    b: '21',
    c: '31',
  });
  expect(result2).toEqual(result3);
});
test('assign', () => {
  const fn = cm.assign;
  const a = { a: 1, b: 2, c: 3 };
  const b = { a: 4, c: 6, d: 7 };
  const c = { aa: 4, cc: 6, dd: 7 };
  expect(fn({}, a)).toEqual(a);
  expect(fn({}, a)).toEqual(Object.assign({}, a));
  expect(fn({}, a, [1, 2, 3])).toEqual(Object.assign({}, a, [1, 2, 3]));
  expect(fn({}, a, b, c)).toEqual(Object.assign({}, a, b, c));
  expect(fn({}, a, b, c, a, b, c, a, b)).toEqual(Object.assign({}, a, b, c));

  const objArr1 = [{ a: 12, b: undefined, c: 3 }, { a: 1 }, { b: 2 }, { d: 4 }];
  expect(fn({}, ...objArr1)).toEqual(Object.assign({}, ...objArr1));
  expect(fn(objArr1[0]!, ...objArr1.slice(1))).toEqual({ a: 1, b: 2, c: 3, d: 4 });

  const objArr2 = [{ a: 12, b: undefined, c: 3 }, { a: 1 }, { b: 2 }, { c: undefined }];
  expect(fn({}, ...objArr2)).toEqual(Object.assign({}, ...objArr2));
  expect(fn(objArr2[0]!, ...objArr2.slice(1))).toEqual({ a: 1, b: 2, c: undefined });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(fn({}, new TestExtends())).toEqual({ a: 1, b: 2 });

  const opt = {
    scale: {
      step: -1,
    },
    triggerEl: ['.img-zoom'],
  };
  const defaultScale = {
    max: 10,
    min: 0.1,
    step: 0.1,
    default: 1,
  };
  const defaultOptions = {
    triggerEl: '.img-zoom',
    isClickViewImgClose: false,
    dataset: 'data-img-zoom',
  };
  const opts = fn({}, defaultOptions, opt || {});
  opts.scale = fn({}, defaultScale, opts.scale || {});

  expect(opts).toEqual({
    triggerEl: ['.img-zoom'],
    isClickViewImgClose: false,
    dataset: 'data-img-zoom',
    scale: {
      max: 10,
      min: 0.1,
      step: -1,
      default: 1,
    },
  });

  expect(Object.assign({ a: 1, b: 2 }, null, '', '12', { c: 3 })).toEqual({
    a: 1,
    b: 2,
    c: 3,
    0: '1',
    1: '2',
  });
  expect(fn({ a: 1, b: 2 }, null as any, '' as any, '12' as any, { c: 3 })).toEqual({
    a: 1,
    b: 2,
    c: 3,
    0: '1',
    1: '2',
  });

  expect(Object.assign([], null, '', '12')).toEqual(['1', '2']);
  expect(fn([], null, '', '12')).toEqual(['1', '2']);
});
test('omit', () => {
  const fn = cm.omit;
  expect(fn({ a: 12, b: true, c: 'c' }, ['a'])).toEqual({ b: true, c: 'c' });
  expect(fn({ a: 12, b: true, c: 'c' }, ['a', 'b'])).toEqual({ c: 'c' });
  expect(fn({ c: 'c' }, ['c'])).toEqual({});

  const obj: { [k: string]: number } = {};
  forEachByLen(10000, (index) => (obj[index] = index));
  const keys = arr.createArray({ len: 500, fill: (v) => String(v) });
  // console.time('run');
  const result = fn(obj, keys);
  expect(Object.keys(result).length).toEqual(9500);
  // console.timeEnd('run');
});
test('createObj', () => {
  const fn = cm.createObj;
  const obj = fn([
    ['a', 123],
    ['b', 111],
  ]);
  expect(obj).toEqual({ a: 123, b: 111 });
  expect(
    fn([
      ['a', 123],
      ['b', 111],
      ['c', undefined],
    ]),
  ).toEqual({ a: 123, b: 111, c: undefined });
  expect(
    fn([
      ['a', 123],
      ['b', 111],
      ['c', null],
    ]),
  ).toEqual({ a: 123, b: 111, c: null });
  expect(
    fn([
      ['a', 123],
      ['b', 111],
      ['c', false],
    ]),
  ).toEqual({ a: 123, b: 111, c: false });
  expect(
    fn([
      ['a', 123],
      ['b', 111],
      ['c', NaN],
    ]),
  ).toEqual({ a: 123, b: 111, c: NaN });
  expect(
    fn([
      ['a', 123],
      ['b', 111],
      ['c', { aa: 1 }],
    ]),
  ).toEqual({ a: 123, b: 111, c: { aa: 1 } });
  // 不会自动转换值
  expect(
    fn([
      ['a', 123],
      ['b', 111],
      ['c', ['ca', 123]],
    ]),
  ).toEqual({ a: 123, b: 111, c: ['ca', 123] });
  // 转换值为object,使用createObj嵌套
  expect(
    fn([
      ['a', 123],
      ['b', 111],
      ['c', fn([['ca', 123]])],
    ]),
  ).toEqual({ a: 123, b: 111, c: { ca: 123 } });

  expect(fn([])).toEqual({});
  expect(() => {
    fn([[]] as any);
  }).toThrowError();
  expect(() => {
    fn(undefined as any);
  }).toThrowError();
  expect(fn([[undefined, undefined]] as any)).toEqual({});
});
test('defaults', () => {
  const fn = cm.defaults;
  expect(fn({ a: 12, b: undefined, c: 3 }, { a: 1 }, { b: 2 }, { d: 4 })).toEqual({
    a: 12,
    b: 2,
    c: 3,
    d: 4,
  });
  expect(fn({ a: 12, b: undefined, c: 3 }, { a: 1 }, { b: 2 }, { c: undefined })).toEqual({
    a: 12,
    b: 2,
    c: 3,
  });
});
class UpdateTestSuperClass {
  a = 1;
  b = 2;
  private test() {
    return 'super test';
  }
  fn1() {
    return 'super fn1';
  }
  get len() {
    this.test();
    return 0;
  }
}
class UpdateTestClass extends UpdateTestSuperClass {
  c = 3;
  fn2() {
    return 'sub fn2';
  }

  override get len() {
    return 1;
  }
}
test('getInsKeys', () => {
  const fn = cm.getInsKeys;

  const superKeys = ['a', 'b', 'fn1', 'len', 'test'].sort();
  const subKeys = ['c', 'fn2', ...superKeys].sort();

  expect(fn(new UpdateTestSuperClass()).sort()).toEqual(superKeys);

  expect(fn(new UpdateTestClass()).sort()).toEqual(subKeys);

  // 不会继承method
  const obj = { a1: 1, b2: 2, c3: 3, ...new UpdateTestClass() };
  expect(fn(obj).sort()).toEqual(['a', 'b', 'c', 'a1', 'b2', 'c3'].sort());

  const obj2 = Object.create(new UpdateTestClass());
  expect(fn(obj2).sort()).toEqual(subKeys);

  const obj3 = Object.create(null);
  obj3.a = 1;
  obj3.b = 2;
  expect(fn(obj3).sort()).toEqual(['a', 'b']);
});
const commonUpdate = (fn: Function) => {
  expect(fn({ a: 12, b: undefined, c: 3 }, { a: 1 }, { b: 2 }, { d: 4 })).toEqual({
    a: 1,
    b: 2,
    c: 3,
  });
  expect(fn({ a: 12, b: undefined, c: 3 }, { a: 1 }, { b: 2 }, { c: undefined })).toEqual({
    a: 1,
    b: 2,
    c: undefined,
  });
  expect(fn({ a: 12, b: undefined, c: 3 }, { aa: 2, bb: 2, dd: 123 }, { c: undefined })).toEqual({
    a: 12,
    b: undefined,
    c: undefined,
  });

  expect(fn({ a: 12, b: undefined, c: 3 }, null as any, undefined as any)).toEqual({
    a: 12,
    b: undefined,
    c: 3,
  });

  const obj = { a: 1, b: 2 };
  expect(fn(obj, obj)).toBe(obj);
  expect(fn(obj, obj)).toEqual({ a: 1, b: 2 });
};

test('objUpdate', () => {
  const fn = cm.updateObj;
  commonUpdate(fn);

  // objUpdate 不会更新实例的方法
  const ins = fn(new UpdateTestClass(), {
    fn1() {
      return 'replace fn1';
    },
    fn2() {
      return 'replace fn2';
    },
  });
  expect(ins.fn1()).toBe('super fn1');
  expect(ins.fn2()).toBe('sub fn2');
});
test('updateIns', () => {
  const fn = cm.updateIns;
  commonUpdate(fn);

  // updateIns 会更新实例的方法
  const ins = fn(new UpdateTestClass(), {
    fn1() {
      return 'replace fn1';
    },
    fn2() {
      return 'replace fn2';
    },
  });
  expect(ins.fn1()).toBe('replace fn1');
  expect(ins.fn2()).toBe('replace fn2');
});
test('pickUpdated', () => {
  const fn = cm.pickUpdated;
  const obj1 = { a: 12, b: undefined, c: 3 };
  expect(fn(obj1, [{ a: 1 }, { b: 2 }, { d: 3 }])).toEqual({ a: 1, b: 2 });
  expect(fn(obj1, [{ a: 1 }, { a: 2 }, { a: 5 }])).toEqual({ a: 5 });
  expect(fn(obj1, [{ a: 1 }, { a: 2 }, { a: 12 }])).toEqual({});
  expect(fn(obj1, [{ a: 12 }, { b: undefined }, { c: 3 }])).toEqual({});
  expect(fn({}, [{ a: 1 }, { b: 2 }, { d: 3 }])).toEqual({});
  expect(fn({ a: NaN }, [{ a: 1 }, { a: NaN }])).toEqual({});
  expect(fn({ a: NaN }, [{ a: 1 }, null as any])).toEqual({ a: 1 });
  expect(fn({ a: NaN }, [null as any])).toEqual({});
  expect(fn({ a: NaN }, [undefined as any])).toEqual({});
});
test('renameObjKey', () => {
  const fn = cm.renameObjKey;
  expect(fn({ a: 12, b: undefined, c: 3 }, { test: 'a', bb: 'b' })).toEqual({
    test: 12,
    bb: undefined,
    c: 3,
  });
  expect(fn({ a: 12, b: undefined, c: 3 }, { test: 'aa' as any, bb: 'b' })).toEqual({
    a: 12,
    bb: undefined,
    c: 3,
  });
  expect(fn({ a: 1, b: 2 }, { a: 'a', aa: 'a', aaa: 'a' })).toEqual({ a: 1, aa: 1, aaa: 1, b: 2 });
});
test('objKeys', () => {
  const fn = cm.objKeys;
  const obj: any = { a: 1, b: 2, c: 3 };
  expect(fn(obj)).toEqual(Object.keys(obj));
  obj[1] = '';
  obj[NaN] = '';
  obj[''] = '';
  obj[null as any] = '';
  obj[0] = '';
  obj[true as any] = '';
  obj[false as any] = '';
  obj[undefined as any] = '';
  expect(fn(obj)).toEqual(Object.keys(obj));
});
test('objValues', () => {
  const fn = cm.objValues;
  const obj: any = { a: 1, b: 2, c: 3 };
  expect(fn(obj)).toEqual(Object.values(obj));
  obj[1] = '';
  obj[NaN] = '';
  obj[''] = '';
  obj[null as any] = '';
  obj[0] = '';
  obj[true as any] = '';
  obj[false as any] = '';
  obj[undefined as any] = '';
  expect(fn(obj)).toEqual(Object.values(obj));
});
test('objEntries', () => {
  const fn = cm.objEntries;
  const obj: any = { a: 1, b: 2, c: 3 };
  expect(fn(obj)).toEqual(Object.entries(obj));
  obj[1] = '';
  obj[NaN] = '';
  obj[''] = '';
  obj[null as any] = '';
  obj[0] = '';
  obj[true as any] = '';
  obj[false as any] = '';
  obj[undefined as any] = '';
  const result = fn(obj);
  const result2 = Object.entries(obj);
  expect(result).toEqual(result2);
});
test('translateObjPath', () => {
  const fn = cm.translateObjPath;
  expect(fn('a[b][c].d[e][f]')).toBe('a.b.c.d.e.f');
  expect(fn('a.b.c.d.e.f')).toBe('a.b.c.d.e.f');
  expect(fn('a.b.c.d.e.f', 'a')).toBe('b.c.d.e.f');
  expect(fn('a[b][c].d.e.f', 'a\\[b\\]\\[c\\]')).toBe('d.e.f');
  expect(fn('a.b.c.d.e.f', 'a.b.c')).toBe('d.e.f');
  expect(fn('a[][][]')).toBe('a');
  // expect(fn("a%5B%5D", )).toBe("a");
});
test('getObjValueByPath', () => {
  const fn = cm.getObjValueByPath;
  const v = fn({ a: { b: { c: 123 } } }, 'a.b.c');
  expect(v).toEqual(123);
  expect(fn({ a: { b: { c: 123 } } }, 'a[b][c]')).toEqual(123);
  expect(fn({ a: { b: { c: '123' } } }, 'a[b].c')).toEqual('123');

  expect(fn([[[1]]], '0.0.0')).toEqual(1);
  expect(fn([[[1]]], '[0][0][0]')).toEqual(1);
  expect(fn([[[1]]], '[0][0].0')).toEqual(1);

  expect(fn({ a: { b: { b_c: 123 } } }, 'a[b].b_c')).toEqual(123);
  expect(fn({ a: { b: { b_c: 123 } } }, 'a[b][b_c]')).toEqual(123);
  expect(fn({ a: { b: { 'b-c': 123 } } }, 'a[b][b-c]')).toEqual(123);
  expect(fn({ a: { b: { '123c': 123 } } }, 'a[b][123c]')).toEqual(123);
  expect(fn({ a: { '123b': { '123c': 123 } } }, 'a[123b][123c]')).toEqual(123);

  expect(fn({ a: { b: { c: [1, 2, 3] } } }, 'a.b.c[2]')).toEqual(3);
  expect(fn({ a: { b: { c: [1, 2, 3] } } }, 'a[b][c][2]')).toEqual(3);
  expect(fn({ a: { b: { c: [1, 2, 3] } } }, '[a][b][c][2]')).toEqual(3);

  expect(fn({ a: { b: { c: 123 } } }, 'a.d.c' as 'a.b.c')).toEqual(undefined);
  expect(fn({ a: { b: { c: 123 } } }, 'a[d].c' as any)).toEqual(undefined);

  expect(fn({ a: { b: { c: 123 } } }, 'obj[a][b][c]', 'obj')).toEqual(123);
});
test('setObjValueByPath', () => {
  const fn = cm.setObjValueByPath;
  expect(fn({ a: { b: { c: 123 } } }, 'obj[a][b][c]', 333, undefined, 'obj')).toEqual({
    a: { b: { c: 333 } },
  });
  expect(fn({ a: { b: { c: 123 } } }, 'obj[a][b][c]', true as any, undefined, 'obj')).toEqual({
    a: { b: { c: true } },
  });
  expect(fn({ a: { b: { c: 123 } } }, 'b' as any, true)).toEqual({ b: true, a: { b: { c: 123 } } });
  expect(fn({ a: { b: { c: 123 } } }, 'b.c' as any, true)).toEqual({
    b: { c: true },
    a: { b: { c: 123 } },
  });
  expect(fn({ a: 'hello' }, 'a[0]' as any, true)).toEqual({ a: { 0: true } });
  expect(fn({ a: 0 }, 'a[0][b][c]' as any, true)).toEqual({ a: { 0: { b: { c: true } } } });
  expect(fn({ a: 0 }, 'a', true as any, (a, b) => [a, b])).toEqual({ a: [0, true] });
  expect(fn({} as any, 'a', true, (a, b) => [a, b])).toEqual({ a: true });
  expect(fn({ a: '123' }, 'a[3]' as any, 'insert to string')).toEqual({
    a: { 3: 'insert to string' },
  });
  expect(() =>
    fn({ a: '123' }, 'a[3]' as any, 'insert to string', (a, b, isEnd) => (isEnd ? [a, b] : a)),
  ).toThrowError();

  fn({ a: '123' }, 'a[3]' as any, 'i', (_a, _b, _isEnd, path) => {
    expect(path).toBe('a');
    return {};
  });

  function cb(a: any, b: any, _isEnd: any, path: string) {
    expect(path).toBe('a.b.c');
    expect(a).toBe(123);
    expect(b).toBe('test');
    return b;
  }

  expect(fn({ a: { b: { c: 123 } } }, 'obj[a][b][c]' as any, 'test', cb, 'obj')).toEqual({
    a: { b: { c: 'test' } },
  });

  expect(fn({ a: 1 }, 'a[]', 2, (a, b) => [a, b])).toEqual({ a: [1, 2] });

  const obj = {} as any;
  fn(obj, 'a', 1);
  fn(obj, 'a[1]', 2, (a, b, isEnd) => {
    if (isEnd) {
      return b;
    }
    return [a];
  });
  expect(obj).toEqual({ a: [1, 2] });
});
test('getObjPathEntries', () => {
  const fn = cm.getObjPathEntries;
  expect(fn({ a: 1 })).toEqual([['[a]', 1]]);
  expect(fn({ a: { b: { c: 123 } } })).toEqual([['[a][b][c]', 123]]);
  expect(fn({ a: { b: { c: 123, d: 111 } } })).toEqual([
    ['[a][b][c]', 123],
    ['[a][b][d]', 111],
  ]);
  expect(fn({ a: { b: [1, 2] } })).toEqual([
    ['[a][b][0]', 1],
    ['[a][b][1]', 2],
  ]);
  expect(fn({ a: { b: [1, 2, { c: 3, cc: 5 }] } })).toEqual([
    ['[a][b][0]', 1],
    ['[a][b][1]', 2],
    ['[a][b][2][c]', 3],
    ['[a][b][2][cc]', 5],
  ]);
  expect(fn({ a: { b: [1, 2, { c: 3, cc: 5 }] } }, 'obj')).toEqual([
    ['obj[a][b][0]', 1],
    ['obj[a][b][1]', 2],
    ['obj[a][b][2][c]', 3],
    ['obj[a][b][2][cc]', 5],
  ]);
});
test('pickDiff', () => {
  const fn = cm.pickDiff;
  expect(fn({ a: 1 }, [])).toEqual({});
  expect(fn({ a: 1 }, [{ a: 1 }])).toEqual({});
  expect(fn({ a: 1 }, [{ a: 2 }])).toEqual({ a: 2 });
  expect(fn({ a: 1 }, [{ b: 2 }])).toEqual({ b: 2 });
  expect(fn({ a: 1 }, [{ b: 2 }, { a: 1, c: 3 }, { a: 3 }])).toEqual({ a: 3, b: 2, c: 3 });
  expect(fn({ a: NaN }, [{ a: NaN, b: 1 }])).toEqual({ b: 1 });

  const a = { a: { id: 123 } };
  const b = { a: { id: 123 } };
  expect(fn(a, [b])).toEqual({ a: { id: 123 } });
  const r = fn(a, [b]);
  expect(r).not.toBe(a);
  expect(r).not.toBe(b);

  expect(
    fn(a, [b], (v1, v2, k, origin, obj) => {
      expect(k in origin).toBeTruthy();
      expect(origin).toBe(a);
      expect(obj).toBe(b);
      return v1.id === v2.id;
    }),
  ).toEqual({});
  expect(
    fn(a, [b, { a: { id: 1 } }, { b: { id: 11 } }], (v1, v2) => {
      return v1 && v1.id === v2.id;
    }),
  ).toEqual({ a: { id: 1 }, b: { id: 11 } });
});
test('pickAdditional', () => {
  const fn = cm.pickAdditional;
  expect(fn({ a: 1 }, { a: 2 })).toEqual({});
  expect(fn({ a: 1 }, { b: 2 })).toEqual({ b: 2 });
  expect(fn({ a: 1 }, { b: 2, c: 3 })).toEqual({ b: 2, c: 3 });
  expect(fn({ a: 1, b: 2 }, { b: 2, c: 3 })).toEqual({ c: 3 });
});
test('revertObjFromPath', () => {
  const fn = cm.revertObjFromPath;
  expect(fn(['a=1', 'b=2'])).toEqual({ a: '1', b: '2' });
  expect(fn(['a=1', 'a=2'])).toEqual({ a: ['1', '2'] });
  expect(fn(['a[0]=1', 'a[1]=2'])).toEqual({ a: ['1', '2'] });
  expect(fn(['a[b]=1', 'a[c]=2'])).toEqual({ a: Object.assign([], { b: '1', c: '2' }) });

  expect(fn(['a.0=1', 'a.1=2'])).toEqual({ a: ['1', '2'] });
  expect(fn(['a.[0]=1', 'a.[1]=2'])).toEqual({ a: ['1', '2'] });
  expect(fn(['a.[b]=1', 'a.[c]=2'])).toEqual({ a: Object.assign([], { b: '1', c: '2' }) });
  expect(fn(['a.[b]=1', 'a.[c]=2'])).not.toEqual({ a: Object.assign([], { b: 1, c: '2' }) });

  expect(fn(['a[]=1', 'a[]=2'])).toEqual({ a: ['1', '2'] });
  // TODO 暂不支持多层路径
  // expect(fn(["a[b][c]=1", "a[b][d]=2"])).toEqual({a: {b: {c: 1, d: 2}}});
});
test('objFilter', () => {
  const fn = cm.objFilter;
  expect(
    fn({
      a: '',
      b: 123,
      c: 0,
      d: undefined,
      e: false,
      f: NaN,
      g: null,
    }),
  ).toEqual({ b: 123 });
});

test('hasOwn', () => {
  const fn = cm.hasOwn;

  const obj = { a: 1, b: 2 } as const;

  expect(fn(obj, 'a')).toBeTruthy();
  expect(fn(obj, 'c')).toBeFalsy();

  const obj2 = Object.create(obj);
  obj2.a = 3;

  expect(fn(obj2, 'a')).toBeTruthy();
  expect(fn(obj2, 'b')).toBeFalsy();
});
