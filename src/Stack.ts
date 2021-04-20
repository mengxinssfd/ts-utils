import {isNative, isNaN} from "./type";

abstract class CacheSup<T> {
    abstract set(value: T): this;

    abstract has(value: T): boolean;

    abstract clear(): void;

    abstract get size(): number;
}

export class ListCache<T> extends CacheSup<T> {
    private cache: T[] = [];

    set(value: T) {
        if (!this.has(value))
            this.cache.push(value);
        return this;
    }

    has(value: T): boolean {
        return this.cache.some(i => value === i || isNaN(value as any) && isNaN(i as any));
    }

    clear() {
        this.cache = [];
    }

    get size() {
        return this.cache.length;
    }
}

export class SetCache<T> extends CacheSup<T> {
    private cache = new Set();

    set(value: T) {
        this.cache.add(value);
        return this;
    }

    has(value: T): boolean {
        return this.cache.has(value);
    }

    clear() {
        this.cache = new Set();
    }

    get size() {
        return this.cache.size;
    }
}

export const Stack = isNative(window.Set) ? SetCache : ListCache;

