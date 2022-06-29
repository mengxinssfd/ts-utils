import * as all from "./index";
export * from "./index"

declare global {
    interface Window {
        tsUtils: typeof all;
    }
}
export as namespace tsUtils;
declare module 'tsUtils' {
    export = all
}