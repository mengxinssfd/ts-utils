import * as dom from "./dom";
import * as common from "./common";
import * as OneByOne from "./OneByOne";
import * as UrlParse from "./urlParse";
import * as arr from "./array";
import * as Is from "./is";
import * as coordinate from "./coordinate";

const utils = {...Is, ...OneByOne, ...UrlParse, ...dom, ...common, ...arr, ...coordinate};
export default utils;
// TODO npm run lib:umd编译后需要手动删除lib-umd文件夹下的几个文件