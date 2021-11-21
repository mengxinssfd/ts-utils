"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = exports.SetCache = exports.ListCache = void 0;
const common_1 = require("./common");
const dataType_1 = require("./dataType");
class CacheSup {
}
class ListCache extends CacheSup {
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
        return this.cache.some(i => value === i || (0, dataType_1.isNaN)(value) && (0, dataType_1.isNaN)(i));
    }
    clear() {
        this.cache = [];
    }
    get size() {
        return this.cache.length;
    }
}
exports.ListCache = ListCache;
class SetCache extends CacheSup {
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
exports.SetCache = SetCache;
exports.Stack = (0, dataType_1.isNative)(common_1.root.Set) ? SetCache : ListCache;
