import CalcChain from '../src/CalcChain';

test('Calc', () => {
  const Calc = CalcChain;
  // 0.1 + 0.2 = 0.30000000000000004
  expect(0.1 + 0.2).not.toBe(0.3);
  const c = new Calc(1);

  // 0.3 - 0.1 = 0.19999999999999998
  expect(0.3 - 0.1).not.toBe(0.2);
  expect(Calc.init(0.3).minus(0.1).value).toBe(0.2);
  // 0.2 * 0.1 = 0.020000000000000004
  expect(0.2 * 0.1).not.toBe(0.02);
  expect(Calc.init(0.2).times(0.1).value).toBe(0.02);
  // 0.3 / 0.1 = 2.9999999999999996
  expect(0.3 / 0.1).not.toBe(3);
  expect(Calc.init(0.3).divide(0.1).value).toBe(3);

  // 100 / 10 + 5 - 2 = 13
  expect(c.times(100).divide(10).plus(5).minus(2).value).toBe(13);

  // 0.3 - 0.1 = 0.19999999999999998
  expect(0.3 - 0.1).not.toBe(0.2);
  expect(Calc.init(0.3)['-'](0.1).value).toBe(0.2);
  // 0.2 * 0.1 = 0.020000000000000004
  expect(0.2 * 0.1).not.toBe(0.02);
  expect(Calc.init(0.2)['*'](0.1).value).toBe(0.02);
  // 0.3 / 0.1 = 2.9999999999999996
  expect(0.3 / 0.1).not.toBe(3);
  expect(Calc.init(0.3)['/'](0.1).value).toBe(3);

  c.reset();
  // 100 / 10 + 5 - 2 = 13
  expect(c['*'](100)['/'](10)['+'](5)['-'](2).value).toBe(13);
  c.value = 0.1;
  // 0.1 + 0.2 - 0.1 = 0.2
  expect(c['+'](0.2)['-'](0.1).value).toBe(0.2);

  //  100 - 20 * 2 = 60
  expect(Calc.init(20)['*'](2).by(100, '-').value).toBe(60);

  // 100 - 10 - 20 - 30 - 100 = -60
  expect(Calc.init(100)['-'](...[10, 20, 30, 100]).value).toBe(-60);
  expect(Calc.init(100)['-'](...[10, 20, 30, 100]).value).toBe(-60);
  expect(Calc.init(100)['-'](10, 20, 30, 100).value).toBe(-60);
  expect(Calc.init(100)['-'](...[10, 20], 30, 100).value).toBe(-60);
  expect(Calc.init(100)['-'](...[10, 20, 30], 100).value).toBe(-60);
  expect(
    Calc.init(100)
      ['-'](...[10, 20, 30], 100)
      .valueOf(),
  ).toBe(-60);
});
