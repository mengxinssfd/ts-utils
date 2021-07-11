import { EventBus } from "./eventBus";
export declare class Pool<T> {
    readonly itemClass: {
        new (): T;
    };
    readonly events: EventBus;
    constructor(itemClass: {
        new (): T;
    });
    private _aliveList;
    get aliveList(): T[];
    private _recycleList;
    get recycleList(): T[];
    get length(): number;
    add(msg?: any): T;
    remove(item: T, msg?: any): T | undefined;
    pop(msg?: any): void | T;
    shift(msg?: any): T | void;
    unshift(msg?: any): T;
    getRecycleOne(): T | undefined;
    forEach(callbackFn: (value: T, index: number, array: T[]) => void): void;
    clear(): void;
}
