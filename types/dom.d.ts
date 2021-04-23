import { ReadonlyKeys } from "./TsTypes";
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
 * 手动添加img标签下载图片
 * @param url
 */
export declare function loadImg(url: string): Promise<HTMLImageElement>;
/**
 * 手动添加script
 * @param url
 */
export declare function loadScript(url: string): Promise<HTMLScriptElement>;
/**
 * @param el
 * @return {}
 */
export declare function noScroll(el: Window | HTMLElement | string): () => void;
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
    props?: {
        style?: Partial<Omit<CSSStyleDeclaration, ReadonlyKeys<CSSStyleDeclaration>>>;
    } & Partial<Omit<R, "style" | ReadonlyKeys<R>>>;
    parent?: HTMLElement | null;
    children?: HTMLElement[];
}): R;
export declare const createElement: typeof createHtmlElement;
/**
 * 获取文字缩放大小
 * 使用环境：微信浏览器调整文字大小，普通浏览器"ctr" + "+"无效
 * @param reverse
 * @return {number}
 */
export declare function getFontScale(reverse?: boolean): number;
