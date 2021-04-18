import * as types from "./type";
class CacheSup {
}
export class ListCache extends CacheSup {
    constructor() {
        super(...arguments);
        this.cache = [];
    }
    set(value) {
        if (!this.has(value))
            this.cache.push(value);
        return this;
    }
    has(value) {
        return this.cache.some(i => value === i || types.isNaN(value) && types.isNaN(i));
    }
    clear() {
        this.cache = [];
    }
    get size() {
        return this.cache.length;
    }
}
export class SetCache extends CacheSup {
    constructor() {
        super(...arguments);
        this.cache = new Set();
    }
    set(value) {
        this.cache.add(value);
        return this;
    }
    has(value) {
        return this.cache.has(value);
    }
    clear() {
        this.cache = new Set();
    }
    get size() {
        return this.cache.size;
    }
}
export const Stack = types.isNative(Map) ? SetCache : SetCache;
