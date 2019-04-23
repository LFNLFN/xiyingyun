/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  if (str.length === 0) {
    return { valid: false, msg: '用户名不能为空' }
  }
  return { valid: true, msg: '' }
}

export function isvalidPassword(str) {
  if (str.length < 5) {
    return { valid: false, msg: '密码不能少于5位' }
  }
  return { valid: true, msg: '' }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
