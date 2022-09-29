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

/**
 * 工具类库：从选项池中随机挑选n个选项
 *
 * @example
 * const picker = new RandomPicker([1, 2, 3, 4, 5]);
 *
 * // 从选项池中随机挑选1个选项
 * picker.pick(); // 返回1,2,3,4,5中的1个
 * // 从选项池中随机挑选2个选项
 * picker.pick(2); // 返回1,2,3,4,5中的2个,可供选则的有5个，多个可能会出现重复的
 *
 * // 从中随机挑选出选项。每拿走一个选项，都会对剩余的选项重新计算选中几率，可选数量减1
 * picker.take(); // 返回1,2,3,4,5中的1个，之后pick或take可供选择的只剩下4个
 * picker.take(2); // 返回1,2,3,4,5中的2个，之后pick或take可供选择的只剩下2个，多个不会出现重复的
 *
 * // 重置后，会恢复选项池
 * picker.reset();
 *
 * // 添加选项
 * picker.option(6);
 *
 * // 恢复初始选项，去除picker.option方法添加的选项
 * picker.resetBySeed();
 *
 */
export class RandomPicker<T> {
  /**
   * 选项池
   */
  protected optionsPool: RangeItem<T>[] = [];
  /**
   * 全部选项，包含后面option添加的
   */
  protected options: Array<WeightFnItem<T> | WeightItem<T>> = [];

  constructor(
    /**
     * 初始选项，不包含后面option添加的
     */
    protected readonly seed: [item: T, weights: number | WeightFn][] | T[] = [],
  ) {
    // 禁止在new RandomPicker([1,2,3])后继续对seed数组增减，
    // 如果需要增减那么直接再new一个实例就好
    this.seed = seed.slice();

    this.handleSeed();
    this.generateOptionsPool();
  }

  /**
   * 转换初始选项为普通选项
   * @protected
   */
  protected handleSeed(): void {
    this.options = this.seed.map((item) => {
      return Array.isArray(item) ? { item: item[0], weights: item[1] ?? 1 } : { item, weights: 1 };
    }) as Array<WeightFnItem<T> | WeightItem<T>>;
  }

  /**
   * 计算各个选项的所占的百分比及所处位置，并生成选项池
   * @protected
   */
  protected generateOptionsPool(list = this.options): void {
    // 计算百分比
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

    // 生成选项池
    let reduceWeight = 0;
    this.optionsPool = list.map((item) => {
      const weight = typeof item.weights === 'number' ? item.weights : item.weights(weightTotal);
      reduceWeight += weight;
      return { ...item, range: ~~((reduceWeight / weightTotal) * 1000_000) / 10_000 };
    });
  }

  /**
   * 添加选项
   * @param item 选项
   * @param weights 权重
   * @return {this}
   */
  option(item: T, weights: number | WeightFn): this {
    this.options.push({ weights, item } as WeightFnItem<T> | WeightItem<T>);
    this.generateOptionsPool();
    return this;
  }

  protected getRandomItem(list = this.optionsPool): T {
    const range = ~~(Math.random() * 1000_000) / 10_000;
    return (list.find((item) => item.range > range) as RangeItem<T>).item;
  }

  /**
   * 获取随机可能会重复的1个选项
   *
   * 会被take影响到
   */
  pick(): T;
  /**
   * @see {@link RandomPicker.pick}
   */
  pick<N extends 1>(count: N): T;
  /**
   * 获取随机可能会重复的count个选项
   *
   * @see {@link RandomPicker.pick}
   */
  pick<N extends number>(count: N): Tuple<T, N>;
  pick(count = 1): T[] | T {
    if (count === 1) {
      return this.getRandomItem();
    }

    return Array(count)
      .fill(void 0)
      .map(() => this.getRandomItem());
  }

  /**
   * 获取随机不会重复的1个选项。
   *
   * 取出以后不能在次获取，除非reset
   *
   * 会影响到pick
   */
  take(): T | void;
  /**
   * @see {@link RandomPicker.take}
   */
  take<N extends 1>(count: N): T | void;
  /**
   * 获取随机不会重复的count个选项
   * @see {@link RandomPicker.take}
   */
  take<N extends number>(count: N): Tuple<T | void, N>;
  take(count = 1): void | T | T[] {
    if (!this.poolLen) return;
    const removeItem = (item: T, list = this.optionsPool) => {
      list = list.filter((it) => it.item !== item);
      this.generateOptionsPool(list);
    };
    if (count === 1) {
      const item = this.getRandomItem();
      removeItem(item);
      return item;
    }

    return Array(Math.min(count, this.poolLen))
      .fill(void 0)
      .map(() => {
        const item = this.getRandomItem();
        removeItem(item);
        return item;
      });
  }

  /**
   * 移除一个选项
   * @param item
   * @return 操作成功或失败
   */
  remove(item: T): boolean {
    const index = this.options.findIndex((it) => it.item === item);
    if (index === -1) return false;
    this.options.splice(index, 1);
    this.generateOptionsPool();
    return true;
  }

  /**
   * 重置选项池：通过初始选项重置所有选项，并重置选项池，如果有需要可以先export备份
   * @return {this}
   */
  resetBySeed(): this {
    this.handleSeed();
    this.generateOptionsPool();
    return this;
  }

  /**
   * 重置选项池：恢复被take移除的选项
   * @return {this}
   */
  reset(): this {
    this.generateOptionsPool();
    return this;
  }

  /**
   * @return 选项数组长度
   */
  get len(): number {
    return this.options.length;
  }

  /**
   * @return 选项池数组长度
   */
  get poolLen(): number {
    return this.optionsPool.length;
  }

  /**
   * @returns 由item、weights组成的元组所组成的选项数组，可以用于new RandomPicker(picker.export())
   */
  export(): [item: T, weights: number | WeightFn][] {
    return this.options.map((item) => [item.item, item.weights]);
  }
}
