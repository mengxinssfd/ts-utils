export declare function decoratorfy(callback: (descriptor: PropertyDescriptor) => Function): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 * 防抖装饰器
 * @param delay
 * @constructor
 */
export declare const Debounce: (delay: number) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 * 比setInterval好的地方在于使用promise判断一回执行完毕情况
 * @param interval
 * @param [immediate=true]
 * @constructor
 */
export declare const Polling: (interval: number, immediate?: boolean) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
