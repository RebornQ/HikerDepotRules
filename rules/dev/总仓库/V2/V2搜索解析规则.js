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

(async () => {

// js:
var res = {};
var d = [];
var key = getUrl().split("#")[1];
// key = "影视";

if (key != null && key != "") {
    var regExp = new RegExp("[^]*"+key+"[^]*");
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
    };

    // 搜索解析思路：
    // 获取搜索链接中的**，然后循环遍历每一个仓库的规则，正则模糊匹配到不为空的就加入搜索结果
    var remoteAuthorList = [];
    try {
        eval("remoteAuthorList=" + fetch(settings.remoteAuthorListUrl, {}));
    } catch (e) {
    }
    Array.prototype.push.apply(settings.authorList, remoteAuthorList);
    if (settings.authorListBottom.length != 0) Array.prototype.push.apply(settings.authorList, settings.authorListBottom);

    // 空间换时间, n^2->2n？虽然Array.prototype.push.apply可能也是一个n？（体验上没感觉快多少，毕竟那个fetch太多了...）
    var mRemoteRules = [];
    // 1.拿到仓库
    for (var i = 0; i < settings.authorList.length; i++) {
        var authorList = settings.authorList[i];
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

        // var remoteUrl = remoteApiHome + encodeURIComponent(author) + "/" + remoteFilename;
        var remoteSource = fetch(remoteUrl, {});
        // setError(remoteUrl);
        try {
            eval("remoteSource=" + remoteSource);
            if (apiType == "0") {
                Array.prototype.push.apply(mRemoteRules, remoteSource);
            } else if (apiType == "1") {
                eval("var remoteRules=" + base64Decode(remoteSource.content));
            }
            if (remoteRules.data != null) {
                Array.prototype.push.apply(mRemoteRules, remoteRules.data);
            }
        }catch (e) {
        }
    }
    // 2.拿到单个仓库的规则列表
    if (mRemoteRules.length != 0) {
        // 换个锤子的二分法，一定要遍历所有数据的，这样顶多是O(1/2 n)，忽略常数还是O(n)，确实会快一丢丢，空间换时间的结果
        var left = 0;
        var right = mRemoteRules.length - 1;
        while (left <= right) {
            var remoteRuleLeft = mRemoteRules[left];
            var remoteRuleRight = mRemoteRules[right];
            if (regExp.test(remoteRuleLeft.title) == true) {
                d.push({
                    title: remoteRuleLeft.title,
                    url: "https://baidu.com#" + remoteRuleLeft.rule,
                    desc: remoteRuleLeft.author,
                    content: "云端版本：" + remoteRuleLeft.version
                });
            }
            if (regExp.test(remoteRuleRight.title) == true) {
                d.push({
                    title: remoteRuleRight.title,
                    url: "https://baidu.com#" + remoteRuleRight.rule,
                    desc: remoteRuleRight.author,
                    content: "云端版本：" + remoteRuleRight.version
                });
            }
            left++;
            right--;
        }
    }
}

// setError(JSON.stringify(d));
res.data = d;
setSearchResult(res);

})();
