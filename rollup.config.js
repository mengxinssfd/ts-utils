import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';
import commonjs from "rollup-plugin-commonjs";
import resolve from 'rollup-plugin-node-resolve';

const {version, author, homepage} = require('./package.json');
const libraryName = "tsUtils";
const date = new Date();


function intro(lib, libraryName, version) {
  function getCurrentScript() {
    if(document.currentScript) {
      return document.currentScript;
    }
    return document.getElementById(libraryName + version);
  }

  if(typeof document === "undefined") {
    return;
  }
  var alias, currentScript;
  // 如果当前script绑定了${libraryName + version}为id则认为这是当前script
  if((currentScript = getCurrentScript()) && (alias = currentScript.getAttribute("alias"))) {
    self[alias] = lib;
  }
  var vk = libraryName + "Versions";
  if("undefined" === typeof self[vk]) self[vk] = {};
  self[vk][version] = lib;
}

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
      ` */\n`,
    intro: // window.tsUtilsVersions = tsUtils & <script alias="tu"></script> window.tu = tsUtils
      `(${intro.toString()})(${libraryName},"${libraryName}","${version}");`
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
