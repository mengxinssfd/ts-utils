import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';
import commonjs from "rollup-plugin-commonjs";
import resolve from 'rollup-plugin-node-resolve';

const {version, author, homepage} = require('./package.json');
const libraryName = "tsUtils";
const date = new Date();


export default {
  input: 'src/index.ts',  // 入口文件
  output: {
    name: libraryName, // umd 模式必须要有 name  此属性作为全局变量访问打包结果
    file: `lib-umd/index.js`,
    format: 'umd',
    sourcemap: false,
    banner:
      "/*!\n" +
      ` * ${libraryName} v${version}\n` +
      ` * Author: ${author}\n` +
      ` * Documentation: ${homepage}\n` +
      ` * Date: ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}\n` +
      ` */\n`
  },
  plugins: [
    typescript({
      // tsconfig:"tsconfig.webpack.json",
      tsconfigOverride: {
        compilerOptions: {
          declaration: false // 输出时去除类型文件
        }
      }
    }),
    babel({
      extensions: [".ts"],
      exclude: "node_modules/*",
      babelHelpers: "runtime"
    }),
    terser(),
    resolve(),
    commonjs()
  ]
};
