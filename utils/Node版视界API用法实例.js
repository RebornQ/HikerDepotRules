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
} = require("./api_haikuoshijie");

// 有异步操作比如请求则一定要有 async - await 搭配
// 转到视界的时候一定要把 async - await 删掉（搜索替换全部即可）
(async () => {
    // 写视界的规则
    var mUrl = "https://jiexi.380k.com/?url=https://v.qq.com/x/cover/0s8n49g3g1rv1oz/m002777wq26.html";
    var html = await fetch(mUrl, {});
    setError(html);
})();
