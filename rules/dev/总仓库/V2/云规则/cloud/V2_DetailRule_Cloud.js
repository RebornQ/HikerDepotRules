// 注意事项文字
var waringText = "1. 保存后需要手动下拉刷新才能更新规则状态" + "\n2. 按钮形状的规则是处于最新版本的，点击可跳转至规则页";
// 首次导入文字
var firstImportText = "1.‘‘下拉刷新即可显示仓库规则’’" + "\n2.二级规则中 needChangeShowType 可设置显示样式" + "\n3.二级规则中 hideAll 可设置一键隐藏标题和注意事项";


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
        if (settingsTemp.detail_find_rule_settings != null && JSON.stringify(settingsTemp.detail_find_rule_settings) != "{}") {
            depotSettings = settingsTemp;
            extend(settings, settingsTemp.detail_find_rule_settings);
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

// TODO 目前会导致一旦仓库配置的本地缓存产生，则无法更改默认配置中同字段内容的问题
// 默认配置与本地缓存/云端合并内容的方式，以本地缓存/云端为主（合并优先级为：云端->本地缓存->默认配置）
// 先读本地再读云端，云端炸了用本地，本地炸了用默认；本地缓存云端时先比对md5不一致再缓存
if (needCacheSetting == true) getSettingsContent(settingsCacheFile, false);
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
        remoteFilename = "update.json";
    }
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
    d.push({
        title: "总仓库开发文档入口(点击可查看完整文档)",
        desc: "这是专门给大佬们写的，文笔太差了，觉得写得乱还请体谅一下🙈。有不懂的地方可以联系我，溜了溜了～",
        url: "https://gitee.com/Reborn_0/HikerRulesDepot/blob/master/README.md",
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

    var depotRulesStatus = {
        updateNum: 0,
        noImportNum: 0,
        ignoreNum: 0,
        unknownTypeNum: 0
    };

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
        return getRuleInArray(rules, rule) != null;
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
        if (rule != null && rule.version < 0) {
            depotRulesStatus.unknownTypeNum += 1;
            return "仓库无法检测该规则类型，请‘‘看规则更新时间’’";
        }
        if (isInRulesWithMapping(rules, rule) == true || isInArray(rules, rule) == true) {
            if (rule.oldVersion != null && rule.oldVersion < rule.version) {
                depotRulesStatus.updateNum += 1;
                return ("‘‘有新版本：" + rule.version + "’’，点击导入新版本")
                    + (
                        "<br><br>[更新日志] "
                        + (
                            rule.updateText == null ?
                                "无"
                                : rule.updateText
                        ));
            } else {
                return rule.oldVersion > rule.version ?
                    "‘‘喵？为啥你的规则版本比我还高？’’"
                    : "当前规则已是最新版，点击跳到规则页";
            }
        } else {
            depotRulesStatus.noImportNum += 1;
            return "‘‘你尚未导入该规则’’，点击导入";
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
                                //if ((localRule.mappingTitle != null && remoteRule.mappingTitle != null) || remoteRule.isMapped == true) break;
                                var ruleMapping = settings.rulesMapping[k];
                                var localRuleMappingTitle = ruleMapping[0].title;
                                var remoteRuleMappingTitle = ruleMapping[1].title;
                                // 全名映射
                                if (localRule.title == localRuleMappingTitle && remoteRule.title == remoteRuleMappingTitle && ruleMapping[2].matchAll == true) {
                                    localRule.mappingTitle = remoteRuleMappingTitle;
                                    remoteRule.mappingTitle = remoteRuleMappingTitle;
                                } else {
                                    var titleRegex = new RegExp(localRuleMappingTitle);
                                    localRule.mappingTitle = localRule.mappingTitle != null && localRule.mappingTitle != "" ? localRule.mappingTitle : localRule.title.match(titleRegex)[0];
                                    titleRegex = new RegExp(remoteRuleMappingTitle, "g");
                                    remoteRule.mappingTitle = remoteRule.title.match(titleRegex)[0];
                                }
                                if (localRule.mappingTitle == remoteRule.mappingTitle) {
                                    remoteRule.localTitle = localRule.title;
                                    remoteRule.isMapped = true;
                                    remoteRule.oldVersion = localRule.version;
                                    remoteRule.group = localRule.group;
                                    break;
                                }
                            } catch (e) {
                            }
                        }
                        if (localRule.title == remoteRule.title) {
                            remoteRule.oldVersion = localRule.version;
                            remoteRule.group = localRule.group;
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
                                //if ((localRule.mappingTitle != null && remoteRule.mappingTitle != null) || remoteRule.isMapped == true) break;
                                var ruleMapping = settings.rulesMapping[k];
                                var localRuleMappingTitle = ruleMapping[0].title;
                                var remoteRuleMappingTitle = ruleMapping[1].title;
                                // 全名映射
                                if (localRule.title == localRuleMappingTitle && remoteRule.title == remoteRuleMappingTitle && ruleMapping[2].matchAll == true) {
                                    localRule.mappingTitle = remoteRuleMappingTitle;
                                    remoteRule.mappingTitle = remoteRuleMappingTitle;
                                } else {
                                    var titleRegex = new RegExp(localRuleMappingTitle);
                                    localRule.mappingTitle = localRule.mappingTitle != null && localRule.mappingTitle != "" ? localRule.mappingTitle : localRule.title.match(titleRegex)[0];
                                    titleRegex = new RegExp(remoteRuleMappingTitle, "g");
                                    remoteRule.mappingTitle = remoteRule.title.match(titleRegex)[0];
                                }
                                if (localRule.mappingTitle == remoteRule.mappingTitle) {
                                    remoteRule.localTitle = localRule.title;
                                    remoteRule.isMapped = true;
                                    remoteRule.oldVersion = localRule.version;
                                    remoteRule.group = localRule.group;
                                    break;
                                }
                            } catch (e) {
                            }
                        }

                        if (localRule.title == remoteRule.title) {
                            remoteRule.oldVersion = localRule.version;
                            remoteRule.group = localRule.group;
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

            var ruleReg = new RegExp(/{[^]*/);
            function getRuleInRemote(remoteRule) {
                var remoteRuleRule = null;
                try {
                    eval("remoteRuleRule=" + base64Decode(remoteRule.rule.replace("rule://", "")).match(ruleReg)[0]);
                    if(remoteRule.group != null && remoteRuleRule != null) {
                        remoteRuleRule.group = remoteRule.group;
                    }
                } catch (e) { }
                return remoteRuleRule;
            }

            var importList = [];
            var updateList = [];
            var importListFile = "hiker://files/tmp_importList.json";
            var updateListFile = "hiker://files/tmp_updateList.json";
            function generateHomeRulesUrl(rules, filename) {
                // 海阔视界，首页频道合集￥home_rule_url￥
                var homeRulesKey = "5rW36ZiU6KeG55WM77yM6aaW6aG16aKR6YGT5ZCI6ZuG77+laG9tZV9ydWxlX3VybO+/pQ==";
                // setError (JSON.stringify(rules));
                writeObjectToFile(filename, rules);
                var str = base64Decode(homeRulesKey) + filename;
                return "rule://" + base64Encode(str).replace(/\n/g, '');
            }

            var showRuleList = [];
            // setError(JSON.stringify(remoteRules));
            for (var i = 0; i < remoteRules.length; i++) {
                var j = remoteRules[i];
                var ruleWithMapping = getRuleInRulesWithMapping(remoteRules, j);
                if (ruleWithMapping != null && getRuleInRulesWithMapping(myRules, j)) j = ruleWithMapping;
                var r = {};
                if (settings.needChangeShowType == true && j.oldVersion != null && j.oldVersion >= j.version && remoteRules.length > settings.showFullTextMax)
                    r.col_type = settings.overMaxShowType;
                if ((settings.noIgnoreUpdate != true && j.isIgnoreUpdate == true) && (j.oldVersion == null || j.oldVersion < j.version)) {
                    depotRulesStatus.ignoreNum += 1;
                    r.desc = "该规则已忽略本次更新";
                } else {
                    r.desc = desc(myRules, j);
                }
                r.desc = r.desc + (
                    j.tips != null && j.tips != "" ?
                        "\n\nTips: " + j.tips
                        : ""
                );
                r.title = j.mappingTitle != null && j.mappingTitle != "" && j.isMapped == true ?
                    j.mappingTitle
                    : j.title;
                r.url = j.version < 0 ?
                    j.rule || ""
                    : isInArray(myRules, j) || j.isMapped == true ?
                        (j.oldVersion != null && j.oldVersion < j.version ?
                            (j.rule || "")
                            : ("hiker://home@" + (j.localTitle != null && j.localTitle != "" ?
                                j.localTitle
                                : j.title)))
                        : (j.rule || "");
                //r.content = j.updateText;
                showRuleList.push(r);

                var ruleInRemote = getRuleInRemote(j);
                if (ruleInRemote !=null ) {
                    if(j.oldVersion != null && j.oldVersion < j.version) {
                        updateList.push(ruleInRemote);
                    }
                    importList.push(ruleInRemote);
                }
            }

            if (settings.noRulesNum != true && settings.hideAll != true){}
            d.push({
                title: "<b>该仓库共有 ‘‘" + remoteRules.length + "’’ 条规则</b>" +
                    " ("
                    + "更新:‘‘" + depotRulesStatus.updateNum
                    + "’’  未导入:‘‘" + depotRulesStatus.noImportNum
                    + "’’  忽略:‘‘" + depotRulesStatus.ignoreNum
                    + "’’)",
                col_type: "text_1",
            });

            if (updateList.length != 0) {
                d.push({
                    title: "““[自动生成]本页一键更新””",
                    url: generateHomeRulesUrl(updateList, updateListFile),
                    col_type: "text_1",
                    desc: "更新‘‘不影响原分组’’，此项由总仓库自动生成‘‘(实验性功能)’’\n\n注: 仅支持导入首页规则，其他请自行导入！"
                });
            }

            if (importList.length != 0) {
                d.push({
                    title: "““[自动生成]本页一键导入””",
                    url: generateHomeRulesUrl(importList, importListFile),
                    col_type: "text_1",
                    desc: "此项由总仓库自动生成‘‘(实验性功能)’’\n\n注: 仅支持导入首页规则，其他请自行导入！"
                });
            }

            while (showRuleList.length) d.push(showRuleList.shift())

        }
    }
}
