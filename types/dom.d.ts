import { SettableStyle, SettableProps } from "./TsTypes";
export declare function supportClassList(): boolean;
export declare function hasClassIe8(target: HTMLElement, className: string[] | string): boolean;
export declare function hasClassStandard(target: HTMLElement, className: string[] | string): boolean;
/**
 * 判断是否有class  必须全都存在才为true
 */
export declare const hasClass: (target: HTMLElement, className: string[] | string) => boolean;
export declare function addClassStandard(target: HTMLElement, className: string[] | string): string;
export declare function addClassIe8(target: HTMLElement, className: string[] | string): string;
export declare const addClass: (target: HTMLElement, className: string[] | string) => string;
export declare function removeClassIe8(target: HTMLElement, className: string[] | string): string;
export declare function removeClassStandard(target: HTMLElement, className: string[] | string): string;
export declare const removeClass: (dom: HTMLElement, className: string[] | string) => string;
export declare function toggleClass(target: HTMLElement, className: string): string;
/**
 * 判断是什么种类的浏览器并返回拼接前缀后的数据
 * @param style
 * @returns {string}
 */
export declare function prefixStyle<T extends keyof CSSStyleDeclaration>(style: T): T | false;
/**
 * 判断是否支持css
 * @param key
 * @param value
 * @returns {boolean}
 */
export declare function cssSupport<K extends keyof CSSStyleDeclaration, V extends CSSStyleDeclaration[K]>(key: K, value: V): boolean;
/**
 * @param style
 * @param option
 * @param {HTMLElement?} option.el
 * @param [option.toCssText = true] 合并后只触发一次重绘，性能会更好一点
 * @returns setStyle.bind(el)
 */
export declare function setStyle(style: SettableStyle, { toCssText, el, }?: {
    toCssText?: boolean;
    el?: HTMLElement | string;
}): typeof setStyle;
/**
 * 手动添加img标签下载图片
 * @param url
 * @param [props = {}] img标签的属性
 */
export declare function loadImg(url: string, props?: Partial<HTMLImageElement>): Promise<HTMLImageElement>;
export declare function loadScript(url: string): Promise<HTMLScriptElement>;
export declare function loadScript<T extends (script: HTMLScriptElement) => void>(url: string, successFn: T, errorFn?: Function): void;
/**
 * @param [el = window]
 * @return {}
 */
export declare function noScroll(el?: Window | HTMLElement | string): () => void;
/**
 * 通过object来生成html元素
 * @tips: attribute（特性），是我们赋予某个事物的特质或对象。property（属性），是早已存在的不需要外界赋予的特质。
 * @param tagName
 * @param params
 */
export declare function createHtmlElement<K extends keyof HTMLElementTagNameMap, R extends HTMLElementTagNameMap[K]>(tagName: K, params?: {
    attrs?: {
        [k: string]: any;
    };
    props?: SettableProps<R>;
    parent?: HTMLElement | string;
    children?: HTMLElement[] | NodeList;
}): R;
/**
 * @alias createHtmlElement
 */
export declare const createElement: typeof createHtmlElement;
export declare function createHiddenHtmlElement<E extends HTMLDivElement>(): E;
export declare function createHiddenHtmlElement<E extends HTMLDivElement>(props: SettableProps<E>): E;
export declare function createHiddenHtmlElement<K extends keyof HTMLElementTagNameMap, E extends HTMLElementTagNameMap[K]>(props: SettableProps<E>, tagName: K): E;
/**
 * 获取文字缩放大小
 * 使用环境：微信浏览器调整文字大小，普通浏览器"ctr" + "+"无效,调整浏览器最小文字大小
 * @param reverse
 * @return {number}
 */
export declare function getFontScale(reverse?: boolean): number;
/**
 * 是否在iframe中
 */
export declare function inIframe(): boolean;
/**
 * 判断是否固定在顶部的条件
 * @param target {HTMLElement}
 * @param {Function} cb
 * @param {number?} [top=0]
 * @param {HTMLElement|window} [container=window]
 * @return {function(): void}
 */
export declare function scrollFixedWatcher(target: HTMLElement, cb: (reach: boolean) => void, top?: number, container?: HTMLElement | Window): () => void;
declare type Rem = "rem";
declare type Px = "px";
declare type Percent = "%";
declare type RemVal = `${number}${Rem}`;
declare type PxVal = `${number}${Px}`;
declare type PercentVal = `${number}${Percent}`;
/**
 * 获取等于1rem的像素值
 */
export declare function get1rem(): number;
/**
 * rem转像素
 * @param rem
 */
export declare function rem2px(rem: RemVal): PxVal;
/**
 * 像素转rem
 * @param px
 */
export declare function px2rem(px: PxVal): RemVal;
export declare function percent2px(p: PercentVal, relativePx: number | PxVal): PxVal;
/**
 * 像素转百分比
 * @param px
 * @param relativePx
 * @returns {string} PercentVal 保留fractionDigits位小数
 */
export declare function px2Percent(px: PxVal, relativePx: number | PxVal): PercentVal;
/**
 * rem转百分比
 * @param rem
 * @param relativePx
 */
export declare function rem2Percent(rem: RemVal, relativePx: number | PxVal): PercentVal;
/**
 * 百分百转rem
 * @param p
 * @param relativePx
 */
export declare function percent2Rem(p: PercentVal, relativePx: number | PxVal): RemVal;
export {};
