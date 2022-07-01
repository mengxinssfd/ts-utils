import { strPadEnd } from './string';
import { createTimeCountDown } from './time';
import { isArray, isString, isPromiseLike, isNumber, typeOf } from './dataType';
import { assign, getReverseObj, hasOwn, objKeys } from './object';
import { inRange } from './array';

/**
 * 防抖函数
 * @param callback 回调
 * @param delay 延时
 * @param [immediate = false] 为true的时候第一次会立即执行callback并禁止立即执行，之后时间间隔内的只会执行一次callback并恢复立即执行，
 *                            如果只执行了一次立即执行callback，那么会在一次delay延时后恢复可立即执行
 *
 * @returns {Function}
 */
export function debounce<CB extends (...args: any[]) => any>(
  callback: CB,
  delay: number,
  immediate = false,
): CB & { cancel(): void; flush: CB } {
  let lastThis: any;
  let lastArgs: any;
  let lastResult: any;
  let timer: any;
  let canImmediateRun = true;
  const cancel = () => {
    clearTimeout(timer);
    timer = undefined;
  };
  const debounced = function (...args: any[]) {
    if (timer) {
      cancel();
    }
    lastThis = this;
    lastArgs = args;
    if (canImmediateRun && immediate) {
      debounced.flush();
      canImmediateRun = false;
      timer = setTimeout(() => {
        canImmediateRun = true;
      }, delay);
      return lastResult;
    }
    timer = setTimeout(() => {
      cancel();
      debounced.flush();
      canImmediateRun = true;
    }, delay);

    return lastResult;
  } as ReturnType<typeof debounce>;
  debounced.cancel = cancel;
  debounced.flush = () => {
    lastResult = callback.apply(lastThis, lastArgs);
    lastThis = lastArgs = undefined;
    return lastResult;
  };
  return debounced as any;
}

/**
 * 如果callback执行了的话，那么不论是否resolved都不会再被reject
 * @param callback
 * @param delay
 */
export function debounceAsync<T, CB extends (...args: any[]) => Promise<T>>(
  callback: CB,
  delay: number,
): CB {
  let timer: any = null;
  let rej;

  return function (...args: any[]) {
    return new Promise<T>((resolve, reject) => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
        rej('debounceAsync reject');
      }
      rej = reject;
      timer = setTimeout(async () => {
        timer = null;
        const result = await callback.apply(this, args);
        resolve(result);
      }, delay);
    });
  } as CB;
}

/**
 * 节流函数
 * @param callback
 * @param delay
 * @param invalidCB {function?}间隔期间调用throttle返回的函数执行的回调  例如一个按钮5秒点击一次，不可点击时执行该函数
 */
export function throttle<CB extends (...args: any[]) => void | any>(
  callback: CB,
  delay: number,
  invalidCB: (interval: number) => void = () => void 0,
): CB {
  let countDown = () => 0;
  return function (...args: any[]) {
    const interval = countDown();
    if (interval > 0) {
      invalidCB(interval);
      return;
    }
    countDown = createTimeCountDown(delay);
    return callback.apply(this, args);
  } as CB;
}

// 第1种实现方式
/*export function throttle<CB extends (...args: any[]) => (void | any)>(
    callback: CB,
    delay: number,
    invalidCB?: (interval: number) => void,
): CB {
    let lastTime = 0;
    return function (...args: any[]) {
        const now = Date.now();
        const interval = now - lastTime;
        if (interval < delay) {
            invalidCB && invalidCB(delay - interval);
            return;
        }
        lastTime = now;
        return callback.apply(this, args);
    } as CB;
}*/

// 第三种实现方式，不能获取剩余时间或者另外获取时间，有点多余
/*export function throttleByTimeOut<CB extends (...args: any[]) => (void | any)>(
    callback: CB,
    delay: number,
    invalidCB?: (interval: number) => void,
): CB {
    let throttling = false;
    return function (...args: any[]) {
        if (throttling) {
            return;
        }
        throttling = true;
        setTimeout(() => {
            throttling = false;
        }, delay);
        return callback.apply(this, args);
    } as CB;
}*/

/**
 * 可取消防抖函数
 * @param callback 回调
 * @param delay 延时
 * @returns {Function}
 */
export function debounceCancelable(callback: (...args: any[]) => void, delay: number) {
  let timer: any = null;

  function cancel() {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
  }

  return function (...args: any[]) {
    cancel();
    timer = setTimeout(() => {
      timer = null;
      callback.apply(this, args);
    }, delay);
    return cancel;
  };
}

/**
 * 前一个promise未完成即reject，最后一个或者中断前调用的才会执行
 * 无法阻止cb被调用 不推荐使用
 * @param callback
 */
export function debounceByPromise<T, CB extends (...args: any[]) => Promise<T>>(callback: CB): CB {
  let rejectFn;
  return function (...args: any[]): Promise<T> {
    rejectFn && rejectFn();
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (res, rej) => {
      rejectFn = rej;
      const result = await callback.apply(this, args);
      res(result);
    });
  } as CB;
}

/**
 * 轮询函数
 * @param callback
 * @param interval  间隔
 * @param [immediate=true] 是否马上执行第一次
 */
export function polling(
  callback: (times: number) => void | Promise<any>,
  interval: number,
  immediate = true,
): () => void {
  enum state {
    running,
    stopped,
  }

  let timer: number;
  let status: state;
  let times = 0;
  let lastTime = Date.now();
  let diff = 0;

  function run() {
    const back = callback(times++);
    back instanceof Promise ? back.then(timeout) : timeout();
  }

  function timeout() {
    const delay = interval - diff;
    timer = setTimeout(() => {
      if (status !== state.running) return;
      const now = Date.now();
      diff = now - lastTime - delay;
      lastTime = now;
      run();
    }, delay) as any;
  }

  status = state.running;
  if (immediate) {
    run();
  } else {
    timeout();
  }
  return function () {
    status = state.stopped;
    clearTimeout(timer);
  };
}

// 代替for循环
export function forEachByLen(len: number, callback: (index: number) => any | false) {
  for (let i = 0; i < len; i++) {
    if (callback(i) !== false) continue;
    break;
  }
}

// 代替for循环
export function forEachByLenRight(len: number, callback: (index: number) => any | false) {
  for (let i = len - 1; i >= 0; i--) {
    if (callback(i) === false) break;
  }
}

/**
 * 每隔一段事件返回字符串中的一个单词
 * @param words
 * @param delay
 * @param callback
 */
export function oneByOne(
  words: string,
  delay: number,
  callback?: (word: string, index: number, words: string) => false | void,
): () => void {
  const wordArr = words.split('');
  const cancel = polling((index) => {
    const word = wordArr.shift();
    let keepRun = !!wordArr.length;
    if (callback) {
      const flag = callback(word as string, index, words);
      keepRun = keepRun && flag !== false;
    } else {
      // console.log(word);
    }
    if (!keepRun) cancel();
  }, delay);
  return cancel;
}

// 代替扩展符"...", 实现apply的时候可以使用此方法
export function generateFunctionCode(argsArrayLength: number) {
  let code = 'return arguments[0][arguments[1]](';
  // 拼接args
  for (let i = 0; i < argsArrayLength; i++) {
    if (i > 0) {
      code += ',';
    }
    code += 'arguments[2][' + i + ']';
  }
  code += ')';
  // return object.property(args)
  // return arguments[0][arguments[1]](arg1, arg2, arg3...)
  return code;
}

// const args = [1, 2, 3];
// (new Function(generateFunctionCode(args.length)))(object, property, args);
export function functionApply<T extends object, K extends keyof T>(
  obj: T,
  property: K,
  args: any[],
) {
  return new Function(generateFunctionCode(args.length))(obj, property, args);
}

/**
 * 生成不重复的字符串
 * @param length
 * @returns {string}
 */
export function createUUID(length: number): string {
  const uuidArr: string[] = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < length; i++) {
    uuidArr[i] = hexDigits.substr(Math.random() * 0x10, 1);
  }

  // uuidArr[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  // uuidArr[19] = hexDigits.substr(((uuidArr[19] as any) & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01

  return uuidArr.join('');
}

/**
 * 格式化json
 * @param json
 * @param [indent=2] tab空格占位
 */
export function formatJSON(json: object | string, indent = 2): string {
  if (typeof json === 'string') {
    try {
      json = JSON.parse(json);
    } catch (e) {
      throw new TypeError();
    }
  }

  function foreach(js: any, floor = 0): string {
    switch (typeof js) {
      case 'object':
        const isArr = isArray(js);

        const space = ' '.repeat(indent * floor);
        const start = isArr ? '[\r\n' : '{\r\n';
        const end = '\r\n' + space + (isArr ? ']' : '}');
        let times = 0;

        let result = start;
        for (const key in js) {
          if (!hasOwn(js, key)) continue;
          const value = js[key];

          // 如果改行不是第一行，则给上一行的末尾添加逗号，并且换行
          if (times) result += ',\r\n';

          // 拼接空格
          const childSpace = ' '.repeat(indent * floor + indent);
          const child = foreach(value, floor + 1);

          if (isArr) {
            result += `${childSpace}${child}`;
          } else {
            result += `${childSpace}"${key}":${child}`;
          }

          times++;
        }
        return result + end;
      case 'function':
        // 函数的}位置有点对不上
        return `"${js.toString()}"`;
      default:
        return isString(js) ? '"' + js + '"' : js;
    }
  }

  return foreach(json);
}

// TODO 暂时无法手动设置值 未添加测试用例
export function createEnum<T extends string>(
  items: T[],
): { [k in T]: number } & { [k: number]: T } {
  const result: any = {};
  items.forEach((item, index) => {
    result[item] = index;
    result[index] = item;
  });
  Object.freeze(result); // freeze值不可变
  // Object.seal(result); // seal值可以变
  return result;
}

export function createEnumByObj<T extends object, K extends keyof T>(
  obj: T,
): T & { [k: string]: K } {
  /* const res: any = {};
     for (let k in obj) {
         if (res.hasOwnProperty(k)) throw new Error("key multiple");
         res[res[k] = obj[k]] = k;
     }

     Object.freeze(res); // freeze值不可变
     // Object.seal(result); // seal值可以变
     return res;*/
  return assign({}, obj, getReverseObj(obj as any)) as any;
}

// omit({a: 123, b: "bbb", c: true}, ["a", "b", "d"]);
// type O = Omit<{ a: 123, b: "bbb", c: true }, "a" | "c">

/**
 * Promise.prototype.any list中任意一个promise resolve都会resolve，如果全是reject，那么reject
 * @param list
 */
export function promiseAny<T>(list: Promise<T>[]): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let rejectTimes = 0;
    try {
      for (const p of list) {
        if (!isPromiseLike(p)) {
          resolve(p);
          break;
        }
        p.then(
          (res) => resolve(res),
          () => {
            rejectTimes++;
            if (rejectTimes !== list.length) return;
            reject('AggregateError: All promises were rejected');
          },
        );
      }
      !list.length && reject('AggregateError: All promises were rejected');
    } catch (e: any) {
      reject(e.toString());
    }
  });
}

/**
 * 串行版promise.all，执行完一个才会去执行下一个
 * @template T
 * @param {((list: T[]) => Promise<T>)[]} list
 * @returns {Promise<T[]>}
 */
export function syncPromiseAll<T>(list: ((list: T[]) => Promise<T>)[]): Promise<T[]> {
  return list.reduce(
    (p, next) =>
      p.then((resList) =>
        next(resList).then((res) => {
          resList.push(res);
          return resList;
        }),
      ),
    Promise.resolve([] as T[]),
  );
}

/**
 * promise队列  任何一个reject都会中断队列 (跟reduceAsync类似)
 * 队列第一个会接收initValue作为参数，其余会接收上一个promise返回值作为参数
 * @template T
 * @param {Array<(lastValue: unknown) => Promise<unknown>>} queue
 * @param {T} initValue
 * @returns {Promise<unknown>}
 */
export async function promiseQueue<T>(
  queue: Array<(lastValue: unknown) => Promise<unknown>>,
  initValue: T,
) {
  return queue.reduce(
    (p, next) => p.then((res) => next(res)),
    Promise.resolve(initValue) as Promise<unknown>,
  );
}

/*export async function promiseQueue<T>(queue: Array<(lastValue: unknown) => Promise<unknown>>, initValue: T) {
    let lastValue: unknown = initValue;
    await forEachAsync(async (promise) => {
        lastValue = await promise(lastValue);
    }, queue);
    return lastValue;
}*/

export const root = Function('return this')();

/**
 * 原来的函数四舍五入不准确
 * @note 原来的toFixed可以把科学计数法的小数，给转成普通小数字符串
 * @param num
 * @param [fractionDigits = 0]
 * @param [rounding = false] 是否四舍五入
 */
export function numToFixed(num: number, fractionDigits = 0, rounding = false): string {
  if (!isNumber(fractionDigits) || !inRange(fractionDigits, [0, 100])) {
    throw new TypeError('numToFixed() fractionDigits argument must be between 0 and 100');
  }

  if (fractionDigits === 0) return String(~~num);

  const base = 10;
  // 加1 四舍五入
  const pow = base ** (fractionDigits + 1);
  num = ~~(num * pow);
  if (rounding && num) {
    // num为0的时候位数已经不对了
    num += 5;
  }
  num /= pow;

  const split = String(num).split('.');
  const digits = strPadEnd((split[1] || '').substr(0, fractionDigits), fractionDigits, '0');
  return split[0] + '.' + digits;
}

/**
 * 从arr获取index处的item，支持负数
 * @param arr
 * @param index
 * @param def
 */
export function at<
  V extends ArrayLike<any>,
  K extends keyof V | number,
  T extends ArrayLikeType<V>,
  D extends any | void,
>(arr: V, index: K, def: D = undefined as never): In<V, K, D extends never ? T | void : T | D> {
  if (typeof index === 'number' && index < 0) {
    index = (arr.length + (index as number)) as any;
  }
  // if (typeof arr === "string") return (arr[index] ?? def) as any;
  return (hasOwn(arr, index) ? arr[index] : def) as any;
}

type In<A, K, D> = K extends keyof A ? (A[K] extends void ? D : A[K]) : D;
type ArrayLikeType<T> = T extends ArrayLike<infer R> ? R : never;

// type A = In<[1, 2, 3], 7, 1>
// type B = In<[1, 2, 3], (-1), 1>
// const a = [1,2,3]
// type A = In<typeof a, 5, unknown>

/**
 * 查找对象中与param key类似的key
 * @param target
 * @param key
 */
export function likeKeys(target: object | Map<string, any>, key: string | RegExp): string[] {
  const reg = new RegExp(key);
  if ('undefined' !== typeof Map && target instanceof Map) {
    // keys = [...obj.keys()]; // babel编译成es5会编译成[].concat，无法使用
    const keys: string[] = [];
    for (const k of target.keys()) {
      if (reg.test(k)) keys.push(k);
    }
    return keys;
  }

  return objKeys(target).filter((key) => reg.test(key));
}

/**
 * 命令行的参数转为Map
 * @notice 部分命令行工具中"--"是全写，"-"是缩写 这里未分
 * @param arr 命令行参数数组
 * @param prefix 前缀 --d --f 前缀是"--"
 * @param defaultKey 如果前面没有变量名那么使用默认
 */
export function parseCmdParams(
  arr: string[],
  prefix = '-',
  defaultKey = 'default',
): Map<string, string[] | string | boolean> {
  const eqReg = /([^=]+)=([\s\S]+)?/;
  const isKeyReg = new RegExp(`^${prefix}`);
  const list = arr.slice();
  const map: ReturnType<typeof parseCmdParams> = new Map();
  let currentKey = defaultKey;
  let item: string;

  function setKey(): void {
    let key = item.replace(isKeyReg, '');
    if (eqReg.test(key)) {
      key = RegExp.$1;
      const value = RegExp.$2;
      value && list.unshift(value);
    }
    currentKey = key;
    if (!map.has(currentKey)) {
      map.set(currentKey, true);
    }
  }

  // fullFight
  function setValue() {
    const existValue = map.get(currentKey);
    switch (typeOf(existValue)) {
      case 'undefined':
      case 'boolean':
        map.set(currentKey, item);
        break;
      case 'array':
        (existValue as Array<string>).push(item);
        break;
      default:
        map.set(currentKey, [existValue as string, item]);
    }
  }

  while ((item = list.shift() as string)) {
    if (isKeyReg.test(item)) {
      setKey();
      continue;
    }
    setValue();
  }
  return map;
}

// 使用下面的生成器代替
// /**
//  * 创建一个自增id的闭包函数
//  * @param init {number} 初始值
//  * @param step {number} 每次增加的值
//  */
// export function createIdFn(init = 0, step = 1) {
//     let id = init;
//     return function getId(_step = step) {
//         const current = id;
//         id += _step;
//         return current;
//     };
// }

/**
 * 创建一个自增id生成器
 * @notice 第一次next传值是无效的 解决方法参考https://es6.ruanyifeng.com/#docs/generator#next-%E6%96%B9%E6%B3%95%E7%9A%84%E5%8F%82%E6%95%B0
 * @param [init = 0] 初始值
 * @param [step = 1] 每次增加的值
 * @param [end = Number.MAX_SAFE_INTEGER] 最大值；包左不包右原则，所以最后一个值是小于end的
 */
export function* idGen(
  init = 0,
  step = 1,
  end = Number.MAX_SAFE_INTEGER,
): Generator<number, void, void | number> {
  let id = init;
  const handle = init < end ? () => id < end : () => id > end;
  while (handle()) {
    const _step = (yield id) || step;
    id += _step;
  }
}

export function lazy() {
  let queue = Promise.resolve();

  function then(cb: (done: Function, value: any) => void) {
    const q = queue;
    queue = new Promise((res) => {
      q.then((value) => {
        return cb(res, value);
      });
    });
  }

  const obj = {
    /**
     * @param {number} ms 等待毫秒数
     */
    wait(ms: number) {
      then((done, value) => setTimeout(() => done(value), ms));
      return obj;
    },

    /**
     * @param {((done: Function) => void) | (() => Promise<any>)} cb 回调返回一个值或返回一个promise 供下一个do回调调用
     */
    do(cb: ((done: Function, value) => void) | ((done: Function, value) => Promise<any>)) {
      then((done, value) => {
        const res = cb(done, value);
        if (res && res.then) {
          res.then((val) => done(val));
        }
      });
      return obj;
    },
  };

  return obj;
}

export function swap<T extends object, K1 extends keyof T, K2 extends keyof T>(
  obj: T,
  k1: K1,
  k2: K2,
): T {
  const temp = obj[k1];
  obj[k1] = obj[k2] as any;
  obj[k2] = temp as any;
  return obj;
}
