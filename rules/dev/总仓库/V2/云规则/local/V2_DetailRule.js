// js:
var res = {};
var d = [];
eval(getCryptoJS());

// 仓库配置本地缓存文件
var settingsCacheFile = "hiker://files/depot_v2_settings.json";
// 本地缓存开关
var needCacheSetting = true;

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
     * 需要全名匹配需要在映射表中加入{ "matchAll": true }
     * （注意，程序逻辑为先映射后执行下面的删除标记）
     */
    rulesMapping: [
        // [{"title": "嗨哆咪", "author": "Reborn"}, {"title": "嗨哚咪影视", "author": "Reborn"}, {"matchAll": true}],
        // [{"title": "预告片", "author": "Reborn"}, {"title": "预告片(?=•Re)", "author": "Reborn"}],
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
var depotSettings = {};

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

var fileUrl = "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/V2_DetailRule_Cloud.js";
eval(fetch(fileUrl, {}));

res.data = d;
setHomeResult(res);
