// 导入 crypto-js 包
const CryptoJS = require('crypto-js');
/**
 * CipherOption, 加密的一些选项:
 *   mode: 加密模式, 可取值(CBC, CFB, CTR, CTRGladman, OFB, ECB), 都在 CryptoJS.mode 对象下
 *   padding: 填充方式, 可取值(Pkcs7, AnsiX923, Iso10126, Iso97971, ZeroPadding, NoPadding), 都在 CryptoJS.pad 对象下
 *   iv: 偏移量, mode === ECB 时, 不需要 iv
 * 返回的是一个加密对象
 */
const reg = {
    matchDomain: function (str) {
        const url = str;
        const reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
        const result = url.match(reg);
        return result[0];
    }
};
let AES = {
    encrypt: function (src, key, cipherOption) {
// const encryptedStr = encrypted.ciphertext.toString();
// console.log('加密结果: ', encryptedStr);
// const encryptedStr = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
//     console.log('加密结果: ', encrypted.toString());
        return CryptoJS.AES.encrypt(src, key, cipherOption);
    },
    decrypt: function (str, key, cipherOption) {
        // console.log('解密结果: ', CryptoJS.enc.Utf8.stringify(decrypt).toString());
        return CryptoJS.AES.decrypt(str, key, cipherOption);
    }
};
const AES_ECB = AES.ECB = {};
// AES/ECB/ZeroPadding
AES_ECB.ZeroPadding = {
    encrypt: function (src, key) {
        return AES.encrypt(src, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.ZeroPadding
        });
    },
    decrypt: function (str, key) {
        return AES.decrypt(str, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.ZeroPadding
        });
    }
};
// exports.AES = AES;
// exports.reg = reg;
module.exports = {
    AES,
    reg,
};
