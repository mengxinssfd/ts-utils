import { debounce } from "./common";
/**
 * 防抖装饰器
 * @param delay
 * @constructor
 */
export function Debounce(delay) {
    return function (target, propertyKey, descriptor) {
        // 在babel的网站编译的是target包含key，descriptor
        if (target.descriptor) {
            descriptor = target.descriptor;
        }
        descriptor.value = debounce(descriptor.value, delay);
    };
}
// 比setInterval好的地方在于使用promise判断一回执行完毕情况 // TODO 无法从origin函数外中断polling 如果同一个polling执行多次的话 无法中断前一个
export function Polling(interval, immediate = true) {
    let state;
    (function (state) {
        state[state["running"] = 0] = "running";
        state[state["stopped"] = 1] = "stopped";
    })(state || (state = {}));
    return function (target, propertyKey, descriptor) {
        // 在babel的网站编译的是target包含key，descriptor
        if (target.descriptor) {
            descriptor = target.descriptor;
        }
        const origin = descriptor.value;
        function start() {
            return new Promise((res, rej) => {
                let timer;
                let status;
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
                            back.then(function () {
                                nextTimeout();
                            }).catch(clear);
                        }
                        else {
                            back === false ? clear() : nextTimeout();
                        }
                    }
                }
                status = state.running;
                if (immediate) {
                    handle();
                }
                else {
                    nextTimeout();
                }
            });
        }
        descriptor.value = start;
    };
}
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
