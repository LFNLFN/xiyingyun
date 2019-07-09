import CryptoJS from 'crypto-js'
import md5 from 'js-md5'

const getKey = function(keyWord) {
  return CryptoJS.enc.Utf8.parse(md5(String(keyWord)))
}

const getIv = function(keyWord) {
  return CryptoJS.enc.Utf8.parse(keyWord)
}

// 加密方法
export function Encrypt(data, keyWord) {
  const key = getKey(keyWord)
  const iv = getIv(keyWord)
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

// 解密方法
export function Decrypt(word, keyWord) {
  const key = getKey(keyWord)
  const iv = getIv(keyWord)
  const decryptedStr = CryptoJS.AES.decrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decryptedStr.toString(CryptoJS.enc.Utf8)
}
