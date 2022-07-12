export * from '@mxssfd/core';
export * from '@mxssfd/types';
export * from '@mxssfd/bom';
export * from '@mxssfd/dom';

import * as all from './index';

declare global {
  interface Window {
    tsUtils: typeof all;
  }
}
