declare type Callback = (...args: any[]) => void;
export declare class EventBus {
    private static instance?;
    private events;
    constructor();
    static get Ins(): EventBus;
    getCallbackList(eventName: string): Callback[];
    on(eventName: string, callback: Callback): void;
    once(eventName: string, callback: Callback): void;
    times(times: number, eventName: string, callback: Callback): void;
    emit(eventName: string, ...params: any[]): void;
    off(eventName: string, callback: Callback): void;
    offAll(): void;
}
export {};
