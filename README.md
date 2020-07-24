# 仓库开发文档

## 介绍
视界规则个人仓库，在总仓库分类中填入`Reborn@@Reborn_0@@HikerRulesDepot`即可访问仓库中的规则。

> _重要说明：_
>
> _总仓库V2版的作者仓库配置列表 **已迁移** 至 [https://gitee.com/qiusunshine233/hikerView/blob/master/ruleversion/authorList.json](https://gitee.com/qiusunshine233/hikerView/blob/master/ruleversion/authorList.json)，请各位大佬移步至链接处更新自己的仓库配置， **不需要大佬们再更新 depotRule.json 文件了，大佬们不需要再导出规则完整编码才可以配置总仓库了！**_

## 仓库开发步骤
1. 首先，你需要跟小棉袄py，让他拉你进 [https://gitee.com/qiusunshine233/hikerView](https://gitee.com/qiusunshine233/hikerView) 这个仓库，获得作者仓库配置列表 [authorList.json](https://gitee.com/qiusunshine233/hikerView/blob/master/ruleversion/authorList.json) 的编辑权限；
2. 然后，创建自己的仓库，[点击链接](https://gitee.com/projects/new)可跳到创建仓库界面，创建完仓库请记得**留意自己的仓库链接**，后面要用；
3. 继续，在自己仓库的根目录下创建 update.json 文件，在里面写自己仓库的规则，规则模板下面也有给；
4. 获得编辑权限和创建自己的仓库后，在作者仓库配置列表（即 [authorList.json](https://gitee.com/qiusunshine233/hikerView/blob/master/ruleversion/authorList.json) 文件）加入自己的仓库配置，仓库配置模板下面有写具体说明，也可以直接参考 [authorList.json](https://gitee.com/qiusunshine233/hikerView/blob/master/ruleversion/authorList.json) 中别人的配置（也即套娃）；

## 仓库配置（分类）模板

> 路径：
> - V1 -> 总仓库分类
> - V2 -> [https://gitee.com/qiusunshine233/hikerView/blob/master/ruleversion/authorList.json](https://gitee.com/qiusunshine233/hikerView/blob/master/ruleversion/authorList.json)


**模式一（码云仓库模式）：**

```shell
{规则作者author}@@{码云仓库拥有者owner}@@{码云仓库名project}@@picUrl='{头像图片链接picUrl}'@@access_token='{个人访问令牌access_token}'@@remoteFilename='{自定义仓库文件名remoteFilename}'
```

**模式二（文件直链模式）：**


```shell
{规则作者author}@@apiType='0'@@fullUrl='文件完整直链'@@picUrl='{头像图片链接picUrl}'
```

其中：
- picUrl 、access_token、remoteFilename 不分先后顺序
- @@picUrl='{头像图片链接picUrl}' 可选填入，**仅在总仓库 V2 版提供支持**，不填就随机头像， **不要忘记单引号**
- @@access_token='{个人访问令牌access_token}'  可选填入， **不要忘记单引号**
- @@remoteFilename='{自定义仓库文件名remoteFilename}' 可选填入，不填则默认为 update.json，**不要忘记单引号**
- @@apiType='0'@@fullUrl='文件完整直链' 是**连在一起**的。**不要忘记单引号**
    1. 当 apiType 为 '0' 时（注意，**'0'是有单引号的**），为文件完整直链模式，后面一定要跟 @@fullUrl='文件完整直链'；
    2. 当 apiType 不填或者 ='1' 时，后面可不跟 fullUrl，但是要填码云仓库配置。

#### 举例分析

以Reborn的仓库为例，码云链接为：[https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/update.json
](https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/update.json)

那么连接中的
- Reborn_0 就是 码云仓库拥有者owner
- HikerRulesDepot 就是 码云仓库名project

## 仓库规则模板

> 路径：{你的码云规则仓库}/blob/master/update.json

可以参考我的规则：[https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/update.json](https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/update.json)

```json
[
    {
        "title": "规则名1",
        "author": "作者名",
        "version": 1,
        "updateText": "这里填你的更新信息，如修复xxx问题",
        "tips": "这里写你想要的规则提示",
        "rule": "rule://你的规则1完整编码"
    },
    {
        "title": "规则名2",
        "author": "作者名",
        "version": 0,
        "tips": "",
        "rule": "rule://你的规则2完整编码"
    },
    {
        "title": "规则名3",
        "author": "作者名",
        "version": 0,
        "rule": "rule://你的规则3完整编码"
    }
]
```

其中：
- tips 若如规则2一样为""或如规则3一样不填，视界都会不显示规则提示（注：规则提示不能超过视界显示的一行，否则超出部分会被隐藏）。
- updateText 与 tips 的规定一致。
- rule 的值，**千万记住不能少了 rule://**，否则视界无法识别（PS：视界支持识别 javascript:// 开头的插件规则）。


### 注意事项

 `update.json`文件**必须在自己的码云仓库根目录下！！！**


## 仓库通知模板
现已支持仓库通知功能

大佬们的仓库规则JSON格式要改为：

```json
{
    "notice": "你要写的仓库通知",
    "data": [
        {
            "title": "规则名1",
            "author": "作者名",
            "version": 1,
            "updateText": "这里填你的更新信息，如修复xxx问题",
            "tips": "这里写你想要的规则提示",
            "rule": "rule://你的规则1完整编码"
        },
        {
            "title": "规则名2",
            "author": "作者名",
            "version": 0,
            "tips": "",
            "rule": "rule://你的规则2完整编码"
        }
    ]
}
```

若仓库通知需要自定义属性，则：
```json
{
    "notice": {
        "title": "你要写的仓库通知标题，可空，默认为仓库通知",
        "desc": "你要写的仓库通知内容，可空；若要显示通知则为必填项，其他两个可空",
        "picUrl": "你要展示的图片链接，可空"
    },
    "data": [
        {
            "title": "规则名1",
            "author": "作者名",
            "version": 1,
            "updateText": "这里填你的更新信息，如修复xxx问题",
            "tips": "这里写你想要的规则提示",
            "rule": "rule://你的规则1完整编码"
        }
    ]
}
```

现仓库通知**图片链接已支持js解析模式**，需要`js:`开头接js语句，可参考[我的例子](https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/update_1.json)。举例：
```json
"notice": {
    "title": "仓库通知",
    "desc": "这是仓库通知内容",
    "picUrl": "js:'https://acg.xydwz.cn/gqapi/gqapi.php?t=' + new Date().getTime()"
}
```

> PS: 兼容原来的规则数组格式，不需要的大佬可以不改

若不想显示仓库通知，把 notice 的值设为 "" 即可，如：

```json
{
    "notice": "",
    "data": [
        {
            "title": "规则名1",
            "author": "作者名",
            "version": 1,
            "updateText": "这里填你的更新信息，如修复xxx问题",
            "tips": "这里写你想要的规则提示",
            "rule": "rule://你的规则1完整编码"
        },
        {
            "title": "规则名2",
            "author": "作者名",
            "version": 0,
            "tips": "",
            "rule": "rule://你的规则2完整编码"
        }
    ]
}
```

## 忽略更新云端模板
现已支持“忽略本次更新”功能，提供云端模板，可参考 [https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/ignoreUpdateRuleList.json](https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/ignoreUpdateRuleList.json)

然后把链接填到仓库二级规则的 remoteIgnoreListUrl 变量中即可~

```json
[
    {
        "title":"规则名1",
        "author": "规则作者1"
    },
    {
        "title":"规则名2",
        "author": "规则作者2"
    }
]
```

## 规则映射云端模板
现已支持“规则映射”功能，提供云端模板

要自行创建JSON文件上传到云端，然后把链接填入仓库二级规则的 remoteRulesMappingUrl 变量中即可~

### 全名映射

模板：

```json
[
    [{"title": "本地规则名1", "author": "作者1"}, {"title": "仓库规则名1", "author": "作者1"}, { "matchAll": true }],
    [{"title": "本地规则名2", "author": "作者2"}, {"title": "仓库规则名2", "author": "作者2"}, { "matchAll": true }]
]
```

其中：
- 本地规则名x 对应 仓库规则名x，这样本地规则的规则名无论是什么在检查更新时能检查到对应仓库规则的更新版本

> **注意：全名映射 { "matchAll": true } 不能漏！！！**

### 正则批量映射
支持正则批量映射，即通过正则来一一匹配所有符合的规则。

模板：

```json
[
    [{"title": ".*?(?=•T)", "author": "Reborn"}, {"title": ".*?(?=•Re)", "author": "Reborn"}],
    [{"title": ".*?(?=•B)", "author": "Reborn"}, {"title": ".*?(?=•Re)", "author": "Reborn"}]
]
```

> ".*?(?=•T)" --> ".*?(?=•Re)" 的意思是 所有本地仓库中的 "•T" 切掉后的内容 与 远程仓库中 "•Re" 切掉后的内容 对比，若一致则映射成功。
