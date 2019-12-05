import { OneByOne } from "./OneByOne";
import { UrlParse } from "./urlParse";
import * as dom from "./dom";
import * as common from "./common";
const utils = { OneByOne, UrlParse, ...dom, ...common };
export default utils;
// module.exports = utils;
