# [2.8.0](https://github.com/RebornQ/HikerDepotRules/compare/2.7.0...2.8.0) (2020-07-16)


### Bug Fixes

* 分类仓库模板：修复导入错误问题 ([8bfee3b](https://github.com/RebornQ/HikerDepotRules/commit/8bfee3bec5d5340e3dd243420075210ad3ba54dd))
* 总仓库V2: 1.调整二级界面; 2.修复显示仓库数量开关不生效问题 ([296f17a](https://github.com/RebornQ/HikerDepotRules/commit/296f17ae212e6dda28a1a89ebd2d6b4f8de17deb))
* 总仓库V2: 修复导入错误问题 ([7bb794f](https://github.com/RebornQ/HikerDepotRules/commit/7bb794f14b72a9edea0f8a786dffc012f291a3e7))


### Features

* 分类仓库模板：1.搜索支持搜索规则名、域名和作者; 2.新增一键导入/更新; 3.加入模板更新提示 ([fd2528b](https://github.com/RebornQ/HikerDepotRules/commit/fd2528be557ca38246265c9bd80486230e20a07a))


### Performance Improvements

* 分类仓库模板：[优化] 仓库通知 pic_url 支持使用 js 执行模式，如：需要添加 new Date().getTime(); ([79a831c](https://github.com/RebornQ/HikerDepotRules/commit/79a831c978ec54f68d1cb8ea78d1c1cc774546b2))
* 总仓库V2: [优化] 仓库通知 pic_url 支持使用 js 执行模式，如：需要添加 new Date().getTime(); ([9318488](https://github.com/RebornQ/HikerDepotRules/commit/9318488de9e259848870018d75f0b78e04981258))



# [2.7.0](https://github.com/RebornQ/HikerDepotRules/compare/2.6.0...2.7.0) (2020-07-06)


### Features

* 总仓库V2云规则: 添加测试通道 ([e7b2cd5](https://github.com/RebornQ/HikerDepotRules/commit/e7b2cd5a8497c545fe787f881a968f00f692ab24))


### Performance Improvements

* 总仓库V2云规则: 完善测试通道 ([f8e3f2a](https://github.com/RebornQ/HikerDepotRules/commit/f8e3f2a12649df3b84fb773fe45b9a778f36beb9))



# [2.6.0](https://github.com/RebornQ/HikerDepotRules/compare/2.5.0...2.6.0) (2020-07-06)


### Bug Fixes

* 总仓库V2: 云规则修复例子和大佬通道一直显示的问题 ([65a5495](https://github.com/RebornQ/HikerDepotRules/commit/65a54952e51ef9dac2be66569154720d551804ee))
* 总仓库V2: 云规则修复自动更新程序一直提示更新完成的问题 ([d51e7ef](https://github.com/RebornQ/HikerDepotRules/commit/d51e7efb13255bb1251b8347cbfdfbf2c9b84469))


### Performance Improvements

* 总仓库V2: 云规则优化更新程序 ([c2218db](https://github.com/RebornQ/HikerDepotRules/commit/c2218db47f59c492e9ad3bc2e80354c446d47c03))
* 总仓库V2: 云规则修改更新程序 ([7ca7896](https://github.com/RebornQ/HikerDepotRules/commit/7ca7896f7987ee98b8382c41623dcad89a081dcf))
* 总仓库V2: 优化云规则 ([dac0e84](https://github.com/RebornQ/HikerDepotRules/commit/dac0e84a426bfefd52079b6e02357c5f1444a05c))
* 总仓库V2: 更换为云规则更新 ([1ccc56c](https://github.com/RebornQ/HikerDepotRules/commit/1ccc56cfd8bf82bc2f6d4439784f9c4336675a54))
* 总仓库V2云规则: 二级一键更新/导入修改文件路径（创建一个tmp文件夹） ([048b964](https://github.com/RebornQ/HikerDepotRules/commit/048b964ee1b5d43803719967962b1547f694b0db))



# [2.5.0](https://github.com/RebornQ/HikerDepotRules/compare/2.4.0...2.5.0) (2020-07-06)


### Features

* 总仓库V2: 二级添加一键更新、一键导入 ([0ebd689](https://github.com/RebornQ/HikerDepotRules/commit/0ebd6890a5bac07fb066f5a5bf14fbe240ee766b))


### Performance Improvements

* 总仓库V2: 1.优化二级一键更新、一键导入（合集必须跟链接）; 2.一键更新支持不改变分组更新 ([5416c03](https://github.com/RebornQ/HikerDepotRules/commit/5416c03c64b52b406f6478877959eb9880b2d0d6))



# [2.4.0](https://github.com/RebornQ/HikerDepotRules/compare/2.3.0...2.4.0) (2020-07-06)


### Bug Fixes

* 分类仓库模板: 修复无法检测规则类型时不显示提示的问题 ([e427755](https://github.com/RebornQ/HikerDepotRules/commit/e42775504b9737cfacf129c754dfe5f263e75390))
* 分类仓库模板: 修复规则映射无法全名匹配问题（需要加上{ "matchAll":true }） ([f78f9f8](https://github.com/RebornQ/HikerDepotRules/commit/f78f9f861a391e587b4fd2e6368ed4b91e8d991a))
* 总仓库V1、分类仓库模板: 修复remoteFilename因格式化代码而导致的永远为update.json问题 ([ac13ed4](https://github.com/RebornQ/HikerDepotRules/commit/ac13ed49a672492206c51ec40aa0431979a30c4d))
* 总仓库V2: 修复搜索出重复数据的问题 ([9421630](https://github.com/RebornQ/HikerDepotRules/commit/9421630e61339f0d77fe3370d5aadc0d8e358276))
* 总仓库V2: 修复无法检测规则类型时不显示提示的问题 ([0fed8e5](https://github.com/RebornQ/HikerDepotRules/commit/0fed8e5b57f6620793b133828fad44e773f90dd4))


### Features

* 总仓库V2: 加入搜索解析，但是真的很慢，慎重考虑使用 ([d5c6f23](https://github.com/RebornQ/HikerDepotRules/commit/d5c6f23f5afae0f7a8ac2c143af5b71b145985cb))
* 总仓库V2: 搜索解析支持搜索规则名、网址和作者 ([3c5083b](https://github.com/RebornQ/HikerDepotRules/commit/3c5083bae571c3e28a8589a1eae1571d8333bdf7))


### Performance Improvements

* 分类仓库模板:1.添加 当仓库规则版本号<0时，不提供检测更新功能; 2.添加显示 (更新:x 未导入:y 忽略:z) ([960c92c](https://github.com/RebornQ/HikerDepotRules/commit/960c92ce0cde384d73b5aa12f9632e9853553855))
* 总仓库V2: 完善搜索解析 ([4c96fc4](https://github.com/RebornQ/HikerDepotRules/commit/4c96fc40bd40b04194b39e948ecdb00d94e3d8d7))
* 总仓库V2: 换个锤子的二分法，一定要遍历所有数据的，这样顶多是O(1/2 n)，忽略常数还是O(n)，确实会快一丢丢，空间换时间的结果 ([dc4437d](https://github.com/RebornQ/HikerDepotRules/commit/dc4437db80242683ad3cdc7f97c64ca02903691f))
* 总仓库V2: 据这篇文章 https://www.jianshu.com/p/4cd4f74a0b20 测试是string.test比indexOf还快 ([371595c](https://github.com/RebornQ/HikerDepotRules/commit/371595cf51d7d1685f1e6d078136253b4932e317))
* 总仓库V2: 搜索解析用indexOf好像会快一点？正则性能不敢恭维啊~ ([003798b](https://github.com/RebornQ/HikerDepotRules/commit/003798b4883a14e8581137518a8c06ba8f6b382d))
* 总仓库V2: 空间换时间, n^2->2n？虽然Array.prototype.push.apply可能也是一个n？（体验上没感觉快多少，毕竟那个fetch太多了...） ([3ae489c](https://github.com/RebornQ/HikerDepotRules/commit/3ae489cc0dd0cd1208f9192d79fbbfddc1f53068))



# [2.2.0](https://github.com/RebornQ/HikerDepotRules/compare/2.1.0...2.2.0) (2020-07-01)


### Features

* 总仓库V1和分类模板 完成规则映射表功能（规则替换检索表），支持云端配置，支持正则批量匹配映射 ([16a75e2](https://github.com/RebornQ/HikerDepotRules/commit/16a75e26c5b23ee49ed4f2db05016dac5117a7e6))



# [2.3.0](https://github.com/RebornQ/HikerDepotRules/compare/2.2.0...2.3.0) (2020-07-03)


### Bug Fixes

* 总仓库V2 修复规则映射无法全名匹配问题（需要加上{ "matchAll":true }） ([bd3370f](https://github.com/RebornQ/HikerDepotRules/commit/bd3370f12b97f8a8f09cb301fd381a7c23fecf0a))
* 总仓库V2: 修复 (更新:x ...) 不能取消粗体的问题 ([56e845c](https://github.com/RebornQ/HikerDepotRules/commit/56e845cfb2ee9ec5034f346e7daffa9b0fb50f08))
* 总仓库V2: 修复自定义仓库配置文件因格式化代码而导致的永远为update.json问题 ([c6396d1](https://github.com/RebornQ/HikerDepotRules/commit/c6396d1ef6e869b90ca8d1345e3ec4bf8a250b00))
* 总仓库V2: 修复规则映射不生效问题 ([f326ddc](https://github.com/RebornQ/HikerDepotRules/commit/f326ddc38b03efb2da2831ceaad4e174c555fe45))
* 总仓库V2：修复 mRule.version != depotStatus.version 不生效的问题 ([a448432](https://github.com/RebornQ/HikerDepotRules/commit/a448432bbcaae065ab3da1e9fe0b316688db7c4e))


### Features

* 总仓库V2 settings 完成远程配置 和 本地缓存 ([e4f4021](https://github.com/RebornQ/HikerDepotRules/commit/e4f40217c86cf2e73417bc5feaf1a95d35520ecd))
* 总仓库V2 settings 完成远程配置 和 本地缓存 ([2d1d11a](https://github.com/RebornQ/HikerDepotRules/commit/2d1d11a2aaeca7a12dd43c022e7e756449d25239))
* 总仓库V2 添加是否 开启本地缓存开关 ([468ef24](https://github.com/RebornQ/HikerDepotRules/commit/468ef24f9f66ce4309e7ea426d06955482346234))


### Performance Improvements

* 总仓库V2 settings 优化远程配置（合并对象数据方式，以云端和本地缓存数据为主） ([83d0770](https://github.com/RebornQ/HikerDepotRules/commit/83d0770f0ead1eb172c7f07d55639b5ffe196897))
* 总仓库V2 添加 当仓库规则版本号<0时，不提供检测更新功能 ([85413ea](https://github.com/RebornQ/HikerDepotRules/commit/85413ea31cd39cee14dc8c59697ba40c47d25324))
* 总仓库V2: (更新:x 未导入:y 忽略:z) 不加粗 ([62de40b](https://github.com/RebornQ/HikerDepotRules/commit/62de40b9139f26708e31d9df3104bbc2e9d18d11))
* 总仓库V2：添加显示 (更新:x 未导入:y 忽略:z) ([04ca7d7](https://github.com/RebornQ/HikerDepotRules/commit/04ca7d700c146104a46833aab1c0732e6ee532c2))



# [2.2.0](https://github.com/RebornQ/HikerDepotRules/compare/2.1.0...2.2.0) (2020-07-01)


### Bug Fixes

* 总仓库V2 修复无法跳转首页的问题 ([cfc2256](https://github.com/RebornQ/HikerDepotRules/commit/cfc2256e84787bf6e2c5bfb7940060f2caef6798))
* 总仓库V2 修复规则映射多个正则匹配无法成功匹配的问题 ([d74fb24](https://github.com/RebornQ/HikerDepotRules/commit/d74fb246475000a1707200d278de7789f3b76411))


### Features

* 完成规则映射表功能（规则替换检索表） ([fffceb4](https://github.com/RebornQ/HikerDepotRules/commit/fffceb4ad08ad40018e0c21d4990c291a0d42a17))
* 总仓库V1和分类模板 完成规则映射表功能（规则替换检索表），支持云端配置，支持正则批量匹配映射 ([16a75e2](https://github.com/RebornQ/HikerDepotRules/commit/16a75e26c5b23ee49ed4f2db05016dac5117a7e6))
* 总仓库V1和分类模板 添加显示仓库规则数量 ([330f145](https://github.com/RebornQ/HikerDepotRules/commit/330f145c37d56a22088f0492c487c3e43cc2b96c))


### Performance Improvements

* 规则映射表功能添加云端配置 ([b7c833d](https://github.com/RebornQ/HikerDepotRules/commit/b7c833db6fdb3353da29f728318f7f15b9438754))



# [2.1.0](https://github.com/RebornQ/HikerDepotRules/compare/2.0.0...2.1.0) (2020-07-01)


### Performance Improvements

* 对不需要更新却又忽略更新的规则，不排序 ([426f891](https://github.com/RebornQ/HikerDepotRules/commit/426f8913b0f12107f1e9105bff73d2822372259b))



# [2.0.0](https://github.com/RebornQ/HikerDepotRules/compare/1.0.0...2.0.0) (2020-07-01)


### Features

* 提交总仓库V2规则 ([8427f97](https://github.com/RebornQ/HikerDepotRules/commit/8427f9735c22c357bdf032f96bb7c97b29aff1b9))



# 1.0.0 (2020-06-30)



