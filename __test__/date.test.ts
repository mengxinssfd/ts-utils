import * as dt from "../src/date";

test('str2Date', () => {
    const t1 = (dt.str2Date("2020-02-02 10:10:10") as Date).getTime();
    const t2 = (dt.str2Date("2020-02-20 10:10:10") as Date).getTime();
    expect(t2).toBeGreaterThan(t1);
    expect(dt.str2Date("abcd")).toBeNull();

    function fn(date: string, format?: string) {
        return dt.formatDate.call(dt.str2Date(date), format);
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
test('formatDate', () => {
    const date1 = dt.getDateFromStr("2020-02-02 10:10:10");
    expect(dt.formatDate.call(date1, "yyyy-MM-dd")).toBe("2020-02-02");
    expect(dt.formatDate.call(date1, "hh:mm:ss")).toBe("10:10:10");
    expect(dt.formatDate.call(date1, "dd-MM-yyyy")).toBe("02-02-2020");
    // week start
    expect(dt.formatDate.call(new Date("2020-01-12"), "周w")).toBe("周日");
    expect(dt.formatDate.call(new Date("2020-01-12"), "w")).toBe("日");
    expect(dt.formatDate.call(new Date("2020-01-13"), "w")).toBe("一");
    expect(dt.formatDate.call(new Date("2020-01-14"), "w")).toBe("二");
    expect(dt.formatDate.call(new Date("2020-01-15"), "w")).toBe("三");
    expect(dt.formatDate.call(new Date("2020-01-16"), "w")).toBe("四");
    expect(dt.formatDate.call(new Date("2020-01-17"), "w")).toBe("五");
    expect(dt.formatDate.call(new Date("2020-01-18"), "w")).toBe("六");
    // week end
    // season start
    expect(dt.formatDate.call(new Date("2020-01-12"), "q")).toBe("春");
    expect(dt.formatDate.call(new Date("2020-02-12"), "q")).toBe("春");
    expect(dt.formatDate.call(new Date("2020-03-13"), "q")).toBe("春");
    expect(dt.formatDate.call(new Date("2020-04-14"), "q")).toBe("夏");
    expect(dt.formatDate.call(new Date("2020-05-15"), "q")).toBe("夏");
    expect(dt.formatDate.call(new Date("2020-06-16"), "q")).toBe("夏");
    expect(dt.formatDate.call(new Date("2020-07-17"), "q")).toBe("秋");
    expect(dt.formatDate.call(new Date("2020-08-18"), "q")).toBe("秋");
    expect(dt.formatDate.call(new Date("2020-09-18"), "q")).toBe("秋");
    expect(dt.formatDate.call(new Date("2020-10-18"), "q")).toBe("冬");
    expect(dt.formatDate.call(new Date("2020-11-18"), "q")).toBe("冬");
    expect(dt.formatDate.call(new Date("2020-12-18"), "q")).toBe("冬");

    dt.formatDate.seasonText = ["spring"];
    expect(dt.formatDate.call(new Date("2020-01-12"), "q")).toBe("spring");
    // season end
    const date2 = dt.getDateFromStr("2019-12-1 10:10:10");
    expect(dt.formatDate.call(date2, "d-MM-yy")).toBe("1-12-19");
});

test("dateDiff", () => {
    const v = dt.dateDiff(new Date("2020-05-01"), new Date("2020-05-06"));
    expect(v).toBe("0年5天 00时00分00秒");
    expect(dt.dateDiff(new Date("2020-05-01"), new Date("2020-05-06"), "dd天 hh时mm分ss秒")).toBe("05天 00时00分00秒");
    expect(dt.dateDiff(new Date("2020-05-06"), new Date("2020-05-01 3:20:10"), "d天 hh时mm分ss秒")).toBe("5天 04时39分50秒");

    // expect(cm.dateDiff(new Date("2020-05-01"), new Date("2020-05-06"), "d天 H时m分s秒")).toBe("5天 0时0分0秒");
    // expect(cm.dateDiff(new Date("2020-05-06"), new Date("2020-05-01 3:20:10"), "d天 H时m分s秒")).toBe("-5天 -4时-39分-50秒");
});
test("number2Date", () => {
    const fn = dt.number2Date;
    expect(fn(1000, "d天hh时")).toBe("0天00时");
    expect(fn(1000)).toBe("0天00时00分01秒");
    expect(fn(60 * 1000)).toBe("0天00时01分00秒");
    expect(fn(60 * 60 * 1000)).toBe("0天01时00分00秒");
    expect(fn(60 * 60 * 24 * 1000)).toBe("1天00时00分00秒");
});
