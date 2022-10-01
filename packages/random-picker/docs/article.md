# 需求

设计一个随机选择器工具类库，适用于随机选择或者抽奖程序。

- 可随机选取单个/多个选项
- 可重复选取(pick)/非重复选取(take)选项
- 选项通过权重控制选中几率
- 可获取每个选项选中几率
- 可重置为 take 前选项
- 可重置为初始选项
- 后期添加单个/多个选项
- 可移除选项
- 导出全部/剩余选项

# 功能一览

## `pick` / `take`

随机选取单个/多个选项

### `pick`

从选项池中随机选中一个

```typescript
import { RandomPicker } from '@mxssfd/random-picker';

const picker = new RandomPicker([1, 2]);

// pick 1个
const v1 = picker.pick(); // 随机从1，2中选中一个，每个选项选中的几率是50%

// pick多个
const v2 = picker.pick(2); // 随机选中2个，可能会出现重复的
const v3 = picker.pick(10); // 随机选中10个，会一直在1，2之间选取
```

### `take`

从选项池中随机拿走一个

```typescript
import { RandomPicker } from '@mxssfd/random-picker';

const picker = new RandomPicker([1, 2]);

// take 1个
const v1 = picker.take(); // 随机从1，2中选中一个，每个选项选中的几率是50%

// take多个
const v2 = picker.take(2); // 随机选中2个，不会出现重复的
const v3 = picker.take(10); // 随机选中10个，但是最多只会返回两个，多了的会去掉

const v4 = picker.take(); // null。因为在上面已经取走了所有选项

const v5 = picker.pick(); // null。pick和take共享一个选项池，take拿走了以后，pick也会被影响。

// 如果需要再次pick或者take的话需要reset
picker.reset();

// 此时又可以pick/take了
const v6 = picker.pick(); // 1 | 2
const v7 = picker.take(); //
```

### 两者区别

|                                | `take` | `pick` |
| ------------------------------ | ------ | ------ |
| 可以选取一个                   | 是     | 是     |
| 可以选取多个                   | 是     | 是     |
| 选取多个时是否可能会重复选取   | 否     | 是     |
| 选取多个时是否可以超出可选数量 | 否     | 是     |
| 影响                           | `pick` | 无     |
| 是否会从选项池中移除           | 是     | 否     |

## 权重(`weights`)

```typescript
import { RandomPicker } from '@mxssfd/random-picker';

// 默认权重为1
const picker = new RandomPicker([1, 2]);

// 约等于
const picker2 = new RandomPicker([
  [1, 1], // [选项, 权重]
  [2, 1], // [选项, 权重]
]);
```

选项有权重的概念

注：权重(`weights`)不完全等于选中几率。

规则：

- 如果总共有 3 个选项，且权重都为 1 的选项，那么每个选中几率是 33%。
- 如果总共只有 1 个选项，且唯一选项权重为 1，那么选中几率是 100%。
- 如果总共有 2 个选项，第一个选项权重为 20，第二个权重为 80，那么选中几率依次为 20%、80%。
- 添加权重为 0 或者为负数的选项会抛出异常
- 如果有三个权重为 1 的选项，take 一个选项会刷新选项池，剩余两个的选中几率各为 50%，再次 take 一个，则唯一的一个选中几率是 100%
- 每额外添加、删除、take 一个选项，选项池内选项的选中几率都会重新计算

## `option`/`options` 添加选项

```typescript
import { RandomPicker } from '@mxssfd/random-picker';

const picker = new RandomPicker([1, 2]);

// 添加单个选项
picker.option(3); // 添加权重为1的选项3
picker.option(4, 2); // 添加选项3，并且设置权重为2
// 添加动态权重的选项33，该权重回调函数会在计算所有静态权重后调用，此时如果只有一个动态权重的话约等于50%
picker.option(33, (weights) => weights);

// 添加多个选项
picker.options([5, 6]); // 添加权重为1的选项5和6
picker.options([
  [7, 2],
  [8, 2],
]); // 添加权重为2的选项7和8
picker.options([[9], [10, (weights) => weight]]); // 添加权重为1的选项9和动态权限的选项10，此时的选项10和选项33选中几率为33.3333%，其他按权限计算各个选项选中几率
```

注意：如果添加选项前有用过 `take` 的话，调用 `option/options` 会自动刷新选项池，已经 `take` 过的选项会重新进入选项池

## `rateOf` 获取选项的选中几率

```typescript
import { RandomPicker } from '@mxssfd/random-picker';

const picker = new RandomPicker([1]);
console.log(picker.rateOf(1)); // 选中几率 100

picker.option(2);
console.log(picker.rateOf(1)); // 选中几率 50
console.log(picker.rateOf(2)); // 选中几率 50

picker.option(3, 2);
console.log(picker.rateOf(1)); // 选中几率 25
console.log(picker.rateOf(2)); // 选中几率 25
console.log(picker.rateOf(3)); // 选中几率 50

picker.option(4, (weightTotal) => weightTotal);
console.log(picker.rateOf(1)); // 选中几率 12.5
console.log(picker.rateOf(2)); // 选中几率 12.5
console.log(picker.rateOf(3)); // 选中几率 25
console.log(picker.rateOf(4)); // 选中几率 50

picker.option(5, (weightTotal) => weightTotal);
console.log(picker.rateOf(1)); // 选中几率 8.3333
console.log(picker.rateOf(2)); // 选中几率 8.3333
console.log(picker.rateOf(3)); // 选中几率 16.6667
console.log(picker.rateOf(4)); // 选中几率 33.3333
console.log(picker.rateOf(5)); // 选中几率 33.3334
```

## `remove` 移除选项

```typescript
import { RandomPicker } from '@mxssfd/random-picker';

const picker = new RandomPicker([1, 2, 3]);

picker.remove(1); // 此时会把选项1移除
```

注意：如果移除的选项不存在于 `seed `或者未备份的话，将不能恢复

## `reset`/`resetWithSeed` 重置选项池

### 使用 `reset`重置选项池

```typescript
import { RandomPicker } from '@mxssfd/random-picker';

const seed = [1, 2, 3];
const picker = new RandomPicker(seed);

// 当take 3次后，选项池就为空了，此时再take或pick都会返回null
picker.take(seed.length); //  [number,number,number]
picker.take(); // invalid null

// 重置选项池
picker.reset();
picker.take(); // 1 | 2 | 3

// 注意：不会重置remove过的选项
picker.reset();
picker.remove(1); // 移除选项1
picker.take(seed.length); //  [number,number]

picker.reset();
picker.take(seed.length); //  重置回去也是[number,number]

// option
picker.reset();
picker.option(5);
picker.take(seed.length); //  [number,number,number]

// 使用reset可以重置option/options添加的选项
picker.reset();
picker.take(seed.length); //  [number,number,number]

//
```

### 使用 `resetWithSeed`重置选项池

```typescript
import { RandomPicker } from '@mxssfd/random-picker';

const seed = [1, 2, 3];
const picker = new RandomPicker(seed);

// 当take 3次后，选项池就为空了，此时再take或pick都会返回null
picker.take(seed.length); //  [number,number,number]
picker.take(); // invalid null

// 重置选项池
picker.resetWithSeed();
picker.take(); // 1 | 2 | 3

// 注意：会重置remove过的选项
picker.resetWithSeed();
picker.remove(1); // 移除选项1
picker.take(seed.length); //  [number,number]

picker.resetWithSeed();
picker.take(seed.length); //  [number,number,number]

// option
picker.resetWithSeed();
picker.option(5);
picker.take(seed.length); //  [1 ｜ 2 ｜ 3 | 5, ...]

// 使用resetWithSeed会丢弃option/options添加的选项
picker.resetWithSeed();
picker.take(seed.length); //  [1 ｜ 2 ｜ 3 , ...]
```

### 两者区别

|                                   | `reset` | `resetWithSeed`                              |
| --------------------------------- | ------- | -------------------------------------------- |
| 恢复被 `take`的选项               | 是      | 是                                           |
| 重置 `option`/`options`添加的选项 | 是      | 否，会丢弃选项                               |
| 恢复被 `remove`的选项             | 否      | 如果是存在于 `seed`的选项被 `remove`会被恢复 |

## `export` / `exportPool` 导出选项

### `export`导出所有选项

```typescript
import { RandomPicker, Seed } from '@mxssfd/random-picker';
const seed: Seed<number> = [1, 2, [3, (weights: number) => weights]];
const picker = new RandomPicker(seed);

// export 导出所有选项
console.log(picker.export()); // [[1, 1], [2, 1], [3, (weights: number) => weights]]

// take过的的选项也会导出
picker.take(3);
console.log(picker.export()); // [[1, 1], [2, 1], [3, (weights: number) => weights]]

// 不会导出remove过的选项
picker.remove(3);
console.log(picker.export()); // [[1, 1], [2, 1]]
```

### `export`导出剩余选项

```typescript
import { RandomPicker, Seed } from '@mxssfd/random-picker';
const seed: Seed<number> = [1, 2, [3, (weights: number) => weights]];
const picker = new RandomPicker(seed);

// exportPool 导出剩余选项
console.log(picker.exportPool()); // [[1, 1], [2, 1], [3, (weights: number) => weights]]

// take过的选项不会导出
picker.take(3);
console.log(picker.exportPool()); // []

picker.reset();
// 不会导出remove过的选项
picker.remove(3);
console.log(picker.exportPool()); // [[1, 1], [2, 1]]
```

### 两者区别

|                          | `export`(导出未 `remove` 的所有选项) | `exportPool`(剩余可供选择的所有选项) |
| ------------------------ | ------------------------------------ | ------------------------------------ |
| 能导出 `take` 过的选项   | 是                                   | 否                                   |
| 能导出 `remove` 过的选项 | 是                                   | 否                                   |

## `poolOptions` 查看剩余选项

```typescript
import { RandomPicker } from '@mxssfd/random-picker';

const picker = new RandomPicker([1, 2, [3, 98]]);

picker.take(); // 3  98%几率会出现3

console.log(picker.poolOptions); // [1|2, 1|2]

picker.take();
console.log(picker.poolOptions); // [1|2]

picker.take();
console.log(picker.poolOptions); // []
```

## `len` / `poolLen` 查看选项数量

```typescript
import { RandomPicker } from '@mxssfd/random-picker';

const picker = new RandomPicker([1, 2, 3]);

// 初始都有3个
console.log(picker.len, picker.poolLen); // 3, 3

picker.take(2); // 拿走两个

console.log(picker.len, picker.poolLen); // 3, 1

picker.remove(3); // 移除3

console.log(picker.len, picker.poolLen); // 2, 2

picker.take(2); // 拿走两个

console.log(picker.len, picker.poolLen); // 2, 0
```

# 源码

在此就不一步步写了，直接一步到位上成品。  
不想复制粘贴的话也可以使用已经写好的`npm`库，直接`npm install @mxssfd/random-picker`

源码主要分成 5 个文件

## 1.`types.ts`

`types.ts`内部放一些`typescript`类型声明

```typescript
export type WeightFn = (weightTotal: number) => number;

/**
 * 静态权重
 */
export interface WeightsItem<T> {
  weights: number;
  option: T;
}

/**
 * 动态权重
 */
export interface WeightsFnItem<T> {
  weights: WeightFn;
  option: T;
}

/**
 * 选项池数组item
 */
export type PoolItem<T> = {
  range: number;
} & (WeightsFnItem<T> | WeightsItem<T>);

/**
 * 选项列表item
 */
export type OptionListItem<T> = WeightsFnItem<T> | WeightsItem<T>;
/**
 * 选项列表
 */
export type OptionList<T> = Array<OptionListItem<T>>;

/**
 * [option, weights] 元组
 */
export type OptionWeightsTuple<T> = [option: T, weights: number | WeightFn];

/**
 * Seed 数组
 */
export type Seed<T> = Array<OptionWeightsTuple<T> | T>;
```

## 2.`OptionsPool.ts`

`OptionsPool.ts`维护着选项池工具类

```typescript
import type { OptionList, OptionWeightsTuple, PoolItem, WeightsFnItem } from './types';

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
      }, staticWeights) || 1, // 总权重不能为0，当只有一个选项，且选项为动态权重的时候会有这种情况
      staticWeights || 1, // 静态权重不能为0
    ];
  }

  /**
   * 生成选项池
   * 计算各个选项的所占的百分比及所处位置，并生成选项池
   * @protected
   */
  protected generatePool(list: OptionList<T>): void {
    // 计算权重
    const [weightsTotal, staticWeightsTotal] = this.computeWeights(list);

    // 生成选项池
    let reduceWeight = 0;
    this.pool = list.map((item) => {
      const weights =
        typeof item.weights === 'number' ? item.weights : item.weights(staticWeightsTotal);
      // 权重为0或负数的强制抛出异常
      if (weights <= 0) {
        throw new RangeError(`权重不能小于等于0，weights: ${weights}`);
      }
      reduceWeight += weights;
      const range = ~~((reduceWeight / weightsTotal) * 1_000_000) / 10_000;
      return { ...item, range };
    });
  }

  /**
   * 从选项池中获取随机选项
   * @protected
   */
  get randomOption(): T | null {
    if (!this.pool.length) return null;
    const range = Math.random() * 100;
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
   * @return @return 几率：100分满值
   */
  rateOf(option: T): number {
    const pool = this.pool;
    const index = pool.findIndex((it) => it.option === option);
    if (index === -1) return 0;
    const w = 10_000;
    const currentRange = ~~(pool[index].range * w);
    const prevRange = ~~((pool[index - 1]?.range ?? 0) * w);
    const diff = currentRange - prevRange;
    return diff / w;
  }

  /**
   * 导出选项池剩余的选项
   * @return 由option、weights组成的元组所组成的选项数组，可以用于new RandomPicker(picker.export())
   */
  export(): OptionWeightsTuple<T>[] {
    return this.pool.map((item) => [item.option, item.weights]);
  }
}
```

## 3.`OptionsStore.ts`

`OptionsStore.ts`维护所有选项工具类

```typescript
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
```

## 4.`RandomPicker.ts`

`RandomPicker.ts`完整的随机选择器工具类

```typescript
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
```

## 5.`index.ts`

在`index.ts`统合导出

```typescript
export * from './types';
export * from './OptionsStore';
export * from './OptionsPool';
export * from './RandomPicker';
```

## 测试覆盖率

```text
--------------------------|---------|----------|---------|---------|----------------------------------------------------------------------------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------|---------|----------|---------|---------|----------------------------------------------------------------------------------------
 random-picker/src        |     100 |      100 |     100 |     100 |                                                                                        
  OptionsPool.ts          |     100 |      100 |     100 |     100 |                                                                                        
  OptionsStore.ts         |     100 |      100 |     100 |     100 |                                                                                        
  RandomPicker.ts         |     100 |      100 |     100 |     100 |  
--------------------------|---------|----------|---------|---------|----------------------------------------------------------------------------------------
````

源码测试覆盖率达到 100%，请放心食用

# github 仓库

<https://github.com/mengxinssfd/ts-utils/tree/master/packages/random-picker>