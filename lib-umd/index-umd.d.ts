import * as OneByOne from "./OneByOne";
import * as UrlParse from "./urlParse";
declare const utils: {
    createArray({ start, end, len, callback }: {
        start?: number | undefined;
        end?: number | undefined;
        len?: number | undefined;
        callback?: ((item: any, index: any) => any) | undefined;
    }): any[];
    forEach(callbackfn: (value: any, index: number, array: ArrayLike<any>) => any, thisArg?: ArrayLike<any> | undefined): void;
    from(iterable: ArrayLike<any>, mapFn?: ((v: any, k: number, array: ArrayLike<any>) => any) | undefined): any[];
    filter(callbackfn: (value: any, index: number, array: ArrayLike<any>) => boolean, thisArg?: ArrayLike<any> | undefined): any[];
    includes(thisArg: ArrayLike<any>, searchElement: any, fromIndex?: number): boolean;
    keys(target: object | []): string[];
    find(predicate: (value: any, index: number, obj: any[]) => boolean, thisArg?: ArrayLike<any> | undefined): any;
    debounce(callback: (...args: any[]) => void, delay: number): (...args: any[]) => void;
    polling(callback: (times: number) => void | Promise<any>, interval: number, immediate?: boolean): () => void;
    forEachByLen(len: any, callback: (index: number) => any): void;
    deepCopy(obj: any): any;
    formatDate(formatStr: string): string;
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
