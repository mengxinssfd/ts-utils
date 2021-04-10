import {sleep} from "../src/time";
import * as dc from "../src/decorator";

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

test("Polling", async (done) => {
    const Polling = dc.Polling;

    class Test {
        times = 0;
        time = 0;
        value: string | number = "";

        @Polling(100)
        test(times?: number) {
            return new Promise<void>((res, rej) => {
                if (times! >= 5) {
                    rej();
                } else {
                    // console.log(times);
                    res();
                }
            });
        }
    }

    const t = new Test();

    await t.test();

    // await sleep(5000);
    done();
});