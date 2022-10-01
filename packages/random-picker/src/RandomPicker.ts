import type { Tuple } from '@mxssfd/types';
import type { OptionWeightsTuple, Seed, WeightFn } from './types';
import { OptionsPool } from './OptionsPool';
import { OptionsStore } from './OptionsStore';

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
   * 选项存储
   * 全部选项，包含后面option添加的
   */
  protected store!: OptionsStore<T>;

  constructor(
    /**
     * 初始选项，不包含后面option添加的
     */
    protected readonly seed: Seed<T> = [],
  ) {
    // 禁止在new RandomPicker([1,2,3])后继续对seed数组增减，
    // 如果需要增减那么直接再new一个实例就好
    this.seed = seed.slice();

    this.refreshStore();
    this.refreshPool();
  }

  /**
   * 刷新选项存储
   * @protected
   */
  protected refreshStore(): void {
    this.store = new OptionsStore(this.seed);
  }

  /**
   * 刷新选项池
   * @protected
   */
  protected refreshPool(): void {
    this.pool = new OptionsPool(this.store.list);
  }

  /**
   * 添加单个选项，如果需要添加多个则推荐使用options
   * @param option 选项
   * @param [weights = 1] 权重
   * @return {this}
   */
  option(option: T, weights: number | WeightFn = 1): this {
    return this.options([[option, weights]]);
  }
  /**
   * 添加多个选项
   * @param options [[选项, 权重], [选项, 权重], ...]
   * @return {this}
   */
  options(options: Seed<T>): this {
    this.store.add(options);
    this.refreshPool();
    return this;
  }

  /**
   * 获取随机可能会重复的1个选项
   *
   * 会被take影响到
   */
  pick(): T | null;
  /**
   * @see {@link RandomPicker.pick}
   */
  pick<N extends 1>(count: N): T | null;
  /**
   * 获取随机可能会重复的count个选项
   *
   * @see {@link RandomPicker.pick}
   */
  pick<N extends number>(count: N): Tuple<T | null, N>;
  pick(count = 1): T[] | T | null {
    if (count === 1) {
      return this.pool.randomOption;
    }

    return Array(count)
      .fill(void 0)
      .map(() => this.pool.randomOption) as T[];
  }

  /**
   * 获取随机不会重复的1个选项。
   *
   * 取出以后不能在次获取，除非reset
   *
   * 会影响到pick
   */
  take(): T | null;
  /**
   * @see {@link RandomPicker.take}
   */
  take<N extends 1>(count: N): T | null;
  /**
   * 获取随机不会重复的count个选项
   * @see {@link RandomPicker.take}
   */
  take<N extends number>(count: N): Tuple<T | null, N>;
  take(count = 1): null | T | (T | null)[] {
    const next = () => {
      const option = this.pool.randomOption;
      if (option === null) return option;
      this.pool.remove(option);
      return option;
    };
    if (count === 1) {
      return next();
    }

    return Array(Math.min(count, this.poolLen))
      .fill(null)
      .map(() => next());
  }

  /**
   * 移除一个选项
   * @param option 选项
   * @return 操作成功或失败
   */
  remove(option: T): boolean {
    const flag = this.store.remove(option);
    flag && this.refreshPool();
    return flag;
  }

  /**
   * 重置选项池：通过初始选项重置所有选项，并重置选项池，如果有需要可以先export备份
   * @return {this}
   */
  resetWithSeed(): this {
    this.refreshStore();
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
    return this.store.len;
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
   * @return 几率：100分满值
   */
  rateOf(option: T): number {
    return this.pool.rateOf(option);
  }

  /**
   * 导出所有选项
   * @returns 由option、weights组成的元组所组成的选项数组，可以用于new RandomPicker(picker.export())
   */
  export(): OptionWeightsTuple<T>[] {
    return this.store.export();
  }

  /**
   * 导出选项池的所有选项
   * @returns 由option、weights组成的元组所组成的选项数组，可以用于new RandomPicker(picker.export())
   */
  exportPool(): OptionWeightsTuple<T>[] {
    return this.pool.export();
  }
}
