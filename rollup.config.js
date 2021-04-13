import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',  // 入口文件
  output: {
    name: 'tsUtils', // umd 模式必须要有 name  此属性作为全局变量访问打包结果
    file: `lib-umd/index.js`,
    format: 'umd',
    sourcemap: false
  },
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: false // 输出时去除类型文件
        }
      }
    }),
    babel({
      extensions: [".ts"],
      exclude: "node_modules/**",
      babelHelpers: 'bundled'
    }),
    terser()
  ]
};
