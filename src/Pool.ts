export class Pool<T> {
    aliveList: T[] = [];
    recycleList: T[] = [];

    constructor() {
    }

    push(item: T) {
        if (this.aliveList.indexOf(item) > -1) return;
        this.aliveList.push(item);
    };

    splice(item: T) {
        const index = this.aliveList.indexOf(item);
        if (index === -1) return;
        this.aliveList.splice(index, 1);
        this.recycleList.push(item);
    }

    pop() {
        const acList = this.aliveList;
        if (acList.length === 0) return;
        this.recycleList.push(acList.pop() as T);
    }

    shift() {
        const acList = this.aliveList;
        if (acList.length === 0) return;
        const item = acList.shift() as T;
        this.recycleList.push(item);
        return item;
    }

    unshift(item: T) {
        const acList = this.aliveList;
        const index = acList.indexOf(item);
        if (index > -1) {
            acList.splice(index, 1);
        }
        acList.unshift(item);
        return item;
    }

    getRecycleOne() {
        return this.recycleList.shift();
    }

    clear() {
    }

}

class test {
    constructor() {
    }
}

const p = new Pool();
p.push(new test());
p.splice(p);