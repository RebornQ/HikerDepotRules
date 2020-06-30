const jsdom = require("jsdom");
const jquery = require('jquery');
const {JSDOM} = jsdom;
var globalMap = new Map();
// 海阔视界的API
const getUrl = function () {
    // 视界规则中获取当前网页连接的API
    return "http://baidu.com#Reborn";
};
const getRule = function () {
    // 视界规则中获取当前规则的API
    var ruleEtc = {
        title: "测试",
        author: "测试者"
    };
    return JSON.stringify(ruleEtc);
};
const getResCode = function () {
    // 视界规则中获取当前网页源码的API
};
const getVar = function (key) {
    return globalMap.get(key);
};
const putVar = function ({key, value}) {
    globalMap.set(key, value);
};
const writeFile = function (fileUrl, content) {
    // 视界规则中写文件的API
};
const setHomeResult = function (res) {
    // 视界规则中设置首页的API
};
const setError = function (str) {
    // 视界规则中打印错误信息的API
    print(str);
};
const setSearchResult = function (res) {
    // 视界规则中设置搜索引擎的API
};
const getCryptoJS = function () {
    // 视界规则中获取CryptoJS的API
    const CryptoJS = require('crypto-js');
    return CryptoJS;
};
const CryptoJS = getCryptoJS();

const base64Encode = function (input) {
    const wordArray = CryptoJS.enc.Utf8.parse(input);
    return CryptoJS.enc.Base64.stringify(wordArray);
};
const base64Decode = function (input) {
    const parsedWordArray = CryptoJS.enc.Base64.parse(input);
    return CryptoJS.enc.Utf8.stringify(parsedWordArray);
    // return parsedWordArray.toString(CryptoJS.enc.Utf8);
};

const parseDom = function (html, rule) {
    // 视界规则中解析HTML的API
    /**
     * 三个简单实用的用于 DOM 操作的 jQuery 方法：
     * text() - 设置或返回所选元素的文本内容
     * html() - 设置或返回所选元素的内容（包括 HTML 标记）
     * val() - 设置或返回表单字段的值
     *
     * attr 和 prop 的区别介绍：
     * 对于 HTML 元素本身就带有的固有属性，在处理时，使用 prop 方法。
     * 对于 HTML 元素我们自己自定义的 DOM 属性，在处理时，使用 attr 方法。
     *
     * prop()函数的结果:
     * 1.如果有相应的属性，返回指定属性值。
     * 2.如果没有相应的属性，返回值是空字符串。
     *
     * attr()函数的结果:
     * 1.如果有相应的属性，返回指定属性值。
     * 2.如果没有相应的属性，返回值是 undefined。
     * */
    var dom = new JSDOM(html);
    var window = dom.window; // 获取 window 对象
    var document = dom.window.document; // 获取 document 对象
    var $ = jquery(window); // 实例化jquery需要传入window对象
    // console.log(document.body.innerHTML);
    // console.log($('body>script').html());

    const rules = rule.split("&&");
    let ruleBuffer = "";
    for (let i = 0; i < rules.length - 1; i++) {
        const ruleTemp = rules[i];
        // if (ruleTemp === "Html" || ruleTemp === "Text" || ruleTemp === "src") break;
        ruleBuffer += (ruleTemp + ">");
    }
    ruleBuffer = ruleBuffer.substring(0, ruleBuffer.length - 1);
    let result = "";
    switch (rules[rules.length - 1]) {
        case "Html":
            result = $(ruleBuffer).html();
            break;
        case "Text":
            result = $(ruleBuffer).text();
            break;
        /*case "src":
            result = $(ruleBuffer).prop("src");
            break;*/
        default:
            result = $(ruleBuffer).prop("src");
    }
    // print(result);
    return result;
};

const print = function (message, ...optionalParams) {
    var msg = message;
    for (let i = 0; i < optionalParams.length; i++) {
        if (i !== 0) {
            msg += " ";
        }
        msg += optionalParams[i];
    }
    console.log(msg);
};
const nodeFetch = require("node-fetch");
const HttpsProxyAgent = require('https-proxy-agent');
let ip = '127.0.0.1';
let port = '8888';
// 解决当前https报self signed certificate in certificate chain问题。
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const fetch = async function (url, options = {}) {
    let response;
    let data;
    if (options.withHeaders === true) {
        response = await nodeFetch(url, {
            headers: options.headers,
            body: options.body,
            method: options.method,
            timeout: 10000,      //ms
            // agent: new HttpsProxyAgent("http://" + ip + ":" + port) //<==注意是 `http://`
        }).then((response) => {
            // print(response.headers.get("set-cookie"));
            let headerJson = headerToJson(response.headers);
            return response.text().then((text) => {
                data = {
                    body: text,
                    headers: headerJson
                };
                data = JSON.stringify(data);
                // print(data);
                return text;
            });
        });
    } else {
        response = await nodeFetch(url, {
            headers: options.headers,
            body: options.body,
            method: options.method,
            timeout: 10000,      //ms
            // agent: new HttpsProxyAgent("http://" + ip + ":" + port) //<==注意是 `http://`
        });
        data = await response.text();
    }

    // const html = await response.text();
    // print(html);
    return data;
};

function headerToJson(headers) {
    // 正确！
    // for(let header of headers.entries()) {
    //     print(header);
    // }
    let headerJson = {};
    headers.forEach((value, key) => {
        let valueArray = [];
        valueArray.push(value);
        headerJson[key] = valueArray
    });
    // 错误！！！
    // for (let header in headers) {
    //     print(header);
    // }
    print(headerJson);
    return headerJson;
}

module.exports = {
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
};
/**
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
} = require("../../utils/api_haikuoshijie");

 // 英文&& ==> 中文＆＆＆＆
 * */
