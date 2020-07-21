# HikerRules

感谢 [https://github.com/mabDc/eso_source](https://github.com/mabDc/eso_source) 的合并脚本和 Github action 提供了很大的参考。

（其实顺手修复了一下合并脚本第一个JSON对象会重复出现的问题）

# 仓库规则（README也抄了🙈️）
[manifest](https://raw.githubusercontent.com/RebornQ/HikerRules/master/manifest) 是合并后的规则，链接：

`https://raw.githubusercontent.com/RebornQ/HikerRules/master/manifest`

网络问题可以使用[jsdelivr cdn](https://www.jsdelivr.com/?docs=gh)，即[manifest from jsdelivr](https://cdn.jsdelivr.net/gh/RebornQ/HikerRules/manifest)，链接：

`https://cdn.jsdelivr.net/gh/RebornQ/HikerRules/manifest`

# 仓库开发者使用说明
## 初步使用
1. 首先，你需要 fork 这个项目，然后把我的规则 xxx.json 全删掉（Github没有文件夹删除选项只有一个文件一个文件删所以只能自己想办法啰~）；
2. 申请一个 github access token，然后点击项目的`Settings-Secrets-New Secret`；填完信息然后`Add`；
    - `name`必须填`ACCESS_TOKEN`
    - `value`填刚刚申请到的 access token
3. 添加`{规则名}.json`文件开始填自己的规则吧，**一个文件只能一个规则噢**~

> 文件说明：
> - xxx.json: 单个规则文件
> - notice.txt: 仓库通知，注意虽然里面是json内容但是**后缀不要改成json**，不然自动合并会炸
>
> **注意：除了上面两种文件其他的都不能动**

## 进阶
### 分类仓库开发者使用说明
大家可以先看看我的模板目录结构：[https://github.com/RebornQ/HikerRules/tree/master/class/noSniffer](https://github.com/RebornQ/HikerRules/tree/master/class/noSniffer)

文件说明与初步使用的一样，同样自己删除我的规则，同样除了那两种文件其他的都要**原封不动**的呆在**每一个分类**里面。

但是**有一点不同的是要改一个文件**：`项目根目录/.github/workflows/main.yml`；

下面说说怎么改：
1. 在这个文件中搜索`# Runs merge`，找到下面的run结点，删掉我的分类仓库规则：

   ```bash
   cd ./class/noSniffer/anime/
   bash merge_rules.sh
   bash merge.sh
   cd $home
   cd ./class/noSniffer/video/
   bash merge_rules.sh
   bash merge.sh
   cd $home
   cd ./class/noSniffer/video_short/
   bash merge_rules.sh
   bash merge.sh
   ```
2. 每添加一个分类都要在这个结点下添加以下代码：

   ```shell
   cd $home
   cd ./{你的分类目录}
   bash merge_rules.sh
   bash merge.sh
   ```

完成这些配置之后，在分类中添加`{规则名}.json`文件开始填自己的规则吧，**一个文件只能一个规则噢**~
