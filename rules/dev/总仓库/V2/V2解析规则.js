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
eval(getCryptoJS());

// 仓库配置本地缓存文件
var settingsCacheFile = "hiker://files/depot_v2_settings.json";
// 本地缓存开关
var needCacheSetting = true;

// 仓库个性设置
var settings = {
    // 在这里添加仓库配置，可使本地添加的仓库置顶
    authorList: [
        "[例子]置顶私人仓库@@Reborn_0@@HikerRulesPrivacy@@access_token='****'",
        "[例子]自定义文件名@@Reborn_0@@HikerRulesDepot@@remoteFilename='update_1.json'"
    ],
    remoteAuthorListUrl: "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/authorList.json",
    // 在这里添加仓库配置，可使本地添加的仓库置底
    authorListBottom: [
        "[例子]置底本地仓库@@Reborn_0@@HikerRulesPrivacy"
    ],
    // 在这里添加随机头像
    picUrlList: [
        "https://www.easyicon.net/api/resizeApi.php?id=1271624&size=128",
        "https://www.easyicon.net/api/resizeApi.php?id=1271647&size=128",
        "https://www.easyicon.net/api/resizeApi.php?id=1266536&size=128",
        "https://www.easyicon.net/api/resizeApi.php?id=1271655&size=128",
    ],
    // 隐藏开关，不需要隐藏请设置为false
    needHideRule: true,
    // 自行添加要隐藏的标记，格式为：["[标记名1]"，"[标记名2]"...]
    hideSymbols: ["[模板]", "[未完成]"],
    // 总仓库更新地址
    remoteDepotRuleUrl: "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/depotRule_v2_release.json",
};
// 若不是第一次使用总仓库则隐藏开发文档
var depotStatus = {
    // 此处所有配置都会被下方覆盖，请移步下方配置 depotStatus.xxx = xxx;
};
var depotSettings = {
};
var statusCacheFile =  "hiker://files/" + mRule.title + "_" + mRule.author + ".json";
// 仓库状态缓存文件地址
var statusCacheFile = statusCacheFile != null && statusCacheFile != "" ? statusCacheFile : "hiker://files/" + mRule.title + "_" + mRule.author + ".json";
// 举例 hiker://files/depotStatus_v2.json
putVar({key: 'statusCacheFile', value: statusCacheFile});

var depotStatusFile = fetch(statusCacheFile, {});
if (depotStatusFile != "") {
    eval("depotStatus=" + depotStatusFile);
}
// 仓库配置远程地址，请自行配置
// 举例：https://gitee.com/Reborn_0/HikerRulesDepot/raw/master/depot_v2_settings.json
depotStatus.settingsRemoteFile = "";

// 若需要永久显示开发文档，则取消注释
// depotStatus.showDevDoc = true;
// 若需要永久显示提示，则取消注释
// depotStatus.showTips = true;
// 若需要永久显示例子，则取消注释
// depotStatus.showEtc = true;

function writeObjectToFile(fileUrl, object) {
    writeFile(fileUrl, JSON.stringify(object));
}

// 把总仓库状态写入文件
function writeDepotStatusToFile(depotStatus) {
    writeObjectToFile(statusCacheFile, depotStatus);
}

function writeSettingsToFile(settings) {
    depotSettings.find_rule_settings = settings;
    writeObjectToFile(settingsCacheFile, depotSettings);
}

// 合并对象
function extend(target, source) {
    for (var obj in source) {
        target[obj] = source[obj];
    }
    return target;
}

function getSettingsContent(settingsFileUrl, isRemote) {
    if (settingsFileUrl == "") return false;
    var settingsCacheFileContent = fetch(settingsFileUrl, {});
    if (settingsCacheFileContent != null && settingsCacheFileContent != "") {
        eval("var settingsTemp=" + settingsCacheFileContent);
        if (settingsTemp.find_rule_settings != null && JSON.stringify(settingsTemp.find_rule_settings) != "{}") {
            depotSettings = settingsTemp;
            extend(settings, settingsTemp.find_rule_settings);
            if (isRemote == true) {
                var settingsMD5Now = CryptoJS.MD5(JSON.stringify(settings)).toString(CryptoJS.enc.Hex);
                if (settingsMD5Now != depotStatus.cacheFindRuleSettingsMD5) {
                    depotStatus.cacheFindRuleSettingsMD5 = settingsMD5Now;
                    writeDepotStatusToFile(depotStatus);
                    writeSettingsToFile(settings);
                }
            }
            return true;
        }
    }
    return false;
}
// 先读本地再读远程，远程炸了用本地，本地炸了用默认；本地缓存远程时先比对md5不一致再缓存
if (needCacheSetting == true) getSettingsContent(settingsCacheFile, false);
getSettingsContent(depotStatus.settingsRemoteFile, true);

var remoteAuthorList = [];
try {
    eval("remoteAuthorList=" + fetch(settings.remoteAuthorListUrl, {}));
} catch (e) {
}
Array.prototype.push.apply(settings.authorList, remoteAuthorList);
if (settings.authorListBottom.length != 0) Array.prototype.push.apply(settings.authorList, settings.authorListBottom);

function isHideRule(ruleTitle) {
    if (settings.needHideRule != true) return false;
    // if (hideSymbols.length == 0) return false;
    var ruleTemp = ruleTitle;
    for (var i = 0; i < settings.hideSymbols.length; i++) {
        if (ruleTemp.indexOf(settings.hideSymbols[i]) != -1) return true;
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
        writeDepotStatusToFile(depotStatus);
    } else {
        settings.hideSymbols.push("[例子]");
    }

    if (depotStatus.showDevDoc != false || mRule.version != depotStatus.version) {
        d.push({
            title: "【大佬通道】\n‘‘(仅显一次)’’",
            desc: "‘‘点击查看V2总仓库开发文档’’\n规则里有永久显示开关可以自己去开",
            url: "https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/README.md#document=https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/README.md",
            col_type: "text_center_1"
        });
        depotStatus.showDevDoc = false;
        writeDepotStatusToFile(depotStatus);
    }

    if (mRule.version != depotStatus.version) {
        depotStatus.version = mRule.version;
        writeDepotStatusToFile(depotStatus);
    }

    var desc = function (rule) {
        return rule.oldVersion != null && rule.oldVersion < rule.version ? ("‘‘有新版本：" + rule.version + "’’，点击导入新版本") : rule.oldVersion > rule.version ? "‘‘喵？为啥你的规则版本比我还高？’’" : "当前规则已是最新版，点击跳到规则页";
    };

    // 为所有分类添加总仓库项
    try {
        var remoteDepotRule = {};
        eval("remoteDepotRule=" + fetch(settings.remoteDepotRuleUrl, {}));
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
            d[0].desc = "‘‘点击可查看更新日志和开发文档’’<br>" + d[0].desc;
            d[0].url = "https://gitee.com/qiusunshine233/hikerView/blob/master/ruleversion/CHANGELOG_DEPOTRULE_V2.md#updateText=" + remoteDepotRule.updateText
        }
    } catch (e) {
        d.push({
            title: "‘‘总仓库更新程序已损坏’’",
            desc: "请联系 " + mRule.author + " 修复",
            col_type: "text_center_1",
        });
    }

    for (var i = 0; i < settings.authorList.length; i++) {
        if (isHideRule(settings.authorList[i])) {
            settings.authorList.splice(i, 1);
            i--;
            continue;
        }
        var picUrl = null;
        var picUrlJS = settings.authorList[i].match(/picUrl=.[\s\S]*?'/) + ";";
        eval(picUrlJS);
        if (picUrl == null) picUrl = settings.picUrlList[Math.floor(Math.random() * settings.picUrlList.length)];
        // setError(picUrl)
        d.push({
            title: settings.authorList[i].split("@@")[0],
            url: "https://baidu.com#" + settings.authorList[i],
            pic_url: picUrl
        });
    }
}

// setError(JSON.stringify(d));
res.data = d;
setHomeResult(res);
