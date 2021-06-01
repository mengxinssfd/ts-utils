import * as cm from "../src/common";
import {sleep} from "../src/time";
import {strPadStart} from "../src/string";

test("forEachByLen", () => {
    const arr: number[] = [];
    cm.forEachByLen(3, (index) => arr.push(index));
    expect(arr).toEqual([0, 1, 2]);
    cm.forEachByLen(7, (index) => arr.push(index));
    expect(arr.length).toEqual(10);
    cm.forEachByLen(3, (index): any | false => {
        arr.push(index);
        if (index === 1) return false;
    });
});

test("debounce", async (done) => {
    let times = 0;
    const d = cm.debounce(() => times++, 100);
    d();
    expect(times).toBe(0);
    d.flush();
    expect(times).toBe(1);
    d();
    d.cancel();
    await sleep(300);
    setTimeout(d, 10);
    setTimeout(d, 20);
    setTimeout(d, 30);
    setTimeout(d, 40);
    setTimeout(() => {
        expect(times).toBe(2);
        // 异步代码需要调用done()
        done();
    }, 500);
});
test("debounce immediate", async (done) => {
    let times = 0;
    const d = cm.debounce(() => times++, 100, true);
    d();
    expect(times).toBe(1);
    d.flush();
    expect(times).toBe(2);
    d();
    d.cancel();
    await sleep(500);
    setTimeout(d, 10);
    setTimeout(d, 20);
    setTimeout(d, 30);
    setTimeout(d, 40);
    setTimeout(() => {
        expect(times).toBe(3);
    }, 500);
    await sleep(1000);
    times = 0;
    d();
    setTimeout(() => {
        expect(times).toBe(1);
        // 异步代码需要调用done()
        done();
    }, 500);
});

test("oneByOne", (done) => {
    const s = "hello world";
    cm.oneByOne(s, 10, (w, index) => {
        expect(w).toBe(s[index]);
        if (s.length === index + 1) {
            done();
        }
    });
    cm.oneByOne(s, 10);
});
test("functionApply", () => {
    // const args = [1, 2, 3];
    // (new Function(generateFunctionCode(args.length)))(object, property, args);
    expect(strPadStart("123", 6, "0")).toBe("000123");
    const value = cm.functionApply({strPadStart}, "strPadStart", ["123", 6, "0"]);
    expect(value).toBe("000123");
});
test("polling", (done) => {
    let t = 0;
    const cancel = cm.polling((times) => {
        return new Promise<void>((res) => {
            expect(times).toBe(t);
            t++;
            if (times === 10) {
                cancel();
                done();
            }
            res();
        });
    }, 10, false);
});

test("createUUID", () => {
    const uuid = cm.createUUID(10);

    // 判断长度是否正确
    expect(uuid.length === 10).toBeTruthy();

    const hexDigits = "0123456789abcdef";
    // 判断每个字符是否在范围内
    for (let i = 0; i < uuid.length; i++) {
        expect(hexDigits.indexOf(uuid[i]) > -1).toBeTruthy();
    }

    // 判断100次循环中是否有相同的
    for (let i = 0; i < 100; i++) {
        const uid = cm.createUUID(10);
        expect(uid !== uuid).toBeTruthy();
    }
});

test("formatJSON", () => {
    const formatJSON = cm.formatJSON;
    const space = "    ";
    const str = {a: 1, b: "2"};
    expect(formatJSON(str, 4)).toBe(`{\r\n${space}"a":1,\r\n${space}"b":"2"\r\n}`);
    expect(formatJSON(JSON.stringify(str), 4)).toBe(`{\r\n${space}"a":1,\r\n${space}"b":"2"\r\n}`);

    expect(formatJSON({a: [1, 2]}, 4)).toBe("{\r\n" +
        "    \"a\":[\r\n" +
        "        1,\r\n" +
        "        2\r\n" +
        "    ]\r\n" +
        "}");

    expect(() => {
        formatJSON("");
    }).toThrowError();
    let obj;
    eval("obj={test:function(){}}");
    expect(formatJSON(obj, 4)).toBe("{\r\n" +
        "    \"test\":\"function(){}\"\r\n" +
        "}");

    function Ext() {
        this.a = 1;
    }

    Ext.prototype.b = "2";

    expect(formatJSON(new Ext(), 4)).toBe(`{\r\n    "a":1\r\n}`);
});

test("promiseAny", async () => {
    expect.assertions(12);
    const fn = cm.promiseAny;
    const isNotIterable = "TypeError: list is not iterable";
    await expect(fn(undefined as any)).rejects.toEqual(isNotIterable);
    await expect(fn(null as any)).rejects.toEqual(isNotIterable);
    await expect(fn(NaN as any)).rejects.toEqual(isNotIterable);
    await expect(fn(0 as any)).rejects.toEqual(isNotIterable);
    await expect(fn(true as any)).rejects.toEqual(isNotIterable);
    await expect(fn({} as any)).rejects.toEqual(isNotIterable);

    const allReject = "AggregateError: All promises were rejected";
    await expect(fn([])).rejects.toEqual(allReject);
    await expect(fn([Promise.reject(0), Promise.reject(1)])).rejects.toEqual(allReject);
    await expect(fn([0 as any, Promise.resolve(1)])).resolves.toEqual(0);
    await expect(fn([Promise.resolve(1), 0 as any])).resolves.toEqual(0);
    await expect(fn([Promise.resolve(0), Promise.resolve(1)])).resolves.toEqual(0);
    await expect(fn([Promise.reject(0), Promise.reject(1), Promise.resolve(2)])).resolves.toEqual(2);
});

test("debounceAsync", async () => {
    expect.assertions(2);
    const fn = cm.debounceAsync;
    let times = 0;
    const cb = () => {
        return new Promise(resolve => {
            resolve(times++);
        });
    };

    const dbFn = fn(cb, 100);
    await cm.promiseAny([dbFn(), dbFn(), dbFn(), dbFn()]);

    expect(times).toEqual(1);

    dbFn();
    await sleep(150);
    dbFn();
    await sleep(150);
    expect(times).toEqual(3);
});
test("debounceByPromise", async () => {
    expect.assertions(2);
    const fn = cm.debounceByPromise;
    let times = 0;
    const cb = (time = 50) => {
        const p = new Promise(resolve => {
            setTimeout(() => {

                resolve(time);
            }, time);
        });
        p.then(() => {
            times++;
        });
        return p;
    };

    const dbFn = fn(cb);

    await expect(cm.promiseAny([dbFn(40), dbFn(20), dbFn(60), dbFn(30)])).resolves.toEqual(30);

    dbFn(100);
    await sleep(150);
    dbFn();
    await sleep(150);
    // fixme 执行了6次， debounceByPromise无法阻止cb被调用 不推荐使用
    expect(times).toEqual(6);
});
test("debounceCancelable", async () => {
    expect.assertions(2);
    const fn = cm.debounceCancelable;
    let times = 0;
    const cb = () => {
        times++;
    };

    const dbFn = fn(cb, 20);

    let cancelFn = dbFn();
    cancelFn();

    await sleep(30);

    expect(times).toEqual(0);

    dbFn();
    await sleep(150);
    expect(times).toEqual(1);
});
test("createEnumByObj", async () => {
    const fn = cm.createEnumByObj;

    const obj = {a: "aa", b: "bb"};
    expect(fn(obj)).toEqual({a: "aa", b: "bb", aa: "a", bb: "b"});
    expect(fn({a: 1, b: 2})).toEqual({a: 1, b: 2, 1: "a", 2: "b"});
});
test("createEnum", async () => {
    const fn = cm.createEnum;

    enum e {
        a,
        b,
        c
    }

    expect(fn(["a", "b", "c"])).toEqual(e);
});
test("throttle", async () => {
    // expect.assertions(4);
    const fn = cm.throttle;
    let times = 0;
    let invalidTimes = 0;
    let interval = 0;
    const th = fn(() => {
        interval = 0;
        return times++;
    }, 1000, (int) => {
        interval = int;
        invalidTimes++;
    });

    const now = Date.now();
    await new Promise<void>(((resolve, reject) => {
        // TODO 可以使用OneByOne代替
        th();

        function exec() {
            const index = setTimeout(() => {
                const t = th();
                expect(t).toBe(t === undefined ? undefined : times - 1);
                if (Date.now() - now > 2200) {
                    clearInterval(index);
                    resolve();
                    return;
                }
                exec();
            }, 100);
        }

        exec();
    }));
    expect(times).toBe(3);
    // 有些电脑能够执行20次 与定时器有关 实际并不准确
    expect(invalidTimes).toBeGreaterThanOrEqual(15);
    expect(invalidTimes).toBeLessThanOrEqual(20);

    // interval = 0;
    await sleep(1000);
    th();
    expect(interval).toBe(0);
    await sleep(100);
    th();
    expect(interval).toBeLessThanOrEqual(900);
    expect(interval).toBeGreaterThanOrEqual(800);
    await sleep(200);
    th();
    expect(interval).toBeLessThanOrEqual(700);
    expect(interval).toBeGreaterThanOrEqual(600);
    await sleep(701);
    th();
    expect(interval).toBe(0);
});
/*test("throttleByTimeDown", async () => {
    // expect.assertions(4);
    const fn = cm.throttleByTimeDown;
    let times = 0;
    let invalidTimes = 0;
    let interval = 0;
    const th = fn(() => {
        interval = 0;
        return times++;
    }, 1000, (int) => {
        interval = int;
        invalidTimes++;
    });

    const now = Date.now();
    await new Promise<void>(((resolve, reject) => {
        // TODO 可以使用OneByOne代替
        th();

        function exec() {
            const index = setTimeout(() => {
                const t = th();
                expect(t).toBe(t === undefined ? undefined : times - 1);
                if (Date.now() - now > 2200) {
                    clearInterval(index);
                    resolve();
                    return;
                }
                exec();
            }, 100);
        }

        exec();
    }));
    expect(times).toBe(3);
    // 有些电脑能够执行20次 与定时器有关 实际并不准确
    expect(invalidTimes).toBeGreaterThanOrEqual(15);
    expect(invalidTimes).toBeLessThanOrEqual(20);

    // interval = 0;
    await sleep(1000);
    th();
    expect(interval).toBe(0);
    await sleep(100);
    th();
    expect(interval).toBeLessThanOrEqual(900);
    expect(interval).toBeGreaterThanOrEqual(800);
    await sleep(200);
    th();
    expect(interval).toBeLessThanOrEqual(700);
    expect(interval).toBeGreaterThanOrEqual(600);
    await sleep(701);
    th();
    expect(interval).toBe(0);
});*/
test("promiseQueue", async () => {
    const fn = cm.promiseQueue;
    const v = await fn([
        (v) => Promise.resolve(`${v} thank you`),
        (v) => Promise.resolve(`${v} im fine`),
    ], "hello");
    expect(v).toBe("hello thank you im fine");

    try {
        await fn([
            (v) => Promise.resolve(`${v} thank you`),
            (v) => Promise.reject(`${v} im fine`),
        ], "hello");
    } catch (e) {
        expect(e).toBe("hello thank you im fine");
    }

    const v2 = await fn([
        (v) => `${v} thank you`,
        (v) => `${v} im fine`,
    ] as any, "hello");
    expect(v2).toBe("hello thank you im fine");
});
test("root", async () => {
    expect(cm.root).toBe(window);
});
test("numToFixed", async () => {
    const fn = cm.numToFixed;
    expect(0.45.toFixed(1)).toEqual("0.5");
    expect(fn(0.45, 1)).toBe("0.4");
    expect(fn(0.45, 1, true)).toBe("0.5");

    expect(1.45.toFixed(1)).toBe("1.4");
    expect(fn(1.45, 1, true)).toBe("1.5");
    expect(fn(1.45, 1)).toBe("1.4");

    expect((1).toFixed(2)).toBe("1.00");
    expect(fn(1, 2)).toBe("1.00");
    expect(fn(1, 2, true)).toBe("1.00");

    expect((1.45).toFixed()).toBe("1");
    expect(fn(1.45)).toBe("1");
    expect(fn(1.45, undefined, true)).toBe("1");

    expect(0.5 + 0.07).not.toBe(0.57);
    expect((0.5 + 0.07).toFixed(2)).toBe("0.57");
    expect(fn(0.5 + 0.07, 2)).toBe("0.57");
    expect(fn(0.5 + 0.07, 5)).toBe("0.57000");

    expect(() => {
        0.1.toFixed(-1);
    }).toThrowError();
    expect(() => {
        fn(0.1, -1);
    }).toThrowError();
    expect(() => {
        0.1.toFixed(101);
    }).toThrowError();
    expect(() => {
        fn(0.1, 101);
    }).toThrowError();

    // const f = fn(0.1, 100);
    // expect(0.1.toFixed(100)).toBe(f)
});