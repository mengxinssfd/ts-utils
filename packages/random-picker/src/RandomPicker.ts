import type { Tuple } from '@mxssfd/types';
import type { OptionWeightsTuple, OptionList, WeightFn, WeightsFnItem, WeightsItem } from './types';
import { OptionsPool } from './OptionsPool';

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
 * picker.resetWithSeed();
 *
 */
export class RandomPicker<T> {
  /**
   * 选项池
   */
  protected pool!: OptionsPool<T>;
  /**
   * 全部选项，包含后面option添加的
   */
  protected optionList: OptionList<T> = [];

  constructor(
    /**
     * 初始选项，不包含后面option添加的
     */
    protected readonly seed: Array<OptionWeightsTuple<T> | T> = [],
  ) {
    // 禁止在new RandomPicker([1,2,3])后继续对seed数组增减，
    // 如果需要增减那么直接再new一个实例就好
    this.seed = seed.slice();

    this.handleSeed();
    this.refreshPool();
  }

  /**
   * 刷新选项池
   * @protected
   */
  protected refreshPool(options = this.optionList): void {
    this.pool = new OptionsPool(options);
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
   * 添加单个选项，如果需要添加多个则推荐使用options
   * @param option 选项
   * @param weights 权重
   * @return {this}
   */
  option(option: T, weights: number | WeightFn): this {
    this.optionList.push({ weights, option } as WeightsFnItem<T> | WeightsItem<T>);
    this.refreshPool();
    return this;
  }
  /**
   * 添加多个选项
   * @param options [[选项, 权重], [选项, 权重], ...]
   * @return {this}
   */
  options(options: OptionWeightsTuple<T>[]): this {
    options.forEach(([option, weights]) =>
      this.optionList.push({ weights, option } as WeightsFnItem<T> | WeightsItem<T>),
    );
    this.refreshPool();
    return this;
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
      return this.pool.randomOption;
    }

    return Array(count)
      .fill(void 0)
      .map(() => this.pool.randomOption);
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

    if (count === 1) {
      const option = this.pool.randomOption;
      this.pool.remove(option);
      return option;
    }

    return Array(Math.min(count, this.poolLen))
      .fill(void 0)
      .map(() => {
        const option = this.pool.randomOption;
        this.pool.remove(option);
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
    this.refreshPool();
    return true;
  }

  /**
   * 重置选项池：通过初始选项重置所有选项，并重置选项池，如果有需要可以先export备份
   * @return {this}
   */
  resetWithSeed(): this {
    this.handleSeed();
    this.refreshPool();
    return this;
  }

  /**
   * 重置选项池：恢复被take移除的选项
   * @return {this}
   */
  reset(): this {
    this.refreshPool();
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
    return this.pool.len;
  }

  /**
   * 获取选项池剩余的选项
   */
  get poolOptions(): T[] {
    return this.pool.options;
  }

  /**
   * 获取选项选中的几率
   * @param  option 选项
   * @return {number} 几率
   */
  rateOf(option: T): number {
    return this.pool.rateOf(option);
  }

  /**
   * 导出所有选项
   * @returns 由option、weights组成的元组所组成的选项数组，可以用于new RandomPicker(picker.export())
   */
  export(): OptionWeightsTuple<T>[] {
    return this.optionList.map((item) => [item.option, item.weights]);
  }

  /**
   * 导出选项池的所有选项
   * @returns 由option、weights组成的元组所组成的选项数组，可以用于new RandomPicker(picker.export())
   */
  exportPool(): OptionWeightsTuple<T>[] {
    return this.pool.export();
  }
}
