import { createArray } from './array';
import { deepCloneBfs } from './clone';
import { strPadStart } from './string';
import { isArrayLike, isNumber } from './dataType';

// min end都不传  return Math.random()
export function randomFloat(): number;
// min = 0 生成0-max之间的随机数
export function randomFloat(max: number): number;
// 生成min到end之间的随机数 包含min不包含max
export function randomFloat(min: number, max: number): number;
// 生成min到end之间的随机数组 包含min不包含end len：数组长度
export function randomFloat(min: number, max: number, len: number): number[];
export function randomFloat(min?, max?, len?) {
  // randomFloat()
  if (!arguments.length) return Math.random();
  // randomFloat(max)
  if (arguments.length === 1) {
    max = min;
    min = 0;
  }

  // randomFloat(min, max)
  if (len === undefined) {
    const dif = (max as number) - (min as number);
    return Math.random() * dif + (min as number);
  } else {
    return createArray({ len, fill: () => randomFloat(min, max) });
  }
}

export function randomInt(): number;
// min = 0 生成0-max之间的随机数
export function randomInt(max: number): number;
// 生成min到max之间的随机数 包含start不包含max
export function randomInt(min: number, max: number): number;
// 生成min到max之间的随机数组 包含min不包含max len：数组长度
export function randomInt(min: number, max: number, len: number): number[];
export function randomInt(min?, max?, len?) {
  // randomInt()
  if (!arguments.length) return Math.random();
  // randomInt(max)
  if (arguments.length === 1) {
    max = min;
    min = 0;
  }

  if (len === undefined) {
    const dif = (max as number) - (min as number);
    // 直接调用randomFloat的话randomInt(-10,10)永远都不会出现-10
    // 用~~做整数转换的时候，数字太大会变为负数: 如1000 * 60 * 60 * 24 * 30
    //  return ~~(Math.random() * dif) + (min as number);
    return parseInt((Math.random() * dif) as any) + (min as number);
  } else {
    return createArray({ len, fill: () => randomInt(min, max) });
  }
}

/**
 * 随机获取数组中的一个
 * @param arr
 */
export function randomItem<T>(arr: T[]): T {
  const index = randomInt(arr.length);
  return arr[index];
}

/**
 * 创建一个数组随机item的生成器，直到遍历完为止
 * @param arr
 */
export function* randomItemsGen<T>(arr: T[]): Generator<T, any, never> {
  const list = arr.slice();
  while (list.length) {
    const index = randomInt(list.length);
    yield list.splice(index, 1)[0];
  }
}

/**
 * 洗牌
 * @param arr
 */
export function shuffle<T, A extends ArrayLike<T>>(arr: A): A {
  if (!isArrayLike(arr)) throw new TypeError();
  const newArr: any = deepCloneBfs(arr);
  let m = newArr.length;
  while (m) {
    const i = randomInt(m--);
    [newArr[m], newArr[i]] = [newArr[i], newArr[m]];
  }
  return newArr;
}

/*
export function shuffle<T>(arr: ArrayLike<T>): T[] {
    if (!isArrayLike(arr)) throw new TypeError();
    const result: T[] = [];
    const indexArr = createArray({len: arr.length});
    while (indexArr.length) {
        const index = randomInt(indexArr.length);
        const arrIndex = indexArr.splice(index, 1)[0];
        result.push(arr[arrIndex]);
    }
    return result;
}
*/

export function randomRGB(): string {
  const num = randomInt(0, 255, 3);
  return `rgb(${num[0]},${num[1]},${num[2]})`;
}

export function randomRGBA(): string {
  const num = randomInt(0, 255, 3);
  const opacity = +randomFloat().toFixed(2);
  return `rgba(${num[0]},${num[1]},${num[2]},${opacity})`;
}

export function randomHEX(): string {
  const num = randomInt(0xffffff).toString(16);
  return '#' + strPadStart(num, 6, '0');
}

type ColorType = 'HEX' | 'RGB' | 'RGBA';

/**
 * 随机颜色
 */
export function randomColor(): string;
export function randomColor(type: ColorType): string;
export function randomColor(len: number): string[];
export function randomColor(type: ColorType, len: number): string[];
export function randomColor(type?, len?) {
  if (isNumber(type)) {
    len = type;
    type = 'HEX';
  }
  if (type === undefined) {
    type = 'HEX';
  }
  type = type.toUpperCase();
  if (len === undefined) {
    const map = {
      HEX: randomHEX,
      RGB: randomRGB,
      RGBA: randomRGBA,
    };
    return (map[type] || map.HEX)();
  } else {
    return createArray({ len, fill: () => randomColor(type as ColorType) });
  }
}
