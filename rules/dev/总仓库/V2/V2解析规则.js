var {
    getUrl,
    getResCode,
    print,
    setHomeResult,
    setError,
    setSearchResult,
    parseDom,
    getCryptoJS,
    CryptoJS,
    fetch,
    base64Encode,
    base64Decode,
    getRule,
    getVar,
    putVar,
    writeFile
} = require("../../../../utils/api_haikuoshijie");


// js:
var res = {};
var d = [];
var mRule = JSON.parse(getRule());

// 在这里添加仓库配置，可使本地添加的仓库置顶
var authorList = [
    "[例子]置顶私人仓库@@Reborn_0@@HikerRulesPrivacy@@access_token='****'",
    "[例子]自定义文件名@@Reborn_0@@HikerRulesDepot@@remoteFilename='update_1.json'"
];
var remoteAuthorListUrl = "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/authorList.json";
var remoteAuthorList = [];
try {
    eval("remoteAuthorList=" + fetch(remoteAuthorListUrl, {}));
} catch (e) {
}
Array.prototype.push.apply(authorList, remoteAuthorList);
// 在这里添加仓库配置，可使本地添加的仓库置底
var authorListBottom = [
    "[例子]置底本地仓库@@Reborn_0@@HikerRulesPrivacy"
];
if (authorListBottom.length != 0) Array.prototype.push.apply(authorList, authorListBottom);

// 在这里添加随机头像
var picUrlList = [
    "https://www.easyicon.net/api/resizeApi.php?id=1271624&size=128",
    "https://www.easyicon.net/api/resizeApi.php?id=1271647&size=128",
    "https://www.easyicon.net/api/resizeApi.php?id=1266536&size=128",
    "https://www.easyicon.net/api/resizeApi.php?id=1271655&size=128",
];

// 隐藏开关，不需要隐藏请设置为false
var needHideRule = true;
// 自行添加要隐藏的标记，格式为：["[标记名1]"，"[标记名2]"...]
var hideSymbols = ["[模板]", "[未完成]"];

// 总仓库更新地址
var remoteDepotRuleUrl = "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/depotRule_v2_release.json";
// 仓库状态缓存文件地址
var statusCacheFile = "hiker://files/" + mRule.title + "_" + mRule.author + ".json";
// 举例 hiker://files/depotStatus_v2.json
putVar({key: 'statusCacheFile', value: statusCacheFile});

// 把总仓库状态写入文件
function writeDepotStatusToFile(depotStatus) {
    writeFile(statusCacheFile, JSON.stringify(depotStatus));
}

// 若不是第一次使用总仓库则隐藏开发文档
var depotStatus = {};
var depotStatusFile = fetch(statusCacheFile, {});
if (depotStatusFile != "") {
    eval("depotStatus=" + depotStatusFile);
}
// 若需要永久显示开发文档，则取消注释
// depotStatus.showDevDoc = true;
// 若需要永久显示提示，则取消注释
// depotStatus.showTips = true;
// 若需要永久显示例子，则取消注释
// depotStatus.showEtc = true;


function isHideRule(ruleTitle) {
    if (needHideRule != true) return false;
    // if (hideSymbols.length == 0) return false;
    var ruleTemp = ruleTitle;
    for (var i = 0; i < hideSymbols.length; i++) {
        if (ruleTemp.indexOf(hideSymbols[i]) != -1) return true;
    }
    return false;
}

d.push({
    title: "欢迎来到视界总仓库",
    desc: "在这里，你可以畅游各个大佬的规则，快速浏览快速导入",
    col_type: "text_center_1"
});

if (depotStatus.showTips != false) {
    d.push({
        title: "首次导入提示\n‘‘(仅显一次)’’",
        desc: "‘‘下拉刷新即可显示仓库’’" + "\n规则里有好多隐藏的开关哦！" + "\n‘‘提供的例子也仅显一次’’",
        col_type: "text_center_1"
    });
    depotStatus.showTips = false;
    writeDepotStatusToFile(depotStatus);
} else {

    if (depotStatus.showEtc != false || mRule.version != depotStatus.version) {
        depotStatus.showEtc = false;
        depotStatus.version = mRule.version;
        writeDepotStatusToFile(depotStatus);
    } else {
        hideSymbols.push("[例子]");
    }

    if (depotStatus.showDevDoc != false) {
        d.push({
            title: "【大佬通道】\n‘‘(仅显一次)’’",
            desc: "‘‘点击查看V2总仓库开发文档’’\n规则里有永久显示开关可以自己去开",
            url: "https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/README.md#document=https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/README.md",
            col_type: "text_center_1"
        });
        depotStatus.showDevDoc = false;
        writeDepotStatusToFile(depotStatus);
    }

    var desc = function (rule) {
        return rule.oldVersion != null && rule.oldVersion < rule.version ? ("‘‘有新版本：" + rule.version + "’’，点击导入新版本") : rule.oldVersion > rule.version ? "‘‘喵？为啥你的规则版本比我还高？’’" : "当前规则已是最新版，点击跳到规则页";
    };

    // 为所有分类添加总仓库项
    try {
        var remoteDepotRule = {};
        eval("remoteDepotRule=" + fetch(remoteDepotRuleUrl, {}));
        var localDepotRule = JSON.parse(getRule());
        remoteDepotRule.oldVersion = localDepotRule.version;
        //setError(JSON.stringify(localDepotRule));
        //setError(JSON.stringify(remoteDepotRule));
        if (remoteDepotRule.oldVersion < remoteDepotRule.version) {
            d.push({
                title: remoteDepotRule.title + "\t" + desc(remoteDepotRule),
                url: "https://baidu.com#" + JSON.stringify(remoteDepotRule) || "",
                col_type: "text_center_1",
                desc: "【更新日志】\n更多完整日志请在里面点击进入原网页查看"
            });
        } else {
            d[0].desc = "‘‘点击可查看更新日志’’<br>" + d[0].desc;
            d[0].url = "https://gitee.com/qiusunshine233/hikerView/blob/master/ruleversion/CHANGELOG_DEPOTRULE_V2.md#updateText=" + remoteDepotRule.updateText
        }
    } catch (e) {
        d.push({
            title: "‘‘总仓库更新程序已损坏’’",
            desc: "请联系 " + mRule.author + " 修复",
            col_type: "text_center_1",
        });
    }

    for (var i = 0; i < authorList.length; i++) {
        if (isHideRule(authorList[i])) {
            authorList.splice(i, 1);
            i--;
            continue;
        }
        var picUrl = null;
        var picUrlJS = authorList[i].match(/picUrl=.[\s\S]*?'/) + ";";
        eval(picUrlJS);
        if (picUrl == null) picUrl = picUrlList[Math.floor(Math.random() * picUrlList.length)];
        // setError(picUrl)
        d.push({
            title: authorList[i].split("@@")[0],
            url: "https://baidu.com#" + authorList[i],
            pic_url: picUrl
        });
    }
}

// setError(JSON.stringify(d));
res.data = d;
setHomeResult(res);
