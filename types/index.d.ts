import { OneByOne } from "./OneByOne";
import { UrlParse } from "./urlParse";
declare const utils: {
    debounce(callback: (...args: any[]) => void, delay: number): (...args: any[]) => void;
    polling(callback: (...args: any[]) => void | Promise<any>, interval: number, immediate?: boolean): () => void;
    deepCopy(obj: any): any;
    formatDate(formatStr: string): string;
    getNumberLenAfterDot(num: string | number): number;
    typeOf(target: any): string;
    isObject(target: any): target is Object;
    isArray(target: any): target is any[];
    isArrayLike(target: any): boolean;
    isString(target: any): target is string;
    isNumber(target: any): target is number;
    isFunction(target: any): target is Function;
    isBoolean(target: any): target is boolean;
    isUndefined(target: any): target is undefined;
    isNaN(target: any): boolean;
    isEmpty(target: any): boolean;
    randomNumber(start?: number | undefined, end?: number | undefined): number;
    randomColor(): string;
    getDateFromStr(dateString: string): Date;
    objectIsEqual(obj1: any, obj2: any): boolean;
    isEqual(a: any, b: any): boolean;
    qwFormat(num: string | number): string;
    getFormatStr(): any;
    strFillPrefix(target: string, fill: any, len: number): string;
    oneByOne(words: string, delay: number, callback?: ((word: string, words: string) => boolean | undefined) | undefined): void;
    getChineseNumber(number: number): any;
    generateFunctionCode(argsArrayLength: number): string;
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
        el: string | HTMLElement | null | undefined;
        onDown: (e: MouseEvent | TouchEvent, downXY: {
            x: number;
            y: number;
        }) => void;
        onMove: (e: MouseEvent | TouchEvent, moveXY: {
            x: number;
            y: number;
        }, lastXY: {
            x: number;
            y: number;
        }, downXY: {
            x: number;
            y: number;
        }) => void;
        onUp: (e: MouseEvent | TouchEvent, downXY: {
            x: number;
            y: number;
        }, upXY: {
            x: number;
            y: number;
        }) => void;
        capture: boolean;
    }): () => void;
    isDom: (target: any) => target is HTMLElement;
    addClass: (target: HTMLElement, className: string | string[]) => string;
    OneByOne: typeof OneByOne;
    UrlParse: typeof UrlParse;
};
export default utils;
