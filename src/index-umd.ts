import * as dom from "./dom";
import * as common from "./common";
import * as OneByOne from "./OneByOne";
import * as UrlParse from "./urlParse";

const utils = {...OneByOne, ...UrlParse, ...dom, ...common};
export default utils;
