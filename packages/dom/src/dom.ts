import {
  root,
  castArray,
  includes,
  unique,
  fromCamel,
  isArray,
  isString,
  assign,
  forEachObj,
  objReduce,
  pickByKeys,
  divide,
  getSafeNum,
  times,
} from '@mxssfd/core';
import type { SettableProps, SettableStyle, Tuple } from '@mxssfd/types';
import { isDom, isNodeList } from './domType';
import { onceEvent } from './event';
// 所有主要浏览器都支持 createElement() 方法
const elementStyle: CSSStyleDeclaration = root?.document?.createElement('div').style ?? {};
const vendor: string | false = (() => {
  const transformName: any = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform',
  };
  for (const key in transformName) {
    const transform = transformName[key];
    if (elementStyle[transform] !== undefined) {
      return key;
    }
  }
  return false;
})();

export function supportClassList(): boolean {
  // classList ie9以上支持
  return !!root?.document?.documentElement.classList;
}

function name2List(className: string[] | string): string[] {
  if (!className) return [];
  let list = className as string[];
  if (isString(className)) {
    list = [className.trim()];
  }
  return list.reduce((init, v) => {
    const split = v.trim().split(/ +/);
    init.push(...split);
    return init;
  }, [] as string[]);
}

export function hasClassIe8(target: HTMLElement, className: string[] | string): boolean {
  const list = name2List(className);
  const originClass = target.className;
  const classList = originClass.split(/ +/);
  return list.every((i) => includes(classList, i));
}

export function hasClassStandard(target: HTMLElement, className: string[] | string): boolean {
  const list = name2List(className);
  const classList = target.classList;
  return list.every((i) => includes(classList, i));
}

/**
 * 判断是否有class  必须全都存在才为true
 */
export const hasClass: (target: HTMLElement, className: string[] | string) => boolean =
  supportClassList() ? hasClassStandard : hasClassIe8;

export function addClassStandard(target: HTMLElement, className: string[] | string): string {
  const list = name2List(className);
  const classList = target.classList;
  list.forEach((i) => classList.add(i));

  return target.className;
}

export function addClassIe8(target: HTMLElement, className: string[] | string): string {
  let names = name2List(className);
  const oldClass = target.className + ' ' + names.join(' ');
  names = oldClass.split(' ');
  names = unique(names);
  names = names.filter((it) => Boolean(it));
  target.className = names.join(' ');
  return target.className;
}

export const addClass: (target: HTMLElement, className: string[] | string) => string =
  supportClassList() ? addClassStandard : addClassIe8;

export function removeClassIe8(target: HTMLElement, className: string[] | string): string {
  const list = name2List(className);
  const classList = unique(
    target.className.split(/ +/).filter((i) => {
      return !includes(list, i);
    }),
  );

  return (target.className = classList.join(' '));
}

export function removeClassStandard(target: HTMLElement, className: string[] | string): string {
  const list = name2List(className);
  list.forEach((i) => {
    target.classList.remove(i);
  });
  return target.className;
}

export const removeClass: (dom: HTMLElement, className: string[] | string) => string =
  supportClassList() ? removeClassStandard : removeClassIe8;

export function toggleClass(target: HTMLElement, className: string): string {
  if (hasClass(target, className)) {
    return removeClass(target, className);
  } else {
    return addClass(target, className);
  }
}

/**
 * 判断是什么种类的浏览器并返回拼接前缀后的数据
 * @param style
 * @returns {string}
 */
export function prefixStyle<T extends keyof CSSStyleDeclaration>(style: T): T | null {
  if (vendor === false) {
    return null;
  }
  if (vendor === 'standard') {
    return style;
  }
  return (vendor + (style as string).charAt(0).toUpperCase() + (style as string).substr(1)) as any;
}

/**
 * 判断是否支持css
 * @param key
 * @param value
 * @returns {boolean}
 */
export function cssSupport<K extends keyof CSSStyleDeclaration, V extends CSSStyleDeclaration[K]>(
  key: K,
  value: V,
) {
  if (key in elementStyle) {
    elementStyle[key] = value;
    return elementStyle[key] === value;
  } else {
    return false;
  }
}

// export function setStyle(this: HTMLElement, style: SettableStyle);
// export function setStyle(style: SettableStyle, el: HTMLElement | string);
/**
 * @param style
 * @param option
 * @param {HTMLElement?} option.el
 * @param [option.toCssText = true] 合并后只触发一次重绘，性能会更好一点
 * @returns setStyle.bind(el)
 */
export function setStyle(
  this: HTMLElement | void,
  style: Array<SettableStyle> | SettableStyle,
  { toCssText = true, el }: { toCssText?: boolean; el?: HTMLElement | string } = {},
): typeof setStyle {
  if (isString(el)) el = document.querySelector(el) as HTMLDivElement;
  const target: HTMLElement = el || (this as HTMLElement);
  if (!isDom(target)) throw new TypeError('setStyle param el | this is not HTMLElement');
  toCssText = isArray(style) ? false : toCssText;
  if (toCssText) {
    const cssText = target.style.cssText;
    const cssTextObj = cssText
      .replace(/; ?$/, '')
      .split(';')
      .reduce((init, v) => {
        const [key, value] = v.split(/: ?/) as Tuple<string, 2>;
        init[key] = value;
        return init;
      }, {} as Record<string, any>);
    assign(cssTextObj, style);
    target.style.cssText = objReduce(
      cssTextObj,
      (result, v, k) => {
        return result + `${fromCamel(k as string, '-')}: ${v};`;
      },
      '',
    );
  } else {
    const styleList = castArray(style);
    styleList.forEach((style) => assign(target.style, style));
  }
  return setStyle.bind(target);
}

/**
 * 手动添加img标签下载图片
 * @param url
 * @param [props = {}] img标签的属性
 */
export function loadImg(
  url: string,
  props: Partial<HTMLImageElement> = {},
): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>(function (resolve, reject) {
    // const img = new Image();
    const onerror = (ev: Event) => {
      reject(ev);
    };
    const img = createHtmlElement('img', {
      props: assign(
        {
          // 不支持crossOrigin的浏览器（IE 10及以下版本不支持，Android 4.3 及以下版本不支持）
          // 可以使用 XMLHttprequest 和 URL.createObjectURL() 来做兼容
          // 不是所有的图片都支持 如http://gchat.qpic.cn/gchatpic_new/0/0-0-58CAD4E2605562E55627B37C15FACB65/0?term=2
          crossOrigin: 'anonymous',
          onload() {
            resolve(img);
          },
          onabort: onerror,
          onerror,
        },
        props,
      ),
    });
    img.src = url;
  });
}

export function loadScript(url: string): Promise<HTMLScriptElement>;
export function loadScript(
  url: string,
  props: Partial<HTMLScriptElement>,
): Promise<HTMLScriptElement>;
export function loadScript(param: {
  url: string;
  props?: Partial<HTMLScriptElement>;
  attrs?: object;
  onLoad: (el: HTMLScriptElement) => void;
  onError?: Function;
}): void;
export function loadScript(param: {
  url: string;
  props?: Partial<HTMLScriptElement>;
  attrs?: object;
  onLoad?: (el: HTMLScriptElement) => void;
  onError: Function;
}): void;
/**
 * 手动添加script
 * @param param
 * @param props
 */
export function loadScript(param: any, props?: any) {
  let url = '';
  let onLoad, onError, attrs: any;
  if (typeof param === 'string') {
    url = param;
  } else {
    ({ url, onLoad, onError, props, attrs } = param);
  }
  const cb = (successFn: Function, errorFn: Function) => {
    const script = createElement('script', {
      props: {
        onload: () => successFn && successFn(script),
        onabort: errorFn,
        onerror: errorFn,
        src: url,
        ...props,
      },
      attrs,
      parent: document.body, // 插到body上是最后执行的，未插到dom上是不会下载的，所以不用在意props的设置顺序
    });
  };
  if (onLoad || onError) {
    cb(onLoad, onError);
    return;
  }
  return new Promise(function (resolve, reject) {
    cb(resolve as any, reject);
  });
}

/**
 * @param [el = window]
 * @return {}
 */
export function noScroll(el: Window | HTMLElement | string = window) {
  let scroller: HTMLElement = el as HTMLElement;
  if (isString(el)) {
    scroller = document.querySelector(el) as HTMLElement;
    if (!scroller) throw new Error(`el not found`);
  } else if (el === window) {
    if (document.body.scrollTop) {
      scroller = document.body;
    } else {
      scroller = document.documentElement;
    }
  }

  const last = pickByKeys(getComputedStyle(scroller), ['marginTop', 'overflow']);
  const scrollTop = scroller.scrollTop;
  scroller.scrollTop = 0;
  scroller.style.overflow = 'hidden';
  scroller.style.marginTop = -scrollTop + parseInt(last.marginTop) + 'px';
  return function () {
    assign(scroller.style, last);
    // scrollTop必须最后传 否则可能不能回到原位
    scroller.scrollTop = scrollTop;
  };
}

/**
 * 通过object来生成html元素
 * @tips: attribute（特性），是我们赋予某个事物的特质或对象。property（属性），是早已存在的不需要外界赋予的特质。
 * @param tagName
 * @param params
 */
export function createHtmlElement<
  K extends keyof HTMLElementTagNameMap,
  R extends HTMLElementTagNameMap[K],
>(
  tagName: K,
  params: {
    attrs?: { [k: string]: any };
    props?: SettableProps<R>;
    parent?: HTMLElement | string;
    children?: HTMLElement[] | NodeList;
  } = {},
): R {
  const el = document.createElement(tagName);
  const { attrs = {}, props = {}, parent, children } = params;
  // set props
  forEachObj(props, (v, k) => {
    const isObjValue = typeof v === 'object';
    if (k === 'style' && isObjValue) {
      // 未添加到body中，不会触发重绘
      assign(el.style, v);
      return;
    }
    el[k] = v;
  });
  // set attrs
  forEachObj(attrs, (v, k) => {
    const isObjValue = typeof v === 'object';
    el.setAttribute(k as string, isObjValue ? JSON.stringify(v) : v);
  });
  // set children
  if (isArray(children) || isNodeList(children)) {
    children.forEach((child) => el.appendChild(child));
  }
  // set parent
  if (parent) {
    if (isDom(parent)) {
      parent.appendChild(el);
    } else if (isString(parent)) {
      const pr = document.querySelector(parent);
      if (!pr) throw new TypeError(`createHtmlElement param 'parent' => "${parent}" not founded`);
      pr.appendChild(el);
    }
  }
  return el as any;
}

/**
 * @alias createHtmlElement
 */
export const createElement = createHtmlElement;

export function createHiddenHtmlElement<E extends HTMLDivElement>(): E;
export function createHiddenHtmlElement<E extends HTMLDivElement>(props: SettableProps<E>): E;
export function createHiddenHtmlElement<
  K extends keyof HTMLElementTagNameMap,
  E extends HTMLElementTagNameMap[K],
>(props: SettableProps<E>, tagName: K): E;
/**
 * 创建一个隐藏的html元素
 * @param props
 * @param tagName
 */
export function createHiddenHtmlElement(props?: any, tagName = 'div') {
  return createHtmlElement(tagName as keyof HTMLElementTagNameMap, {
    props: {
      ...props,
      style: {
        position: 'fixed',
        left: '-10000px',
        visibility: 'hidden',
        ...props?.style,
      },
    },
    parent: document.body,
  });
}

/**
 * 获取文字缩放大小
 * 使用环境：微信浏览器调整文字大小，普通浏览器"ctr" + "+"无效,调整浏览器最小文字大小
 * @param reverse
 * @return {number}
 */
export function getFontScale(reverse = false) {
  const fontSize = 10;
  const div = createElement('div', {
    props: { style: { fontSize: fontSize + 'px' } },
    parent: document.body,
  });
  const realFontSize = getComputedStyle(div).fontSize;
  document.body.removeChild(div);
  if (reverse) {
    return fontSize / parseInt(realFontSize);
  }
  return parseInt(realFontSize) / fontSize;
}

/**
 * 是否在iframe中
 */
export function inIframe(): boolean {
  /* // 方式1
     if (self.frameElement && self.frameElement.tagName == "IFRAME") {
         alert('在iframe中');
     }
     // 方式2
     if (window.frames.length != parent.frames.length) {
         alert('在iframe中');
     }
     // 方式3
     if (window.self != window.top) {
         alert('在iframe中');
     } */

  return Boolean(
    (root.self.frameElement && root.self.frameElement.tagName === 'IFRAME') ||
      root.frames.length !== parent.frames.length ||
      root.self !== root.top,
  );
}

/**
 * 判断是否固定在顶部的条件
 * @param target {HTMLElement}
 * @param {Function} cb
 * @param {number?} [top=0]
 * @param {HTMLElement|window} [container=window]
 * @return {function(): void}
 */
export function scrollFixedWatcher(
  target: HTMLElement,
  cb: (reach: boolean) => void,
  top = 0,
  container: HTMLElement | Window = window,
): () => void {
  const getScrollTop =
    container === window
      ? () => document.documentElement.scrollTop || document.body.scrollTop
      : () => (container as HTMLElement).scrollTop;

  const rect = target.getBoundingClientRect();
  const distanceTop = rect.top + getScrollTop() - top;
  let handler: Function;
  // 立即判断一次
  cb(getScrollTop() >= distanceTop);
  container.addEventListener(
    'scroll',
    (handler = function () {
      // 当滑动距离大于等于分类距离顶部位置时，则固定定位
      cb(getScrollTop() >= distanceTop);
    }),
  );
  return function () {
    container.removeEventListener('scroll', handler as any);
  };
}

type Rem = 'rem';
type Px = 'px';
type Percent = '%';

type RemVal = `${number}${Rem}`;
type PxVal = `${number}${Px}`;
type PercentVal = `${number}${Percent}`;

// type CSSLenUnit = RemVal | PxVal | PercentVal;

// 保留小数位
const fractionDigits = 6;

const tempToFixed = (num: number) => {
  const f = num.toFixed(fractionDigits);
  // 经toFixed后一定会有"."，所以不需要担心10000这种会变成1
  return f.replace(/\.?0+$/, '');
};

/**
 * 获取等于1rem的像素值
 */
export function get1rem(): number {
  const computed = getComputedStyle(document.documentElement);
  return parseInt(computed.fontSize);
}

/**
 * rem转像素
 * @param rem
 */
export function rem2px(rem: RemVal): PxVal {
  const fs = get1rem();
  return (fs * parseFloat(rem) + 'px') as PxVal;
}

/**
 * 像素转rem
 * @param px
 */
export function px2rem(px: PxVal): RemVal {
  const fs = get1rem();
  const result = divide(parseFloat(px), fs);
  return (tempToFixed(result) + 'rem') as RemVal;
}

export function percent2px(p: PercentVal, relativePx: number | PxVal): PxVal {
  const t = times(parseFloat(relativePx as string), parseFloat(p));
  return (divide(t, 100) + 'px') as PxVal;
}

/**
 * 像素转百分比
 * @param px
 * @param relativePx
 * @returns {string} PercentVal 保留fractionDigits位小数
 */
export function px2Percent(px: PxVal, relativePx: number | PxVal): PercentVal {
  const val = (parseFloat(px) * 100) / parseFloat(relativePx as string);
  const toFixed = tempToFixed(val);
  return (toFixed + '%') as PercentVal;
}

/**
 * rem转百分比
 * @param rem
 * @param relativePx
 */
export function rem2Percent(rem: RemVal, relativePx: number | PxVal): PercentVal {
  return px2Percent(rem2px(rem), relativePx);
}

/**
 * 百分百转rem
 * @param p
 * @param relativePx
 */
export function percent2Rem(p: PercentVal, relativePx: number | PxVal): RemVal {
  return px2rem(percent2px(p, relativePx));
}

/*export function toPx(from: CSSLenUnit, relativePx: number): string {
    if (/rem$/.test(from)) {
        return rem2px(from as RemVal);
    }
    if (/%$/.test(from)) {
        return percent2px(from as PercentVal, relativePx);
    }
    return from;
}*/

/*export function translateCssLenUnit(from: `${number}${Px | Rem}`, to: Px): string;
export function translateCssLenUnit(from: `${number}${Percent}`, to: Px | Rem, relativePx: number): string;
export function translateCssLenUnit(from: `${number}${(Px | Rem)}`, to: Percent, relativePx: number): string;
export function translateCssLenUnit(from: `${number}${CSSLenUnit}`, to: CSSLenUnit, relativePx: number): string {
    return "";
}*/

// translateCssLenUnit("100%", "rem");
// 管道语法
// "100px" |> ((_: any) => translateCssLenUnit(_, "rem"));

/**
 * 用于类似手风琴的伸缩效果
 * @param el  el的宽或高必须是子元素撑开的，否则无效
 * @param type
 * @param transition
 */
export function toggleWidthOrHeight(
  el: HTMLElement,
  type: 'width' | 'height',
  transition: {
    duration?: string;
    delay?: string;
    timingFunction?: string;
  } = {},
) {
  const trans = 'transition';
  const prefixTransition = prefixStyle(trans) as string;

  const isHide = el.getAttribute('toggle-status') === 'hide';
  const transitionValue = `${type} ${transition.duration || '.3s'} ${
    transition.timingFunction || ''
  } ${transition.delay || ''}`.trim();
  if (!isHide) {
    el.setAttribute('toggle-status', 'hide');
    const set = setStyle(
      [
        { [trans]: 'none' },
        { [type]: (type === 'height' ? el.scrollHeight : el.scrollWidth) + 'px' },
      ],
      { el },
    );
    set({
      [prefixTransition]: transitionValue,
      [trans]: transitionValue,
    });
    setTimeout(function () {
      set({ [type]: '0' });
    });
  } else {
    el.removeAttribute('toggle-status');
    const set = setStyle(
      {
        [trans]: 'none',
        [type]: '0',
      },
      { el },
    )({
      [prefixTransition]: transitionValue,
      [trans]: transitionValue,
    });
    setTimeout(function () {
      set({ [type]: (type === 'height' ? el.scrollHeight : el.scrollWidth) + 'px' });
    });
    onceEvent(el, 'transitionend', function () {
      set({ [type]: '' });
    });
  }
}

export function animateTo({
  from,
  to,
  callback,
  speed = 0.5,
  immediate = true,
  minStepDenominator = 50,
}: {
  from: number;
  to: number;
  speed?: number;
  minStepDenominator?: number;
  immediate?: boolean;
  callback: (num: number) => void;
}) {
  const originSpeed = speed;
  let isStopped: boolean;
  let current: number;
  let isOver: () => boolean;
  let direct: 1 | -1 = 1;
  let minMove: number;

  function init() {
    const isUp = to > from;
    isStopped = false;
    current = from;
    direct = isUp ? 1 : -1;
    speed = originSpeed;
    minMove = Math.max(Math.abs(to), Math.abs(from)) / minStepDenominator;
    isOver = from > to ? () => current <= to : () => current >= to;
    immediate && callback(current);
  }

  function run() {
    if (isStopped) return;
    if (!isOver()) {
      const abs = Math.max(Math.abs(current - to), 1);
      const move = Math.min((abs / 10) * speed, minMove) * direct;
      current += move;
      callback(current);
      window.requestAnimationFrame(run);
    } else {
      stop();
      current = to;
      callback(current);
    }
  }

  function stop() {
    isStopped = true;
  }

  init();
  run();

  return {
    isStop() {
      return isStopped;
    },
    reset() {
      init();
      run();
    },
    reverse() {
      [to, from] = [from, to];
      init();
      run();
    },
    run() {
      isStopped = false;
      run();
    },
    stop,
  };
}

let stopScrollTo: Function | null = null;

/**
 * 滚动到目标处
 * @param target {number}
 * @param speed [1 - 100]
 * @param el {HTMLElement | Window}
 * @param [direct='vertical'] {'vertical'|'horizontal'}
 */
export function scrollTo(
  target = 0,
  speed = 10,
  el: HTMLElement | Window = window,
  direct: 'vertical' | 'horizontal' = 'vertical',
) {
  stopScrollTo && stopScrollTo();
  speed = getSafeNum(speed, 1, 100);
  const vertical = {
    scrollTo: 'scrollTop',
    scrollSize: 'scrollHeight',
    inner: 'innerHeight',
    offset: 'offsetHeight',
  } as const;
  const horizontal = {
    scrollTo: 'scrollLeft',
    scrollSize: 'scrollWidth',
    inner: 'innerWidth',
    offset: 'offsetWidth',
  } as const;
  const directKey = direct === 'horizontal' ? horizontal : vertical;
  const topOrLeft = directKey.scrollTo;
  let current = 0;
  const element =
    el === window
      ? document.body[topOrLeft]
        ? document.body
        : document.documentElement
      : (el as HTMLElement);
  const getPos = () => (current = element[topOrLeft]);
  getPos();
  let lastPos = Infinity;
  let isOver: () => boolean;
  if (current > target) {
    // 往上
    isOver = () => getPos() <= target;
  } else if (current < target) {
    // 往下
    target = Math.min(
      target,
      element[directKey.scrollSize] -
        (el === window ? window[directKey.inner] : element[directKey.offset]),
    );
    speed *= -1;
    isOver = () => getPos() >= target;
  } else {
    return;
  }

  let stop = false;
  stopScrollTo = () => {
    stop = true;
    stopScrollTo = null;
  };
  const eventTypes = ['wheel', 'touchstart', 'mousedown'];
  const clear = () => {
    stop = true;
    eventTypes.forEach((type) => window.removeEventListener(type, clear));
    stopScrollTo = null;
  };

  eventTypes.forEach((type) => window.addEventListener(type, clear));

  function scroll() {
    if (stop) return; // 不单独拿出来的话，未滚动完成马上再次滚动的话会先到达上次的目标点在滚动
    if (!isOver() && lastPos !== current) {
      const abs = Math.abs(target - current);
      const move = Number((speed + ((abs / 50) * speed) / 10).toFixed(1));
      element[topOrLeft] = current - move;
      lastPos = current;
      window.requestAnimationFrame(scroll);
    } else {
      element[topOrLeft] = target;
      clear();
    }
  }

  scroll();
}

/**
 * 获取当前js所在的script标签
 * @notice 只能在script引入的js中使用
 */
export function getCurrentScriptTag(): HTMLScriptElement | null {
  // 除了ie都支持document.currentScript
  if (document.currentScript) {
    return document.currentScript as HTMLScriptElement;
  }
  // 由于script加载会中断浏览器渲染(未设置async和defer的情况下)，所以当前的script一定是最后一个script
  const scripts = document.scripts;
  if (!scripts.length) return null;
  return scripts[scripts.length - 1] as HTMLScriptElement;
}

/**
 * 判断是否子元素
 * @param {HTMLElement | string} child
 * @param {HTMLElement | string} [parent=document.documentElement]
 * @return {boolean}
 */
export function isChildHTMLElement(
  child: HTMLElement | string,
  parent: HTMLElement | string = document.documentElement,
): boolean {
  const childNode: HTMLElement | null =
    typeof child === 'string' ? document.querySelector(child) : child;
  if (!childNode) throw 'child not founded';
  const parentNode: HTMLElement | null =
    typeof parent === 'string' ? document.querySelector(parent) : parent;
  if (!parentNode) throw 'parent not founded';

  const root = document.documentElement;

  function find(child: ParentNode | null, parent: HTMLElement): boolean {
    if (!child) return false;
    if (child === parent) return false;
    if (child === root) return false;
    if (child.parentNode === parent) return true;
    return find(child.parentNode, parent);
  }

  return find(childNode, parentNode);
}

/**
 * 普通图片url转base64的webp，可通过base64ToFile转为File
 *@see base64ToFile
 *
 * 注意：并不是所有图片转webp都能比原图小；在chrome和edge对一些上m的图片比较有效；在safari上基本没效果
 *
 * @param  url
 * @param  quality
 */
export function toWebp(url: string, quality?: number): Promise<string>;
/**
 * 普通图片File转base64的webp，可通过base64ToFile转为File
 * @see base64ToFile
 *
 * 注意：并不是所有图片转webp都能比原图小；在chrome和edge对一些上m的图片比较有效；在safari上基本没效果
 *
 * @param  file
 * @param  quality
 */
export function toWebp(file: Blob, quality?: number): Promise<string>;
export function toWebp(input: string | Blob, quality = 1): Promise<string> {
  const handle = (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d')?.drawImage(img, 0, 0);
    // type如果改成自动识别的，函数名就可以改为叫压缩图片了
    return canvas.toDataURL('image/webp', quality);
  };

  // url
  if (typeof input === 'string') return loadImg(input).then(handle);

  // Blob|file
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onabort = fileReader.onerror = reject;
    fileReader.onload = (e) =>
      loadImg(e.target?.result as any)
        .then(handle)
        .then(resolve);

    fileReader.readAsDataURL(input);
  });
}
