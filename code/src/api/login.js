import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/authorize/login',
    method: 'post',
    data: JSON.stringify({
      username,
      password,
      'token_type': 'jwt'
    })
  })
}

export function getUserInfo() {
  return request({
    url: '/person/custom/me',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/authorize/login-out',
    method: 'get'
  })
}
