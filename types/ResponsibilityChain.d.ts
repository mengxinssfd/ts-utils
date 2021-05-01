declare type Next<T> = (value: T) => void;
declare type Done<T> = (value?: T | unknown) => void;
declare type OnDone<T> = (value: T | unknown, index: number) => void;
declare type ChainHandler<T> = (value: T, next: Next<T>, done: Done<T>, initValue?: T) => void;
declare type ChainItem<T> = {
    handler: ChainHandler<T>;
    name?: string;
    desc?: string;
};
declare enum State {
    ready = "ready",
    running = "running",
    done = "done"
}
/**
 * 责任链
 */
export declare class ResponsibilityChain<T> {
    private initValue?;
    onDone?: OnDone<T> | undefined;
    static readonly State: typeof State;
    private chain;
    private index;
    private _value;
    get value(): T;
    private _status;
    get status(): State;
    constructor(chain: Array<ChainItem<T> | ChainHandler<T>>, initValue?: T | undefined, onDone?: OnDone<T> | undefined);
    start(value?: T): void;
    private run;
    private next;
    private done;
}
export {};
