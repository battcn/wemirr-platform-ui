import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
type WordArray = CryptoJS.lib.WordArray;

function createIuid(len: number, radix: number) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuidInfo: Array<string> = [];
  let i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) {
      uuidInfo[i] = chars[0 | (Math.random() * radix)];
    }
  } else {
    let r;
    uuidInfo[8] = uuidInfo[13] = uuidInfo[18] = uuidInfo[23] = '-';
    uuidInfo[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuidInfo[i]) {
        r = 0 | (Math.random() * 16);
        uuidInfo[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuidInfo.join('');
}

/**
 *
 * 创建一个aes key
 */
export const getKey = () => {
  return createIuid(16, 16);
};

/**
 * aes加密
 */
export function aesEncode(key: string, plaintext: string) {
  const aesSecurity: WordArray = CryptoJS.enc.Utf8.parse(key);
  const srcs = CryptoJS.enc.Utf8.parse(plaintext);
  const encrypted = CryptoJS.AES.encrypt(srcs, aesSecurity, { mode: CryptoJS.mode.ECB });
  return encrypted.toString();
}
/**
 * aes解密
 */
export function aesDecode(key, content) {
  const aesSecurity: WordArray = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.AES.decrypt(content, aesSecurity, { mode: CryptoJS.mode.ECB });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * aes加密
 */
export function rsaEncode(publicKey: string, plaintext: string) {
  const encrypt = new JSEncrypt({});
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(plaintext);
}
