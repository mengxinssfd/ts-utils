import * as common from "./common";
import * as OneByOne from "./OneByOne";
import * as UrlParse from "./urlParse";
declare const utils: {
    createArray({ start, end, len, fill }: {
        start?: number | undefined;
        end?: number | undefined;
        len?: number | undefined;
        fill?: ((item: number, index: number) => any) | undefined;
    }): any[];
    createArray({ start, end, len, fill }: {
        start?: number | undefined;
        end?: number | undefined;
        len?: number | undefined;
        fill?: any;
    }): any[];
    forEach<T>(callbackfn: (value: T, index: number, array: ArrayLike<T>) => any, thisArg?: ArrayLike<T> | Iterable<T> | undefined): void;
    from<T_1, U>(iterable: Iterable<T_1> | ArrayLike<T_1>, mapFn?: ((v: T_1, k: number) => U) | undefined): U[];
    filter<T_2>(callbackfn: (value: T_2, index: number, array: ArrayLike<T_2>) => boolean, thisArg?: ArrayLike<T_2> | undefined): T_2[];
    includes<T_3>(thisArg: ArrayLike<T_3>, searchElement: (v: T_3, index: number, arr: ArrayLike<T_3>) => boolean, fromIndex?: number | undefined): boolean;
    includes<T_4>(thisArg: ArrayLike<T_4>, searchElement: T_4, fromIndex?: number | undefined): boolean;
    keys<T_5>(target: T_5): (keyof T_5)[];
    find<T_6>(predicate: (value: T_6, index: number, obj: T_6[]) => boolean, thisArg?: ArrayLike<T_6> | undefined): void | T_6;
    debounce(callback: (...args: any[]) => void, delay: number): (...args: any[]) => void;
    polling(callback: (times: number) => void | Promise<any>, interval: number, immediate?: boolean): () => void;
    forEachByLen(len: any, callback: (index: number) => any): void;
    deepCopy(obj: any): any;
    getNumberLenAfterDot(num: string | number): number;
    typeOf(target: any): string;
    isObject(target: any): target is Object;
    isArray(target: any): target is any[];
    isArrayLike(target: any): target is ArrayLike<any>;
    isString(target: any): target is string;
    isNumber(target: any): target is number;
    isFunction(target: any): target is Function;
    isBoolean(target: any): target is boolean;
    isUndefined(target: any): target is undefined;
    isNaN(target: any): boolean;
    isEmptyObject(target: object): boolean;
    isEmpty(target: any): boolean;
    randomNumber(start?: number | undefined, end?: number | undefined, length?: number): number | number[];
    randomColor(len?: number): string | string[];
    getDateFromStr(date: string): void | Date;
    objectIsEqual(obj1: object, obj2: object): boolean;
    isEqual(a: any, b: any): boolean;
    thousandFormat(num: string | number): string;
    getFormatStr(str: any, ...params: any[]): any;
    strFillPrefix(target: string, fill: string, len: number): string;
    oneByOne(words: string, delay: number, callback?: ((word: string, index: number, words: string) => false | void) | undefined): () => void;
    getChineseNumber(number: number): any;
    generateFunctionCode(argsArrayLength: number): string;
    generateFunction(obj: object, property: string, args: any[]): any;
    formatDate: common.formatDateInterface;
    FloatCalc: {
        add(a: number, b: number): number;
        minus(a: number, b: number): number;
        mul(a: number, b: number): number;
        division(a: number, b: number): number;
    };
    removeClass(dom: any, className: string): string;
    prefixStyle(style: string): string | false;
    eventProxy(containerEl: string | HTMLElement | null, eventType: string, targetEl: string | HTMLElement, callback: (e: Event) => void): (() => void) | null;
    onceEvent(el: string | HTMLElement | Window | null | undefined, eventType: string, callback: (e: Event) => false | undefined, capture?: boolean): void;
    addDragEventListener({ el, onDown, onMove, onUp, capture }: {
        el?: string | HTMLElement | undefined;
        onDown?: ((e: MouseEvent | TouchEvent, currentXY: {
            x: number;
            y: number;
        }) => any) | undefined;
        onMove?: ((e: MouseEvent | TouchEvent, currentXY: {
            x: number;
            y: number;
        }, lastXY: {
            x: number;
            y: number;
        }, downXY: {
            x: number;
            y: number;
        }) => any) | undefined;
        onUp?: ((e: MouseEvent | TouchEvent, currentXY: {
            x: number;
            y: number;
        }, downXY: {
            x: number;
            y: number;
        }) => any) | undefined;
        capture?: {
            down?: boolean | undefined;
            up?: boolean | undefined;
            move?: boolean | undefined;
        } | undefined;
    }): () => void;
    onElResize(el: HTMLElement, handler: () => void): void;
    isDom: (target: any) => target is HTMLElement;
    addClass: (target: HTMLElement, className: string | string[]) => string;
    UrlParse: typeof UrlParse.UrlParse;
    OneByOne: typeof OneByOne.OneByOne;
};
export default utils;
