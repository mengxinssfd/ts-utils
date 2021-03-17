// T的属性必须是可以在外部更改的
export class Pool {
    constructor() {
        this._aliveList = [];
        this._recycleList = [];
    }
    get recycleList() {
        return this._recycleList.slice();
    }
    get aliveList() {
        return this._aliveList.slice();
    }
    add(addFn) {
        const item = this.getRecycleOne() || addFn(this.aliveList, this.recycleList);
        if (this._aliveList.indexOf(item) > -1)
            return item;
        this._aliveList.push(item);
        return item;
    }
    ;
    remove(item) {
        const index = this._aliveList.indexOf(item);
        if (index === -1)
            return;
        this._aliveList.splice(index, 1);
        this._recycleList.push(item);
        return item;
    }
    pop() {
        const acList = this._aliveList;
        if (acList.length === 0)
            return;
        this._recycleList.push(acList.pop());
    }
    shift() {
        const acList = this._aliveList;
        if (acList.length === 0)
            return;
        const item = acList.shift();
        this._recycleList.push(item);
        return item;
    }
    unshift(addFn) {
        const item = this.getRecycleOne() || addFn(this.aliveList, this.recycleList);
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
