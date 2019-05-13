export function isvalidUsername(rule, value, callback) {
  if (value === 0) {
    callback(new Error('用户名不能为空'))
  }
  callback()
}

export function isvalidPassword(rule, value, callback) {
  if (value.length < 5) {
    callback(new Error('密码不能少于5位'))
  }
  callback()
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function isvalidPhoneNum(rule, value, callback) {
  if (value.length < 11) {
    callback(new Error('手机号格式不正确'))
  }
  callback()
}
