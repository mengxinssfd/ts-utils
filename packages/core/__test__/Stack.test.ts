import * as Cache from '../src/Stack';

function testCache(clazz: typeof Cache.Stack) {
  const c = new clazz();
  const objKey = {};
  const fnKey = () => 0;
  const arrKey: never[] = [];
  const symbolKey = Symbol('test');
  // eslint-disable-next-line no-sparse-arrays
  const arr = [
    ,
    0,
    undefined,
    NaN,
    null,
    fnKey,
    true,
    false,
    arrKey,
    '',
    ' ',
    objKey,
    symbolKey,
    /test/,
  ];
  arr.forEach((i) => {
    c.set(i);
    c.set(i);
    c.set(i);
    c.set(i);
    c.set(i);
  });
  expect(c.size).toBe(arr.length - 1);
  arr.forEach((i) => {
    expect(c.has(i)).toBeTruthy();
  });
  expect(c.has(NaN)).toBeTruthy();
  expect(c.has('0')).toBeFalsy();
  expect(c.has({})).toBeFalsy();
  expect(c.has([])).toBeFalsy();
  expect(c.has(Function)).toBeFalsy();
  expect(c.has(Symbol('test'))).toBeFalsy();
  expect(c.has(() => 0)).toBeFalsy();

  c.clear();
  expect(c.size).toBe(0);
}

test('ListCache', function () {
  const fn = Cache.ListCache;
  testCache(fn as any);
});
test('SetCache', function () {
  const fn = Cache.SetCache;
  testCache(fn);
});
