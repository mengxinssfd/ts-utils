# @mxssfd/random-picker

从数组中随机挑选出 n 个选项的 js 工具类库。

## 安装方法

```shell
npm install @mxssfd/random-picker
```

## 使用方法

### `pick` / `take`

#### `pick`

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

#### `take`

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

#### 区别

|                                | `take` | `pick` |
| ------------------------------ | ------ | ------ |
| 可以选取一个                   | 是     | 是     |
| 可以选取多个                   | 是     | 是     |
| 选取多个时是否可能会重复选取   | 否     | 是     |
| 选取多个时是否可以超出可选数量 | 否     | 是     |
| 影响                           | `pick` | 无     |
| 是否会从选项池中移除           | 是     | 否     |

### 权重(`weights`)

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

### `option`/`options` 添加选项

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

### `rateOf` 获取选项的选中几率

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

### `remove` 移除选项

```typescript
import { RandomPicker } from '@mxssfd/random-picker';

const picker = new RandomPicker([1, 2, 3]);

picker.remove(1); // 此时会把选项1移除
```

### `reset`/`resetWithSeed` 重置选项池

#### 使用 `reset`重置选项池

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

#### 使用 `resetWithSeed`重置选项池

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

#### 区别

|                                  | `reset` | `resetWithSeed`                             |
| -------------------------------- | ------- | ------------------------------------------- |
| 恢复被`take`的选项               | 是      | 是                                          |
| 重置`option`/`options`添加的选项 | 是      | 否，会丢弃选项                              |
| 恢复被`remove`的选项             | 否      | 如果是存在于`seed`的选项被 `remove`会被恢复 |

### `export` / `exportPool`

### `len` / `poolLen`

## 代码测试覆盖率

```text
--------------------------|---------|----------|---------|---------|----------------------------------------------------------------------------------------
File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------|---------|----------|---------|---------|----------------------------------------------------------------------------------------
 random-picker/src        |     100 |      100 |     100 |     100 |
  OptionsPool.ts          |     100 |      100 |     100 |     100 |
  RandomPicker.ts         |     100 |      100 |     100 |     100 |
--------------------------|---------|----------|---------|---------|----------------------------------------------------------------------------------------
```

测试覆盖率达到 100%请放心食用

## 案例

```ts
const picker = new RandomPicker([1, 2, 3, 4, 5]);

// 从选项池中随机挑选1个选项
picker.pick(); // 返回1,2,3,4,5中的1个
// 从选项池中随机挑选2个选项
picker.pick(2); // 返回1,2,3,4,5中的2个,可供选则的有5个，多个可能会出现重复的

// 从中随机拿走选项。每拿走一个选项，都会对剩余的选项重新计算选中几率，可选数量减1
picker.take(); // 返回1,2,3,4,5中的1个，之后pick或take可供选择的只剩下4个
picker.take(2); // 返回1,2,3,4,5中的2个，之后pick或take可供选择的只剩下2个，多个不会出现重复的

// 重置后，会恢复选项池
picker.reset();

// 添加选项
picker.option(6);

// 恢复初始选项，去除picker.option方法添加的选项
picker.resetBySeed();
```
