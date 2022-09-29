import type { Tuple } from '@mxssfd/types';

type WeightFn = (weightTotal: number) => number;
type RangeItem<T> = {
  range: number;
} & (WeightFnItem<T> | WeightItem<T>);

interface WeightItem<T> {
  weights: number;
  item: T;
}
interface WeightFnItem<T> {
  weights: WeightFn;
  item: T;
}
// TODO 可独立出来
/**
 * 随机挑选组件
 *
 * @example
 * const picker = new RandomPicker([1,2,3,4,5]);
 *
 * picker.pick() // 返回1,2,3,4,5中的1个
 * picker.pick(2) // 返回1,2,3,4,5中的2个
 *
 * picker.take() // 返回1,2,3,4,5中的1个，之后pick或take可供选择的只剩下4个
 * picker.take(2) // 返回1,2,3,4,5中的2个，之后pick或take可供选择的只剩下2个
 *
 */
export class RandomPicker<T> {
  protected rangeList: RangeItem<T>[] = [];
  protected list: Array<WeightFnItem<T> | WeightItem<T>> = [];

  constructor(protected readonly seed: [item: T, weights: number | WeightFn][] | T[] = []) {
    this.handleSeed();
    this.computeRange();
  }

  protected handleSeed() {
    this.list = this.seed.map((item) => {
      return Array.isArray(item) ? { item: item[0], weights: item[1] ?? 1 } : { item, weights: 1 };
    }) as Array<WeightFnItem<T> | WeightItem<T>>;
  }

  protected computeRange(list = this.list) {
    const [weights, fnList] = list.reduce(
      ([weightTotal, fnList], cur) => {
        if (typeof cur.weights === 'number') {
          return [weightTotal + cur.weights, fnList];
        }
        fnList.push(cur as WeightFnItem<T>);
        return [weightTotal, fnList];
      },
      [0, [] as WeightFnItem<T>[]],
    );
    // WeightFn如果返回的是百分比，那么这个百分比是相对于固定weight的累积百分比，
    // 也就是说动态百分比是相对于静态百分比的
    const weightTotal = fnList.reduce((prev, cur) => {
      return prev + cur.weights(weights);
    }, weights);
    let reduceWeight = 0;
    this.rangeList = list.map((item) => {
      const weight = typeof item.weights === 'number' ? item.weights : item.weights(weightTotal);
      reduceWeight += weight;
      return { ...item, range: ~~((reduceWeight / weightTotal) * 1000_000) / 10_000 };
    });
  }

  option(item: T, weights: number | WeightFn) {
    this.list.push({ weights, item } as WeightFnItem<T> | WeightItem<T>);
    this.computeRange();
  }

  protected getRandomItem(list = this.rangeList): T {
    const range = ~~(Math.random() * 1000_000) / 10_000;
    return (list.find((item) => item.range > range) as RangeItem<T>).item;
  }

  /**
   * 获取随机可能会重复的count个item
   *
   * 会被take影响到
   *
   * @param  [count=1]
   */
  pick<N extends 1>(count: N): T;
  pick<N extends number>(count: N): Tuple<T, N>;
  pick(count = 1) {
    if (count === 1) {
      return this.getRandomItem();
    }

    return Array(count)
      .fill(void 0)
      .map(() => this.getRandomItem());
  }

  /**
   * 获取随机不会重复的count个item
   *
   * 取出以后不能在次获取，除非reset
   *
   * 会影响到pick
   * @param [count=1]
   */
  take<N extends 1>(count: N): T | void;
  take<N extends number>(count: N): Tuple<T | void, N>;
  take(count = 1): void | T | T[] {
    if (!this.rangeLen) return;
    const removeItem = (item: T, list = this.rangeList) => {
      list = list.filter((it) => it.item !== item);
      this.computeRange(list);
    };
    if (count === 1) {
      const item = this.getRandomItem();
      removeItem(item);
      return item;
    }

    return Array(Math.min(count, this.rangeLen))
      .fill(void 0)
      .map(() => {
        const item = this.getRandomItem();
        removeItem(item);
        return item;
      });
  }

  remove(item: T): boolean {
    const index = this.list.findIndex((it) => it.item === item);
    if (index === -1) return false;
    this.list.splice(index, 1);
    this.computeRange();
    return true;
  }

  resetBySeed(): this {
    this.handleSeed();
    this.computeRange();
    return this;
  }

  reset(): this {
    this.computeRange();
    return this;
  }

  get len(): number {
    return this.list.length;
  }
  get rangeLen(): number {
    return this.rangeList.length;
  }
}
