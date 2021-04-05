import {Pool} from "../src/Pool";

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
    pool.add();
    pool.add();
    pool.add();
    pool.shift();
    expect(pool.aliveList.length).toBe(2);
    expect(pool.recycleList.length).toBe(1);
    pool.add();
    expect(pool.aliveList.length).toBe(3);
    expect(pool.aliveList[0].x).toBe(0);
    const first = pool.shift() as PoolItem;
    first.x = 100;
    first.y = 100;
    expect(pool.aliveList.length).toBe(2);
    expect(pool.recycleList.length).toBe(1);
    const last = pool.add();
    expect(last.x).toBe(100);
    expect(last.y).toBe(100);
    expect(pool.aliveList.length).toBe(3);
    expect(pool.recycleList.length).toBe(0);
    const pi = pool.unshift();
    pi.y = 10;
    expect(pool.aliveList.map(i => i.x)).toEqual([0, 0, 0, 100]);
    expect(pool.aliveList.map(i => i.y)).toEqual([10, 0, 0, 100]);
});

