/**
 * 单元测试
 * @Author: dyh
 * @Date: 2019-10-17 12:35
 * @Description:
 */
import * as utils from "../index";


const str1 = "123123";
const str2 = "123123";
const str3 = "12312";

// 断言
console.log(str1, str2, true === utils.isEqual(str1, str2));
console.log(str1, str3, false === utils.isEqual(str1, str3));

const obj1 = {a: 123, b: "123123", c: {a: 123}};
const obj2 = {a: 123, b: "123123", c: {a: 123}};
const obj3 = {a: 123, b: "123123", c: [1, 23, 4]};

// 断言
console.log(obj1, obj2, true === utils.isEqual(obj1, obj2));
console.log(obj1, obj3, false === utils.isEqual(obj1, obj3));
console.log(str1, obj3, false === utils.isEqual(str1, obj3));