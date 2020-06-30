/**
 * 这里列出了总仓库V2的所有开关，希望有大佬可以帮忙写个像猴子大佬那种网页端配置
 */

/**
 * 一级列表
 */

// 在这里添加仓库配置，可使本地添加的仓库置顶
var authorList = [
];
// 在这里添加仓库配置，可使本地添加的仓库置底
var authorListBottom = [
];
// 在这里添加随机头像，有默认值
var picUrlList = [
];

// 远程仓库配置Url，有默认值
var remoteAuthorListUrl = "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/authorList.json";
// 总仓库更新地址，有默认值
var remoteDepotRuleUrl = "https://gitee.com/qiusunshine233/hikerView/raw/master/ruleversion/depotRule_v2_release.json";

// 隐藏开关，不需要隐藏请设置为false；需要自行添加要隐藏的标记，格式为：["[标记名1]"，"[标记名2]"...]
var needHideRule = true;
var hideSymbols = [];

// 若需要永久显示开发文档，则取消注释
// var alwaysShowDevDoc = true;
// 若需要永久显示提示，则取消注释
// var alwaysShowTips = true;
// 若需要永久显示例子，则取消注释
// var alwaysShowEtc = true;


/**
 * 二级列表
 */
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

// 入戏开关？（滑稽）// 删除开关，不需要删除请设置为false; 需要自行添加要被删掉的标记，格式为：["标记1", "标记2"]
var needDelSymbol = true;
var symbols = [];
// 隐藏开关，不需要隐藏请设置为false；需要自行添加要隐藏的标记，格式为：["[标记名1]"，"[标记名2]"...]
// 可与一级列表的公用一个
var needHideRule = true;
var hideSymbols = [];

// 是否隐藏例子，需要隐藏请设置为true
var needHideEtc = false;
// 若需要永久关闭忽略本次更新请设置为true
var noIgnoreUpdate = false;

// 云端忽略更新列表，格式是JSON数组，请自己设置
var remoteIgnoreListUrl = "";
// 参考链接：https://gitee.com/Reborn_0/HikerRulesDepot/raw/master/ignoreUpdateRuleList.json

// 若需要永久显示二级列表的提示，则取消注释
// var alwaysShowSecondListTips = true;
