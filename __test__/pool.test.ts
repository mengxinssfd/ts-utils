import {Pool} from "../src/Pool";

class PoolItem {
    constructor(private _x: number, private _y: number) {
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

test("Pool", () => {
    const pool = new Pool<PoolItem>();
    pool.add(() => new PoolItem(0, 0));
    pool.add(() => new PoolItem(1, 1));
    pool.add(() => new PoolItem(2, 2));
    pool.shift();
    pool.add(() => new PoolItem(3, 3));
    expect(pool.recycleList.length).toBe(3);
    expect(pool.aliveList[0].x).toBe(1);
    const pi = pool.unshift((a, b) => new PoolItem(10, 10));
    pi.y = 100;
});

