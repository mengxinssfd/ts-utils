declare type AddFn<T> = (aliveList: readonly T[], recycleList: readonly T[]) => T;
export declare class Pool<T> {
    get recycleList(): T[];
    get aliveList(): T[];
    private _aliveList;
    private _recycleList;
    constructor();
    add(addFn: AddFn<T>): T;
    remove(item: T): T | undefined;
    pop(): void;
    shift(): T | undefined;
    unshift(addFn: AddFn<T>): T;
    getRecycleOne(): T | undefined;
    clear(): void;
}
export {};
