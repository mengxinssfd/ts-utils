import * as arr from '../src/array';
import { sleep, objForEach } from '../src';

test('forEach', () => {
  const fe = arr.forEach;
  const arr1: any[] = [1, 2, 3];
  let rt = fe(arr1, (_v, k) => (arr1[k] = k));
  expect(arr1).toEqual([0, 1, 2]);
  expect(rt).toBeTruthy();
  // ArrayLike
  rt = fe({ 0: 1, 1: 2, length: 2 }, (_v, k) => (arr1[k] = k + k));
  expect(arr1).toEqual([0, 2, 2]);
  expect(rt).toBeTruthy();
  // const arr = thisArg || this;
  // fn.call(arr1, (v, k) => arr1[k] = k + 2);
  // expect(arr1).toEqual([2, 3, 4]);
  // if (callbackfn(arr[i], i, arr) === false) break;
  rt = fe(arr1, (_v, k) => {
    arr1[k] = k + 1;
    return k !== 1;
  });
  expect(rt).toBeFalsy();
  expect(arr1).toEqual([1, 2, 2]);

  const arr2: (number | string)[] = [2, 3, 4];
  rt = fe(arr2, (v, k) => (arr2[k] = 'a' + v));
  expect(rt).toBeTruthy();
  expect(arr2).toEqual(['a2', 'a3', 'a4']);
  rt = fe(arr2, (_v, k) => (arr2[k] = 'a' + k));
  expect(arr2).toEqual(['a0', 'a1', 'a2']);
  expect(rt).toBeTruthy();

  let elseCount = 0;
  rt = fe(
    arr2,
    (v, k) => (arr2[k] = 'a' + v),
    () => elseCount++,
  );
  expect(rt).toBeTruthy();
  expect(elseCount).toBe(1);
  rt = fe(
    arr2,
    () => false,
    () => elseCount++,
  );
  expect(rt).toBeFalsy();
  expect(elseCount).toBe(1);

  let count = 0;
  rt = fe({} as any, () => count++);
  expect(rt).toBeTruthy();
  expect(count).toEqual(0);
});
test('forEachAsync', async () => {
  const fn = arr.forEachAsync;
  const arr1: number[] = [1, 2, 3];
  await fn(arr1, async (_v, k) => (arr1[k] = k));
  expect(arr1).toEqual([0, 1, 2]);
  // ArrayLike
  await fn({ 0: 1, 1: 2, length: 2 }, async (_v, k) => (arr1[k] = k + k));
  expect(arr1).toEqual([0, 2, 2]);
  // const arr = thisArg || this;
  await fn.call(arr1, arr1, async (_v, k) => (arr1[k] = k + 2));
  expect(arr1).toEqual([2, 3, 4]);
  // if (callbackfn(arr[i], i, arr) === false) break;
  await fn(arr1, async (_v, k) => {
    arr1[k] = k + 1;
    return k !== 1;
  });
  expect(arr1).toEqual([1, 2, 4]);

  const arr2: (number | string)[] = [2, 3, 4];
  await fn(arr2, async (v, k) => (arr2[k] = 'a' + v));
  expect(arr2).toEqual(['a2', 'a3', 'a4']);
  await fn(arr2, async (_v, k) => (arr2[k] = 'a' + k));
  expect(arr2).toEqual(['a0', 'a1', 'a2']);

  const res: any = [];
  const asyncList = [
    async () => {
      await sleep(200);
      res.push(1);
    },
    async () => {
      await sleep(300);
      res.push(2);
    },
    async () => {
      await sleep(10);
      res.push(3);
    },
  ];
  await fn(asyncList, (v: Function) => v());
  expect(res).toEqual([1, 2, 3]);

  const list = [() => Promise.resolve('hello'), () => Promise.reject('im fine')];

  try {
    await fn(list, (v: Function) => v());
  } catch (e) {
    expect(e).toBe('im fine');
  }
});
test('mapAsync', async () => {
  const fn = arr.mapAsync;

  const asyncList = [
    async () => {
      await sleep(200);
      return 1;
    },
    async () => {
      await sleep(300);
      return 2;
    },
    async () => {
      await sleep(10);
      return 3;
    },
  ];
  const res = await fn(asyncList, (v) => v());
  expect(res).toEqual([1, 2, 3]);
});
test('reduceAsync', async () => {
  expect.assertions(9);

  const fn = arr.reduceAsync;

  const v1 = await fn(
    [
      (v: string) => Promise.resolve(`${v} thank you`),
      (v: string) => Promise.resolve(`${v} im fine`),
    ],
    (initValue, value) => {
      return value(initValue);
    },
    'hello',
  );

  expect(v1).toBe('hello thank you im fine');

  try {
    await fn(
      [
        (v: string) => Promise.resolve(`${v} thank you`),
        (v: string) => Promise.reject(`${v} im fine`),
      ],
      (initValue, value) => {
        return value(initValue);
      },
      'hello',
    );
  } catch (e) {
    expect(e).toBe('hello thank you im fine');
  }

  const v3 = await fn(
    [(v) => `${v} thank you`, (v) => `${v} im fine`] as Array<(v: string) => any>,
    (initValue, value) => {
      return value(initValue);
    },
    'hello',
  );
  expect(v3).toBe('hello thank you im fine');

  const v4 = await fn(
    [() => `thank you`, (v) => `${v} im fine`] as Array<(v: string) => string>,
    (initValue, value) => {
      return value(initValue);
    },
  );
  expect(v4).toBe('thank you im fine');

  const v5 = await fn(
    [async () => `thank you`, async (v) => `${v} im fine`],
    (initValue, value) => {
      return value(initValue);
    },
  );
  expect(v5).toBe('thank you im fine');

  try {
    await fn([], (initValue, value) => {
      return (value as any)(initValue);
    });
  } catch (e: any) {
    expect(e.message).toBe('Reduce of empty array with no initial value');
  }

  const v7 = await fn(
    [],
    (initValue, value) => {
      return (value as any)(initValue);
    },
    'hello',
  );
  expect(v7).toBe('hello');

  // break
  const v8 = await fn(
    [async (v: string) => `${v} thank you`, () => false, async (v: string) => `${v} im fine`],
    (initValue, value) => value(initValue) as any,
    'hello',
  );
  expect(v8).toBe('hello thank you');

  const v9 = await fn(
    [async () => `thank you`, () => false, async (v: string) => `${v} im fine`] as Array<any>,
    async (initValue, value) => value(initValue as string),
  );
  expect(v9).toBe('thank you');
});
test('forEachRight', () => {
  const fn = arr.forEachRight;
  const arr2: number[] = [];
  fn([1, 2, 3, 4], (i) => arr2.push(i + 1));
  expect(arr2).toEqual([5, 4, 3, 2]);

  const result: any = {};
  fn(arr.createArray({ len: 20 }), (v, k) => {
    result[k] = v;
    if (k === 10) return false;
    return;
  });
  expect(result).toEqual(
    arr.createArray({ start: 10, end: 20 }).reduce((obj, v) => {
      obj[v] = v;
      return obj;
    }, {} as Record<string, any>),
  );

  const result2: any[] = [];
  fn(arr.createArray({ len: 20 }), (v, k) => {
    result2.push({ [k]: v });
    if (k === 15) return false;
    return;
  });

  expect(result2).toEqual([{ 19: 19 }, { 18: 18 }, { 17: 17 }, { 16: 16 }, { 15: 15 }]);
});
test('from', () => {
  expect(arr.from([1, 2, 3])).toEqual([1, 2, 3]);
  // ArrayLike
  expect(arr.from({ 0: 2, 1: 1, length: 2 })).toEqual([2, 1]);
  // mapFn
  expect(arr.from([1, 2, 3], (v, k) => v + '' + k)).toEqual(['10', '21', '32']);
  expect(
    Array.from(
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
    ),
  ).toEqual([
    ['a', 1],
    ['b', 2],
  ]);
  expect(
    arr.from(
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
    ),
  ).toEqual([
    ['a', 1],
    ['b', 2],
  ]);
});
test('includes', () => {
  const list = ['', undefined, 0, NaN, null];
  expect(arr.includes([1, 2, 3], 10)).toBe(false);
  expect(arr.includes(list, NaN)).toBe(true);
  expect(arr.includes(list, null)).toBe(true);
  expect(arr.includes(list, 0)).toBe(true);
  expect(arr.includes(list, undefined)).toBe(true);
  expect(arr.includes(list, '')).toBe(true);
  expect(arr.includes(list, true as unknown)).toBeFalsy();
  expect(arr.includes(list, {} as unknown)).toBeFalsy();
  expect(arr.includes(list, (item) => !item)).toBe(true);
  expect(arr.includes(list, (item) => item === undefined)).toBe(true);
  expect(arr.includes.call(null, list, NaN)).toBe(true);
});
test('createArray', () => {
  expect(arr.createArray({ start: 0, end: 2 })).toEqual([0, 1]);
  expect(arr.createArray({ start: 0, len: 2 })).toEqual([0, 1]);
  expect(arr.createArray({ len: 2 })).toEqual([0, 1]);
  expect(arr.createArray({ len: 5, end: 3 })).toEqual([0, 1, 2]);
  expect(arr.createArray({ start: 3, end: 2 })).toEqual([]);
  expect(arr.createArray({ start: 3, len: 2 })).toEqual([3, 4]);
  expect(arr.createArray({ start: 3, len: 5, end: 5 })).toEqual([3, 4]);
  expect(arr.createArray({ start: 3, len: 1, end: 5 })).toEqual([3]);
  expect(
    arr.createArray({
      start: 3,
      len: 5,
      end: 5,
      fill(item, index) {
        return item + '' + index;
      },
    }),
  ).toEqual(['30', '41']);
  expect(arr.createArray({ start: 3, len: 5, end: 6, fill: 0 })).toEqual([0, 0, 0]);
});
test('filter', () => {
  // 未找到
  expect(
    arr.filter([1, 2, 3, 4, 5, 6, 7, 8], (v) => {
      return v > 10;
    }),
  ).toEqual([]);
  // 找到
  expect(
    arr.filter([1, 2, 3, 4, 5, 6, 7, 8], (v, k, arr) => {
      return v < 7 && k > 2 && arr.length === 8;
    }),
  ).toEqual([4, 5, 6]);
});

test('find', () => {
  expect(
    arr.find([1, 2, 3, 4], (v, k, arr) => {
      return v === 3 && k === 2 && arr.length === 4;
    }),
  ).toBe(3);
  expect(
    arr.find([1, 2, 3, 4], (v, k, arr) => {
      return v === 3 && k === 2 && arr.length === 6;
    }),
  ).toBe(undefined);
  expect(
    arr.find([], (v, k, arr) => {
      return v === 3 && k === 2 && arr.length === 6;
    }),
  ).toBe(undefined);
});
test('flat', () => {
  expect([1, 2, 3, [1, 2, 3, [1, 2, 3]], [1, 2, 3, [1, 2, 3]]].flat(1)).toEqual([
    1,
    2,
    3,
    1,
    2,
    3,
    [1, 2, 3],
    1,
    2,
    3,
    [1, 2, 3],
  ]);

  const list = [1, 2, 3, [1, 2, 3, [1, 2, 3]], [1, 2, 3, [1, 2, 3]]];

  // Array.property.flat(depth=1)
  expect(list.flat()).toEqual(list.flat(1));
  expect(arr.flat(list, 1)).toEqual(list.flat());
  expect(arr.flat(list, 1)).toEqual(list.flat(1));
  expect(arr.flat(list, 2)).toEqual(list.flat(2));
  expect(arr.flat(list, 3)).toEqual(list.flat(3));

  // flat all
  expect(arr.flat([1, 2, 3], -1)).toEqual([1, 2, 3]);
  expect(arr.flat([1, 2, 3, [1, 2, 3]], -1)).toEqual([1, 2, 3, 1, 2, 3]);
  expect(arr.flat([1, 2, 3, [1, 2, 3], [1, 2, 3]], -1)).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]);
  expect(arr.flat([1, 2, 3, [1, 2, 3, [1, 2, 3]], [1, 2, 3]], -1)).toEqual([
    1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3,
  ]);
  expect(arr.flat([1, 2, 3, [1, 2, 3, [1, 2, 3]], [1, 2, 3, [1, 2, 3]]], -1)).toEqual([
    1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3,
  ]);
  expect(arr.flat([1, 2, 3, [1, 2, 3, [1, 2, 3]], [1, 2, 3, [1, 2, 3]]])).toEqual([
    1,
    2,
    3,
    1,
    2,
    3,
    [1, 2, 3],
    1,
    2,
    3,
    [1, 2, 3],
  ]);
});

test('binaryFind', () => {
  const list: { id: number }[] = [...Array(100).keys()].map((i) => ({ id: i * 2 }));

  function find(target: number): { times: number; value: ReturnType<typeof arr.binaryFind> } {
    let times = 0;
    const value = arr.binaryFind(list, function (item, index) {
      times++;
      // console.log(index);
      // 判断index是否正确
      expect(list[index]).toBe(item);
      return target - item.id;
    });
    return { times, value };
  }

  let res = find(58);
  expect(res.times).toBe(5);
  expect(res.value).toEqual({ id: 58 });

  // console.log('----min-----');
  // 判断边缘 min
  const first = list[0]!;
  res = find(first.id);
  expect(res.times).toBe(7);
  expect(res.value).toEqual(first);

  // console.log('----max-----');
  // 判断边缘 max
  const maxIndex = list.length - 1;
  const last = list[maxIndex]!;
  res = find(last.id);
  expect(res.times).toBe(6);
  expect(res.value).toEqual(last);

  // cover
  expect(arr.binaryFind([1], (i) => i)).toBeUndefined();
  expect(find(55).value).toBeUndefined();
  expect(find(400).value).toBeUndefined();
  expect(arr.binaryFind([], (i) => i)).toBeUndefined();
});
test('binaryFind2', () => {
  const list: { id: number }[] = [...Array(100).keys()].map((i) => ({ id: i * 2 }));

  function find(target: number): { times: number; value: ReturnType<typeof arr.binaryFind2> } {
    let times = 0;
    const value = arr.binaryFind2(list, function (item, index) {
      times++;
      // console.log(index);
      // 判断index是否正确
      expect(list[index]).toBe(item);
      return target - item.id;
    });
    return { times, value };
  }

  let res = find(58);
  expect(res.times).toBe(5);
  expect(res.value).toEqual({ id: 58 });

  // console.log('----min-----');
  // 判断边缘 min
  const first = list[0]!;
  res = find(first.id);
  expect(res.times).toBe(7);
  expect(res.value).toEqual(first);

  // console.log('----max-----');
  // 判断边缘 max
  const maxIndex = list.length - 1;
  const last = list[maxIndex]!;
  res = find(last.id);
  expect(res.times).toBe(6);
  expect(res.value).toEqual(last);

  // cover
  expect(arr.binaryFind2([1], (i) => i)).toBeUndefined();
  expect(find(55).value).toBeUndefined();
  expect(find(400).value).toBeUndefined();
  expect(arr.binaryFind2([], (i) => i)).toBeUndefined();
});
test('binaryFindIndex', () => {
  // console.log('-----binaryFindIndex------');

  const list: { id: number }[] = [...Array(100).keys()].map((i) => ({ id: i * 2 }));

  function find(target: number): { times: number; index: ReturnType<typeof arr.binaryFindIndex> } {
    // 查找次数
    let times = 0;
    const index = arr.binaryFindIndex(list, function (item, index, start, end) {
      times++;
      // console.log(index);
      // 判断index是否正确
      expect(list[index]).toBe(item);
      // 0 <= (start) < end <= list.length
      expect(start).toBeGreaterThanOrEqual(0);
      expect(start).toBeLessThan(end);
      expect(start).toBeLessThan(list.length);
      expect(end).toBeLessThanOrEqual(list.length);

      return target - item.id;
    });
    return { times, index };
  }

  let res = find(58);
  expect(res.times).toBe(5);
  expect(res.index).toBe(29);

  // console.log('--------min-------');
  // 判断边缘 min
  const minIndex = 0;
  const first = list[minIndex]!;
  res = find(first.id);
  expect(res.times).toBe(7);
  expect(res.index).toBe(minIndex);

  // console.log('----max-----');
  // 判断边缘 max
  const maxIndex = list.length - 1;
  const last = list[maxIndex]!;
  res = find(last.id);
  expect(res.times).toBe(6);
  expect(res.index).toBe(maxIndex);

  // cover
  expect(
    arr.binaryFindIndex([1], (item) => {
      // console.log(index, start, end);
      return 0 - item;
    }),
  ).toBe(-1);
  expect(arr.binaryFindIndex([], (i) => i)).toBe(-1);
  expect(arr.binaryFindIndex(list, (i) => 55 - i.id)).toBe(-1);
});
test('insertToArray', () => {
  const fn = arr.insertToArray;
  const arr1 = [1, 2, 3, 4];
  const arr2 = [1, 2, 3, 4];
  const arr3 = [1, 2, 3, 4];
  const arr4 = [1, 2, 3, 4];
  const arr5 = [1, 2, 4, 5];
  const arr6 = [1, 2, 4, 5];
  const arr7 = [1, 2, 4, 5];
  expect(fn(5, 1, arr1)).toBe(1);
  expect(arr1).toEqual([1, 5, 2, 3, 4]);
  expect(fn([6, 7], 100, arr1)).toBe(5);
  expect(arr1).toEqual([1, 5, 2, 3, 4, 6, 7]);

  expect(fn(5, 1, arr2, { after: true })).toBe(2);
  expect(arr2).toEqual([1, 2, 5, 3, 4]);
  expect(fn(0, -1, arr2)).toBe(0);
  expect(arr2).toEqual([0, 1, 2, 5, 3, 4]);
  expect(fn(6, 100, arr2, { after: true })).toBe(6);
  expect(arr2).toEqual([0, 1, 2, 5, 3, 4, 6]);
  expect(fn(6, (v) => v === 100, arr2)).toBe(-1);
  expect(arr2).toEqual([0, 1, 2, 5, 3, 4, 6]);

  expect(fn(5, 0, arr3)).toBe(0);
  expect(arr3).toEqual([5, 1, 2, 3, 4]);
  expect(fn(5, 100, arr4)).toBe(4);
  expect(fn(6, 100, arr4)).toBe(5);
  expect(arr4).toEqual([1, 2, 3, 4, 5, 6]);

  expect(
    fn(
      3,
      (v) => {
        return v === 2;
      },
      arr5,
    ),
  ).toBe(1);
  expect(arr5).toEqual([1, 3, 2, 4, 5]);
  expect(
    fn(
      3,
      (v) => {
        return v > 2;
      },
      arr6,
    ),
  ).toBe(2);
  expect(arr6).toEqual([1, 2, 3, 4, 5]);
  expect(fn(6, (v) => v === 1000, arr6)).toBe(-1);
  expect(arr6).toEqual([1, 2, 3, 4, 5]);

  const a2: number[] = [];
  expect(
    fn(
      3,
      (v, _k, _a, inset) => {
        a2.push(v);
        return v < inset;
      },
      arr7,
      { reverse: true, after: true },
    ),
  ).toBe(2);
  expect(a2).toEqual([5, 4, 2]);
  expect(arr7).toEqual([1, 2, 3, 4, 5]);

  const arr8 = [1, 2, 4, 5];
  const a3: number[] = [];
  expect(
    fn(
      [3, 3],
      (v, _k, _a, insets) => {
        a3.push(v);
        return v > insets[0]!;
      },
      arr8,
    ),
  ).toBe(2);
  expect(a3).toEqual([1, 2, 4]);
  expect(arr8).toEqual([1, 2, 3, 3, 4, 5]);
});
test('unique', () => {
  const fn = arr.unique;
  expect(fn([1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1])).toEqual([1, 2, 3, 4]);
  expect(fn([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  expect(fn([NaN, null, undefined, ''])).toEqual([NaN, null, undefined, '']);
  expect(fn([undefined, undefined, ''])).toEqual([undefined, '']);
  expect(fn([NaN, NaN])).toEqual([NaN]);
  /* expect(fn([NaN, NaN], (a, b) => {
        return Number.isNaN(a) && Number.isNaN(b);
    })).toEqual([NaN]);*/
  const a = { value: 1 };
  const b = { value: 2 };
  const c = { value: 3 };
  const d = { value: 2 };
  expect(fn([a, b, c, d])).toEqual([a, b, c, d]);
  expect(fn([])).toEqual([]);
  expect(fn([a, b, c, d], (v1, v2) => v1.value === v2.value)).toEqual([a, b, c]);
});
test('findIndex', () => {
  const fn = arr.findIndex;
  // 中途删除
  expect(
    [1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1].findIndex((v, index, a) => {
      if (v === 1) {
        a.splice(index, 1);
      }
      return v === 4;
    }),
  ).toEqual(3);
  expect(
    fn([1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1], (v, index, a) => {
      if (v === 1) {
        (a as number[]).splice(index, 1);
      }
      return v === 4;
    }),
  ).toEqual(3);
  expect(fn([1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1], (v) => v === 4)).toEqual(5);
  expect(fn([{ v: 1 }, { v: 2 }], (v) => v.v === 4)).toEqual(-1);
  expect(fn([{ v: 1 }, { v: 2 }], (v) => v.v === 2)).toEqual(1);

  expect(fn([], undefined as any)).toBe(-1);
});
test('findIndexRight', () => {
  const fn = arr.findIndexRight;
  const list = [1, 1, 2, 1, 3, 4, 1, 1, 1, 1, 1];
  const result: number[] = [];
  expect(
    fn(list, (v) => {
      result.push(v);
      return v === 4;
    }),
  ).toEqual(5);
  expect(result).toEqual([1, 1, 1, 1, 1, 4]);
  expect(fn([{ v: 1 }, { v: 2 }], (v) => v.v === 4)).toEqual(-1);
  expect(fn([{ v: 1 }, { v: 2 }], (v) => v.v === 2)).toEqual(1);

  expect(fn([], undefined as any)).toBe(-1);
});
test('castArray', () => {
  const fn = arr.castArray;
  expect(fn(0)).toEqual([0]);
  expect(fn('')).toEqual(['']);
  expect(fn([1, 2, 3])).toEqual([1, 2, 3]);
});
test('chunk', () => {
  const fn = arr.chunk;
  expect(fn([0, 1, 2, 3, 4, 5, 6], 10)).toEqual([[0, 1, 2, 3, 4, 5, 6]]);
  expect(fn([0, 1, 2, 3, 4, 5, 6], 1)).toEqual([[0], [1], [2], [3], [4], [5], [6]]);
  expect(fn([0, 1, 2, 3, 4, 5, 6], 0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  expect(fn([0, 1, 2, 3, 4, 5, 6], -1)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  expect(fn([0, 1, 2, 3, 4, 5, 6], 3)).toEqual([[0, 1, 2], [3, 4, 5], [6]]);
  expect(fn([0, 1, 2, 3, 4, 5], 3)).toEqual([
    [0, 1, 2],
    [3, 4, 5],
  ]);
  expect(fn([0, 1, 2, 3, 4], 3)).toEqual([
    [0, 1, 2],
    [3, 4],
  ]);
  const emptyArr: any[] = [];
  expect(fn(emptyArr, 3)).toEqual([]);
  expect(fn(emptyArr, 3)).not.toBe(emptyArr);
  expect(() => {
    fn({} as any, 3);
  }).toThrowError();
  expect(() => {
    fn(null as any, 3);
  }).toThrowError();
});
test('arrayRemoveItem', () => {
  const fn = arr.arrayRemoveItem;
  const a1 = [1, 2, 3, 4, 5];

  expect(fn(100, a1)).toBe(undefined);
  expect(a1).toEqual([1, 2, 3, 4, 5]);
  expect(fn(1, a1)).toBe(1);
  expect(a1).toEqual([2, 3, 4, 5]);
});
test('arrayRemoveItemsBy', () => {
  const fn = arr.arrayRemoveItemsBy;
  const a1 = [1, 2, 3, 4, 5];

  expect(fn((v) => v === 100, a1)).toEqual([]);
  expect(a1).toEqual([1, 2, 3, 4, 5]);
  expect(fn((v) => v === 1, a1)).toEqual([1]);
  expect(a1).toEqual([2, 3, 4, 5]);
});
test('inRange', () => {
  const fn = arr.inRange;
  expect(fn(0, [undefined as any, 100])).toBeTruthy();
  expect(fn(0, [0])).toBeTruthy();
  expect(fn(0, [1])).toBeFalsy();
  expect(fn(0, [1, 2])).toBeFalsy();
});
test('inRanges', () => {
  const fn = arr.inRanges;
  expect(fn(0, [undefined as any, 100])).toBeTruthy();
  expect(fn(0, [0])).toBeTruthy();
  expect(fn(0, [1])).toBeFalsy();
  expect(fn(0, [1, 2])).toBeFalsy();

  expect(fn(0, [1, 2], [-9, -1])).toBeFalsy();
  expect(fn(-9, [1, 2], [-9, -1])).toBeTruthy();
  expect(fn(-1, [1, 2], [-9, -1])).toBeTruthy();
  expect(fn(-10, [1, 2], [-9, -1])).toBeFalsy();
  expect(fn(-10, [1, 2], [-9, -1], [-20, -10])).toBeTruthy();
  expect(fn(0, [1, 2], [-9, -1])).toBeFalsy();
});
test('groupBy', () => {
  const fn = arr.groupBy;
  expect(fn([{ type: 1 }, { type: 2 }], 'type')).toEqual({
    1: [{ type: 1 }],
    2: [{ type: 2 }],
  });
  expect(
    fn(
      [
        { type: 1, value: 111 },
        { type: 2, value: 222 },
        { type: 1, value: 222 },
        { type: 2, value: 33344 },
        { type: 1, value: 333 },
        { type: 1, value: 444 },
      ],
      'type',
    ),
  ).toEqual({
    1: [
      { type: 1, value: 111 },
      { type: 1, value: 222 },
      { type: 1, value: 333 },
      { type: 1, value: 444 },
    ],
    2: [
      { type: 2, value: 222 },
      { type: 2, value: 33344 },
    ],
  });
  expect(fn([], '')).toEqual({});
  expect(() => {
    fn(undefined as any, undefined as any);
  }).toThrowError();
  expect(fn([], undefined as any)).toEqual({});
  expect(fn([{ type: 1 }, { type: 2 }], undefined as any)).toEqual({
    '*': [{ type: 1 }, { type: 2 }],
  });
  expect(fn([{ type: 1 }, { value: 2 }], 'type')).toEqual({
    '*': [{ value: 2 }],
    1: [{ type: 1 }],
  });
  expect(fn([{ type: 1 }, { value: 2 }], 'type', 'other')).toEqual({
    other: [{ value: 2 }],
    1: [{ type: 1 }],
  });
  // cb
  expect(
    fn(
      [
        { name: 'a', score: 50 },
        { name: 'b', score: 90 },
        { name: 'c', score: 70 },
        { name: 'd', score: 10 },
        { name: 'e', score: 100 },
      ],
      (item) => {
        const score = item.score;
        if (score >= 90) return 'A';
        if (score >= 60) return 'B';
        return 'C';
      },
    ),
  ).toEqual({
    A: [
      { name: 'b', score: 90 },
      { name: 'e', score: 100 },
    ],
    B: [{ name: 'c', score: 70 }],
    C: [
      { name: 'a', score: 50 },
      { name: 'd', score: 10 },
    ],
  });

  const list = [
    { code: 'a' },
    { code: 'a_a' },
    { code: 'a_b' },
    { code: 'a_c' },
    { code: 'b' },
    { code: 'b_a' },
    { code: 'b_b' },
  ];

  const r = arr.groupBy(list, (item, obj) => {
    let result = '';
    objForEach(
      obj,
      (_v, k): false | void => {
        if (new RegExp((k as string) + '_.+').test(item.code)) {
          result = k as string;
          return false;
        }
      },
      () => (result = item.code),
    );
    return result;
  });

  expect(r).toEqual({
    a: [{ code: 'a' }, { code: 'a_a' }, { code: 'a_b' }, { code: 'a_c' }],
    b: [{ code: 'b' }, { code: 'b_a' }, { code: 'b_b' }],
  });
});
test('someInList', () => {
  const fn = arr.someInList;
  expect(fn([0, 20, 100], [...Array(10).keys()])).toBeTruthy();
  expect(fn([500, 20], Array.from({ length: 10 }))).toBeFalsy();
  expect(fn([{ id: 1 }], [{ id: 1 }, { id: 2 }, { id2: 3 }])).toBeFalsy();
  expect(
    fn([{ id: 1 }], [{ id: 1 }, { id: 2 }, { id: 3 }], (item, _i, list) => {
      return list.some((s) => s.id === item.id);
    }),
  ).toBeTruthy();
});
