import { forEachRight, unique } from './array';
import { isArray, isBroadlyObj, isNaN, isObject, typeOf } from './dataType';
import type {
  DotTrim,
  RemoveStrStart,
  TransferPath,
  TypeOfPath,
  TransferPathOf,
} from '@mxssfd/types';

// 获取object树的最大层数 tree是object的话，tree就是层数1
export function getTreeMaxDeep(tree: object): number {
  function deeps(obj: object, num = 0): number {
    if (typeof tree !== 'object' || tree === null) return num;
    const arr: number[] = [++num];
    forEachObj(obj, (v) => {
      arr.push(deeps(v, num));
    });
    return Math.max(...arr);
  }

  return deeps(tree);
}

// 获取树某层的节点数 0是tree本身
export function getTreeNodeLen(tree: object, nodeNumber = 1): number {
  let result = 0;
  if (typeof tree !== 'object' || tree === null || nodeNumber < 0) return result;

  function deeps(obj: object, num = 0) {
    if (nodeNumber === num++) {
      result++;
      return;
    }
    forEachObj(obj, (v) => {
      deeps(v, num);
    });
  }

  deeps(tree);
  return result;
}

// 合并两个object TODO 可优化
export function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(
  first: T,
  second: U,
): T & U {
  function assign(receive: Record<string, any>, obj: any) {
    for (const k in obj) {
      if (!hasOwn(obj, k)) continue;
      const v = obj[k];
      if (v && typeof v === 'object') {
        receive[k] = new v.constructor();
        assign(receive[k], v);
      } else receive[k] = v;
    }
  }

  const result: any = {};
  assign(result, first);
  assign(result, second);
  return result;
}

/**
 * 代替Object.keys(obj).forEach，减少循环次数
 * @param obj
 * @param callbackFn 返回false的时候中断
 * @param elseCB 遍历完后执行
 * @returns {boolean} isDone
 */
export function forEachObj<T extends object>(
  obj: T,
  callbackFn: (value: T[keyof T], key: keyof T, obj: T) => void | false,
  elseCB?: () => any,
): boolean {
  for (const k in obj) {
    if (!hasOwn(obj, k)) continue;
    const v = obj[k];
    if (callbackFn(v, k, obj) === false) return false;
  }
  elseCB && elseCB();
  return true;
}

/**
 * @alias forEachObj
 */
export const objForEach = forEachObj;

/**
 * object key-value翻转
 * @param obj
 */
export function getReverseObj(obj: { [k: string]: string }): { [k: string]: string } {
  return reduceObj(
    obj,
    (res, v, k) => {
      res[v] = k;
      return res;
    },
    {} as Record<string, any>,
  );
}

/**
 * 代替Object.keys(obj).reduce，减少循环次数
 * @param obj
 * @param callbackFn
 * @param initialValue 初始值 数组中可以省略，默认使用数组中的第一项作为初始值，但object不存在第一项，所以不能省略
 */
export function reduceObj<T extends object, R>(
  obj: T,
  callbackFn: (previousValue: R, value: T[keyof T], key: keyof T, obj: T) => R,
  initialValue: R,
): R {
  let result = initialValue;
  forEachObj(obj, (v, k, o) => {
    result = callbackFn(result, v, k, o);
  });
  return result;
}

/**
 * @alias reduceObj
 */
export const objReduce = reduceObj;

/**
 * @param originObj
 * @param pickKeys
 * @param cb
 */
export function pickByKeys<T extends object, K extends keyof T>(
  originObj: T,
  pickKeys: K[],
  cb?: (value: T[K], key: K, originObj: T) => Pick<T, K>[K],
): Pick<T, K> {
  const callback = cb || ((v) => v);
  return pickKeys.reduce((res, key) => {
    if (hasOwn(originObj, key)) res[key] = callback(originObj[key], key, originObj);
    return res;
  }, {} as any);
}

// TODO 不完美的地方：k === "a"时应该限定返回值类型为number
/*pickByKeys({a: 123, b: "111", c: false}, ["a", "b"], (v, k, o) => {
    if(k === "a"){
        return "123123"
    }
    return v;
});*/

// 新属性名作为键名的好处是可以多个属性对应一个值
export function pickRename<T extends object, K extends keyof T, O extends { [k: string]: K }>(
  originObj: T,
  pickKeyMap: O,
  cb?: (value: T[O[keyof O]], key: O[keyof O], originObj: T) => T[O[keyof O]],
): { [k in keyof O]: T[O[k]] } {
  const callback = cb || ((v) => v);
  /* const renames = Object.keys(renamePickObj) as (keyof O)[];
     return renames.reduce((result, rename) => {
         const pick = renamePickObj[rename];
         if (originObj.hasOwnProperty(pick)) {
             result[rename] = callback(originObj[pick], pick, originObj);
         }
         return result;
     }, {} as any);*/
  return reduceObj(
    pickKeyMap,
    (result, pick, rename) => {
      if (hasOwn(originObj, pick)) {
        result[rename] = callback(originObj[pick], pick, originObj);
      }
      return result;
    },
    {} as any,
  );
}

/*
export function pickRename2<T extends object,
    K extends keyof T,
    O extends { [k: string]: K | ((t: T) => T[K]) }>(
    originObj: T,
    renamePickObj: O,
): { [k in keyof O]: O[k] extends K ? T[O[k]] : T[K] } {
    return {} as any;
}

pickRename2({a: 123, b: "222"}, {
    c: 'a',
    d: (obj) => obj.a,
});
*/

/**
 * 功能与pickByKeys函数一致
 * @param originObj
 * @param pickKeys
 * @param cb
 */
export function pick<T extends object, K extends keyof T, KS extends K[]>(
  originObj: T,
  pickKeys: KS,
  cb?: (value: T[K], key: K, fromObj: T) => T[K],
): { [key in K]: T[key] };
/**
 * 功能与pickRename函数一致
 * @param originObj
 * @param pickKeyMap
 * @param cb
 */
export function pick<T extends object, K extends keyof T, O extends { [k: string]: K }>(
  originObj: T,
  pickKeyMap: O,
  cb?: (value: T[O[keyof O]], key: O[keyof O], fromObj: T) => T[O[keyof O]],
): { [k in keyof O]: T[O[k]] };
/**
 * 合并pickByKeys与pickRename两者的功能
 */
export function pick(originObj: object, picks: any[], cb?: Function) {
  const isObj = isObject(picks);
  // ------- 第一种写法 -------
  // const callback = cb || (v => v);
  // const pickKeys = isObj ? Object.keys(picks) : picks;
  // const getOriginObjKey = isObj ? k => picks[k] : k => k;
  // return pickKeys.reduce((res, k) => {
  //     const originObjKey = getOriginObjKey(k);
  //     if (originObj.hasOwnProperty(originObjKey)) {
  //         res[k] = callback(originObj[originObjKey], originObjKey, originObj);
  //     }
  //     return res;
  // }, {} as any);
  // ------- 第二种写法 -------
  // 更简洁 减少判断次数
  // TODO 需要判断返回值类型是否改变了  改变则抛出异常
  return isObj
    ? pickRename(originObj, picks as any, cb as any)
    : pickByKeys(originObj, picks, cb as any);
}

// pick({a: 132, b: "123123"}, ["a", "b"]);

/**
 * 从其他对象中挑出与原对象值不一样的或原对象中不存在的键值对所组成的新对象
 * @param origin
 * @param objs
 * @param verify
 */
export function pickDiff(
  origin: object,
  objs: object[],
  verify?: (originV: any, objV: any, k: string | number, origin: object, obj: object) => boolean,
): { [k: string]: any } {
  const verifyFn =
    verify ||
    ((originV, objV, k, origin) => {
      return (hasOwn(origin, k) && originV === objV) || (isNaN(originV) && isNaN(objV));
    });
  return objs.reduce((result, obj) => {
    objForEach(obj, (v, k) => {
      if (verifyFn(origin[k], v, k, origin, obj)) return;
      result[k] = v;
    });
    return result;
  }, {});
}

export function pickAdditional<T extends object, K extends object>(
  origin: T,
  other: K,
): Omit<K, keyof T>;
export function pickAdditional(origin: object, ...others: object[]): { [k: string]: any };
/**
 * 从其他对象中挑出与原对象中不存在的键值对所组成的新对象
 */
export function pickAdditional(origin: object, ...others: object[]) {
  // return others.reduce((result, obj) => {
  //     objForEach(obj, (v, k) => {
  //         if (!origin.hasOwnProperty(k))
  //             result[k] = v;
  //     });
  //     return result;
  // }, {});

  return pickDiff(origin, others, (_originV, _objV, k) => hasOwn(origin, k));
}

/**
 * 根据新键值对重命名对象的key，并生成一个新的对象
 * @param originObj
 * @param keyMap
 */
export function renameObjKey<
  T extends object,
  K extends keyof T,
  O extends { [k: string]: K },
  R extends Omit<T, O[keyof O]>,
>(originObj: T, keyMap: O): { [k in keyof O]: T[O[k]] } & R {
  const result: any = assign({}, originObj);
  const delKeys: K[] = [];
  const newKeys: string[] = [];

  forEachObj(keyMap, (originKey, k) => {
    if (hasOwn(result, originKey)) {
      result[k] = result[originKey];
      delKeys.push(originKey);
      newKeys.push(k as string);
    }
  });

  // 可能新key会与旧key同名，如果是同名则把该key从要删除的key数组中移除
  // delKeys = delKeys.filter(k => newKeys.indexOf(k as string) === -1);

  delKeys.forEach((k) => {
    if (newKeys.indexOf(k as string) > -1) return;
    delete result[k];
  });
  return result;
}

/**
 * Omit 省略
 * @example
 *  // returns {c: true}
 *  omit({a: 123, b: "bbb", c: true}, ["a", "b"])
 * @param target
 * @param keys
 */
export function omit<T extends object, K extends keyof T>(
  target: T,
  keys: readonly K[],
): Omit<T, K> {
  const newKeys = keys.slice();
  return reduceObj(
    target,
    (initValue, v, k) => {
      const index = newKeys.indexOf(k as K);
      if (index === -1) {
        initValue[k] = v;
      } else {
        newKeys.splice(index, 1);
      }
      return initValue;
    },
    {} as any,
  );
}

export function assign<T, U>(target: T, source: U): T & U;
export function assign<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export function assign<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export function assign(
  target: Record<string, any>,
  ...args: Record<string, any>[]
): Record<string, any>;
export function assign(target: Record<string, any>, ...args: any[]) {
  args.forEach((arg) => {
    // forEachObj(arg, (v, k) => target[k] = v);  // 不能返回“target[k] = v”值，v可能会为false，为false会中断循环
    forEachObj(arg, (v, k) => {
      target[k as string] = v;
    });
  });
  return target;
}

export function defaults<T, U>(target: T, source: U): T & U;
export function defaults<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export function defaults<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
export function defaults(target: object, ...args: object[]): object;
/**
 * 与lodash defaults一样 只替换target里面的值为undefined的属性
 * 类型推导会以前面的为准
 * @example
 * defaults({a: 12, b: undefined, c: 3}, {a: 1}, {b: 2}, {d: 4}); // returns {a: 12, b: 2, c: 3, d: 4}
 * defaults({a:12,b:undefined,c:3},{a:1},{b:2},{c:undefined}); // returns {a: 12, b: 2, c: 3}
 * @param target
 * @param args
 */
export function defaults(target: Record<string, any>, ...args: any[]) {
  args.forEach((arg) => {
    forEachObj(arg, (v, k) => {
      if (v === undefined || target[k as string] !== undefined) return;
      target[k as string] = v;
    });
  });
  return target;
}

/**
 * 内部更新对象函数
 */
function _updateObj<T extends object>(target: T, others: object[], k: keyof T): void {
  // 从后往前查起
  forEachRight(others, (item): void | false => {
    if (item && hasOwn(item, k)) {
      target[k] = item[k];
      // 某个对象有这个key，那么就不再往前查
      return false;
    }
  });
}

/**
 * 使用target里面的key去查找其他的对象，如果其他对象里有该key，则把该值赋给target,如果多个对象都有同一个值，则以最后的为准
 * 会更新原对象
 *
 * 如果要更新某个class的实例，那么需要使用updateIns
 * @see updateIns
 * @alias updateObj
 *
 * @param target
 * @param others
 */
export function objUpdate<T extends object>(target: T, ...others: object[]): T {
  if (others[others.length - 1] === target) return target;
  objForEach(target, (_v, k) => _updateObj(target, others, k));
  return target;
}
// export function updateObj<T extends object>(target: T, ...others: object[]): T {
//   for (const k in target) {
//     for (let i = others.length - 1; i > -1; i--) {
//       const item = others[i];
//       if (item && hasOwn(item, k)) {
//         target[k] = item[k];
//         break;
//       }
//     }
//   }
//
//   return target;
// }

/**
 * @see objUpdate
 * @alias objUpdate
 */
export const updateObj = objUpdate;

/**
 * 获取class实例的key数组
 * @param ins
 */
export function getInsKeys(ins: Record<string, any>): Array<string | symbol> {
  const result: Array<string | symbol> = [];

  let cur: Record<string, any> = ins;
  while (cur) {
    // 普通key
    result.push(...Object.keys(cur));

    // 使用 Object.getPrototypeOf 代替 cur.__proto__
    const proto = Object.getPrototypeOf(cur);

    if (!proto || proto === Object.prototype) {
      // 构造器为原生函数的话就不是class
      // 或者对象原型和 Object 的原型一样则不是class
      // 或者 Object.create(null) 创建的纯对象，prototype为null, __proto__为undefined
      break;
    } else {
      // method key
      result.push(...Reflect.ownKeys(proto));
    }

    cur = proto;
  }

  // 过滤掉构造方法,并去重
  return unique(result.filter((k) => k !== 'constructor'));
}

/**
 * 更新实例对象属性
 *
 * updateIns可以代替updateObj使用，
 * 不过由于遍历了实例及原型的key，所以理论上updateIns会比updateObj慢一点
 *
 * @see objUpdate
 */
export function updateIns<T extends object>(target: T, ...others: object[]): T {
  if (others[others.length - 1] === target) return target;

  const keys = getInsKeys(target);
  keys.forEach((k) => _updateObj(target, others, k as keyof T));

  return target;
}

/**
 * 根据与target对比，挑出与target同key不同value的key所组成的object
 * @param target
 * @param objs  相当于assign(...objs) 同样的key只会取最后一个
 * @param compareFn
 */
export function pickUpdated<T extends object>(
  target: T,
  objs: object[],
  compareFn: (a: unknown, b: unknown) => boolean = (a, b) => a === b || (isNaN(a) && isNaN(b)),
): Partial<{ [k in keyof T]: any }> {
  return objReduce(
    target,
    (result, _v, k) => {
      forEachRight(objs, function (item: any): void | false {
        if (item && hasOwn(item, k)) {
          if (!compareFn(target[k], item[k])) {
            result[k] = item[k];
          }
          return false;
        }
      });
      return result;
    },
    {} as any,
  );
}

// TODO 需要去除掉前面object里的undefined
/*
type A = { a: undefined, b: number }
type Pick2<T, K extends keyof T> = {
    [NonNullable<T[K]>]: NonNullable<T[K]>;
};
type K = keyof A
type V = A[K]
type B = Pick2<A, keyof A>*/

/**
 * 创建一个object 代替es6的动态key object 与Object.fromEntries一样
 * @example
 * const k1 = "a",k2 = "b"
 * createObj([[k1, 1], [k2, 2]]); // {a:1, b:2}
 * @param entries
 * @return {{}}
 */
export function createObj(entries: Array<[string, any]>): { [k: string]: any } {
  return entries.reduce((initValue, item) => {
    if (!isArray(item) || item.length < 1) throw new TypeError('createObj args type error');
    const [key, value] = item;
    if (key !== void 0) {
      initValue[key] = value;
    }
    return initValue;
  }, {} as Record<string, any>);
}

/**
 * @alias createObj
 */
export const ObjFromEntries = createObj;

/**
 * Object.keys
 * @param obj
 */
export function objKeys<T extends object, K extends keyof T>(obj: T): K[] {
  // Object.keys es5可以使用
  return reduceObj(
    obj,
    (init, _v, k) => {
      init.push(k as K);
      return init;
    },
    [] as K[],
  );
}

/**
 * Object.values
 * @param obj
 */
export function objValues<T extends object, K extends keyof T, V extends T[K]>(obj: T): V[] {
  return reduceObj(
    obj,
    (init, v) => {
      init.push(v as V);
      return init;
    },
    [] as V[],
  );
}

/**
 * Object.entries
 * @param obj
 */
export function objEntries<T extends object, K extends keyof T>(obj: T): [K, T[K]][] {
  return reduceObj(
    obj,
    (init, v, k) => {
      init.push([k, v]);
      return init;
    },
    [] as any,
  );
}

/**
 * obj[a] => obj.a 从getObjValueByPath中分离出来
 * @param path
 * @param [objName = ""]
 */
export function translateObjPath<P extends string, S extends string = ''>(
  path: P,
  objName: S = '' as S,
): DotTrim<TransferPath<RemoveStrStart<P, S>>> {
  let result: any = path;
  // obj[a] => obj.a
  result = result.replace(new RegExp(`^${objName}`), '');
  result = result.replace(/\[([^\]]+)]/g, '.$1');
  result = result.replace(/^\.|\[]/g, '');
  return result;
}

/**
 * 通过object路径获取值
 * @example
 * getObjValueByPath({a: {b: {c: 123}}}, "a.b.c") // => 123
 * @param obj
 * @param path
 * @param [objName = ""]
 */
export function getObjValueByPath<
  T extends Record<string, any>,
  P extends string,
  S extends string = '',
>(
  obj: T,
  path: TransferPathOf<T, P, S>,
  objName: S = '' as S,
): TypeOfPath<T, TransferPath<DotTrim<RemoveStrStart<P, S>>>> {
  const p = translateObjPath(path, objName);
  return p.split('.').reduce((init, v) => {
    if (!isBroadlyObj(init)) return undefined;
    return init[v as keyof typeof init];
  }, obj as any);
}

// getObjValueByPath({a: {b: {b_c: 123,d:'d'}}}, "a.b.b_c"); // number
// getObjValueByPath({a: {b: {c: 123}}}, "obj[a][b][c]", "obj"); // number
// getObjValueByPath({a: 123, b: {c: false}}, "obj[b][c]", "obj"); // boolean

type SetObjValueByPathOnExist = (a: any, b: any, isEnd: boolean, path: string) => any;

/**
 * 通过object路径设置值 如果路径中不存在则会自动创建对应的对象
 * @example
 * @param obj
 * @param path
 * @param value
 * @param onExist 当要改动位置已经有值时的回调
 * @param [objName = ""]
 */
export function setObjValueByPath<
  T extends object,
  P extends string,
  S extends string = '',
  NO_START extends string = DotTrim<RemoveStrStart<P, S>>,
  Path extends string = TransferPath<NO_START>,
>(
  obj: T,
  path: TransferPathOf<T, P, S>,
  value: TypeOfPath<T, Path>,
  onExist: SetObjValueByPathOnExist = (_a, b): any => b,
  objName: S = '' as S,
): T {
  const p = translateObjPath(path, objName);
  const split = p.split('.');
  const end = split.length - 1;
  split.reduce(
    ([init, currentPath], key, index) => {
      currentPath = currentPath + (currentPath ? '.' + key : key);
      if (index === end) {
        if (hasOwn(init, key)) {
          value = onExist(init[key], value, true, currentPath);
        }
        init[key] = value;
        return [init[key], currentPath] as any;
      }

      if (!isBroadlyObj(init[key])) {
        init[key] = hasOwn(init, key) ? onExist(init[key], {}, false, currentPath) : {};
      }
      return [init[key], currentPath];
    },
    [obj, ''] as [Record<string, any>, string],
  );
  return obj;
}

/**
 * 获取object的路径数组
 * @example
 * getObjPathEntries({a: 1}) // => [["[a]", 1]]
 * getObjPathEntries({a: 1},"obj") // => [["obj[a]", 1]]
 * @param obj
 * @param [objName = ""]
 */
export function getObjPathEntries(obj: object, objName = ''): Array<[string, any]> {
  return reduceObj(
    obj,
    (init, v, k) => {
      const key = `${objName}[${k as string}]`;
      if (isBroadlyObj(v)) {
        init.push(...getObjPathEntries(v, key));
      } else {
        init.push([key, v]);
      }
      return init;
    },
    [] as Array<[string, any]>,
  );
}

// 根据路径还原整个object
export function revertObjFromPath(pathArr: string[]): object {
  function getKV(path: string): { key: string; value: string; innerKey: string } {
    const [k, value] = path.split('=').map((item) => decodeURIComponent(item)) as [string, string];
    let key = k;
    let innerKey = '';
    const reg = /(?:\[([^[\]]*)])|(?:\.\[?([^[\]]*)]?)/g;
    if (reg.test(key)) {
      innerKey = RegExp.$1 || RegExp.$2;
      key = key.replace(reg, '');
    }
    // key = key.replace(/\[[^\[\]]*]/g, "");
    return { key, value, innerKey };
  }

  return pathArr.reduce((result, path) => {
    const { key, value, innerKey } = getKV(path);
    const resultValue = result[key];

    // no-fallthrough
    switch (typeOf(resultValue)) {
      case 'undefined':
        if (!innerKey) {
          result[key] = value;
        } else {
          const arr: any[] = [];
          arr[innerKey as any] = value;
          result[key] = arr;
        }
        break;
      case 'string':
        result[key] = [resultValue];
      // eslint-disable-next-line no-fallthrough
      case 'array':
        if (!innerKey) {
          result[key].push(value);
        } else {
          result[key][innerKey] = value;
        }
    }
    return result;
  }, {} as Record<string, any>);
}

// ie9+ 支持，不需要实现
/*
export function objCreate(proto: any) {
    const origin = {};
    // @ts-ignore
    origin.__proto__ = proto;
    return origin;
}*/
export function objFilter(
  obj: Record<string, any>,
  predicate: (v: any, k: string) => boolean = (v) => v,
): object {
  return objReduce(
    obj,
    (init, v, k) => {
      if (predicate(v, k)) {
        init[k] = v;
      }
      return init;
    },
    {} as Record<string, any>,
  );
}

/**
 * 判断对象是否包含某个属性。
 * 因为直接object.hasOwnProperty(key)的话object可能会是null,所以另外封装一个函数使用。
 * 可以用作类型守卫：见example。
 *
 * @example
 *
 * const o = { a: 1 };
 * let k = 'a';
 * k = 'c';
 * // 报错需要在tsconfig.json设置
 * // "suppressImplicitAnyIndexErrors": false,
 * // "noImplicitAny": true,
 * o[k] = 2; // 此处没有类型守卫会报错
 * if (hasOwn(o, k)) {
 *   o[k] = 3; // 有类型守卫，安全
 * }
 *
 * @param obj
 * @param key
 */
export function hasOwn<T extends object>(obj: T, key: any): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
