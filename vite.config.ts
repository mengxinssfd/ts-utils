import { resolve } from 'path';
import { defineConfig, UserConfigExport } from 'vite';

export default defineConfig(({ mode }) => {
  const config: UserConfigExport = {
    resolve: {
      alias: {
        '@mxssfd': resolve(__dirname, 'packages'),
      },
    },
  };

  return config;
});
