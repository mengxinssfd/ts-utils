import {ResponsibilityChain} from "../packages/core/src/ResponsibilityChain";
import {sleep} from "../packages/core/src/time";

test("ResponsibilityChain", () => {
    const rc = new ResponsibilityChain([
        {
            desc: "获取第1个接口的数据",
            handler(value, next, done, init) {
                expect(value).toBe(1);
                expect(init).toBe(1);
                expect(rc.status).toBe(ResponsibilityChain.State.running);
                next(2);
            },
        },
        {
            desc: "获取第二个接口的数据",
            handler(value, next, done, init) {
                expect(value).toBe(2);
                expect(init).toBe(1);
                expect(rc.status).toBe(ResponsibilityChain.State.running);
                next((value as number) * 30);
            },
        },
        {
            desc: "获取第三个接口的数据",
            handler(value, next, done, initValue) {
                expect(value).toBe(60);
                expect(initValue).toBe(1);
                expect(rc.status).toBe(ResponsibilityChain.State.running);
                next(Number(value) * Number(initValue));
            },
        },

    ], 1);
    expect(rc.status).toBe(ResponsibilityChain.State.ready);
    rc.onDone = function (value) {
        expect(value).toBe(60);
        expect(rc.status).toBe(ResponsibilityChain.State.done);
    };
    rc.start();
});
test("ResponsibilityChain handler", () => {
    const rc = new ResponsibilityChain([
        (value, next, done, init) => {
            expect(value).toBe(1);
            expect(init).toBe(1);
            expect(rc.status).toBe(ResponsibilityChain.State.running);
            next(2);
        },
        (value, next, done, init) => {
            expect(value).toBe(2);
            expect(init).toBe(1);
            expect(rc.status).toBe(ResponsibilityChain.State.running);
            next((value as number) * 30);
        },
        (value, next, done, initValue) => {
            expect(value).toBe(60);
            expect(initValue).toBe(1);
            expect(rc.status).toBe(ResponsibilityChain.State.running);
            next(Number(value) * Number(initValue));
        },

    ], 1);
    expect(rc.status).toBe(ResponsibilityChain.State.ready);
    rc.onDone = function (value) {
        expect(value).toBe(60);
        expect(rc.status).toBe(ResponsibilityChain.State.done);
    };
    rc.start();
    expect(rc.value).toBe(60);
    rc.start();
    expect(rc.value).toBe(60);
});
test("ResponsibilityChain handler item", async () => {
    let initValue = 1;
    const rc = new ResponsibilityChain([
        {
            desc: "获取第1个接口的数据",
            handler(value, next, done, init) {
                expect(value).toBe(init);
                expect(init).toBe(initValue);
                expect(rc.status).toBe(ResponsibilityChain.State.running);
                next(2);
            },
        },
        (value, next, done, init) => {
            expect(value).toBe(2);
            expect(init).toBe(initValue);
            expect(rc.status).toBe(ResponsibilityChain.State.running);
            next((value as number) * 30);
        },
        async (value, next, done, initValue) => {
            expect(value).toBe(60);
            expect(initValue).toBe(initValue);
            expect(rc.status).toBe(ResponsibilityChain.State.running);
            await sleep(100);
            next(Number(value) - Number(initValue));
        },

    ], initValue);
    expect(rc.status).toBe(ResponsibilityChain.State.ready);
    rc.onDone = function (value) {
        expect(value).toBe(59);
        expect(rc.status).toBe(ResponsibilityChain.State.done);
    };
    rc.start();
    expect(rc.value).toBe(60);
    rc.start();
    expect(rc.status).toBe(ResponsibilityChain.State.running);
    await sleep(1000);
    expect(rc.status).toBe(ResponsibilityChain.State.done);
    rc.onDone = function (value, index) {
        expect(value).toBe(119);
        expect(index).toBe(2);
        expect(rc.status).toBe(ResponsibilityChain.State.done);
    };
    rc.start(initValue = 2);
    expect(rc.status).toBe(ResponsibilityChain.State.running);
    expect(rc.value).toBe(60);
});
test("ResponsibilityChain handler break", () => {
    let initValue = 1;
    const rc = new ResponsibilityChain([
        (value, next) => {
            next(100);
        },
        (value, next, done, init) => {
            // next((value as number) * 30);
            done(init);
        },
        {
            desc: "不执行",
            handler(value, next, done, initValue) {
                next(Number(value) - Number(initValue));
            },
        },

    ], initValue);
    expect(rc.status).toBe(ResponsibilityChain.State.ready);
    rc.onDone = function (value, index) {
        expect(value).toBe(100);
        expect(index).toBe(1);
        expect(rc.status).toBe(ResponsibilityChain.State.done);
    };

});