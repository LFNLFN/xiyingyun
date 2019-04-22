import { param2Obj } from './utils'

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  code: 200,
  result: {
    attributes: {
      
    },
    permissions: [
      
    ],
    roles: [
      "admin"
    ],
    user: {
      id: "0",
      name: "zmb",
      type: "default",
      username: "admin"
    }
  },
  status: 200,
  timestamp: 1555663215156
}

export default {
  login: opt => {
    return {
      code: 200,
      message: '登陆成功',
      result: {
        userId: 0,
        token: 'admin-token'
      },
      status: 200,
      timestamp: 0
    }
  },
  getInfo: res => {
    const { token } = param2Obj(res.url)
    const info = users
    return info
  },
  logout: () => {
    return {
      code: 200,
      status: 200,
      data: 'success',
      message: '退出登录成功'
    }
  }
}
