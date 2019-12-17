import * as dom from "./dom";
import * as common from "./common";
import * as OneByOne from "./OneByOne";
import * as UrlParse from "./urlParse";

const utils = {...OneByOne, ...UrlParse, ...dom, ...common};
export default utils;
// TODO npm run lib:umd编译后需要手动删除lib-umd文件夹下的几个文件