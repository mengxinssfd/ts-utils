## 5.0.0-beta.12 (2022-10-14)

* fix(random-picker): 命令行工具缺少脚本头 ([15ab7c9](https://github.com/mengxinssfd/ts-utils/commit/15ab7c9))



## 5.0.0-beta.11 (2022-10-14)

* feat(dom): onceEvent callback绑定this为dom ([a1e3b4c](https://github.com/mengxinssfd/ts-utils/commit/a1e3b4c))
* feat(random-picker): 添加命令行工具 ([1b43d32](https://github.com/mengxinssfd/ts-utils/commit/1b43d32))
* test(dom): 移除掉测试中的log ([a5dd87f](https://github.com/mengxinssfd/ts-utils/commit/a5dd87f))
* docs(random-picker): article.md ([19dc344](https://github.com/mengxinssfd/ts-utils/commit/19dc344))
* docs(random-picker): article.md ([5118198](https://github.com/mengxinssfd/ts-utils/commit/5118198))
* docs(random-picker): README.md ([9c7a643](https://github.com/mengxinssfd/ts-utils/commit/9c7a643))



## 5.0.0-beta.10 (2022-10-01)

* style(random-picker): prettier ([8984229](https://github.com/mengxinssfd/ts-utils/commit/8984229))
* chore: package random-picker RandomPicker从core独立出来 并优化调整 ([4bd860f](https://github.com/mengxinssfd/ts-utils/commit/4bd860f))
* chore: package random-picker 优化 分离RandomPicker和OptionsPool ([f2d3a21](https://github.com/mengxinssfd/ts-utils/commit/f2d3a21))
* chore: package random-picker 优化 分离types ([9217e68](https://github.com/mengxinssfd/ts-utils/commit/9217e68))
* chore: package random-picker 修复边际 ([dce76aa](https://github.com/mengxinssfd/ts-utils/commit/dce76aa))
* chore: package random-picker 完成 ([2d252be](https://github.com/mengxinssfd/ts-utils/commit/2d252be))
* chore: package random-picker 更新keywords ([cb1622a](https://github.com/mengxinssfd/ts-utils/commit/cb1622a))
* chore: package random-picker 补充权重为0或为负数的情况 ([3e33bf4](https://github.com/mengxinssfd/ts-utils/commit/3e33bf4))
* chore: update pnpm-lock.yaml ([eefa703](https://github.com/mengxinssfd/ts-utils/commit/eefa703))
* chore: update README.md ([a59940a](https://github.com/mengxinssfd/ts-utils/commit/a59940a))
* chore(random-picker): index ([370b967](https://github.com/mengxinssfd/ts-utils/commit/370b967))
* chore(random-picker): optionsList独立提炼出文件OptionsStore.ts ([b411af0](https://github.com/mengxinssfd/ts-utils/commit/b411af0))
* chore(random-picker): 修复 最后一个选项是动态权重会报权重为0的错误 ([8035230](https://github.com/mengxinssfd/ts-utils/commit/8035230))
* chore(random-picker): 提炼Seed类型 ([8818a53](https://github.com/mengxinssfd/ts-utils/commit/8818a53))
* docs(core): RandomPicker ([6275b8e](https://github.com/mengxinssfd/ts-utils/commit/6275b8e))
* docs(random-picker): types ([0a4e455](https://github.com/mengxinssfd/ts-utils/commit/0a4e455))
* docs(random-picker): update ([46ed758](https://github.com/mengxinssfd/ts-utils/commit/46ed758))
* docs(random-picker): update README.md ([e648df2](https://github.com/mengxinssfd/ts-utils/commit/e648df2))
* docs(TsTypes.ts): Tuple ([7054812](https://github.com/mengxinssfd/ts-utils/commit/7054812))
* test: package random-picker ([70fb959](https://github.com/mengxinssfd/ts-utils/commit/70fb959))
* test: package random-picker ([9db9056](https://github.com/mengxinssfd/ts-utils/commit/9db9056))
* test: package random-picker option/rateOf options/rateOf ([1aab2f3](https://github.com/mengxinssfd/ts-utils/commit/1aab2f3))
* test(bom): AbstractStorageProxy ([06e9a50](https://github.com/mengxinssfd/ts-utils/commit/06e9a50))
* test(random-picker): 补充测试 ([147dcf0](https://github.com/mengxinssfd/ts-utils/commit/147dcf0))
* feat: package random-picker 从数组中随机挑选出n个选项的js工具类库 ([603a2c2](https://github.com/mengxinssfd/ts-utils/commit/603a2c2))
* feat(bom): AbstractStorageProxy localStorage和sessionStorage的代理类，支持设置过期时间和加密key value ([dc37e1d](https://github.com/mengxinssfd/ts-utils/commit/dc37e1d))
* feat(core): capitalizeFirstChar加上类型提示 ([82ed77f](https://github.com/mengxinssfd/ts-utils/commit/82ed77f))
* feat(core): RandomPicker ([37c2499](https://github.com/mengxinssfd/ts-utils/commit/37c2499))
* feat(core): toCamel使用ToCamelCase类型提示 ([9fd9e98](https://github.com/mengxinssfd/ts-utils/commit/9fd9e98))
* feat(time.ts): calcRelativeDate 根据服务器与本地时间的差值计算实际日期 ([5d6b0a0](https://github.com/mengxinssfd/ts-utils/commit/5d6b0a0))
* feat(TsTypes.ts): TupleM2N ([243f4e1](https://github.com/mengxinssfd/ts-utils/commit/243f4e1))
* feat(TsTypes.ts): TupleToUnion ([6f7e997](https://github.com/mengxinssfd/ts-utils/commit/6f7e997))
* feat(Type): ToCamelCase ([1b63690](https://github.com/mengxinssfd/ts-utils/commit/1b63690))
* ci: scripts new-pkg ([e42d2f1](https://github.com/mengxinssfd/ts-utils/commit/e42d2f1))
* ci: scripts new-pkg 多选选项添加默认选中 ([89bea38](https://github.com/mengxinssfd/ts-utils/commit/89bea38))
* ci: scripts new-pkg 添加__test__目录 ([c93afd8](https://github.com/mengxinssfd/ts-utils/commit/c93afd8))
* refactor(core): ([c923edd](https://github.com/mengxinssfd/ts-utils/commit/c923edd))
* fix(clipboard.ts): 避免在全局作用域下使用dom相关的api ([30e340d](https://github.com/mengxinssfd/ts-utils/commit/30e340d))


### BREAKING CHANGE

* capitalizeFirstChar重命名为capitalize与ts的Capitalize保持一致


## 5.0.0-beta.9 (2022-07-24)

* release: v5.0.0-beta.8 ([82b9cba](https://github.com/mengxinssfd/ts-utils/commit/82b9cba))
* feat: types的package.json不能用exports 移除exports ([5af6e10](https://github.com/mengxinssfd/ts-utils/commit/5af6e10))



## 5.0.0-beta.8 (2022-07-24)

* feat: types的package.json不能用exports 移除exports ([5af6e10](https://github.com/mengxinssfd/ts-utils/commit/5af6e10))



## 5.0.0-beta.7 (2022-07-24)

* feat: 所有package.json加上exports ([c3a3985](https://github.com/mengxinssfd/ts-utils/commit/c3a3985))



## 5.0.0-beta.6 (2022-07-24)

* chore(package.json): 加上exports ([48709f7](https://github.com/mengxinssfd/ts-utils/commit/48709f7))



## 5.0.0-beta.5 (2022-07-24)

* feat: bom dom都加上cjs打包 ([24a220f](https://github.com/mengxinssfd/ts-utils/commit/24a220f))



# [5.0.0-beta.4](https://github.com/mengxinssfd/ts-utils/compare/v5.0.0-beta.3...v5.0.0-beta.4) (2022-07-24)


### Bug Fixes

* **types:** index.js require path ([2712d53](https://github.com/mengxinssfd/ts-utils/commit/2712d530d13981bb3e5ebc019a57088478079a72))


### Features

* **core/time.ts:** inSameWeek weekStart类型改为'Mon' | 'Sun' ([91ac902](https://github.com/mengxinssfd/ts-utils/commit/91ac902c635f75962d104f8b55b1f9d3f309d864))
* **ts-utils:** global global ([1f60f5f](https://github.com/mengxinssfd/ts-utils/commit/1f60f5fd70165034ec181bd860b434869ba29ab8))



# [5.0.0-beta.3](https://github.com/mengxinssfd/ts-utils/compare/v5.0.0-beta.2...v5.0.0-beta.3) (2022-07-10)



# [5.0.0-beta.2](https://github.com/mengxinssfd/ts-utils/compare/v5.0.0-beta.1...v5.0.0-beta.2) (2022-07-10)


### Features

* **types:** 支持cjs ([2e35334](https://github.com/mengxinssfd/ts-utils/commit/2e3533472da3d9e798ef79187a36a2cfc630380d))



# [5.0.0-beta.1](https://github.com/mengxinssfd/ts-utils/compare/v5.0.0-beta.0...v5.0.0-beta.1) (2022-07-10)



