"use strict";
exports.__esModule = true;
/**
 * 防抖函数
 * @param callback 回调
 * @param delay 延时
 * @returns {Function}
 */
function debounce(callback, delay) {
    var timer = null;
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(function () {
            timer = null;
            callback.apply(_this, args);
        }, delay);
    };
}
exports.debounce = debounce;
// 对象深拷贝办法
function deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]); //递归复制
            }
            else {
                result[key] = obj[key];
            }
        }
    }
    return result;
}
exports.deepCopy = deepCopy;
/**
 * 格式化日期  到date原型上用 不能import导入调用 或者用call apply
 * @param formatStr
 * @returns String
 */
function formatDate(formatStr) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(formatStr)) {
        formatStr = formatStr.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(formatStr)) {
            formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return formatStr;
}
exports.formatDate = formatDate;
// 获取小数点后面数字的长度
function getNumberLenAfterDot(num) {
    num = Number(num);
    if (Number.isNaN(num))
        return 0;
    var item = String(num).split(".")[1];
    return item ? item.length : 0;
}
exports.getNumberLenAfterDot = getNumberLenAfterDot;
function getPow(a, b) {
    a = Number(a);
    b = Number(b);
    if (Number.isNaN(a) || Number.isNaN(b))
        return 1;
    var aLen = getNumberLenAfterDot(a);
    var bLen = getNumberLenAfterDot(b);
    return Math.pow(10, Math.max(aLen, bLen));
}
// 小数运算 小数位不能太长，整数位不能太大
exports.FloatCalc = {
    add: function (a, b) {
        var pow = getPow(a, b);
        return (a * pow + b * pow) / pow;
    },
    minus: function (a, b) {
        var pow = getPow(a, b);
        return (a * pow - b * pow) / pow;
    },
    mul: function (a, b) {
        var pow = getPow(a, b);
        return pow * a * (b * pow) / (pow * pow);
    },
    division: function (a, b) {
        var pow = getPow(a, b);
        return a * pow / (b * pow);
    }
};
// 获取数据类型
function typeOf(target) {
    if (typeof target !== 'object')
        return typeof target;
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}
exports.typeOf = typeOf;
// 判断是否是空值 undefined, null, "", [], {} ,NaN都为true
function isEmpty(target) {
    // @ts-ignore
    if ([undefined, null, "", NaN].includes(target))
        return true;
    switch (typeOf(target)) {
        case "array":
            return !!target.length;
        case "object":
            return JSON.stringify(target) === "{}";
    }
    return false;
}
exports.isEmpty = isEmpty;
// 生成start到end之间的随机数 包含start与end
// 传start不传end  end=start start=0 生成0-start之间的随机数
// start end都不传  return Math.random()
function randomNumber(start, end) {
    if (!arguments.length)
        return Math.random();
    if (arguments.length === 1) {
        end = start;
        start = 0;
    }
    var len = end - start + 1;
    return ~~(Math.random() * len) + start;
}
exports.randomNumber = randomNumber;
/**
 * 随机颜色
 */
function randomColor() {
    var num = randomNumber(0xffffff).toString(16);
    return "#" + strAddPrefix(num, 0, 6);
}
exports.randomColor = randomColor;
/**
 * 字符串转为date对象 因为苹果手机无法直接new Date("2018-08-01 10:20:10")获取date
 * @param dateString
 * @returns {Date}
 */
function getDateFromStr(dateString) {
    var arr = dateString.split(/[- :\/]/).map(function (item) { return Number(item) || 0; });
    return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
}
exports.getDateFromStr = getDateFromStr;
function objectIsEqual(obj1, obj2) {
    for (var key in obj1) {
        var value1 = obj1[key];
        var value2 = obj2[key];
        if (!isEqual(value1, value2)) {
            return false;
        }
    }
    return true;
}
exports.objectIsEqual = objectIsEqual;
function isEqual(a, b) {
    if (a === b)
        return true;
    var aType = typeOf(a);
    var bType = typeOf(b);
    if (aType !== bType)
        return false;
    switch (aType) {
        case "boolean":
        case "number":
        case "string":
        case "function":
            return false;
        //  只有数组或者object不相等的时候才去对比是否相等
        case "array":
        case "object":
            return objectIsEqual(a, b);
    }
}
exports.isEqual = isEqual;
/**
 * 千位分隔 1,234,567,890
 * @param num
 */
function qwFormat(num) {
    return String(num).replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}
exports.qwFormat = qwFormat;
// 给不能用``模板字符串的环境使用
// es5的格式化字符串 example: getFormatStr("11%s111%s", 3, 4) => "1131114"
function getFormatStr() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (!args.length)
        return "";
    var str = args[0];
    var params = args.slice(1);
    return str.replace(/%s/g, function () {
        return params.length ? params.shift() : "";
    });
}
exports.getFormatStr = getFormatStr;
/**
 * 给长度不满足要求的字符串添加前缀
 * @param target
 * @param fill
 * @param len
 */
function strAddPrefix(target, fill, len) {
    if (target.length >= len)
        return target;
    var fillStr = Array(len - target.length).fill(fill).join("");
    return fillStr + target;
}
exports.strAddPrefix = strAddPrefix;
/**
 * 每隔一段事件返回字符串中的一个单词
 * @param sayWord
 * @param delay
 * @param callback
 */
function oneByOne(sayWord, delay, callback) {
    var wordArr = sayWord.split("");
    function handler() {
        var word = wordArr.shift();
        var keepRun = !!wordArr.length;
        if (callback) {
            var flag = callback(word, sayWord);
            keepRun = keepRun && flag !== false;
        }
        else {
            console.log(word);
        }
        if (keepRun)
            run();
    }
    function run() {
        setTimeout(handler, delay);
    }
    handler();
}
exports.oneByOne = oneByOne;
var ONEBYONE_STATE;
(function (ONEBYONE_STATE) {
    ONEBYONE_STATE[ONEBYONE_STATE["default"] = 0] = "default";
    ONEBYONE_STATE[ONEBYONE_STATE["pause"] = 1] = "pause";
    ONEBYONE_STATE[ONEBYONE_STATE["stop"] = 2] = "stop";
})(ONEBYONE_STATE || (ONEBYONE_STATE = {}));
var OneByOne = /** @class */ (function () {
    function OneByOne(sayWord, config) {
        this.status = ONEBYONE_STATE["default"];
        this.sayWord = sayWord;
        this.wordArr = sayWord.split("");
        this.config = config;
    }
    OneByOne.prototype.run = function () {
        var _this = this;
        var handler = function () {
            if (_this.status !== ONEBYONE_STATE["default"])
                return;
            var word = _this.wordArr.shift();
            var len = _this.wordArr.length;
            var keepRun = !!len;
            if (_this.config.callback) {
                var flag = _this.config.callback(word, _this.sayWord);
                if (len && flag === false) {
                    _this.status = ONEBYONE_STATE.pause;
                }
                keepRun = len && flag !== false;
            }
            else {
                console.log(word);
            }
            // 播放过一遍后，设为停止状态
            if (!len) {
                _this.status = ONEBYONE_STATE.stop;
                if (_this.config.loop) {
                    _this.replay();
                }
                return;
            }
            if (keepRun)
                _this.run();
        };
        this.timer = setTimeout(handler, this.config.delay);
    };
    OneByOne.prototype.play = function () {
        if (this.status === ONEBYONE_STATE.stop)
            return;
        this.status = ONEBYONE_STATE["default"];
        this.run();
    };
    OneByOne.prototype.replay = function () {
        this.status = ONEBYONE_STATE["default"];
        this.wordArr = this.sayWord.split("");
        this.run();
    };
    OneByOne.prototype.pause = function () {
        if (this.status === ONEBYONE_STATE.stop)
            return;
        this.status = ONEBYONE_STATE.pause;
        clearTimeout(this.timer);
    };
    OneByOne.prototype.stop = function () {
        if (this.status !== ONEBYONE_STATE["default"])
            return;
        this.status = ONEBYONE_STATE.stop;
        clearTimeout(this.timer);
    };
    return OneByOne;
}());
exports.OneByOne = OneByOne;
