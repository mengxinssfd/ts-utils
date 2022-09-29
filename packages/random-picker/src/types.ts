export type WeightFn = (weightTotal: number) => number;

export interface WeightsItem<T> {
  weights: number;
  option: T;
}

export interface WeightsFnItem<T> {
  weights: WeightFn;
  option: T;
}

export type PoolItem<T> = {
  range: number;
} & (WeightsFnItem<T> | WeightsItem<T>);

export type OptionList<T> = Array<WeightsFnItem<T> | WeightsItem<T>>;

/**
 * [option, weights] 元组
 */
export type OptionWeightsTuple<T> = [option: T, weights: number | WeightFn];
