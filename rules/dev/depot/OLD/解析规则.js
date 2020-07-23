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
    getRule
} = require("../../../../utils/api_haikuoshijie");


var res = {};
var d = [];

// 入戏开关？（滑稽）// 删除开关，不需要删除请设置为false
var needDelSymbol = true;
// 自行添加要被删掉的标记
var symbols = ["标记1","标记2"];

// 隐藏开关，不需要隐藏请设置为false
var needHideRule = true;
// 自行添加要隐藏的标记，格式为：[标记名]
var hideSymbols = ["[模板]", "[未完成]"];

/**
 * 可在此处自定义仓库，实现私人仓库
 *
 * 以Reborn仓库的链接为参考
 *
 * https://gitee.com/qiusunshine233/hikerView/blob/master/ruleversion/Reborn/update.json
 */
var remoteApiHome = "https://gitee.com/api/v5/repos/";
var owner = "qiusunshine233";   // 仓库拥有者
var repo = "hikerView"; // 仓库名
var author = getUrl().split("#")[1];
var remoteFilename = "update.json"; // 文件名
var path = "ruleversion/" + author + "/" + remoteFilename;  // 在仓库中文件的路径
var access_token = "";  // 用户授权码，在码云"设置—>安全设定->个人访问令牌"中可以生成

/**
 * ！！！建议在此处配置私人仓库！！！
 *
 * 为了不影响原仓库可以在这里设置自己的仓库配置，举例：
 *
 * 链接参考：https://gitee.com/Reborn_0/HikerRulesPrivacy/blob/master/update.json
 */
/*
owner = "Reborn_0";
repo = "HikerRulesPrivacy";
path = "update.json";
access_token = "**********";
// author = "Reborn";  // 若所有规则author都是同一个则在此处固定一个即可，然后分类可以清空，注意删除 split，不然会报错；否则请注意填好分类，不然没法检测更新
*/

// API链接参考：https://gitee.com/api/v5/repos/{{owner}}/{{repo}}/contents/{{path}}?access_token=****
var remoteUrl = remoteApiHome + owner + "/" + repo + "/contents/" + path;
if (access_token != "") {
    remoteUrl = remoteUrl + "?access_token=" +access_token;
}

function getRuleNoSymbols(rule, symbolList) {
    if (needDelSymbol != true) return rule;
    var ruleTemp = rule;
    for(var i = 0; i < symbolList.length; i++) {
        var symbolReg = new RegExp(symbolList[i], "g");
        ruleTemp.title = ruleTemp.title.replace(symbolReg, "");
    }
//setError(JSON.stringify(ruleTemp));
    return ruleTemp;
}

function isHideRule (rule) {
    if (needHideRule != true) return false;
    // if (hideSymbols.length == 0) return false;
    var ruleTemp = rule;
    for(var i = 0; i < hideSymbols.length; i++) {
        if (ruleTemp.title.indexOf(hideSymbols[i]) != -1) return true;
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
function isInArray(rules, title) {
    if (rules.length == 0) return false;
    for (var i = 0; i < rules.length; i++) {
        if (rules[i].title == title) return true;
    }
    return false;
}
var desc = function (rules, rule) {
    if (isInArray(rules, rule.title) == true) {
        return rule.oldVersion != null && rule.oldVersion < rule.version ? ("‘‘有新版本：" + rule.version + "’’，点击导入新版本") : rule.oldVersion > rule.version ? "‘‘喵？为啥你的规则版本比我还高？’’" : "当前规则已是最新版，点击跳到规则页";
    } else {
        return "‘‘你尚未导入该规则’’，点击导入";
    }
};

// 为所有分类添加总仓库项
var remoteDepotRuleUrl = "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/depotRule.json"
var remoteDepotRule = {};
eval("remoteDepotRule=" + fetch(remoteDepotRuleUrl, {}));
var localDepotRule = JSON.parse(getRule());
remoteDepotRule.oldVersion = localDepotRule.version;
//setError(JSON.stringify(localDepotRule));
//setError(JSON.stringify(remoteDepotRule));
if (remoteDepotRule.oldVersion < remoteDepotRule.version) {
    d.push({
        title: remoteDepotRule.title + "\t" + desc(rules, remoteDepotRule),
        url: remoteDepotRule.rule || "",
        col_type: "text_center_1",
        //content: remoteDepotRule.updateText,
        desc: "【更新日志】\n" + remoteDepotRule.updateText
    });
}

var remoteRules = [];
// var remoteUrl = remoteApiHome + encodeURIComponent(author) + "/" + remoteFilename;
var remoteSource = fetch(remoteUrl, {});
eval("remoteSource=" + remoteSource);
// setError(remoteUrl);
try {
    eval("remoteRules=" + base64Decode(remoteSource.content));
} catch(e) { }
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
        r.desc = desc(myRules, j) + (j.oldVersion != null && j.oldVersion < j.version ? ("<br><br>[更新日志] " +( j.updateText ==null ? "无": j.updateText)) : "");
        r.title = j.title;
        r.url =  isInArray(myRules, j.title) ?(j.oldVersion != null && j.oldVersion < j.version ? (j.rule || "") : ("hiker://home@"+j.title)):  (j.rule || "");
        //r.content = j.updateText;
        d.push(r);
    }
}

res.data = d;
setHomeResult(res);
