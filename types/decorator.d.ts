/**
 * 防抖装饰器
 * @param delay
 * @constructor
 */
export declare function Debounce(delay: number): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 * 比setInterval好的地方在于使用promise判断一回执行完毕情况
 *
 * // TODO 无法从origin函数外中断polling 如果同一个polling执行多次的话 无法中断前一个
 * @param interval
 * @param [immediate=true]
 * @constructor
 */
export declare function Polling(interval: number, immediate?: boolean): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
