import type { OptionList, OptionListItem, OptionWeightsTuple, Seed } from './types';

/**
 * 选项存储类
 */
export class OptionsStore<T> {
  /**
   * 存储所有选项的列表
   */
  list: OptionList<T> = [];

  constructor(options: Seed<T>) {
    this.list = this.transformOptions(options);
  }

  /**
   * 转换初始选项为普通选项
   * @protected
   */
  protected transformOptions(options: Seed<T>): OptionList<T> {
    return options.map((item) => {
      if (!Array.isArray(item)) return { option: item, weights: 1 };

      const [option, weightsRaw] = item;
      // 空权重默认为1
      const weights = weightsRaw ?? 1;

      return { option, weights } as OptionListItem<T>;
    });
  }

  /**
   * 移除一个选项
   * @param option 选项
   * @return 操作成功或失败
   */
  remove(option: T): boolean {
    const index = this.list.findIndex((it) => it.option === option);
    if (index === -1) return false;
    this.list.splice(index, 1);
    return true;
  }

  /**
   * 添加选项
   */
  add(options: Seed<T>): void {
    this.list.push(...this.transformOptions(options));
  }

  /**
   * 导出所有选项
   * @returns 由option、weights组成的元组所组成的选项数组，可以用于new RandomPicker(picker.export())
   */
  export(): OptionWeightsTuple<T>[] {
    return this.list.map((item) => [item.option, item.weights]);
  }

  /**
   * @return 选项数组长度
   */
  get len(): number {
    return this.list.length;
  }
}
