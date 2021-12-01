"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = exports.inRanges = exports.inRange = exports.chunk = exports.castArray = exports.unique = exports.arrayRemoveItemsBy = exports.arrayRemoveItem = exports.insertToArray = exports.binaryFindIndex = exports.binaryFind = exports.binaryFind2 = exports.flat = exports.findIndexRight = exports.findIndex = exports.find = exports.includes = exports.filter = exports.from = exports.forEachRight = exports.reduceAsync = exports.mapAsync = exports.forEachAsync = exports.forEach = exports.createArray = void 0;
const dataType_1 = require("./dataType");
/**
 * @description len与end两个都有值时，以小的为准
 * @example
 * // returns [0, 1]
 * createArray({end: 2});
 * @example
 * // returns [0, 1]
 * createArray({start: 0, end: 2});
 * @example
 * // [1, 1]
 * createArray({start:0, end:2, len:2, fill:1});
 * @example
 * // returns [1, 2]
 * createArray(start: 0, len: 2, fill: item => item+1);
 */
function createArray({ start = 0, end, len, fill }) {
    let e = start;
    if (len && end) {
        e = Math.min(start + len, end);
    }
    else {
        if (len !== undefined) {
            e = start + len;
        }
        if (end !== undefined) {
            e = end;
        }
    }
    let callback;
    switch ((0, dataType_1.typeOf)(fill)) {
        case "function":
            callback = fill;
            break;
        case "undefined":
        case "null":
            callback = (i) => i;
            break;
        default:
            callback = () => fill;
    }
    const arr = [];
    for (let item = start, index = 0; item < e; item++, index++) {
        arr.push(callback(item, index));
    }
    return arr;
}
exports.createArray = createArray;
// ie9支持
// forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
/**
 * @param arr
 * @param callbackFn
 * @param elseCB 类似于Python的for else中的else，
 *        只会在完整的遍历后执行，任何一个break都不会触发
 * @returns {boolean} isDone
 */
function forEach(arr, callbackFn, elseCB) {
    // 不能直接把arr.length放进循环，否则在循环里新增的话length会变长,原生的不会变长
    const len = arr.length || 0;
    // if (!isArrayLike(arr)) throw new TypeError();
    for (let i = 0; i < len; i++) {
        if (callbackFn(arr[i], i, arr) === false)
            return false;
    }
    elseCB && elseCB();
    return true;
}
exports.forEach = forEach;
/**
 * 跟promiseQueue类似，不过此函数是callback异步，重点在callback
 * @param cbAsync 异步回调
 * @param thisArg
 */
async function forEachAsync(cbAsync, thisArg) {
    const arr = thisArg || this;
    // 不能直接把arr.length放进循环，否则在循环里新增的话length会变长,原生的不会变长
    const len = arr.length;
    // if (!isArrayLike(arr)) throw new TypeError();
    for (let i = 0; i < len; i++) {
        const v = await cbAsync(arr[i], i, arr);
        if (v === false)
            break;
    }
}
exports.forEachAsync = forEachAsync;
async function mapAsync(cbAsync, thisArg) {
    const arr = thisArg || this;
    const result = [];
    await forEachAsync(async (v, k, a) => {
        const item = await cbAsync(v, k, a);
        result.push(item);
    }, arr);
    return result;
}
exports.mapAsync = mapAsync;
/**
 * reduce promise 跟 promiseQueue差不多，此函数多了callbackFn
 * @param callbackfn
 * @param initValue
 * @param thisArg
 */
async function reduceAsync(callbackfn, initValue, thisArg) {
    const arr = (thisArg || this).slice();
    let previousValue = initValue !== null && initValue !== void 0 ? initValue : await arr.shift()();
    await forEachAsync(async (v, k, a) => {
        previousValue = await callbackfn(previousValue, v, k, a);
    }, arr);
    return previousValue;
}
exports.reduceAsync = reduceAsync;
function forEachRight(callbackfn, thisArg) {
    const arr = thisArg || this;
    if (!(0, dataType_1.isArray)(arr))
        throw new TypeError();
    // if (!isArrayLike(arr)) throw new TypeError();
    for (let i = arr.length - 1; i > -1; i--) {
        if (callbackfn(arr[i], i, arr) === false)
            break;
    }
}
exports.forEachRight = forEachRight;
// from<T, U>(iterable: Iterable<T> | ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
function from(iterable, mapFn = (value) => value) {
    const arr = [];
    if ((0, dataType_1.isArrayLike)(iterable)) {
        forEach(iterable, ((v, k) => {
            arr.push(mapFn(v, k));
        }));
    }
    else {
        for (const v of iterable) {
            arr.push(mapFn(v));
        }
    }
    return arr;
}
exports.from = from;
// filter<S extends T>(callbackfn: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[]
function filter(callbackfn, thisArg) {
    const arr = thisArg || this;
    // if (!isArrayLike(arr)) throw new TypeError();
    const fList = [];
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        const value = arr[i];
        if (callbackfn(value, i, arr)) {
            fList.push(value);
        }
    }
    return fList;
}
exports.filter = filter;
// includes(searchElement: T, fromIndex?: number): boolean
function includes(thisArg, searchElement, fromIndex = 0) {
    const arr = thisArg || this;
    // if (!isArrayLike(arr)) throw new TypeError();
    const len = arr.length;
    for (let i = fromIndex; i < len; i++) {
        const item = arr[i];
        if (typeof searchElement === "function") {
            if (searchElement(item, i, arr))
                return true;
        }
        else {
            if (item === searchElement)
                return true;
        }
        if ((0, dataType_1.isNaN)(item) && (0, dataType_1.isNaN)(searchElement))
            return true;
    }
    return false;
}
exports.includes = includes;
// find<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
// find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
function find(predicate, thisArg) {
    const arr = thisArg || this;
    // if (!isArrayLike(arr)) throw new TypeError();
    // if (!isFunction(predicate)) return; // 在typescript中有类型检查，不需要这一句
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        const item = arr[i];
        if (predicate(item, i, arr))
            return item;
    }
}
exports.find = find;
function findIndex(predicate, thisArg) {
    const arr = thisArg || this;
    if (!(0, dataType_1.isArrayLike)(arr))
        throw new TypeError();
    if (!(0, dataType_1.isFunction)(predicate))
        return -1; // 在typescript中有类型检查，不需要这一句(用call和apply调用无法检查，还是加上)
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        const item = arr[i];
        if (predicate(item, i, arr))
            return i;
    }
    return -1;
}
exports.findIndex = findIndex;
function findIndexRight(predicate, thisArg) {
    const arr = thisArg || this;
    if (!(0, dataType_1.isArrayLike)(arr))
        throw new TypeError();
    if (!(0, dataType_1.isFunction)(predicate))
        return -1; // 在typescript中有类型检查，不需要这一句(用call和apply调用无法检查，还是加上)
    const end = arr.length - 1;
    for (let i = end; i >= 0; i--) {
        const item = arr[i];
        if (predicate(item, i, arr))
            return i;
    }
    return -1;
}
exports.findIndexRight = findIndexRight;
function flat(target, depth = 1) {
    function innerFlat(innerArr, innerDepth = 0) {
        if (!(0, dataType_1.isArray)(innerArr) || innerDepth++ === depth)
            return innerArr;
        const result = [];
        for (let i = 0; i < innerArr.length; i++) {
            const newItem = innerFlat(innerArr[i], innerDepth);
            result.push(...((0, dataType_1.isArray)(newItem) ? newItem : [newItem]));
        }
        return result;
    }
    return innerFlat(target);
}
exports.flat = flat;
/**
 * 二分查找item
 * @param arr 要查找的数组
 * @param handler 判断条件 item => target - item 返回值为0时为要找的值，小于0则往前找，大于0往后找
 * @param pcz 不用传
 */
function binaryFind2(arr, handler, pcz = 0) {
    if (arr.length === 0)
        return undefined;
    let result;
    let middleIndex = Math.floor(arr.length / 2);
    const item = arr[middleIndex];
    // 当前index = middleIndex + pcz
    const value = handler(item, middleIndex + pcz, arr);
    if (value === 0) {
        return item;
    }
    else {
        if (arr.length === 1) {
            return undefined;
        }
        // 如果target大于当前item值，则获取middle右边，否则相反
        if (value > 0) {
            middleIndex++;
            result = binaryFind2(arr.slice(middleIndex), handler, pcz + middleIndex);
        }
        else {
            result = binaryFind2(arr.slice(0, middleIndex), handler, pcz);
        }
    }
    return result;
}
exports.binaryFind2 = binaryFind2;
function binaryFind(arr, handler) {
    let start = 0;
    let end = arr.length;
    while (start < end) {
        const mid = ~~((end + start) / 2);
        const item = arr[mid];
        const v = handler(item, mid, arr);
        if (v === 0) {
            return item;
        }
        else if (v > 0) {
            start = mid + 1;
        }
        else {
            end = mid;
        }
    }
    return undefined;
}
exports.binaryFind = binaryFind;
/**
 * 二分查找item index
 * @param arr 要查找的数组
 * @param handler 判断条件 item => target - item 返回值为0时为要找的值，小于0则往前找，大于0往后找
 */
function binaryFindIndex(arr, handler) {
    if (arr.length === 0)
        return -1;
    let start = 0;
    let end = arr.length;
    do {
        const middleIndex = Math.floor((end - start) / 2) + start;
        const value = handler(arr[middleIndex], middleIndex, start, end);
        if (value === 0) {
            return middleIndex;
        }
        else if (value > 0) {
            start = middleIndex + 1;
        }
        else {
            end = middleIndex;
        }
    } while (end > start);
    return -1;
}
exports.binaryFindIndex = binaryFindIndex;
/**
 * item插入到数组，在原数组中改变
 * @param insert 插入的item
 * @param to 要插入的位置 如果to是函数的话没有找到则不会插进数组
 * @param array 要插入item的数组
 * @param after 默认插到前面去
 * @param reverse 是否反向遍历
 */
function insertToArray(insert, to, array, { after = false, reverse = false } = {}) {
    const inserts = castArray(insert);
    let index = to;
    if ((0, dataType_1.isFunction)(to)) {
        index = (reverse ? findIndexRight : findIndex)((v, k, a) => {
            return to(v, k, a, insert);
        }, array);
        if (index === -1) {
            return -1;
        }
    }
    else {
        if (to < 0) {
            index = 0;
        }
        else if (to > array.length) {
            index = array.length - (after ? 1 : 0);
        }
    }
    after && index++;
    array.splice(index, 0, ...inserts);
    return index;
}
exports.insertToArray = insertToArray;
function arrayRemoveItem(item, array) {
    const index = array.indexOf(item);
    if (index === -1)
        return;
    return array.splice(index, 1)[0];
}
exports.arrayRemoveItem = arrayRemoveItem;
function arrayRemoveItemsBy(by, array) {
    const removedItems = [];
    forEachRight((v, k, a) => {
        if (!by(v, k, a))
            return;
        const item = array.splice(k, 1)[0];
        removedItems.unshift(item);
    }, array);
    return removedItems;
}
exports.arrayRemoveItemsBy = arrayRemoveItemsBy;
function unique(target, isRepeatFn) {
    if (!target.length)
        return target;
    const fn = isRepeatFn || ((v1, v2) => v1 === v2 || (0, dataType_1.isNaN)(v1) && (0, dataType_1.isNaN)(v2));
    const result = [target[0]];
    for (let i = 1; i < target.length; i++) {
        const item = target[i];
        if (result.some(resItem => fn(resItem, item)))
            continue;
        result.push(item);
    }
    return result;
}
exports.unique = unique;
/**
 * @example
 * castArray([1]); // [1]
 * @example
 * castArray(1); // [1]
 * @param value
 */
function castArray(value) {
    return ((0, dataType_1.isArray)(value) ? value : [value]);
}
exports.castArray = castArray;
/**
 * 数组分片
 * @example
 * chunk([0,1,2,3,4,5,6], 3) // => [[0,1,2],[3,4,5],[6]]
 * @param arr
 * @param chunkLen
 */
function chunk(arr, chunkLen) {
    if (!(0, dataType_1.isArray)(arr))
        throw new TypeError("chunk param arr type error");
    if (chunkLen < 1)
        return arr.slice();
    const result = [];
    let i = 0;
    while (i < arr.length) {
        result.push(arr.slice(i, i += chunkLen));
    }
    return result;
}
exports.chunk = chunk;
/**
 *  判断min <= num <= max
 * @param value
 * @param [min = Number.MIN_SAFE_INTEGER]
 * @param [max = Number.MAX_SAFE_INTEGER]
 */
function inRange(value, [min = -Infinity, max = Infinity]) {
    return min <= value && value <= max;
}
exports.inRange = inRange;
/**
 * @param value {number}
 * @param ranges {[number,number][]}
 */
function inRanges(value, ...ranges) {
    return ranges.some(item => inRange(value, item));
}
exports.inRanges = inRanges;
function groupBy(arr, key, defaultKey = "*") {
    const cb = (0, dataType_1.isFunction)(key) ? key : item => item[key];
    return arr.reduce((result, item) => {
        var _a;
        const k = (_a = cb(item, result)) !== null && _a !== void 0 ? _a : defaultKey;
        if (!result.hasOwnProperty(k)) {
            result[k] = [item];
        }
        else {
            result[k].push(item);
        }
        return result;
    }, {});
}
exports.groupBy = groupBy;
