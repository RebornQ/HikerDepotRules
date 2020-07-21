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

文件说明与初步使用的一样，同样自己删除我的规则。

新建的分类仓库**只需要**有 "xxx.json" 和 "notice.txt" **两种文件**即可，其他的文件会都自动生成。

但是**有一点不同的是要改一个文件**：`项目根目录/.github/workflows/main.yml`；

下面说说怎么改：
1. 在这个文件中搜索`# Runs merge`，找到下面的run结点，删掉我的分类仓库规则：

   ```bash
   bash merge_class.sh ./class/noSniffer/ $home
   ```
2. 每添加一个**大分类**都要在这个结点下添加以下代码：

   ```shell
   bash merge_class.sh ./{你的大分类目录路径} $home
   ```

   **合并后的规则在每个大分类目录下的 manifest_{小分类名} 文件**

   > 解释一下什么叫大分类：
   >
   > 举例我的目录 "./class/noSniffer/":
   > - class 就是 分类 的意思
   > - 大分类 是指 noSniffer (免嗅)
   > - 其中有很多 小分类 { anime video video_short } 分别代表 { 动漫 影视 短视频 }<br><br>
   >
   > PS：不一定要分很多个大分类，也可以把所有小分类丢到一个文件夹，这个文件夹就是所有小分类的大分类
   >
   > 即大分类目录结构要满足：
   > ```bash
   > .
   > └── 大分类
   >     ├── 小分类1
   >     │   ├── notice.txt
   >     │   ├── 规则1.json
   >     │   └── 规则2.json
   >     └── 小分类2
   >     │   ├── notice.txt
   >     │   ├── 规则1.json
   >     │   └── 规则2.json
   >     └── ...
   > ```

完成这些配置之后，在分类中添加 "{规则名}.json" 和 "notice.txt" 通知文件开始填自己的规则吧，**一个JSON文件只能一个规则噢**~
