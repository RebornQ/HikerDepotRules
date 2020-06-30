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

// 是否允许超过一定规则数后改变显示样式，默认不开启，要开始请设置为 true
var needChangeShowType = false;
// 设置最大显示完整文本的规则数，大于设置值则显示为按钮样式(默认 text_2)
var showFullTextMax = 10;
// 设置超过允许显示完整文本的规则数后显示的样式
var overMaxShowType = "text_2";

// 入戏开关？（滑稽）// 删除开关，不需要删除请设置为false
var needDelSymbol = true;
// 自行添加要被删掉的标记
var symbols = ["标记1", "标记2"];

// 隐藏开关，不需要隐藏请设置为false
var needHideRule = true;
// 自行添加要隐藏的标记，格式为：[标记名]
var hideSymbols = ["[模板]", "[未完成]"];

// 若需要关闭忽略本次更新请设置为true
var noIgnoreUpdate = false;
// 本地忽略更新列表，
// 内容模板为 {title: "规则名", author: "规则作者"}
var ignoreUpdateRuleList = [
// {title: "预告片•Re", author: "Reborn"},
];
// 云端忽略更新列表，格式是JSON数组，请自己设置
var remoteIgnoreListUrl = "https://gitee.com/Reborn_0/HikerRulesDepot/raw/master/ignoreUpdateRuleList.json";

// 参考链接：https://gitee.com/Reborn_0/HikerRulesDepot/raw/master/ignoreUpdateRuleList.json

// 总仓库更新地址
var remoteDepotRuleUrl = "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/depotRule.json";
// 仓库状态缓存文件地址
var statusCacheFile = "hiker://files/" + mRule.title + "_" + mRule.author + ".json";
// 举例 hiker://files/depotStatus.json

var remoteIgnoreList = [];
try {
    eval("remoteIgnoreList=" + fetch(remoteIgnoreListUrl, {}));
} catch (e) {
}
Array.prototype.push.apply(ignoreUpdateRuleList, remoteIgnoreList);
// setError(JSON.stringify(ignoreUpdateRuleList));


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

function getRuleInArray(rules, rule) {
    if (rules == null || rules.length == 0) return null;
    for (var i = 0; i < rules.length; i++) {
        if (rules[i].title == rule.title && rules[i].author == author) return rules[i];
    }
    return null;
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

var rules = [];
eval("rules=" + getResCode());
var myRules = [];
for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];
    if (rule.author == author) {
        myRules.push(getRuleNoSymbols(rule, symbols));
    }
}
// setError(JSON.stringify(myRules));

// 如果本地没有则提示导入新规则
// 因部分手机不支持es6语法，故注释掉
/*var myRulesMap = new Map();
myRules.map(rule=>{
myRulesMap.set(rule.title, true);
});
//setError(myRulesMap.get("腾讯•Re"));*/

// 原始方法，比较耗时
function isInArray(rules, rule) {
    if (rules.length == 0) return false;
    for (var i = 0; i < rules.length; i++) {
        if (rules[i].title == rule.title) return true;
    }
    return false;
}

var desc = function (rules, rule) {
    if (isInArray(rules, rule) == true) {
        return rule.oldVersion != null && rule.oldVersion < rule.version ? ("‘‘有新版本：" + rule.version + "’’，点击导入新版本") + ("<br><br>[更新日志] " + (rule.updateText == null ? "无" : rule.updateText) + (rule.tips != null && rule.tips != "" ? "<br><br>Tips: " + rule.tips : "")) : rule.oldVersion > rule.version ? "‘‘喵？为啥你的规则版本比我还高？’’" : "当前规则已是最新版，点击跳到规则页" + (rule.tips != null && rule.tips != "" ? "\n\nTips: " + rule.tips : "");
    } else {
        return "‘‘你尚未导入该规则’’，点击导入" + (rule.tips != null && rule.tips != "" ? "<br><br>Tips: " + rule.tips : "");
    }
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
            title: "‘‘有新版本：" + remoteDepotRule.version + "’’，点击导入新版本",
// remoteDepotRule.title + "\t" + desc(rules, remoteDepotRule),
            url: remoteDepotRule.rule || "",
            col_type: "text_center_1",
            //content: remoteDepotRule.updateText,
            desc: "【更新日志】\n" + remoteDepotRule.updateText
        });
    }
} catch (e) {
    d.push({
        title: "‘‘总仓库更新程序已损坏’’",
        desc: "请联系 " + mRule.author + " 修复",
        col_type: "text_center_1",
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
    } else if (apiType == "1"){
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

        while (left.length > 0 && right.length > 0) {
            if (left[0].oldVersion < left[0].version) {
                result.push(left.shift());
            } else if (right[0].oldVersion < right[0].version) {
                result.push(right.shift());
            } else if (left[0].oldVersion == null) {
                result.push(left.shift());
            } else if (right[0].oldVersion == null) {
                result.push(right.shift());
            } else {
                result.push(left.shift());
                result.push(right.shift());
            }
        }

        while (left.length)
            result.push(left.shift());

        while (right.length)
            result.push(right.shift());

        return result;
    }

    remoteRules = mergeSort(remoteRules);

    for (var i = 0; i < remoteRules.length; i++) {
        var j = remoteRules[i];
        var r = {};
        if (needChangeShowType == true && j.oldVersion != null && j.oldVersion >= j.version && remoteRules.length > showFullTextMax) r.col_type = overMaxShowType;
        r.desc = noIgnoreUpdate != true && isIgnoreUpdateRule(j) == true ? "该规则已忽略本次更新" : desc(myRules, j);
        r.title = j.title;
        r.url = isInArray(myRules, j) ? (j.oldVersion != null && j.oldVersion < j.version ? (j.rule || "") : ("hiker://home@" + j.title)) : (j.rule || "");
        //r.content = j.updateText;
        d.push(r);
    }
}

res.data = d;
setHomeResult(res);
