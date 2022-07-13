import * as all from '@mxssfd/ts-utils';
export * from '@mxssfd/ts-utils';

declare global {
  interface Window {
    tsUtils: typeof all;
  }
}
export as namespace tsUtils;
declare module 'tsUtils' {
  export = all;
}
