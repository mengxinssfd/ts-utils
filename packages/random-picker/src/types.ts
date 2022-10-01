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
