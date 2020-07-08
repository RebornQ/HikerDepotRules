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
    // beta测试版，若要开启测试通道请设为true
    beta: false,
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
    // 总仓库更新地址，若总仓库更新没问题请勿擅自修改！！！
    remoteDepotRuleUrl: "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/depotRule_v2_release.json",
    remoteBetaDepotRuleUrl: "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/depotRule_v2_beta.json"
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

var fileUrl = "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/V2_FindRule_Cloud.js";
var betaFileUrl = "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/V2_FindRule_beta_Cloud.js";
if (settings.beta == true) {
    fileUrl = betaFileUrl;
    putVar({key: 'beta', value: settings.beta});
}
eval(fetch(fileUrl, {}));

// setError(JSON.stringify(d));
res.data = d;
setHomeResult(res);
