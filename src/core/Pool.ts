import {EventBus} from "./eventBus";


// T的属性必须是可以在外部更改的
export class Pool<T> {
    readonly events = new EventBus();

    constructor(public readonly itemClass: { new(): T }) {
    }

    private _aliveList: T[] = [];

    get aliveList(): T[] {
        return this._aliveList.slice();
    }

    private _recycleList: T[] = [];

    get recycleList(): T[] {
        return this._recycleList.slice();
    }

    get length(): number {
        return this._aliveList.length;
    }

    add(msg?: any): T {
        const item = this.getRecycleOne() || new this.itemClass();
        if (this._aliveList.indexOf(item) > -1) return item;
        this._aliveList.push(item);
        this.events.emit("add", item, msg);
        return item;
    };

    remove(item: T, msg?: any) {
        const index = this._aliveList.indexOf(item);
        if (index === -1) return;
        this._aliveList.splice(index, 1);
        this._recycleList.push(item);
        this.events.emit("remove", item, msg);
        return item;
    }

    pop(msg?: any): void | T {
        const acList = this._aliveList;
        if (acList.length === 0) return;
        const item = acList.pop();
        this._recycleList.push(item!);
        this.events.emit("remove", item, msg);
        return item;
    }

    shift(msg?: any): T | void {
        const acList = this._aliveList;
        if (acList.length === 0) return;
        const item = acList.shift() as T;
        this._recycleList.push(item);
        this.events.emit("remove", item, msg);
        return item;
    }

    unshift(msg?: any): T {
        const item = this.getRecycleOne() || new this.itemClass();
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

    forEach(callbackFn: (value: T, index: number, array: T[]) => void) {
        this._aliveList.forEach(callbackFn);
    }

    clear() {
    }

}