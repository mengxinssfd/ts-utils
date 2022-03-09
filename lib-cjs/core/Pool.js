"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = void 0;
const eventBus_1 = require("./eventBus");
// T的属性必须是可以在外部更改的
class Pool {
    constructor(itemClass) {
        this.itemClass = itemClass;
        this.events = new eventBus_1.EventBus();
        this._aliveList = [];
        this._recycleList = [];
    }
    get aliveList() {
        return this._aliveList.slice();
    }
    get recycleList() {
        return this._recycleList.slice();
    }
    get length() {
        return this._aliveList.length;
    }
    push(item, msg) {
        item = item !== null && item !== void 0 ? item : (this.getRecycleOne() || new this.itemClass());
        const index = this._aliveList.indexOf(item);
        if (index > -1) {
            this._aliveList.splice(index, 1);
        }
        this._aliveList.push(item);
        this.events.emit("add", item, msg);
        return item;
    }
    ;
    remove(item, msg) {
        const index = this._aliveList.indexOf(item);
        if (index === -1)
            return;
        this._aliveList.splice(index, 1);
        this._recycleList.push(item);
        this.events.emit("remove", item, msg);
        return item;
    }
    pop(msg) {
        const acList = this._aliveList;
        if (acList.length === 0)
            return;
        const item = acList.pop();
        this._recycleList.push(item);
        this.events.emit("remove", item, msg);
        return item;
    }
    shift(msg) {
        const acList = this._aliveList;
        if (acList.length === 0)
            return;
        const item = acList.shift();
        this._recycleList.push(item);
        this.events.emit("remove", item, msg);
        return item;
    }
    unshift(item, msg) {
        item = item !== null && item !== void 0 ? item : (this.getRecycleOne() || new this.itemClass());
        const acList = this._aliveList;
        const index = acList.indexOf(item);
        if (index > -1) {
            acList.splice(index, 1);
        }
        acList.unshift(item);
        this.events.emit("add", item, msg);
        return item;
    }
    getRecycleOne() {
        return this._recycleList.shift();
    }
    forEach(callbackFn) {
        this._aliveList.forEach(callbackFn);
    }
    clear() {
    }
}
exports.Pool = Pool;
