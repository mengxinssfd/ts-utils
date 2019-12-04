export declare const isDom: (target: any) => boolean;
export declare const addClass: (target: any, className: string | string[]) => any;
export declare function removeClass(dom: any, className: string): string;
/**
 * 判断是什么种类的浏览器并返回拼接前缀后的数据
 * @param style
 * @returns {*}
 */
export declare function prefixStyle(style: string): string | false;
