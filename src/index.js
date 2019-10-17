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
    switch (Object.typeOf(target)) {
        case "array":
            if (!target.length)
                return true;
            break;
        case "object":
            if (JSON.stringify(target) === "{}")
                return true;
            break;
    }
    return false;
}
exports.isEmpty = isEmpty;
// 生成start到end之间的随机数 包含start与end
function randomNumber(start, end) {
    if (!arguments.length)
        return Math.random();
    var len = end - start + 1;
    return ~~(Math.random() * len) + start;
}
exports.randomNumber = randomNumber;
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
