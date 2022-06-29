import {sleep} from "../packages/core/src/time";
import * as dc from "../packages/core/src/decorator";

test("Debounce", async (done) => {
    const Debounce = dc.Debounce;

    const now = Date.now();

    class Test {
        times = 0;
        time = 0;
        value: string | number = "";

        @Debounce(1000)
        test(value: string | number) {
            this.times++;
            this.time = Date.now();
            this.value = value;
        }
    }

    const t = new Test();

    t.test(1);
    t.test(2);
    t.test(3);
    t.test(4);
    t.test(5);
    t.test(6);

    await sleep(1100);

    expect(t.times).toBe(1);
    expect(t.time - now).toBeGreaterThanOrEqual(100);
    expect(t.value).toBeGreaterThanOrEqual(6);
    done();
});
test("Throttle", async (done) => {
    const Throttle = dc.Throttle;

    const now = Date.now();

    class Test {
        times = 0;
        time = 0;
        value: string | number = "";

        @Throttle(100)
        test(value: string | number) {
            this.times++;
            this.time = Date.now();
            this.value = value;
        }
    }

    const t = new Test();

    t.test(1);
    t.test(2);
    t.test(3);
    t.test(4);
    t.test(5);
    t.test(6);

    await sleep(100);

    expect(t.times).toBe(1);
    expect(t.time - now).toBe(0);
    expect(t.value).toBeGreaterThanOrEqual(1);
    done();
});

test("Polling", async (done) => {
    const Polling = dc.Polling;

    class Test {
        times = 0;

        @Polling(100)
        test(times?: number) {
            this.times = times!;
            if (times! >= 5) {
                return Promise.reject();
            } else {
                // console.log(times);
                return Promise.resolve();
            }
        }
    }

    const t = new Test();

    await t.test();

    expect(t.times).toBe(5);

    // await sleep(5000);
    done();
});
test("Polling 2", async (done) => {
    const Polling = dc.Polling;

    class Test {
        times = 0;

        @Polling(100)
        test(times?: number) {
            this.times = times!;
        }
    }

    const t = new Test();

    t.test();

    await sleep(550);
    (t.test as any).stop();
    expect(t.times).toBe(5);
    t.test();
    await sleep(350);
    expect(t.times).toBe(3);

    // await sleep(5000);
    done();
});