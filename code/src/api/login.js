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

export function getInfo(token) {
  return request({
    url: '/authorize/me',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/authorize/login-out',
    method: 'get'
  })
}
