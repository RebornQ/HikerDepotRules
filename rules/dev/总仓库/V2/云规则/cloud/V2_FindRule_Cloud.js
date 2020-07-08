// 更新程序模式 0->自动更新模式 1->手动更新模式
var updateMode = 0;

// 是否为测试通道
if (settings.beta == true) settings.remoteDepotRuleUrl = settings.remoteBetaDepotRuleUrl;

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

    var desc = function (rule) {
        return rule.oldVersion != null && rule.oldVersion < rule.version ? ("‘‘有新版本：" + rule.version + "’’，点击导入新版本") : rule.oldVersion > rule.version ? "‘‘喵？为啥你的规则版本比我还高？’’" : "当前规则已是最新版，点击跳到规则页";
    };

    // 为所有分类添加总仓库项
    try {
        var remoteDepotRule = {};
        eval("remoteDepotRule=" + fetch(settings.remoteDepotRuleUrl, {}));
        //setError(JSON.stringify(remoteDepotRule));
        if (updateMode == 0) {
            remoteDepotRule.oldVersion = depotStatus.version;
            mRule.version = remoteDepotRule.version;
        } else if (updateMode == 1) {
            var localDepotRule = JSON.parse(getRule());
            remoteDepotRule.oldVersion = localDepotRule.version;
            //setError(JSON.stringify(localDepotRule));
        }

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

        if (remoteDepotRule.oldVersion < remoteDepotRule.version) {
            d.push({
                title: remoteDepotRule.title + "\t" + (updateMode == 0 ? "‘‘已更新完成’’" : desc(remoteDepotRule)),
                url: "https://baidu.com#" + JSON.stringify(remoteDepotRule) || "",
                col_type: "text_center_1",
                desc: "【更新日志】\n更多完整日志(新功能)请在里面点击进入原网页查看"
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

    if (mRule.version != depotStatus.version) {
        depotStatus.version = mRule.version;
        writeDepotStatusToFile(depotStatus);
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
