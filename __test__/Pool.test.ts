import {Pool} from "../packages/core/src/Pool";

class PoolItem {
    private _x: number = 0;
    private _y: number = 0;

    constructor() {
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    set y(value: number) {
        this._y = value;
    }

    get y(): number {
        return this._y;
    }
}

// 在项目使用中测
test("Pool", () => {
    const pool = new Pool(PoolItem);
    pool.push();
    pool.push();
    pool.push();
    pool.shift();
    expect(pool.aliveList.length).toBe(2);
    expect(pool.recycleList.length).toBe(1);
    pool.push();
    expect(pool.aliveList.length).toBe(3);
    expect(pool.aliveList[0].x).toBe(0);
    const first = pool.shift() as PoolItem;
    first.x = 100;
    first.y = 100;
    expect(pool.aliveList.length).toBe(2);
    expect(pool.recycleList.length).toBe(1);
    const last = pool.push();
    expect(last.x).toBe(100);
    expect(last.y).toBe(100);
    expect(pool.aliveList.length).toBe(3);
    expect(pool.recycleList.length).toBe(0);
    const pi = pool.unshift();
    pi.y = 10;
    expect(pool.aliveList.map(i => i.x)).toEqual([0, 0, 0, 100]);
    expect(pool.aliveList.map(i => i.y)).toEqual([10, 0, 0, 100]);

    pool.remove(first);
    expect(pool.length).toBe(3);

    pool.pop();
    expect(pool.length).toBe(2);
    pool.unshift();
    expect(pool.length).toBe(3);

    pool.forEach((v, k) => {
        v.x = k;
    });
    expect(pool.aliveList[2].x).toBe(2);

    const item2 = pool.aliveList[2];
    pool.unshift(item2);
    expect(pool.length).toBe(3);
    expect(pool.aliveList[0]).toBe(item2);

    const item0 = pool.aliveList[0];
    pool.push(item0);
    expect(pool.length).toBe(3);
    expect(pool.aliveList[2]).toBe(item0);

    const newItem = new PoolItem();
    expect(pool.remove(newItem)).toBeUndefined();
    expect(pool.length).toBe(3);

    pool.pop();
    pool.pop();
    pool.pop();
    pool.pop();
    pool.pop();
    expect(pool.pop()).toBeUndefined();
    expect(pool.shift()).toBeUndefined();
});

