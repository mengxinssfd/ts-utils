declare abstract class CacheSup<T> {
    abstract set(value: T): this;
    abstract has(value: T): boolean;
    abstract clear(): void;
    abstract get size(): number;
}
export declare class ListCache<T> extends CacheSup<T> {
    private cache;
    set(value: T): this;
    has(value: T): boolean;
    clear(): void;
    get size(): number;
}
export declare class SetCache<T> extends CacheSup<T> {
    private cache;
    set(value: T): this;
    has(value: T): boolean;
    clear(): void;
    get size(): number;
}
export declare const Stack: typeof ListCache | typeof SetCache;
export {};
