import type { Tuple } from '@mxssfd/types';
import type { PoolItem, WeightFn, WeightsFnItem, WeightsItem, OptionList } from './types';

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
 * picker.option(6); lottery-pool
 *
 * // 恢复初始选项，去除picker.option方法添加的选项
 * picker.resetBySeed();
 *
 */
export class RandomPicker<T> {
  /**
   * 选项池
   */
  protected optionsPool: PoolItem<T>[] = [];
  /**
   * 全部选项，包含后面option添加的
   */
  protected optionList: OptionList<T> = [];

  constructor(
    /**
     * 初始选项，不包含后面option添加的
     */
    protected readonly seed: [option: T, weights: number | WeightFn][] | T[] = [],
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
    this.optionList = this.seed.map((item) => {
      return Array.isArray(item)
        ? { option: item[0], weights: item[1] ?? 1 }
        : { item, weights: 1 };
    }) as Array<WeightsFnItem<T> | WeightsItem<T>>;
  }

  /**
   * 计算各个选项的所占的百分比及所处位置，并生成选项池
   * @protected
   */
  protected generateOptionsPool(list = this.optionList): void {
    // 计算百分比
    const [weights, fnList] = list.reduce(
      ([weightTotal, fnList], cur) => {
        if (typeof cur.weights === 'number') {
          return [weightTotal + cur.weights, fnList];
        }
        fnList.push(cur as WeightsFnItem<T>);
        return [weightTotal, fnList];
      },
      [0, [] as WeightsFnItem<T>[]],
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
   * 添加单个选项，如果需要添加多个则推荐使用options
   * @param option 选项
   * @param weights 权重
   * @return {this}
   */
  option(option: T, weights: number | WeightFn): this {
    this.optionList.push({ weights, option } as WeightsFnItem<T> | WeightsItem<T>);
    this.generateOptionsPool();
    return this;
  }
  /**
   * 添加多个选项
   * @param options [[选项, 权重], [选项, 权重], ...]
   * @return {this}
   */
  options(options: Array<[option: T, weights: number | WeightFn]>): this {
    options.forEach(([option, weights]) =>
      this.optionList.push({ weights, option } as WeightsFnItem<T> | WeightsItem<T>),
    );
    this.generateOptionsPool();
    return this;
  }

  /**
   * 从选项池中获取随机选项
   * @protected
   */
  protected getRandomOption(): T {
    const range = ~~(Math.random() * 1000_000) / 10_000;
    return (this.optionsPool.find((item) => item.range > range) as PoolItem<T>).option;
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
      return this.getRandomOption();
    }

    return Array(count)
      .fill(void 0)
      .map(() => this.getRandomOption());
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
    const removeOption = (option: T, list = this.optionsPool) => {
      list = list.filter((it) => it.option !== option);
      this.generateOptionsPool(list);
    };
    if (count === 1) {
      const option = this.getRandomOption();
      removeOption(option);
      return option;
    }

    return Array(Math.min(count, this.poolLen))
      .fill(void 0)
      .map(() => {
        const option = this.getRandomOption();
        removeOption(option);
        return option;
      });
  }

  /**
   * 移除一个选项
   * @param option 选项
   * @return 操作成功或失败
   */
  remove(option: T): boolean {
    const index = this.optionList.findIndex((it) => it.option === option);
    if (index === -1) return false;
    this.optionList.splice(index, 1);
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
    return this.optionList.length;
  }

  /**
   * @return 选项池数组长度
   */
  get poolLen(): number {
    return this.optionsPool.length;
  }

  /**
   * 获取选项池剩余的选项
   */
  getPoolOptions(): T[] {
    return this.optionsPool.map((item) => item.option);
  }

  /**
   * 获取选项选中的几率
   * @param  option 选项
   * @return {number} 几率
   */
  getOptionRate(option: T): number {
    const pool = this.optionsPool;
    const index = pool.findIndex((it) => it.option === option);
    if (index === -1) return 0;
    return pool[index].range - (pool[index - 1]?.range ?? 0);
  }

  /**
   * 导出所有选项
   * @returns 由option、weights组成的元组所组成的选项数组，可以用于new RandomPicker(picker.export())
   */
  export(): [option: T, weights: number | WeightFn][] {
    return this.optionList.map((item) => [item.option, item.weights]);
  }

  /**
   * 导出选项池的所有选项
   * @returns 由option、weights组成的元组所组成的选项数组，可以用于new RandomPicker(picker.export())
   */
  exportPool(): [option: T, weights: number | WeightFn][] {
    return this.optionsPool.map((item) => [item.option, item.weights]);
  }
}
