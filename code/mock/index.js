import Mock from 'mockjs'
// import userAPI from './user'
import tableAPI from './table'

// Fix an issue with setting withCredentials = true, cross-domain request lost cookies
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// User
// Mock.mock(/\/authorize\/login/, 'post', userAPI.login)
// Mock.mock(/\/person\/custom\/me/, 'get', userAPI.getInfo)
// Mock.mock(/\/authorize\/logout/, 'get', userAPI.logout)

// Table
Mock.mock(/\/table\/list/, 'get', tableAPI.list)

export default Mock
