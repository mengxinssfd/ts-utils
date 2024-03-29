import { castArray, root } from '@mxssfd/core';
import {
  onceEvent,
  createHiddenHtmlElement,
  isDom,
  isInputElement,
  isSelectElement,
  isTextAreaElement,
} from '@mxssfd/dom';

/**
 * @param element
 * @return string
 */
export function select(element: HTMLElement) {
  let selectedText;
  if (isSelectElement(element)) {
    element.focus();
    selectedText = element.value;
  } else if (isInputElement(element) || isTextAreaElement(element)) {
    const isReadOnly = element.hasAttribute('readonly');
    if (!isReadOnly) {
      element.setAttribute('readonly', '');
    }
    element.select();
    element.setSelectionRange(0, element.value.length);
    if (!isReadOnly) {
      element.removeAttribute('readonly');
    }
    selectedText = element.value;
  } else {
    if (element.hasAttribute('contenteditable')) {
      element.focus();
    }
    const selection = window.getSelection() as Selection;
    const range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    selectedText = selection.toString();
  }
  return selectedText;
}

export function isSupportedClipboardCommand<T extends 'cut' | 'copy'>(
  action: Array<T> | T = ['cut', 'copy'] as Array<T>,
): boolean {
  const actions = castArray(action) as T[];

  if (!document.queryCommandSupported) return false;

  return actions.every((act) => document.queryCommandSupported(act));
}

/**
 * 复制文字或html
 * 如果copy2Clipboard的this是一个html元素的话，
 * 不会马上执行，而是在该html元素被点击之后执行
 * @param target {HTMLElement | string}
 * @return {Promise}
 */
export function copy2Clipboard<T extends HTMLElement | string>(target: T): Promise<T> {
  const isDoc = isDom(target);
  const el = isDoc
    ? (target as HTMLElement)
    : createHiddenHtmlElement({
        innerText: String(target),
        style: { visibility: 'visible', opacity: '0' },
      });
  const p = new Promise<T>((resolve, reject) => {
    select(el);
    let succeeded;
    let error: any;
    try {
      succeeded = document.execCommand('copy');
    } catch (err) {
      succeeded = false;
      error = err;
    }
    // execCommand可能返回false
    if (succeeded) {
      resolve(target);
      return;
    }
    reject(error);
  });
  p.finally(function () {
    window.getSelection && (window.getSelection() as Selection).removeAllRanges();
    !isDoc && el && document.body.removeChild(el);
  });
  return p;
}

/* if (window.Promise && !window.Promise.prototype.finally) {
    Promise.prototype.finally = function (cb?: (() => void)) {
        return this.then().then(cb, cb);
    };
}*/

/**
 * 原来通过绑定this的方式实际使用时获取不到准确的target值
 *
 * 用法：
 *      1.触发事件（最好是捕获阶段的事件）
 *      2.使用该函数并接收触发事件的parentNode作为el参数（与步骤1同一事件，最好绑定在冒泡阶段）
 *      3.请求数据（必须同步请求，否则可能复制失败）（是否请求视使用场景而定）
 *      4.冒泡触发事件并复制
 *      5.自动清除事件
 *
 * @param el
 * @param target 复制的目标
 * @param [eventType="click"]
 * @param [capture=false]
 */
copy2Clipboard.once = function (
  el: HTMLElement,
  target: () => HTMLElement | string,
  eventType: keyof HTMLElementEventMap = 'click',
  capture = false,
): ReturnType<typeof copy2Clipboard> {
  return new Promise((resolve, reject) => {
    onceEvent(
      el,
      eventType,
      () => {
        copy2Clipboard(target()).then(resolve, reject);
      },
      capture,
    );
  });
};

copy2Clipboard.interceptor = ({
  cb,
  el = window,
  capture = true,
  type = 'copy',
  format = 'text/plain',
}: {
  cb: (e: ClipboardEvent, data: string) => string;
  el: Window | HTMLElement;
  capture?: boolean;
  type?: 'copy' | 'cut';
  format?: string;
}) => {
  const handler = (e: ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    // CB?.readText().then((data) => {
    //     clipboardData.setData(format, cb(e, data));
    // });

    const selection = window.getSelection() as Selection;
    clipboardData.setData(format, cb(e, selection.toString()));
    e.preventDefault();
  };
  el.addEventListener('copy', handler as EventListener, capture);
  return () => {
    el.removeEventListener(type, handler as EventListener, capture);
  };
};

const CB: Clipboard = root?.navigator?.clipboard;

export function supportClipboardWrite() {
  return Boolean((CB as any)?.write);
}

export function setData2Clipboard(
  data: any,
  el: HTMLElement = root?.document?.documentElement,
  format = 'text/plain',
): boolean {
  function cb(event: ClipboardEvent) {
    event.clipboardData?.setData(format, data);
    event.preventDefault();
    el.removeEventListener('copy', cb);
  }

  el.addEventListener('copy', cb);
  return document.execCommand('copy');
}

declare const ClipboardItem: any;

/**
 * 写进剪贴板
 * @desc notice - 只有在https或者localhost上可以用
 * @param contentList
 */
export async function write2Clipboard(contentList: Array<string | Blob>) {
  if (!supportClipboardWrite()) throw new Error('unsupported navigator.clipboard.write');
  const clipboardItems = contentList.map((item) => {
    const blob = item instanceof Blob ? item : new Blob([item], { type: 'text/plain' });
    return new ClipboardItem({
      [blob.type]: blob,
    });
  });
  await (CB as any).write(clipboardItems);
}
