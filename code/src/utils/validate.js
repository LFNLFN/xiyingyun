export function isvalidUsername(rule, value, callback) {
  if (value === 0) {
    callback(new Error('用户名不能为空'))
  }
  callback()
}

export function isvalidPassword(rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    callback();
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function isvalidPhoneNum(rule, value, callback) {
  if (!new RegExp(/^1[3|4|5|6|7|8]\d{9}$/).test(value)) {
    callback(new Error('手机号格式不正确'))
  }
  callback()
}

export function isvalidEmail(rule, value, callback) {
  const regEmail = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
  if (regEmail.test(value)) {
    callback()
  }
  callback(new Error('邮箱格式不正确'))
}

// el-form之外验证
export function phoneNumValid(value) {
  if (!new RegExp(/^1[3|4|5|6|7|8]\d{9}$/).test(value)) {
    return false
  }
  return true
}

// 身份证验证
export function idCardValid(value) {
  if (!new RegExp(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/).test(value)) {
    return false
  }
  return true
}