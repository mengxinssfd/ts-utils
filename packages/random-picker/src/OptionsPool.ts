import { OptionList, OptionWeightsTuple, PoolItem, WeightsFnItem } from './types';

/**
 * 维护一个选项池
 */
export class OptionsPool<T> {
  /**
   * 选项池
   * @protected
   */
  protected pool: PoolItem<T>[] = [];
  constructor(options: OptionList<T>) {
    this.generatePool(options);
  }

  /**
   * 计算权重
   * @protected
   */
  protected computeWeights(list: OptionList<T>): [number, number] {
    // 静态权重累计
    const [staticWeights, fnList] = list.reduce(
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
    return [
      fnList.reduce((prev, cur) => {
        return prev + cur.weights(staticWeights);
      }, staticWeights),
      staticWeights,
    ];
  }
  /**
   * 生成选项池
   * 计算各个选项的所占的百分比及所处位置，并生成选项池
   * @protected
   */
  protected generatePool(list: OptionList<T>): void {
    // 计算权重
    const [weights, staticWeights] = this.computeWeights(list);

    // 生成选项池
    let reduceWeight = 0;
    this.pool = list.map((item) => {
      const weight = typeof item.weights === 'number' ? item.weights : item.weights(staticWeights);
      reduceWeight += weight;
      return { ...item, range: ~~((reduceWeight / weights) * 1000_000) / 10_000 };
    });
  }
  /**
   * 从选项池中获取随机选项
   * @protected
   */
  get randomOption(): T {
    const range = ~~(Math.random() * 1000_000) / 10_000;
    return (this.pool.find((item) => item.range > range) as PoolItem<T>).option;
  }

  /**
   * 从选项池中移除一个选项，需要根据选项重新计算所有选项的选中几率
   */
  remove(option: T): void {
    const list = this.pool.filter((it) => it.option !== option);
    this.generatePool(list);
  }

  /**
   * 选项池剩余选项数量
   */
  get len(): number {
    return this.pool.length;
  }

  /**
   * 选项池剩余的选项
   */
  get options(): T[] {
    return this.pool.map((item) => item.option);
  }

  /**
   * 获取选项选中的几率
   * @param  option 选项
   * @return {number} 几率
   */
  rateOf(option: T): number {
    const pool = this.pool;
    const index = pool.findIndex((it) => it.option === option);
    if (index === -1) return 0;
    return pool[index].range - (pool[index - 1]?.range ?? 0);
  }

  /**
   * 导出选项池剩余的选项
   * @return 由option、weights组成的元组所组成的选项数组，可以用于new RandomPicker(picker.export())
   */
  export(): OptionWeightsTuple<T>[] {
    return this.pool.map((item) => [item.option, item.weights]);
  }
}
