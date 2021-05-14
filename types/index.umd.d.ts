import * as all from "./export";
export * from "./export"

declare global {
    interface Window {
        tsUtils: typeof all;
    }
}
export as namespace tsUtils;
declare module 'tsUtils' {
    export = all
}