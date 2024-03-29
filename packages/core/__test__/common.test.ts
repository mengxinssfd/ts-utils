import * as cm from '../src/common';
import { sleep } from '../src/time';
import { strPadStart } from '../src/string';

test('forEachByLen', () => {
  const fn = cm.forEachByLen;
  const arr: number[] = [];
  fn(3, (index) => arr.push(index));
  expect(arr).toEqual([0, 1, 2]);
  fn(7, (index) => arr.push(index));
  expect(arr.length).toEqual(10);
  fn(3, (index): any | false => {
    arr.push(index);
    if (index === 1) return false;
  });
  expect(arr).toEqual([0, 1, 2, 0, 1, 2, 3, 4, 5, 6, 0, 1]);
});
test('forEachByLenRight', () => {
  const fn = cm.forEachByLenRight;
  const arr: number[] = [];
  fn(3, (index) => arr.push(index));
  expect(arr).toEqual([0, 1, 2].reverse());
  fn(7, (index) => arr.push(index));
  expect(arr.length).toEqual(10);
  fn(3, (index): any | false => {
    arr.push(index);
    if (index === 1) return false;
  });
  expect(arr).toEqual([...[0, 1, 2].reverse(), ...[0, 1, 2, 3, 4, 5, 6].reverse(), 2, 1]);
});

test('debounce', async () => {
  expect.assertions(3);
  let times = 0;
  const d = cm.debounce(() => times++, 100);
  d();
  expect(times).toBe(0);
  d.flush();
  expect(times).toBe(1);
  d();
  d.cancel();
  await sleep(300);
  setTimeout(d, 10);
  setTimeout(d, 20);
  setTimeout(d, 30);
  setTimeout(d, 40);
  setTimeout(() => {
    expect(times).toBe(2);
    // 异步代码需要调用done()
  }, 500);
  await sleep(500);
});
test('debounce immediate', async () => {
  expect.assertions(4);
  let times = 0;
  const d = cm.debounce(() => times++, 100, true);
  d();
  expect(times).toBe(1);
  d.flush();
  expect(times).toBe(2);
  d();
  d.cancel();
  await sleep(500);
  setTimeout(d, 10);
  setTimeout(d, 20);
  setTimeout(d, 30);
  setTimeout(d, 40);
  setTimeout(() => {
    expect(times).toBe(3);
  }, 500);
  await sleep(1000);
  times = 0;
  d();
  setTimeout(() => {
    expect(times).toBe(1);
    // 异步代码需要调用done()
  }, 500);
  await sleep(500);
});

test('oneByOne', (done) => {
  const s = 'hello world';
  cm.oneByOne(s, 10, (w, index) => {
    expect(w).toBe(s[index]);
    if (s.length === index + 1) {
      done();
    }
  });
  cm.oneByOne(s, 10);
});
test('functionApply', () => {
  // const args = [1, 2, 3];
  // (new Function(generateFunctionCode(args.length)))(object, property, args);
  expect(strPadStart('123', 6, '0')).toBe('000123');
  const value = cm.functionApply({ strPadStart }, 'strPadStart', ['123', 6, '0']);
  expect(value).toBe('000123');
});
test('polling', (done) => {
  let t = 0;
  const cancel = cm.polling(
    (times) => {
      return new Promise<void>((res) => {
        expect(times).toBe(t);
        t++;
        if (times === 10) {
          cancel();
          done();
        }
        res();
      });
    },
    10,
    false,
  );
});

test('createUUID', () => {
  const uuid = cm.createUUID(10);

  // 判断长度是否正确
  expect(uuid.length === 10).toBeTruthy();

  const hexDigits = '0123456789abcdef';
  // 判断每个字符是否在范围内
  for (let i = 0; i < uuid.length; i++) {
    expect(hexDigits.indexOf(uuid[i]!) > -1).toBeTruthy();
  }

  // 判断100次循环中是否有相同的
  for (let i = 0; i < 100; i++) {
    const uid = cm.createUUID(10);
    expect(uid !== uuid).toBeTruthy();
  }
});

test('formatJSON', () => {
  const formatJSON = cm.formatJSON;
  const space = '    ';
  const str = { a: 1, b: '2' };
  expect(formatJSON(str, 4)).toBe(`{\r\n${space}"a":1,\r\n${space}"b":"2"\r\n}`);
  expect(formatJSON(JSON.stringify(str), 4)).toBe(`{\r\n${space}"a":1,\r\n${space}"b":"2"\r\n}`);

  expect(formatJSON({ a: [1, 2] }, 4)).toBe(
    '{\r\n' + '    "a":[\r\n' + '        1,\r\n' + '        2\r\n' + '    ]\r\n' + '}',
  );

  expect(() => {
    formatJSON('');
  }).toThrowError();
  let obj;
  eval('obj={test:function(){}}');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(formatJSON(obj, 4)).toBe('{\r\n' + '    "test":"function(){}"\r\n' + '}');

  function Ext(this: any) {
    this.a = 1;
  }

  Ext.prototype.b = '2';

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  expect(formatJSON(new Ext(), 4)).toBe(`{\r\n    "a":1\r\n}`);
});

test('promiseAny', async () => {
  expect.assertions(12);
  const fn = cm.promiseAny;
  const isNotIterable = 'TypeError: list is not iterable';
  await expect(fn(undefined as any)).rejects.toEqual(isNotIterable);
  await expect(fn(null as any)).rejects.toEqual(isNotIterable);
  await expect(fn(NaN as any)).rejects.toEqual(isNotIterable);
  await expect(fn(0 as any)).rejects.toEqual(isNotIterable);
  await expect(fn(true as any)).rejects.toEqual(isNotIterable);
  await expect(fn({} as any)).rejects.toEqual(isNotIterable);

  const allReject = 'AggregateError: All promises were rejected';
  await expect(fn([])).rejects.toEqual(allReject);
  await expect(fn([Promise.reject(0), Promise.reject(1)])).rejects.toEqual(allReject);
  await expect(fn([0 as any, Promise.resolve(1)])).resolves.toEqual(0);
  await expect(fn([Promise.resolve(1), 0 as any])).resolves.toEqual(0);
  await expect(fn([Promise.resolve(0), Promise.resolve(1)])).resolves.toEqual(0);
  await expect(fn([Promise.reject(0), Promise.reject(1), Promise.resolve(2)])).resolves.toEqual(2);
});

test('debounceAsync', async () => {
  expect.assertions(2);
  const fn = cm.debounceAsync;
  let times = 0;
  const cb = () => {
    return new Promise((resolve) => {
      resolve(times++);
    });
  };

  const dbFn = fn(cb, 100);
  await cm.promiseAny([dbFn(), dbFn(), dbFn(), dbFn()]);

  expect(times).toEqual(1);

  dbFn();
  await sleep(150);
  dbFn();
  await sleep(150);
  expect(times).toEqual(3);
});
test('debounceByPromise', async () => {
  expect.assertions(2);
  const fn = cm.debounceByPromise;
  let times = 0;
  const cb = (time = 50) => {
    const p = new Promise((resolve) => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
    p.then(() => {
      times++;
    });
    return p;
  };

  const dbFn = fn(cb);

  await expect(cm.promiseAny([dbFn(40), dbFn(20), dbFn(60), dbFn(30)])).resolves.toEqual(30);

  dbFn(100);
  await sleep(150);
  dbFn();
  await sleep(150);
  // fixme 执行了6次， debounceByPromise无法阻止cb被调用 不推荐使用
  expect(times).toEqual(6);
});
test('debounceCancelable', async () => {
  expect.assertions(2);
  const fn = cm.debounceCancelable;
  let times = 0;
  const cb = () => {
    times++;
  };

  const dbFn = fn(cb, 20);

  const cancelFn = dbFn();
  cancelFn();

  await sleep(30);

  expect(times).toEqual(0);

  dbFn();
  await sleep(150);
  expect(times).toEqual(1);
});
test('createEnumByObj', async () => {
  const fn = cm.createEnumByObj;

  const obj = { a: 'aa', b: 'bb' };
  expect(fn(obj)).toEqual({ a: 'aa', b: 'bb', aa: 'a', bb: 'b' });
  expect(fn({ a: 1, b: 2 })).toEqual({ a: 1, b: 2, 1: 'a', 2: 'b' });
});
test('createEnum', async () => {
  const fn = cm.createEnum;

  enum e {
    a,
    b,
    c,
  }

  expect(fn(['a', 'b', 'c'])).toEqual(e);
});
test('throttle', async () => {
  // expect.assertions(4);
  const fn = cm.throttle;
  let times = 0;
  let invalidTimes = 0;
  let interval = 0;
  const th = fn(
    () => {
      interval = 0;
      return times++;
    },
    1000,
    (int) => {
      interval = int;
      invalidTimes++;
    },
  );

  const now = Date.now();
  await new Promise<void>((resolve) => {
    // TODO 可以使用OneByOne代替
    th();

    function exec() {
      const index = setTimeout(() => {
        const t = th();
        expect(t).toBe(t === undefined ? undefined : times - 1);
        if (Date.now() - now > 2200) {
          clearInterval(index);
          resolve();
          return;
        }
        exec();
      }, 100);
    }

    exec();
  });
  expect(times).toBe(3);
  // 有些电脑能够执行20次 与定时器有关 实际并不准确
  expect(invalidTimes).toBeGreaterThanOrEqual(15);
  expect(invalidTimes).toBeLessThanOrEqual(20);

  // interval = 0;
  await sleep(1000);
  th();
  expect(interval).toBe(0);
  await sleep(100);
  th();
  expect(interval).toBeLessThanOrEqual(900);
  expect(interval).toBeGreaterThanOrEqual(800);
  await sleep(200);
  th();
  expect(interval).toBeLessThanOrEqual(700);
  expect(interval).toBeGreaterThanOrEqual(600);
  await sleep(701);
  th();
  expect(interval).toBe(0);

  let times2 = 0;
  let interval2 = 0;
  const th2 = fn(() => {
    interval2 = 3;
    return times2++;
  }, 1000);
  th2();
  th2();
  th2();
  th2();
  expect(interval2).toBe(3);
  expect(times2).toBe(1);
});
/*test("throttleByTimeDown", async () => {
    // expect.assertions(4);
    const fn = cm.throttleByTimeDown;
    let times = 0;
    let invalidTimes = 0;
    let interval = 0;
    const th = fn(() => {
        interval = 0;
        return times++;
    }, 1000, (int) => {
        interval = int;
        invalidTimes++;
    });

    const now = Date.now();
    await new Promise<void>(((resolve, reject) => {
        // TODO 可以使用OneByOne代替
        th();

        function exec() {
            const index = setTimeout(() => {
                const t = th();
                expect(t).toBe(t === undefined ? undefined : times - 1);
                if (Date.now() - now > 2200) {
                    clearInterval(index);
                    resolve();
                    return;
                }
                exec();
            }, 100);
        }

        exec();
    }));
    expect(times).toBe(3);
    // 有些电脑能够执行20次 与定时器有关 实际并不准确
    expect(invalidTimes).toBeGreaterThanOrEqual(15);
    expect(invalidTimes).toBeLessThanOrEqual(20);

    // interval = 0;
    await sleep(1000);
    th();
    expect(interval).toBe(0);
    await sleep(100);
    th();
    expect(interval).toBeLessThanOrEqual(900);
    expect(interval).toBeGreaterThanOrEqual(800);
    await sleep(200);
    th();
    expect(interval).toBeLessThanOrEqual(700);
    expect(interval).toBeGreaterThanOrEqual(600);
    await sleep(701);
    th();
    expect(interval).toBe(0);
});*/
test('promiseQueue', async () => {
  const fn = cm.promiseQueue;
  const v = await fn(
    [(v) => Promise.resolve(`${v} thank you`), (v) => Promise.resolve(`${v} im fine`)],
    'hello',
  );
  expect(v).toBe('hello thank you im fine');

  try {
    await fn(
      [(v) => Promise.resolve(`${v} thank you`), (v) => Promise.reject(`${v} im fine`)],
      'hello',
    );
  } catch (e) {
    expect(e).toBe('hello thank you im fine');
  }

  const v2 = await fn([(v: any) => `${v} thank you`, (v: any) => `${v} im fine`] as any, 'hello');
  expect(v2).toBe('hello thank you im fine');
});
test('syncPromiseAll', async () => {
  const fn = cm.syncPromiseAll;

  let timeStart = Date.now();
  let timeEnd = timeStart;
  let num = 0;
  const list = [
    () =>
      new Promise<number>((res) => {
        setTimeout(() => {
          timeEnd = Date.now();
          num = 200;
          res(200);
        }, 200);
      }),
    () => ((num = 2), Promise.resolve(2)),
  ];
  const res = await fn(list);

  expect(timeEnd - timeStart).toBeGreaterThanOrEqual(200);
  expect(timeEnd - timeStart).toBeLessThanOrEqual(300);
  expect(res).toEqual([200, 2]);
  expect(num).toBe(2);

  // 对比Promise.all, 是先执行的快的那一个
  timeStart = Date.now();
  const res2 = await Promise.all(list.map((i) => i()));
  expect(timeEnd - timeStart).toBeGreaterThanOrEqual(200);
  expect(timeEnd - timeStart).toBeLessThanOrEqual(300);
  expect(res2).toEqual([200, 2]);
  expect(num).toBe(200);
});
test('root', () => {
  expect(cm.root).toBe(window);
});
test('numToFixed', () => {
  const fn = cm.numToFixed;
  expect((0).toFixed(1)).toEqual('0.0');
  expect(fn(0, 1)).toBe('0.0');
  expect(fn(0, 1, true)).toBe('0.0');
  expect((0).toFixed(6)).toEqual('0.000000');
  expect(fn(0, 6)).toBe('0.000000');
  expect(fn(0, 6, true)).toBe('0.000000');

  expect((0.45).toFixed(1)).toEqual('0.5');
  expect((0.45).toFixed(1)).toEqual('0.5');
  expect(fn(0.45, 1)).toBe('0.4');
  expect(fn(0.45, 1, true)).toBe('0.5');

  expect((1.45).toFixed(1)).toBe('1.4');
  expect(fn(1.45, 1, true)).toBe('1.5');
  expect(fn(1.45, 1)).toBe('1.4');

  expect((1).toFixed(2)).toBe('1.00');
  expect(fn(1, 2)).toBe('1.00');
  expect(fn(1, 2, true)).toBe('1.00');

  expect((1.45).toFixed()).toBe('1');
  expect(fn(1.45)).toBe('1');
  expect(fn(1.45, undefined, true)).toBe('1');

  expect(0.5 + 0.07).not.toBe(0.57);
  expect((0.5 + 0.07).toFixed(2)).toBe('0.57');
  expect(fn(0.5 + 0.07, 2)).toBe('0.57');
  expect(fn(0.5 + 0.07, 5)).toBe('0.57000');

  expect(() => {
    (0.1).toFixed(-1);
  }).toThrowError();
  expect(() => {
    fn(0.1, -1);
  }).toThrowError();
  expect(() => {
    (0.1).toFixed(101);
  }).toThrowError();
  expect(() => {
    fn(0.1, 101);
  }).toThrowError();

  // const f = fn(0.1, 100);
  // expect(0.1.toFixed(100)).toBe(f)
});
test('at', () => {
  const fn = cm.at;
  // const arr = [1, 2, 3, 4, 5, 6, 7];
  const arr: [1, 2, 3, 4, 5, 6, 7] = [1, 2, 3, 4, 5, 6, 7];
  expect(fn(arr, 0)).toBe(1);
  expect(fn(arr, -1)).toBe(7);
  expect(fn(arr, -7)).toBe(1);
  expect(fn(arr, -8)).toBe(undefined);
  expect(fn(arr, -9, 20)).toBe(20);
  expect(fn(arr, 7)).toBe(undefined);
  expect(fn(arr, 7, 20)).toBe(20);

  const obj = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, length: 6 };
  expect(fn(obj, 0)).toBe(1);
  expect(fn(obj, -1)).toBe(6);
  expect(fn(obj, -6)).toBe(1);
  expect(fn(obj, -8)).toBe(undefined);
  expect(fn(obj, -9, 20)).toBe(20);
  expect(fn(obj, 7)).toBe(undefined);
  expect(fn(obj, 7, 20)).toBe(20);

  const str = '123456';
  expect(fn(str, 0)).toBe('1');
  expect(fn(str, -1)).toBe('6');
  expect(fn(str, -6)).toBe('1');
  expect(fn(str, -8)).toBe(undefined);
  expect(fn(str, -9, '20')).toBe('20');
  expect(fn(str, 7)).toBe(undefined);
  expect(fn(str, 7, 20)).toBe(20);

  const und = [null, false, undefined, '', NaN];

  und.forEach((it, index) => {
    expect(fn(und, index)).toEqual(it);
    expect(fn(und, index, true)).toEqual(it);
  });
  expect(fn(und, 5, true)).toBe(true);
  expect(fn(und, -7, true)).toBe(true);

  expect(fn(Array(2), 0, true)).toBe(true);
});
test('likeKeys', () => {
  const fn = cm.likeKeys;
  expect(fn([1, 2, 3, 4, 5, 6, 7], '0')).toEqual(['0']);
  expect(fn([1, 2, 3, 4, 5, 6, 7, 1, 1, 1, 1, 1, 1], '0')).toEqual(['0', '10']);
  expect(fn({ test: 1, test2: 2, test3: 3 }, 'test')).toEqual(['test', 'test2', 'test3']);
  const map = new Map<string, number | string>([
    ['test', 1],
    ['test2', 2],
    ['hello', 'world'],
  ]);
  expect(fn(map, 'test')).toEqual(['test', 'test2']);
});

test('parseCmdParams', () => {
  const fn = cm.parseCmdParams;

  function pcp(value: string, prefix?: string, df?: string) {
    return Object.fromEntries(fn(value.split(' ').slice(2), prefix, df));
  }

  expect(pcp('node test.js test.js -a -b -c')).toEqual({
    default: 'test.js',
    a: true,
    b: true,
    c: true,
  });

  expect(pcp('node test.js test.js -a=123')).toEqual({ default: 'test.js', a: '123' });

  expect(pcp('node test.js test.js -a=123 333 555 -b 666 888 -c=1 -b=999')).toEqual({
    default: 'test.js',
    a: ['123', '333', '555'],
    b: ['666', '888', '999'],
    c: '1',
  });

  expect(pcp('node test.js test.js -a=123=333=444=555')).toEqual({
    default: 'test.js',
    a: '123=333=444=555',
  });

  expect(pcp('node test.js test.js -a= ')).toEqual({ default: 'test.js', a: true });

  expect(pcp('node test.js test.js -a= -b=123')).toEqual({ default: 'test.js', a: true, b: '123' });

  expect(pcp('node test.js test.js -a==123=333=444=555')).toEqual({
    default: 'test.js',
    a: '=123=333=444=555',
  });

  expect(pcp('node test.js test.js --a==123=333=444=555', '--', 'args')).toEqual({
    args: 'test.js',
    a: '=123=333=444=555',
  });
});
describe('idGen', () => {
  const fn = cm.idGen;

  test('什么参数都不传', () => {
    const id = fn();
    expect(id.next().value).toBe(0);
    expect(id.next().value).toBe(1);
    expect(id.next().value).toBe(2);
    expect(id.next(10).value).toBe(12);
    expect(id.next().value).toBe(13);
  });

  test('传init与step', () => {
    const id = fn(10, 2);
    expect(id.next().value).toBe(10);
    expect(id.next(3).value).toBe(13);
    expect(id.next(10).value).toBe(23);
    expect(id.next().value).toBe(25);
  });

  test('next第一次传值无效', () => {
    const id = fn();
    expect(id.next(11).value).toBe(0); // 第一次next传值无效,因为next只能传给下一个yield，而第一次之前没有yield
    expect(id.next().value).toBe(1);
    expect(id.next().value).toBe(2);
  });

  test('使用for of迭代', () => {
    const iter = fn();
    let curId = 0;
    for (const id of iter) {
      expect(id).toBe(curId++);
      if (id > 10) {
        iter.return(); // 使用Generator.prototype.return强制中断生成器
      }
    }
  });

  test('设置max', () => {
    const idGen = fn(0, 1, 3);
    const ids: number[] = [];
    for (const id of idGen) {
      ids.push(id);
    }

    expect(ids).toEqual([0, 1, 2]);
    expect(idGen.next()).toEqual({ done: true, value: undefined });
  });

  test('倒序生成', () => {
    const idGen = fn(2, -1, -1);
    const ids: number[] = [];
    for (const id of idGen) {
      ids.push(id);
    }

    expect(ids).toEqual([0, 1, 2].reverse());
    expect(idGen.next()).toEqual({ done: true, value: undefined });
  });
});

describe('lazy', () => {
  const fn = cm.lazy;
  test('base', async () => {
    const mock = jest.fn();

    const start = Date.now();
    let end = 0;
    fn()
      .do((done) => (mock('hello'), done()))
      .wait(10)
      .do(
        () =>
          new Promise<void>((res) => {
            mock('hello');
            res();
          }),
      )
      .wait(20)
      .do((done) => {
        mock('world');
        end = Date.now();
        done();
      });
    await sleep(50);
    expect(mock.mock.calls.length).toBe(3);
    expect(mock.mock.calls.map((i) => i[0])).toEqual(['hello', 'hello', 'world']);
    expect(end - start).toBeGreaterThanOrEqual(30);
  });
  test('promise中断', async () => {
    const mock = jest.fn();

    fn()
      .wait(10)
      .do(
        () =>
          new Promise(() => {
            // promise不resolve，那么后面的永远不会执行
            mock('hello');
          }),
      )
      .wait(20)
      .do((done) => {
        mock('world');
        done();
      });
    await sleep(50);
    expect(mock.mock.calls.length).toBe(1);
    expect(mock.mock.calls.map((i) => i[0])).toEqual(['hello']);
  });
  test('done中断', async () => {
    const mock = jest.fn();

    fn()
      .wait(10)
      // 不done的话，后面的永远不会执行
      .do(() => mock('hello'))
      .wait(20)
      .do((done) => {
        mock('world');
        done();
      });
    await sleep(50);
    expect(mock.mock.calls.length).toBe(1);
    expect(mock.mock.calls.map((i) => i[0])).toEqual(['hello']);
  });
  test('value chain', async () => {
    const mock = jest.fn();

    fn()
      .wait(10)
      .do((done) => done('hello '))
      .wait(20)
      .do((done, value) => done(value + 'world'))
      .do((_, value) => Promise.resolve(value + ' foo bar'))
      .do((done, value) => {
        mock(value);
        done();
      })
      .do((_, value) => mock(value));
    await sleep(50);
    expect(mock.mock.calls.length).toBe(2);
    expect(mock.mock.calls.map((i) => i[0])).toEqual(['hello world foo bar', undefined]);
  });
});

test('swap', () => {
  const fn = cm.swap;

  expect(fn({ a: 1, b: 2 }, 'a', 'b')).toEqual({ b: 1, a: 2 });
  expect(fn({ a: 1, b: 2 }, 'a', 'c' as any)).toEqual({ c: 1, b: 2, a: undefined });

  expect(fn([1, 2], 1, 0)).toEqual([2, 1]);
  expect(fn([1, 2], 1, 2)).toEqual([1, undefined, 2]);
});
