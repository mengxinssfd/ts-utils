import {debounce, throttle} from "./common";
import type {OmitFirstParameters} from "../types/TsTypes";

export function decoratorfy(callback: (descriptor: PropertyDescriptor) => Function) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // 在babel的网站编译的是target包含key，descriptor
        if (target.descriptor) {
            descriptor = target.descriptor;
        }
        descriptor.value = callback(descriptor);
    };
}

/**
 * 防抖装饰器
 * @constructor
 */
export const Debounce = (...args:OmitFirstParameters<typeof debounce>) => decoratorfy(descriptor => debounce(descriptor.value, ...args));

/**
 * 节流装饰器
 * @constructor
 */
export const Throttle = (...args: OmitFirstParameters<typeof throttle>) => decoratorfy(descriptor => throttle(descriptor.value, ...args));
// Throttle(1, () => 0);
/**
 * 比setInterval好的地方在于使用promise判断一回执行完毕情况
 * @param interval
 * @param [immediate=true]
 * @constructor
 */
/*export function Polling(interval: number, immediate = true) {
    enum state {running, stopped}

    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // 在babel的网站编译的是target包含key，descriptor
        if (target.descriptor) {
            descriptor = target.descriptor;
        }

        const origin = descriptor.value;

        function start() {
            return new Promise<void>((res, rej) => {
                let timer: any;
                let status: state;
                let times = 0;

                function nextTimeout() {
                    timer = setTimeout(handle, interval);
                }

                function clear() {
                    status = state.stopped;
                    clearTimeout(timer);
                    res();
                }

                function handle() {
                    const back = origin.call(this, times++, res, rej);
                    if (status === state.running) {
                        if (back instanceof Promise) {
                            (back as Promise<any>).then(function () {
                                nextTimeout();
                            }).catch(clear);
                        } else {
                            back === false ? clear() : nextTimeout();
                        }
                    }
                }

                status = state.running;
                if (immediate) {
                    handle();
                } else {
                    nextTimeout();
                }
            });
        }

        descriptor.value = start;
    };

}*/
export const Polling = (interval: number, immediate = true) => decoratorfy((descriptor => {
        enum state {running, stopped}

        const origin = descriptor.value;
        let timer: any;
        let status: state;

        function stop() {
            status = state.stopped;
            clearTimeout(timer);
        }

        function start() {
            stop();
            const p = new Promise<void>((res, rej) => {
                let times = 0;

                function nextTimeout() {
                    timer = setTimeout(handle, interval);
                }

                function clear() {
                    stop();
                    res();
                }

                const handle = () => {
                    const back = origin.call(this, times++, res, rej);
                    if (status === state.running) {
                        if (back instanceof Promise) {
                            (back as Promise<any>).then(function () {
                                nextTimeout();
                            }).catch(clear);
                        } else {
                            back === false ? clear() : nextTimeout();
                        }
                    }
                };

                status = state.running;
                if (immediate) {
                    handle();
                } else {
                    nextTimeout();
                }
            });
            p.finally(stop);
            return p;
        }

        start.stop = stop;
        return start;
    }
));

/*
export function Singleton<T extends { new(...args: any[]): {} }>(constructor: T): any {
    class newClass extends constructor {
        private static instance?: newClass;

        private constructor(...args: any[]) {
            super(...args);
        }

        public static get Ins(): newClass {
            if (!newClass.instance) {
                newClass.instance = new newClass();
            }
            return newClass.instance;
        }

    }

    return newClass;
}
*/
