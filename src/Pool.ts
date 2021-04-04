// T的属性必须是可以在外部更改的
export class Pool<T> {
    get recycleList(): T[] {
        return this._recycleList.slice();
    }

    get aliveList(): T[] {
        return this._aliveList.slice();
    }

    private _aliveList: T[] = [];
    private _recycleList: T[] = [];

    constructor(public readonly itemClass: { new(): T }) {
    }

    add(): T {
        const item = this.getRecycleOne() || new this.itemClass();
        if (this._aliveList.indexOf(item) > -1) return item;
        this._aliveList.push(item);
        return item;
    };

    remove(item: T) {
        const index = this._aliveList.indexOf(item);
        if (index === -1) return;
        this._aliveList.splice(index, 1);
        this._recycleList.push(item);
        return item;
    }

    pop(): void | T {
        const acList = this._aliveList;
        if (acList.length === 0) return;
        const item = acList.pop();
        this._recycleList.push(item!);
        return item;
    }

    shift(): T | void {
        const acList = this._aliveList;
        if (acList.length === 0) return;
        const item = acList.shift() as T;
        this._recycleList.push(item);
        return item;
    }

    unshift(): T {
        const item = this.getRecycleOne() || new this.itemClass();
        const acList = this._aliveList;
        const index = acList.indexOf(item);
        if (index > -1) {
            acList.splice(index, 1);
        }
        acList.unshift(item);
        return item;
    }

    getRecycleOne() {
        return this._recycleList.shift();
    }

    clear() {
    }

}