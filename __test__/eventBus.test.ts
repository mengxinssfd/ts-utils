import {EventBus} from "../packages/core/src/eventBus";

test('EventBus', () => {
    let result = "";
    let result2 = "";
    EventBus.Ins.on("test", function (...params) {
        result = (result + " " + params.join(" ")).trim();
    });
    EventBus.Ins.emit("test", "hello", "world");
    EventBus.Ins.emit("test", "hello");
    EventBus.Ins.emit("test", "world");

    const eb = new EventBus();
    let cb;
    eb.on("test", cb = function (...params) {
        result2 = (result2 + " " + params.join(" ")).trim();
    });
    eb.emit("test", "world");

    eb.off("test", cb);
    eb.emit("test", "hello");

    expect(result).toBe("hello world hello world");
    expect(result2).toBe("world");
});
test('once', () => {
    let result = "";
    EventBus.Ins.once("test", function (...params) {
        result = (result + " " + params.join(" ")).trim();
    });
    EventBus.Ins.emit("test", "hello", "world once");
    EventBus.Ins.emit("test", "hello");
    EventBus.Ins.emit("test", "world");


    expect(result).toBe("hello world once");
});
test('times', () => {
    let result = "";
    EventBus.Ins.times(10, "test", function (...params) {
        result = (result + " " + params.join(" ")).trim();
    });
    [...Array(20).keys()].forEach(item => {
        EventBus.Ins.emit("test", item);
    });


    expect(result).toBe([...Array(10).keys()].join(" "));
});