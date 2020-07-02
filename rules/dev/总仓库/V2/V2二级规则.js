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
eval(getCryptoJS());

// 仓库配置本地缓存文件
var settingsCacheFile = "hiker://files/depot_v2_settings.json";

// 仓库个性设置
var settings = {
    // 设置 true 一键净化，除了规则和仓库通知，啥也不要
    hideAll: false,
    // 小仓库标题开关（注意事项上面那个），不需要显示请设置为true
    noTitle: true,
    // 注意事项开关，不需要显示请设置为true
    noWarning: false,
    // 规则数量显示开关，不需要显示请设置为true
    noRulesNum: false,
    // 是否允许超过一定规则数后改变显示样式，默认不开启
    needChangeShowType: false,
    // 设置最大显示完整文本的规则数，大于设置值则显示为按钮样式(默认 text_2)
    showFullTextMax: 10,
    // 设置超过允许显示完整文本的规则数后显示的样式
    overMaxShowType: "text_2",
    /**
     * 规则映射列表
     * 左本地，右远端，本地映射为远端，达到替换内容的目的
     * （注意，程序逻辑为先映射后执行下面的删除标记）
     */
    rulesMapping: [
        // [{"title": "预告片•T", "author": "Reborn"}, {"title": "预告片•Re", "author": "Reborn"}],
        // [{"title": ".*?(?=•T)", "author": "Reborn"}, {"title": ".*?(?=•Re)", "author": "Reborn"}],
        // [{"title": ".*?(?=•B)", "author": "Reborn"}, {"title": ".*?(?=•Re)", "author": "Reborn"}]
    ],
    // 云端规则映射列表链接，内容格式是JSON数组，请自己设置
    remoteRulesMappingUrl: "",
    // 入戏开关？（滑稽）// 删除开关，不需要删除请设置为false
    needDelSymbol: true,
    // 自行添加要被删掉的标记
    symbols: ["标记1", "标记2"],
    // 隐藏开关，不需要隐藏请设置为false
    needHideRule: true,
    // 自行添加要隐藏的标记，格式为：[标记名]
    hideSymbols: ["[模板]", "[未完成]"],
    // 是否隐藏例子，需要隐藏请设置为true
    needHideEtc: false,

    // 若需要关闭忽略本次更新请设置为true
    noIgnoreUpdate: false,
    // 本地忽略更新列表，
    // 内容模板为 {title: "规则名", author: "规则作者"}
    ignoreUpdateRuleList: [
        // {title: "预告片•Re", author: "Reborn"},
    ],
    // 云端忽略更新列表链接，格式是JSON数组，请自己设置
    remoteIgnoreListUrl: "",
    // 参考链接：
    // https://gitee.com/Reborn_0/HikerRulesDepot/raw/master/ignoreUpdateRuleList.json
    // https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/Reborn/ignoreUpdateRuleList.json
};
// 注意事项文字
var waringText = "1. 保存后需要手动下拉刷新才能更新规则状态" + "\n2. 按钮形状的规则是处于最新版本的，点击可跳转至规则页";
// 首次导入文字
var firstImportText = "1.‘‘下拉刷新即可显示仓库规则’’" + "\n2.二级规则中 needChangeShowType 可设置显示样式" + "\n3.二级规则中 hideAll 可设置一键隐藏标题和注意事项";
var statusCacheFile = getVar('statusCacheFile');
// 若不是第一次使用总仓库则存储仓库状态
var depotStatus = {
    // 此处所有配置都会被下方覆盖，请移步下方配置 depotStatus.xxx = xxx;
};
var depotSettings = {
};

if (settings.needHideEtc == true) settings.hideSymbols.push("[例子]");

// 仓库状态缓存文件地址
if (statusCacheFile == null || statusCacheFile == "") statusCacheFile = "hiker://files/depotStatus_v2.json";
// 举例 hiker://files/depotStatus_v2.json

var depotStatusFile = fetch(statusCacheFile, {});
if (depotStatusFile != "") {
    eval("depotStatus=" + depotStatusFile);
}

// 仓库配置远程地址，请自行配置
// 举例：https://gitee.com/Reborn_0/HikerRulesDepot/raw/master/depot_v2_settings.json
depotStatus.settingsRemoteFile = "";
// 若需要永久显示提示，则取消注释
// depotStatus.showSecondListTips = true;

function writeObjectToFile(fileUrl, object) {
    writeFile(fileUrl, JSON.stringify(object));
}

// 把总仓库状态写入文件
function writeDepotStatusToFile(depotStatus) {
    writeObjectToFile(statusCacheFile, depotStatus);
}

function writeSettingsToFile(settings) {
    depotSettings.detail_find_rule_settings = settings;
    writeObjectToFile(settingsCacheFile, depotSettings);
}

function getSettingsContent(settingsFileUrl, isRemote) {
    if (settingsFileUrl == "") return false;
    var settingsCacheFileContent = fetch(settingsFileUrl, {});
    if (settingsCacheFileContent != null && settingsCacheFileContent != "") {
        eval("var settingsTemp=" + settingsCacheFileContent);
        if (settingsTemp.detail_find_rule_settings != null && JSON.stringify(settingsTemp.detail_find_rule_settings) != "{}") {
            depotSettings = settingsTemp;
            settings = settingsTemp.detail_find_rule_settings;
            if (isRemote == true) {
                var settingsMD5Now = CryptoJS.MD5(JSON.stringify(settings)).toString(CryptoJS.enc.Hex);
                if (settingsMD5Now != depotStatus.cacheDetailFindRuleSettingsMD5) {
                    depotStatus.cacheDetailFindRuleSettingsMD5 = settingsMD5Now;
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
getSettingsContent(settingsCacheFile, false);
getSettingsContent(depotStatus.settingsRemoteFile, true);

var remoteIgnoreList = [];
try {
    eval("remoteIgnoreList=" + fetch(settings.remoteIgnoreListUrl, {}));
} catch (e) {
}
Array.prototype.push.apply(settings.ignoreUpdateRuleList, remoteIgnoreList);
// setError(JSON.stringify(remoteIgnoreList));


var remoteRulesMapping = [];
try {
    eval("remoteRulesMapping=" + fetch(settings.remoteRulesMappingUrl, {}));
} catch (e) {
}
Array.prototype.push.apply(settings.rulesMapping, remoteRulesMapping);
// setError(JSON.stringify(rulesMapping));


/**
 * 可在此处自定义仓库，实现私人仓库
 *
 * 以Reborn仓库的链接为参考
 *
 * https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/update.json
 */
var authorList = getUrl().split("#")[1];
var authorAndOwnerAndProject = authorList.split("@@");
var author = authorAndOwnerAndProject[0];
var remoteUrl = "";

var apiType = "1";  // 0 为文件直链，1 为码云API
var apiTypeJS = authorList.match(/apiType=.[\s\S]*?'/) + ";";
eval(apiTypeJS);
if (apiType == null) apiType = "1";

if (apiType == "0") {
    var fullUrl = "";
    var fullUrlJS = authorList.match(/fullUrl=.[\s\S]*?'/) + ";";
    eval(fullUrlJS);
    remoteUrl = fullUrl;
} else if (apiType == "1") {
    var remoteApiHome = "https://gitee.com/api/v5/repos/";
    var owner = authorAndOwnerAndProject[1];   // 仓库拥有者
    var repo = authorAndOwnerAndProject[2]; // 仓库名
    var remoteFilename = null; // 文件名
    var path = remoteFilename;  // 在仓库中文件的路径
    var access_token = null;  // 用户授权码，在码云"设置—>安全设定->个人访问令牌"中可以生成
    var tokenJS = authorList.match(/access_token=.[\s\S]*?'/) + ";";
    eval(tokenJS);
    // setError(access_token==null);
    var remoteFilenameJS = authorList.match(/remoteFilename=.[\s\S]*?'/) + ";";
    eval(remoteFilenameJS);
    if (remoteFilename == null) {
    }
    remoteFilename = "update.json";
    path = remoteFilename;
    // setError(remoteFilename)
    // API链接参考：https://gitee.com/api/v5/repos/{{owner}}/{{repo}}/contents/{{path}}?access_token=****
    remoteUrl = remoteApiHome + owner + "/" + repo + "/contents/" + path;
    if (access_token != null) {
        remoteUrl = remoteUrl + "?access_token=" + access_token;
    }
    // setError(remoteUrl);
    // var remoteHome = "https://gitee.com/" + owner + "/" + repo + "/blob/master/update.json";
}

if (getUrl().indexOf("rule://") != -1) {
    var remoteDepotRule = JSON.parse(getUrl().split("#")[1]);
    d.push({
        title: "更新日志 (点击可查看完整日志)",
        desc: remoteDepotRule.updateText,
        url: "https://gitee.com/qiusunshine233/hikerView/blob/master/ruleversion/CHANGELOG_DEPOTRULE_V2.md",
        col_type: "pic_1"
    });
    d.push({
        title: "点击更新总仓库",
        url: remoteDepotRule.rule,
        col_type: "text_center_1"
    });
} else if (getUrl().indexOf("updateText=") != -1) {
    var updateText = null;
    // updateTextJS = "updateText='" + getUrl().split("#")[1].replace("updateText=", "") + "';";
    // eval(updateTextJS);
    updateText = getUrl().split("#")[1].replace("updateText=", "");
    d.push({
        title: "更新日志 (点击可查看完整日志)",
        desc: updateText != null ? updateText : "暂无更新日志",
        url: "https://gitee.com/qiusunshine233/hikerView/blob/master/ruleversion/CHANGELOG_DEPOTRULE_V2.md",
        col_type: "pic_1"
    });
} else if (getUrl().indexOf("document=") != -1) {
    var documentUrl = null;
    documentUrl = getUrl().split("#")[1].replace("document=", "");
    d.push({
        title: "总仓库开发文档入口",
        desc: "这是专门给大佬们写的，文笔太差了，觉得写得乱还请体谅一下🙈。有不懂的地方可以联系我，溜了溜了～",
        url: documentUrl,
        col_type: "pic_1"
    });
    d.push({
        title: "点击可查看完整文档",
        url: documentUrl,
        col_type: "text_center_1"
    });
} else {

    function getRuleNoSymbols(rule, symbolList) {
        if (settings.needDelSymbol != true) return rule;
        var ruleTemp = rule;
        for (var i = 0; i < symbolList.length; i++) {
            var symbolReg = new RegExp(symbolList[i], "g");
            ruleTemp.title = ruleTemp.title.replace(symbolReg, "");
        }
        //setError(JSON.stringify(ruleTemp));
        return ruleTemp;
    }

    function isHideRule(rule) {
        if (settings.needHideRule != true) return false;
        // if (hideSymbols.length == 0) return false;
        var ruleTemp = rule;
        for (var i = 0; i < settings.hideSymbols.length; i++) {
            if (ruleTemp.title.indexOf(settings.hideSymbols[i]) != -1) return true;
        }
        return false;
    }

    // 如果本地没有则提示导入新规则
    // 因部分手机不支持es6语法，故注释掉
    /*var myRulesMap = new Map();
    myRules.map(rule => {
        myRulesMap.set(rule.title, true);
    });
    //setError(myRulesMap.get("腾讯•Re"));*/

    function getRuleInArray(rules, rule) {
        if (rules == null || rules.length == 0) return null;
        for (var i = 0; i < rules.length; i++) {
            if (rules[i].title == rule.title && rules[i].author == author) return rules[i];
        }
        return null;
    }

    // 原始方法，比较耗时
    function isInArray(rules, rule) {
        if (getRuleInArray(rules, rule) != null) return true;
        else return false;
    }

    function isIgnoreUpdateRule(rule) {
        if (isInArray(settings.ignoreUpdateRuleList, rule) == true) {
            var cacheIgnoreRule = getRuleInArray(depotStatus.ignoreUpdateRuleList, rule);
            if (cacheIgnoreRule == null) {
                if (depotStatus.ignoreUpdateRuleList == null) depotStatus.ignoreUpdateRuleList = [];
                cacheIgnoreRule = {
                    title: rule.title,
                    author: author,
                    version: rule.version
                };
                depotStatus.ignoreUpdateRuleList.push(cacheIgnoreRule);
                writeDepotStatusToFile(depotStatus)
            } else {
                if (rule.version != cacheIgnoreRule.version) {
                    cacheIgnoreRule.version = rule.version;
                    writeDepotStatusToFile(depotStatus);
                } else {
                    return true;
                }
            }
            // return true;
        }
        return false;
    }

    function setIgnoreUpdateRule(rule) {
        if (isIgnoreUpdateRule(rule) == true) rule.isIgnoreUpdate = true;
    }

    var rules = [];
    eval("rules=" + fetch("hiker://home", {}));
    var myRules = [];
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (rule.author == author) {
            myRules.push(getRuleNoSymbols(rule, settings.symbols));
        }
    }

    // setError(JSON.stringify(myRules));

    function getRuleInRulesWithMapping(rules, rule) {
        if (rules == null || rules.length == 0 || rule == null || rule.mappingTitle == null) return null;
        for (var i = 0; i < rules.length; i++) {
            if (rules[i].mappingTitle != null && rules[i].mappingTitle == rule.mappingTitle && rules[i].author == author) return rules[i];
        }
        return null;
    }

    function isInRulesWithMapping(rules, rule) {
        if (getRuleInRulesWithMapping(rules, rule) != null) return true;
        else return false;
    }

    var desc = function (rules, rule) {
        if (isInRulesWithMapping(rules, rule) == true || isInArray(rules, rule) == true) {
            return rule.oldVersion != null && rule.oldVersion < rule.version ? ("‘‘有新版本：" + rule.version + "’’，点击导入新版本") + ("<br><br>[更新日志] " + (rule.updateText == null ? "无" : rule.updateText) + (rule.tips != null && rule.tips != "" ? "<br><br>Tips: " + rule.tips : "")) : rule.oldVersion > rule.version ? "‘‘喵？为啥你的规则版本比我还高？’’" : "当前规则已是最新版，点击跳到规则页" + (rule.tips != null && rule.tips != "" ? "\n\nTips: " + rule.tips : "");
        } else {
            return "‘‘你尚未导入该规则’’，点击导入" + (rule.tips != null && rule.tips != "" ? "<br><br>Tips: " + rule.tips : "");
        }
    };

    if (depotStatus.showSecondListTips != false) {
        d.push({
            title: "首次导入提示\n‘‘(仅显一次)’’",
            desc: firstImportText,
            col_type: "text_center_1"
        });
        depotStatus.showSecondListTips = false;
        writeDepotStatusToFile(depotStatus);
    } else {
        if (settings.noTitle != true && settings.hideAll != true) {
            d.push({
                title: "‘‘这里是 " + author + " 的规则小仓库’’",
                // desc: "点击可访问规则仓库源",
                // url: remoteHome,
                col_type: "text_1"
            });
        }

        var remoteRules = [];
        // var remoteUrl = remoteApiHome + encodeURIComponent(author) + "/" + remoteFilename;
        var remoteSource = fetch(remoteUrl, {});
        // setError(remoteUrl);
        try {
            eval("remoteSource=" + remoteSource);
            if (apiType == "0") {
                remoteRules = remoteSource;
            } else if (apiType == "1") {
                eval("remoteRules=" + base64Decode(remoteSource.content));
            }
            if (remoteRules.data != null) {
                var notice = remoteRules.notice;
                if (notice != null) {
                    if (typeof (notice) == "string" && notice != "") {
                        d.push({
                            title: "仓库通知",
                            desc: notice,
                            col_type: "pic_1"
                        });
                    } else if (typeof (notice) == "object" && notice.desc != null && notice.desc != "") {
                        d.push({
                            title: notice.title != null && notice.title != "" ? notice.title : "仓库通知",
                            desc: notice.desc,
                            pic_url: notice.picUrl,
                            col_type: "pic_1"
                        });
                    }
                }
                remoteRules = remoteRules.data;
            }
            if (settings.noWarning != true && settings.hideAll != true) {
                d.push({
                    title: "注意事项",
                    desc: waringText,
                    col_type: "pic_1",
                    url: "hiker://home@总仓库"
                });
            }
        } catch (e) {
        }
        //setError(remoteRules.length);
        if (remoteRules.length == 0) {
            d.push({
                title: "该远程仓库无数据！",
                col_type: "text_center_1"
            });
            d.push({
                title: "该远程仓库无数据！",
                col_type: "text_center_1"
            });
            d.push({
                title: "该远程仓库无数据！",
                col_type: "text_center_1"
            });
        } else {
            //setError(myRules.length);
            if (myRules.length >= remoteRules.length) {
                // 不知道会不会有问题
                for (var i = 0; i < myRules.length; i++) {
                    for (var j = 0; j < remoteRules.length; j++) {
                        var localRule = myRules[i];
                        var remoteRule = remoteRules[j];
                        if (isHideRule(remoteRule)) {
                            remoteRules.splice(j, 1);
                            j--;
                            continue;
                        }
                        setIgnoreUpdateRule(remoteRule);
                        for (var k = 0; k < settings.rulesMapping.length; k++) {
                            try {
                                var ruleMapping = settings.rulesMapping[k];
                                var localRuleMappingTitle = ruleMapping[0].title;
                                var titleRegex = new RegExp(localRuleMappingTitle, "g");
                                localRule.mappingTitle = localRule.title.match(titleRegex)[0];
                                var remoteRuleMappingTitle = ruleMapping[1].title;
                                titleRegex = new RegExp(remoteRuleMappingTitle, "g");
                                remoteRule.mappingTitle = remoteRule.title.match(titleRegex)[0];
                                if (localRule.mappingTitle == remoteRule.mappingTitle) {
                                    remoteRule.localTitle = localRule.title;
                                    remoteRule.isMapped = true;
                                    remoteRule.oldVersion = localRule.version;
                                    break;
                                }
                            } catch (e) {
                            }
                        }
                        if (localRule.title == remoteRule.title) {
                            remoteRule.oldVersion = localRule.version;
                            //remoteRules[j].rule=myRules[i].rule;
                            //remoteRules[j].desc=myRules[i].desc;
                            break
                        }
                    }
                }
            } else {
                for (var i = 0; i < remoteRules.length; i++) {
                    var remoteRule = remoteRules[i];
                    if ((isHideRule(remoteRule))) {
                        remoteRules.splice(i, 1);
                        i--;
                        continue;
                    }
                    setIgnoreUpdateRule(remoteRule);
                    for (var j = 0; j < myRules.length; j++) {
                        var localRule = myRules[j];
                        for (var k = 0; k < settings.rulesMapping.length; k++) {
                            try {
                                var ruleMapping = settings.rulesMapping[k];
                                var localRuleMappingTitle = ruleMapping[0].title;
                                var titleRegex = new RegExp(localRuleMappingTitle);
                                localRule.mappingTitle = localRule.title.match(titleRegex)[0];
                                var remoteRuleMappingTitle = ruleMapping[1].title;
                                titleRegex = new RegExp(remoteRuleMappingTitle, "g");
                                remoteRule.mappingTitle = remoteRule.title.match(titleRegex)[0];
                                if (localRule.mappingTitle == remoteRule.mappingTitle) {
                                    remoteRule.localTitle = localRule.title;
                                    remoteRule.isMapped = true;
                                    remoteRule.oldVersion = localRule.version;
                                    break;
                                }
                            } catch (e) {
                            }
                        }

                        if (localRule.title == remoteRule.title) {
                            remoteRule.oldVersion = localRule.version;
                            //remoteRules[i].rule=myRules[j].rule;
                            //remoteRules[i].desc=myRules[j].desc;
                            break
                        }
                    }
                }
            }

            function mergeSort(arr) {
                var len = arr.length;
                if (len < 2) {
                    return arr;
                }
                var middle = Math.floor(len / 2),
                    left = arr.slice(0, middle),
                    right = arr.slice(middle);
                return merge(mergeSort(left), mergeSort(right));
            }

            function merge(left, right) {
                var result = [];
                var ignoreUpdateList = [];
                var isThisVersionList = [];

                while (left.length > 0 && right.length > 0) {
                    if (left[0].isIgnoreUpdate == true && left[0].oldVersion != left[0].version) {
                        ignoreUpdateList.push(left.shift());
                    } else if (right[0].isIgnoreUpdate == true && right[0].oldVersion != right[0].version) {
                        ignoreUpdateList.push(right.shift());
                    } else if (left[0].oldVersion < left[0].version) {
                        result.push(left.shift());
                    } else if (right[0].oldVersion < right[0].version) {
                        result.push(right.shift());
                    } else if (left[0].oldVersion == null) {
                        result.push(left.shift());
                    } else if (right[0].oldVersion == null) {
                        result.push(right.shift());
                    } else {
                        isThisVersionList.push(left.shift());
                        isThisVersionList.push(right.shift());
                    }
                }

                while (ignoreUpdateList.length) result.push(ignoreUpdateList.shift());

                while (isThisVersionList.length) result.push(isThisVersionList.shift());

                while (left.length)
                    result.push(left.shift());

                while (right.length)
                    result.push(right.shift());

                return result;
            }

            remoteRules = mergeSort(remoteRules);

            if (settings.noRulesNum != true && settings.hideAll != true)
                d.push({
                    title: "<b>该仓库共有 ‘‘" + remoteRules.length + "’’ 条规则<b/>",
                    col_type: "text_1"
                });

            // setError(JSON.stringify(remoteRules));
            for (var i = 0; i < remoteRules.length; i++) {
                var j = remoteRules[i];
                var ruleWithMapping = getRuleInRulesWithMapping(remoteRules, j);
                if (ruleWithMapping != null && getRuleInRulesWithMapping(myRules, j)) j = ruleWithMapping;
                var r = {};
                if (settings.needChangeShowType == true && j.oldVersion != null && j.oldVersion >= j.version && remoteRules.length > settings.showFullTextMax) r.col_type = settings.overMaxShowType;
                r.desc = (settings.noIgnoreUpdate != true && j.isIgnoreUpdate == true) && (j.oldVersion == null || j.oldVersion < j.version) ? "该规则已忽略本次更新" : desc(myRules, j);
                r.title = j.mappingTitle != null && j.mappingTitle != "" && j.isMapped == true ? j.mappingTitle : j.title;
                r.url = isInArray(myRules, j) || j.isMapped == true ? (j.oldVersion != null && j.oldVersion < j.version ? (j.rule || "") : ("hiker://home@" + (j.localTitle != null && j.localTitle != "" ? j.localTitle : j.title))) : (j.rule || "");
                //r.content = j.updateText;
                d.push(r);
            }

        }
    }
}
res.data = d;
setHomeResult(res);
