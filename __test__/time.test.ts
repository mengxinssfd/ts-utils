import * as t from "../src/time";
import {createArray} from "../src/array";

const sleepTime = 50;
const arr = createArray({
    len: 10000, fill: () => {
        const startTime = Date.now();
        return t.sleep(sleepTime).then(() => Date.now() - startTime);
    },
});

// 获取timeout差值
async function getTimeoutMax() {
    const list = await Promise.all(arr);
    return Math.max(...list) - sleepTime;
}

async function getTimeoutMin() {
    const list = await Promise.all(arr);
    return Math.min(...list) - sleepTime;
}

test("sleep", async () => {
    const max = await getTimeoutMax();
    const min = await getTimeoutMin();
    expect(max).toBeLessThanOrEqual(200);
    expect(min).toBeGreaterThanOrEqual(0);
    const date = Date.now();
    await t.sleep(100);
    // 时间与机器配置有关  波动大
    expect(Date.now() - date).toBeGreaterThanOrEqual(100);
    expect(Date.now() - date).toBeLessThanOrEqual(100 + 150);
});

test("str2Date", () => {
    const t1 = (t.str2Date("2020-02-02 10:10:10") as Date).getTime();
    const t2 = (t.str2Date("2020-02-20 10:10:10") as Date).getTime();
    expect(t2).toBeGreaterThan(t1);
    expect(t.str2Date("abcd")).toBeNull();

    function fn(date: string, format?: string) {
        return t.formatDate.call(t.str2Date(date), format);
    }

    expect(fn("2020-02-02", "yyyy")).toBe("2020");
    expect(fn("2020-02-02", "MM")).toBe("02");
    expect(fn("2020-02-02", "dd")).toBe("02");
    expect(fn("2020-02-02", "yy")).toBe("20");
    expect(fn("2020-02-02", "hh")).toBe("00");
    expect(fn("2020-02-02", "mm")).toBe("00");
    expect(fn("2020-02-02", "ss")).toBe("00");
    expect(fn("2019-03", "dd")).toBe("01");
    expect(fn("2020-02-02 12:00:00", "hh")).toBe("12");
    expect(fn("2020-02-02 12:00:00", "mm")).toBe("00");
    expect(fn("2020-02-02 12:00:00", "ss")).toBe("00");
    expect(fn("2020-02-02 12:00:10", "ss")).toBe("10");
    expect(fn("2020-02-02 12:11:10", "mm")).toBe("11");
    expect(fn("2020-02-02 12:11:10")).toBe("2020-02-02 12:11:10");
});
test("getDateFromStr", () => {
    const fn = t.getDateFromStr;
    [
        "2020-02-02 10:10:10",
        "2020/02/02 10:10:10",
        "2020/02-02-10-10-10",
        "2020/02/02 10/10/10",
        "2020/02/02/10/10/10",
    ].forEach((time: string) => {
        expect(t.formatDate.call(fn(time))).toBe("2020-02-02 10:10:10");
    });
    expect(fn("")).toBe(null);
    expect(fn("123cvsd213")).toBe(null);
    expect(fn("2020l02/02/10/10/10")).toBe(null);
    expect(fn(undefined as any)).toBe(null);
});
test("formatDate", () => {
    const date1 = t.getDateFromStr("2020-02-02 10:10:10");
    expect(t.formatDate.call(date1, "yyyy-MM-dd")).toBe("2020-02-02");
    expect(t.formatDate.call(date1, "hh:mm:ss")).toBe("10:10:10");
    expect(t.formatDate.call(date1, "dd-MM-yyyy")).toBe("02-02-2020");
    // week start
    expect(t.formatDate.call(new Date("2020-01-12"), "周w")).toBe("周日");
    expect(t.formatDate.call(new Date("2020-01-12"), "w")).toBe("日");
    expect(t.formatDate.call(new Date("2020-01-13"), "w")).toBe("一");
    expect(t.formatDate.call(new Date("2020-01-14"), "w")).toBe("二");
    expect(t.formatDate.call(new Date("2020-01-15"), "w")).toBe("三");
    expect(t.formatDate.call(new Date("2020-01-16"), "w")).toBe("四");
    expect(t.formatDate.call(new Date("2020-01-17"), "w")).toBe("五");
    expect(t.formatDate.call(new Date("2020-01-18"), "w")).toBe("六");
    // week end
    // season start
    expect(t.formatDate.call(new Date("2020-01-12"), "q")).toBe("春");
    expect(t.formatDate.call(new Date("2020-02-12"), "q")).toBe("春");
    expect(t.formatDate.call(new Date("2020-03-13"), "q")).toBe("春");
    expect(t.formatDate.call(new Date("2020-04-14"), "q")).toBe("夏");
    expect(t.formatDate.call(new Date("2020-05-15"), "q")).toBe("夏");
    expect(t.formatDate.call(new Date("2020-06-16"), "q")).toBe("夏");
    expect(t.formatDate.call(new Date("2020-07-17"), "q")).toBe("秋");
    expect(t.formatDate.call(new Date("2020-08-18"), "q")).toBe("秋");
    expect(t.formatDate.call(new Date("2020-09-18"), "q")).toBe("秋");
    expect(t.formatDate.call(new Date("2020-10-18"), "q")).toBe("冬");
    expect(t.formatDate.call(new Date("2020-11-18"), "q")).toBe("冬");
    expect(t.formatDate.call(new Date("2020-12-18"), "q")).toBe("冬");

    t.formatDate.seasonText = ["spring"];
    expect(t.formatDate.call(new Date("2020-01-12"), "q")).toBe("spring");
    // season end
    const date2 = t.getDateFromStr("2019-12-1 10:10:10");
    expect(t.formatDate.call(date2, "d-MM-yy")).toBe("1-12-19");
});

test("dateDiff", () => {
    const v = t.dateDiff(new Date("2020-05-01"), new Date("2020-05-06"));
    expect(v).toBe("0年5天 00时00分00秒");
    expect(t.dateDiff(new Date("2020-05-01"), new Date("2020-05-06"), "dd天 hh时mm分ss秒")).toBe("05天 00时00分00秒");
    expect(t.dateDiff(new Date("2020-05-06"), new Date("2020-05-01 3:20:10"), "d天 hh时mm分ss秒")).toBe("5天 04时39分50秒");

    // expect(cm.dateDiff(new Date("2020-05-01"), new Date("2020-05-06"), "d天 H时m分s秒")).toBe("5天 0时0分0秒");
    // expect(cm.dateDiff(new Date("2020-05-06"), new Date("2020-05-01 3:20:10"), "d天 H时m分s秒")).toBe("-5天 -4时-39分-50秒");
});
test("number2Date", () => {
    const fn = t.number2Date;
    expect(fn(1000, "d天hh时")).toBe("0天00时");
    expect(fn(1000)).toBe("0天00时00分01秒");
    expect(fn(60 * 1000)).toBe("0天00时01分00秒");
    expect(fn(60 * 60 * 1000)).toBe("0天01时00分00秒");
    expect(fn(60 * 60 * 24 * 1000)).toBe("1天00时00分00秒");
});
test("createTimeCountUp", async () => {
    const c = t.createTimeCountUp;
    const fn = c();
    expect(fn()).toBe(0);
    await t.sleep(100);
    const t1 = fn();
    expect(t1).toBeGreaterThanOrEqual(100);
    expect(t1).toBeLessThanOrEqual(100 + 100);
    await t.sleep(100);
    const t2 = fn();
    expect(t2).toBeGreaterThanOrEqual(200);
    expect(t2).toBeLessThanOrEqual(200 + 100);
    await t.sleep(600);
    const t3 = fn();
    expect(t3).toBeGreaterThanOrEqual(800);
    expect(t3).toBeLessThanOrEqual(800 + 100);
});
test("createTimeCountDown", async () => {
    const ctd = t.createTimeCountDown;
    let down = 1000;
    let sleep = 10;
    let initTime = Date.now();
    await t.sleep(sleep);
    expect(Date.now() - initTime).toBeGreaterThanOrEqual(sleep);
    const fn = ctd(down);

    await t.sleep(50);
    let t1 = fn();
    expect(t1).toBeLessThanOrEqual(down - 50);
    expect(t1).toBeGreaterThanOrEqual(down - 150);
    await t.sleep(150);
    t1 = fn();
    expect(t1).toBeLessThanOrEqual(down - 200);
    expect(t1).toBeGreaterThanOrEqual(down - 300);
});
test("getTheLastDayOfAMonth", async () => {
    const fn = t.getTheLastDayOfAMonth;

    expect(fn(new Date("2021-1")).getDate()).toBe(31);
    expect(fn(new Date("2021-2")).getDate()).toBe(28);
    expect(fn(new Date("2021-3")).getDate()).toBe(31);
    expect(fn(new Date("2021-4")).getDate()).toBe(30);
    expect(fn(new Date("2021-5")).getDate()).toBe(31);
    expect(fn(new Date("2021-6")).getDate()).toBe(30);
    expect(fn(new Date("2021-7")).getDate()).toBe(31);
    expect(fn(new Date("2021-8")).getDate()).toBe(31);
    expect(fn(new Date("2021-9")).getDate()).toBe(30);
    expect(fn(new Date("2021-10")).getDate()).toBe(31);
    expect(fn(new Date("2021-11")).getDate()).toBe(30);
    expect(fn(new Date("2021-12")).getDate()).toBe(31);
    expect(fn(new Date("2020-2")).getDate()).toBe(29);
});
test("getMonthTheNthWeekday", async () => {
    // const fn = t.getMonthTheLastWeekDay;
    const fn = t.getMonthTheNthWeekday;

    expect(fn(new Date("2021-4-25"), -1, 1)!.getDate()).toBe(26);
    expect(fn(new Date("2021-2"), -1, 1)!.getDate()).toBe(22);
    expect(fn(new Date("2021-5"), -1, 1)!.getDate()).toBe(31);
    expect(fn(new Date("2021-5"), -1, 5)!.getDate()).toBe(28);
    expect(fn(new Date("2021-8"), -1, 4)!.getDate()).toBe(26);
});
test("getMonthTheNthWeekday", async () => {
    const fn = t.getMonthTheNthWeekday;
    // +
    expect(fn(new Date("2021-4"), 1, 4)!.getDate()).toBe(1);
    expect(fn(new Date("2021-4"), 1, 5)!.getDate()).toBe(2);
    expect(fn(new Date("2021-4"), 1, 6)!.getDate()).toBe(3);
    expect(fn(new Date("2021-4"), 1, 0)!.getDate()).toBe(4);
    expect(fn(new Date("2021-4"), 1, 7)!.getDate()).toBe(4);
    expect(fn(new Date("2021-4"), 1, 7)!.getDate()).toBe(4);
    expect(fn(new Date("2021-4"), 1, 1)!.getDate()).toBe(5);
    expect(fn(new Date("2021-4"), 1, 2)!.getDate()).toBe(6);
    expect(fn(new Date("2021-4"), 1, 3)!.getDate()).toBe(7);
    expect(fn(new Date("2021-4"), 2, 4)!.getDate()).toBe(8);
    expect(fn(new Date("2021-4"), 2, 5)!.getDate()).toBe(9);
    expect(fn(new Date("2021-4"), 2, 7)!.getDate()).toBe(11);
    expect(fn(new Date("2021-4"), 4, 3)!.getDate()).toBe(28);
    expect(fn(new Date("2021-3"), 1, 1)!.getDate()).toBe(1);
    expect(fn(new Date("2021-3"), 4, 7)!.getDate()).toBe(28);
    expect(fn(new Date("2021-3"), 5, 7)).toBe(null);
    expect(fn(new Date("2021-3"), 4, 8)).toBe(null);
    expect(fn(new Date("2021-3"), 4, -1)).toBe(null);
    expect(fn(new Date("2021-3"), 4, -1)).toBe(null);

    // -
    // 周日
    expect(fn(new Date("2021-1"), -1)!.getDate()).toBe(31);
    expect(fn(new Date("2021-2"), -1)!.getDate()).toBe(28);
    expect(fn(new Date("2021-3"), -1)!.getDate()).toBe(28);
    expect(fn(new Date("2021-4"), -1)!.getDate()).toBe(25);
    expect(fn(new Date("2021-5"), -1)!.getDate()).toBe(30);
    expect(fn(new Date("2021-6"), -1)!.getDate()).toBe(27);
    expect(fn(new Date("2021-7"), -1)!.getDate()).toBe(25);
    expect(fn(new Date("2021-8"), -1)!.getDate()).toBe(29);
    expect(fn(new Date("2021-9"), -1)!.getDate()).toBe(26);
    expect(fn(new Date("2021-10"), -1)!.getDate()).toBe(31);
    expect(fn(new Date("2021-11"), -1)!.getDate()).toBe(28);
    expect(fn(new Date("2021-12"), -1)!.getDate()).toBe(26);

    expect(fn(new Date("2021-4"), 1 - 6, 4)!.getDate()).toBe(1);
    expect(fn(new Date("2021-4"), 1 - 6, 5)!.getDate()).toBe(2);
    expect(fn(new Date("2021-4"), 1 - 6, 6)).toBe(null);
    expect(fn(new Date("2021-4"), -4, 6)!.getDate()).toBe(3);
    expect(fn(new Date("2021-4"), 1 - 6, 7)).toBe(null);
    expect(fn(new Date("2021-4"), 1 - 6, 0)).toBe(null);
    expect(fn(new Date("2021-4"), -4, 7)!.getDate()).toBe(4);
    expect(fn(new Date("2021-4"), -4, 0)!.getDate()).toBe(4);
    expect(fn(new Date("2021-4"), 1 - 5, 1)!.getDate()).toBe(5);
    expect(fn(new Date("2021-4"), 1 - 5, 2)!.getDate()).toBe(6);
    expect(fn(new Date("2021-4"), 1 - 5, 3)!.getDate()).toBe(7);
    expect(fn(new Date("2021-4"), 2 - 6, 4)!.getDate()).toBe(8);
    expect(fn(new Date("2021-4"), 2 - 6, 5)!.getDate()).toBe(9);
    expect(fn(new Date("2021-4"), 2 - 5, 7)!.getDate()).toBe(11);
    expect(fn(new Date("2021-4"), 4 - 5, 3)!.getDate()).toBe(28);
    expect(fn(new Date("2021-3"), 1 - 6, 1)!.getDate()).toBe(1);
    expect(fn(new Date("2021-3"), 4 - 5, 7)!.getDate()).toBe(28);
    expect(fn(new Date("2021-4"), 4 - 5, 5)!.getDate()).toBe(30);
});