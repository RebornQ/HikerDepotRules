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

// 设置 true 一键净化，除了规则和仓库通知，啥也不要
var hideAll = false;
// 小仓库标题开关（注意事项上面那个），不需要显示请设置为true
var noTitle = true;
// 注意事项开关，不需要显示请设置为true
var noWarning = false;
// 规则数量显示开关，不需要显示请设置为true
var noRulesNum = false;

// 是否允许超过一定规则数后改变显示样式，默认不开启
var needChangeShowType = false;
// 设置最大显示完整文本的规则数，大于设置值则显示为按钮样式(默认 text_2)
var showFullTextMax = 10;
// 设置超过允许显示完整文本的规则数后显示的样式
var overMaxShowType = "text_2";

/**
 * 规则映射列表
 * 左本地，右远端，本地映射为远端，达到替换内容的目的
 * （注意，先映射后执行下面的删除标记）
 */
var rulesMapping = [
    // [{"title": "预告片•T", "author": "Reborn"}, {"title": "预告片•Re", "author": "Reborn"}],
];

// 入戏开关？（滑稽）// 删除开关，不需要删除请设置为false
var needDelSymbol = true;
// 自行添加要被删掉的标记
var symbols = ["标记1", "标记2"];

// 隐藏开关，不需要隐藏请设置为false
var needHideRule = true;
// 自行添加要隐藏的标记，格式为：[标记名]
var hideSymbols = ["[模板]", "[未完成]"];

// 是否隐藏例子，需要隐藏请设置为true
var needHideEtc = false;
if (needHideEtc == true) hideSymbols.push("[例子]");

// 仓库状态缓存文件地址
var statusCacheFile = getVar('statusCacheFile');
if (statusCacheFile == null || statusCacheFile == "") statusCacheFile = "hiker://files/depotStatus_v2.json";
// 举例 hiker://files/depotStatus_v2.json
// setError(statusCacheFile);

// 若需要关闭忽略本次更新请设置为true
var noIgnoreUpdate = false;
// 本地忽略更新列表，
// 内容模板为 {title: "规则名", author: "规则作者"}
var ignoreUpdateRuleList = [
// {title: "预告片•Re", author: "Reborn"},
];
// 云端忽略更新列表，格式是JSON数组，请自己设置
var remoteIgnoreListUrl = "";

// 参考链接：
// https://gitee.com/Reborn_0/HikerRulesDepot/raw/master/ignoreUpdateRuleList.json
// https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/Reborn/ignoreUpdateRuleList.json

var remoteIgnoreList = [];
try {
    eval("remoteIgnoreList=" + fetch(remoteIgnoreListUrl, {}));
} catch (e) {
}
Array.prototype.push.apply(ignoreUpdateRuleList, remoteIgnoreList);
// setError(JSON.stringify(remoteIgnoreList));

// 注意事项文字
var waringText = "1. 保存后需要手动下拉刷新才能更新规则状态" + "\n2. 按钮形状的规则是处于最新版本的，点击可跳转至规则页";
// 首次导入文字
var firstImportText = "1.‘‘下拉刷新即可显示仓库规则’’" + "\n2.二级规则中 needChangeShowType 可设置显示样式" + "\n3.二级规则中 hideAll 可设置一键隐藏标题和注意事项";

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
// 若需要永久显示提示，则取消注释
// depotStatus.showSecondListTips = true;

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
        if (needDelSymbol != true) return rule;
        var ruleTemp = rule;
        for (var i = 0; i < symbolList.length; i++) {
            var symbolReg = new RegExp(symbolList[i], "g");
            ruleTemp.title = ruleTemp.title.replace(symbolReg, "");
        }
        //setError(JSON.stringify(ruleTemp));
        return ruleTemp;
    }

    function isHideRule(rule) {
        if (needHideRule != true) return false;
        // if (hideSymbols.length == 0) return false;
        var ruleTemp = rule;
        for (var i = 0; i < hideSymbols.length; i++) {
            if (ruleTemp.title.indexOf(hideSymbols[i]) != -1) return true;
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
        if (isInArray(ignoreUpdateRuleList, rule) == true) {
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

    function getRuleMapping(rule, index) {
        if (rulesMapping.length == 0) return null;
        for (var i = 0; i < rulesMapping.length; i++) {
            if (rule.title == rulesMapping[i][index].title && rule.author == rulesMapping[i][index].author) {
                rulesMapping[i][index].isMapped = true;
                return rulesMapping[i];
            }
        }
        return null;
    }

    function getRuleMappingTitle(rules, rule) {
        var ruleMapping = getRuleMapping(rule, 1);
        if (ruleMapping != null && ruleMapping[0].isMapped == true) return ruleMapping[0].title;
        else return rule.title;
    }

    var rules = [];
    eval("rules=" + fetch("hiker://home", {}));
    var myRules = [];
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (rule.author == author) {
            var ruleMapping = getRuleMapping(rule, 0);
            if (ruleMapping != null) rule.title = ruleMapping[1].title;
            myRules.push(getRuleNoSymbols(rule, symbols));
        }
    }
    // setError(JSON.stringify(myRules));

    var desc = function (rules, rule) {
        if (isInArray(rules, rule) == true) {
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
        if (noTitle != true && hideAll != true) {
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
            if (noWarning != true && hideAll != true) {
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
                        if (isHideRule(remoteRules[j])) {
                            remoteRules.splice(j, 1);
                            j--;
                            continue;
                        }
                        setIgnoreUpdateRule(remoteRules[j]);
                        if (myRules[i].title == remoteRules[j].title) {
                            remoteRules[j].oldVersion = myRules[i].version;
                            //remoteRules[j].rule=myRules[i].rule;
                            //remoteRules[j].desc=myRules[i].desc;
                            break
                        }
                    }
                }
            } else {
                for (var i = 0; i < remoteRules.length; i++) {
                    if ((isHideRule(remoteRules[i]))) {
                        remoteRules.splice(i, 1);
                        i--;
                        continue;
                    }
                    setIgnoreUpdateRule(remoteRules[i]);
                    for (var j = 0; j < myRules.length; j++) {
                        if (myRules[j].title == remoteRules[i].title) {
                            remoteRules[i].oldVersion = myRules[j].version;
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

            if (noRulesNum != true && hideAll != true)
                d.push({
                    title: "<b>该仓库共有 ‘‘" + remoteRules.length + "’’ 条规则<b/>",
                    col_type: "text_1"
                });

            // setError(JSON.stringify(remoteRules));
            for (var i = 0; i < remoteRules.length; i++) {
                var j = remoteRules[i];
                var r = {};
                if (needChangeShowType == true && j.oldVersion != null && j.oldVersion >= j.version && remoteRules.length > showFullTextMax) r.col_type = overMaxShowType;
                r.desc = (noIgnoreUpdate != true && j.isIgnoreUpdate == true) && (j.oldVersion == null || j.oldVersion < j.version) ? "该规则已忽略本次更新" : desc(myRules, j);
                r.title = getRuleMappingTitle(myRules, j);
                r.url = isInArray(myRules, j) ? (j.oldVersion != null && j.oldVersion < j.version ? (j.rule || "") : ("hiker://home@" + j.title)) : (j.rule || "");
                //r.content = j.updateText;
                d.push(r);
            }

        }
    }
}
res.data = d;
setHomeResult(res);
