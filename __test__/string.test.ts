import * as cm from "../src/string";

test("strPadStart", () => {
    const fn = cm.strPadStart;
    expect(fn("123", 6, "0")).toBe("000123");
    expect("123".padStart(6, "0")).toBe("000123");
    expect(fn("123", 0, "0")).toBe("123");
    expect("123".padStart(0, "0")).toBe("123");
    expect(fn("123", 4, "hello")).toBe("h123");
    expect(fn("123", 20, "hello")).toBe("hellohellohellohe123");
    expect("123".padStart(20, "hello")).toBe("hellohellohellohe123");
    expect(fn("123", -1, "0")).toBe("123");
    expect("123".padStart(-1, "0")).toBe("123");
    expect(fn("0", 2, "0")).toBe("00");
    expect(fn("0", 2)).toBe(" 0");
    expect(fn("0", 5)).toBe("    0");
    expect("0".padStart(5)).toBe("    0");
    expect(fn("0", 5, "")).toBe("0");
    expect("0".padStart(5, "")).toBe("0");
});
test("strPadEnd", () => {
    const fn = cm.strPadEnd;
    expect(fn("123", 6, "0")).toBe("123000");
    expect("123".padEnd(6, "0")).toBe("123000");
    expect(fn("123", 0, "0")).toBe("123");
    expect("123".padEnd(0, "0")).toBe("123");
    expect(fn("123", 4, "hello")).toBe("123h");
    expect("123".padEnd(4, "hello")).toBe("123h");
    expect(fn("123", 20, "hello")).toBe("123hellohellohellohe");
    expect("123".padEnd(20, "hello")).toBe("123hellohellohellohe");
    expect(fn("123", -1, "0")).toBe("123");
    expect("123".padEnd(-1, "0")).toBe("123");
    expect(fn("0", 2)).toBe("0 ");
    expect("0".padEnd(2)).toBe("0 ");
    expect(fn("0", 2, "")).toBe("0");
    expect("0".padEnd(2, "")).toBe("0");
});
test("thousandFormat", () => {
    expect(cm.thousandFormat(123456789)).toBe("123,456,789");
    expect(cm.thousandFormat(123)).toBe("123");
    expect(cm.thousandFormat(5763423)).toBe("5,763,423");
});
test("getChineseNumber", () => {
    expect(cm.number2Chinese(123)).toBe("一百二十三");
    expect(cm.number2Chinese(1)).toBe("一");
    expect(cm.number2Chinese(11)).toBe("十一");
    expect(cm.number2Chinese(21)).toBe("二十一");
    expect(cm.number2Chinese(101)).toBe("一百零一");
    expect(cm.number2Chinese(111)).toBe("一百一十一");
    expect(cm.number2Chinese(1001)).toBe("一千零一");
    expect(cm.number2Chinese(12345)).toBe("一万二千三百四十五");
    expect(cm.number2Chinese(23456789)).toBe("二千三百四十五万六千七百八十九");
    expect(cm.number2Chinese(123456789)).toBe("一亿二千三百四十五万六千七百八十九");
});
test("getFormatStr", () => {
    expect(cm.strTemplate("hell%s worl%s", "o", "d")).toBe("hello world");
    expect(cm.strTemplate("hell%s worl%s")).toBe("hell worl");
});
test("chinese2Number", () => {
    expect(cm.chinese2Number("一")).toBe(1);
    expect(cm.chinese2Number("十一")).toBe(11);
    expect(cm.chinese2Number("九十一")).toBe(91);
    expect(cm.chinese2Number("一百九十九")).toBe(199);
    expect(cm.chinese2Number("五千一百九十九")).toBe(5199);
    expect(cm.chinese2Number("一万零一")).toBe(10001);
    expect(cm.chinese2Number("一万零一十")).toBe(10010);
    expect(cm.chinese2Number("一万零一十三")).toBe(10013);
    expect(cm.chinese2Number("一万零一十三")).toBe(10013);
    expect(cm.chinese2Number("十万零一十三")).toBe(100013);
    expect(cm.chinese2Number("二百一十万零一十三")).toBe(2100013);
    expect(cm.chinese2Number("一千二百一十万零一十三")).toBe(12100013);
    expect(cm.chinese2Number("一千二百一十万零一")).toBe(12100001);
    expect(cm.chinese2Number("一亿零二百一十万零一十三")).toBe(102100013);
    expect(cm.chinese2Number("一亿二千三百四十五万六千七百八十九")).toBe(123456789);
    expect(cm.chinese2Number("十一亿零二百一十万零一十三")).toBe(1102100013);
    const sbq = ["拾", "佰", "仟"];
    cm.chinese2Number.units = ["", ...sbq, "萬", ...sbq, "亿"];
    cm.chinese2Number.numbers = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    // 千和百未定义
    expect(() => {
        cm.chinese2Number("壹亿贰仟叁佰肆拾伍萬陆千柒百捌拾玖");
    }).toThrow();
    expect(cm.chinese2Number("壹亿贰仟叁佰肆拾伍萬陆仟柒佰捌拾玖")).toBe(123456789);
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
test("removeSlashByNum", () => {
    const fn = cm.removeStrByNum;
    expect(fn("123/456/78", 2, "\/")).toBe("123/45678");
    expect(fn("123,456,,78", 2, ",")).toBe("123,456,78");
    expect(fn("hello thank you i m fine", 4, " ")).toBe("hello thank you im fine");
});
test("subString", async () => {
    const fn = cm.subString;
    expect(fn("test", 0, -1)).toBe("tes");
    expect(fn("test", 2, -1)).toBe("s");
    expect(fn("test", 0, -2)).toBe("te");
    expect(fn("test", 0, -4)).toBe("");
    expect(fn("test", 0, -10)).toBe("");

    expect(fn("test", 0, 3)).toBe("tes");
    expect(fn("test", 0, 2)).toBe("te");
    expect(fn("test", 1)).toBe("est");
});
test("strRepeat", () => {
    const fn = cm.strRepeat;
    expect(fn("", 100)).toBe("");
    expect(fn("a", 1)).toBe("a");
    expect(fn("a", "1" as any)).toBe("a");
    expect(fn("a", "sfsdf" as any)).toBe("");
    expect(fn("a", 2)).toBe("aa");
    expect(fn("ab", 3)).toBe("ababab");
    expect(fn("ab", undefined as any)).toBe("");

    expect(fn("ab", 0)).toBe("");
    expect("ab".repeat(0)).toBe("");

    expect(() => fn("1", -1)).toThrowError();
    expect(() => "1".repeat(-1)).toThrowError();
    expect(() => fn("1", fn.MAX_STR_LENGTH + 1)).toThrowError();
});
test("smartRepeat", () => {
    const fn = cm.smartRepeat;
    expect(fn("2[a]")).toBe("aa");
    expect(fn("1[a]")).toBe("a");
    expect(fn("[a]")).toBe("[a]");
    expect(fn("[a]")).toBe("[a]");
    expect(fn("2[2[a]2[b]]")).toBe("aabbaabb");
    expect(fn("2[2[a]2[b]2[c]]")).toBe("aabbccaabbcc");
    expect(fn("2[2[a]2[bc]]")).toBe("aabcbcaabcbc");
    expect(fn("2[2]]")).toBe("22]");
    expect(fn("2[2[a]77]")).toBe("aa77aa77");
    // 不能重复有非对称[]的字符串
    // expect(fn("2[2\]]")).toBe("2]2]");
    expect(fn("2[1[1]2[2]3[2[5]2[6]]]")).toBe("122556655665566122556655665566");
    expect(fn("2[1[a]3[b]2[3[c]4[d]]]")).toBe("abbbcccddddcccddddabbbcccddddcccdddd");

    expect(fn("2[1[1]3[b]2[1[1]4[d]]]")).toBe("1bbb1dddd1dddd1bbb1dddd1dddd");
});
test("capitalizeFirstChar", () => {
    const fn = cm.capitalizeFirstChar;
    expect(fn("A")).toBe("A");
    expect(fn("1")).toBe("1");
    expect(fn("ab")).toBe("Ab");
    expect(fn("Ab")).toBe("Ab");
    expect(fn("aa")).toBe("Aa");
});

test("fromCamel", () => {
    const fn = cm.fromCamel;
    expect(fn("a")).toBe("a");
    expect(fn("A")).toBe("a");
    expect(fn("Test")).toBe("test");
    expect(fn("TEST")).toBe("test");
    expect(fn("testCamel")).toBe("test_camel");
    expect(fn("TestCamelString")).toBe("test_camel_string");
    expect(fn("TestCamelSTring")).toBe("test_camel_string");
    expect(fn("TestCamelSTring","-")).toBe("test-camel-string");
});

test("toCamel", () => {
    const fn = cm.toCamel;
    expect(fn("A")).toBe("A");
    expect(fn("a")).toBe("a");
    expect(fn("a", undefined, true)).toBe("A");
    expect(fn("1")).toBe("1");
    expect(fn("ab")).toBe("ab");
    expect(fn("ab", undefined, true)).toBe("Ab");
    expect(fn("aa_bb")).toBe("aaBb");
    expect(fn("test_camel_string")).toBe("testCamelString");
    expect(fn("test__camel_string")).toBe("testCamelString");
    expect(fn("test_camel_string", undefined, true)).toBe("TestCamelString");
    expect(fn("test-camel_string", /[-_]/)).toBe("testCamelString");
});