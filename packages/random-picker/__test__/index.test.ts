import { RandomPicker } from '../src';

describe('random-picker', function () {
  test('calc rate', () => {
    const picker = new RandomPicker([
      [1, 1],
      [2, 39],
      [3, 60],
    ]);
    // 样本越大越接近实际几率
    const count = 1000;
    const takes = [...Array(count).keys()].reduce((result) => {
      result.push(picker.take(3));
      picker.reset();
      return result;
    }, [] as any[]);
    const rate = takes.filter((item) => item[0] === 3).length / count;
    expect(picker.rateOf(3)).toBe(60);
    expect(rate > 0.5 && rate < 0.7).toBeTruthy();
    picker.reset();

    const rates = picker.pick(count as number /* 让编辑器不要计算tuple */).reduce(
      (rate, cur) => {
        rate[cur - 1]++;
        return rate;
      },
      [0, 0, 0],
    );
    // 1
    expect(rates[0] > 0 && rates[0] < 100).toBeTruthy();
    // 2
    expect(rates[1] > 300 && rates[0] < 500).toBeTruthy();
    // 3
    expect(rates[2] > 500 && rates[0] < 700).toBeTruthy();
  });
  test('take/reset/len/poolLen', () => {
    const seed = [1, 2, 3];
    const picker = new RandomPicker(seed);

    expect(seed.includes(picker.take() as number)).toBeTruthy();
    expect(picker.len).toBe(3);
    expect(picker.poolLen).toBe(2);

    expect(seed.includes(picker.take() as number)).toBeTruthy();
    expect(picker.len).toBe(3);
    expect(picker.poolLen).toBe(1);

    expect(seed.includes(picker.take() as number)).toBeTruthy();
    expect(picker.len).toBe(3);
    expect(picker.poolLen).toBe(0);

    expect(seed.includes(picker.take() as number)).toBeFalsy();
    expect(picker.take()).toBeUndefined();
    expect(picker.len).toBe(3);
    expect(picker.poolLen).toBe(0);

    picker.reset();
    expect(seed.includes(picker.take() as number)).toBeTruthy();
    expect(picker.len).toBe(3);
    expect(picker.poolLen).toBe(2);
  });
  test('export/exportPool/take', () => {
    const seed = [1, 2, 3];
    const picker = new RandomPicker(seed);

    // export as seed
    const picker2 = new RandomPicker(picker.export());
    const takes = picker2.take(seed.length);
    expect(takes.sort()).toEqual(takes);
    expect(picker.export()).toEqual(seed.map((item) => [item, 1]));

    // reset
    picker2.reset();
    const takes2 = picker2.take(seed.length - 1) as number[];
    const find = seed.find((item) => !takes2.includes(item));
    // export pool options
    expect(picker2.exportPool()).toEqual([[find, 1]]);
  });
  test('export/take/option/options/resetWithSeed/remove/poolOptions', () => {
    const seed = [1, 2, 3];
    const picker = new RandomPicker(seed);

    picker.option(4);
    expect(picker.export()).toEqual([...seed.map((item) => [item, 1]), [4, 1]]);

    picker.option(5);
    expect(picker.export()).toEqual([...seed.map((item) => [item, 1]), [4, 1], [5, 1]]);

    // resetWithSeed
    picker.resetWithSeed();
    expect(picker.export()).toEqual([...seed.map((item) => [item, 1])]);

    picker.options([4, 5]);
    expect(picker.export()).toEqual([...seed.map((item) => [item, 1]), [4, 1], [5, 1]]);

    // remove
    expect(picker.remove(6)).toBeFalsy();
    expect(picker.export()).toEqual([...seed.map((item) => [item, 1]), [4, 1], [5, 1]]);

    expect(picker.remove(4)).toBeTruthy();
    expect(picker.remove(3)).toBeTruthy();
    expect(picker.export()).toEqual([
      [1, 1],
      [2, 1],
      [5, 1],
    ]);

    expect(picker.poolOptions).toEqual([1, 2, 5]);

    // reset不会恢复已删除的选项3
    picker.reset();
    expect(picker.poolOptions).toEqual([1, 2, 5]);

    // resetWithSeed会恢复已删除的选项3，后面添加的seed push的10不会存在
    // seed push
    seed.push(10);
    expect(picker.poolOptions).toEqual([1, 2, 5]);
    picker.resetWithSeed();
    expect(picker.poolOptions).toEqual([1, 2, 3]);
  });

  test('weightFn/rateOf/pick', () => {
    // 1个等于静态权重的权重选中几率是50%
    const picker = new RandomPicker([1, 2, [3, (weights) => weights]]);

    expect(picker.rateOf(3)).toBe(50);
    expect(picker.rateOf(1)).toBe(25);
    expect(picker.rateOf(2)).toBe(25);

    expect(picker.rateOf(5)).toBe(0);

    // 两个相同的静态权重会三分，选中几率为33%
    picker.option(5, (weightTotal) => weightTotal);

    expect(picker.rateOf(5)).toBe(33.3334);
    expect(picker.rateOf(3)).toBe(33.3333);
    expect(picker.rateOf(1)).toBe(16.6666);
    expect(picker.rateOf(2)).toBe(16.6667);
  });
  test('edge', () => {
    // empty seed
    const p = new RandomPicker();
    p.option(1);
    expect(p.rateOf(1)).toBe(100);
    expect(p.pick()).toBe(1);

    // empty options rateOf
    p.resetWithSeed();
    expect(p.rateOf(1)).toBe(0);

    // tuple empty weights
    const p2 = new RandomPicker([1, [2]]);
    expect(p2.rateOf(1)).toBe(50);
    expect(p2.rateOf(2)).toBe(50);
  });
});
