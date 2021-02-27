/**
 * 防抖装饰器
 * @param delay
 * @constructor
 */
export declare function Debounce(delay: number): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Polling(interval: number, immediate?: boolean): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
