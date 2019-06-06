const express = require('express')
const config = require('../config')
const path = require('path')

const app = express()

const host = config.dev.host
const port = config.dev.port
const distPath = path.join(__dirname, '../dist')
console.log('__dirname', __dirname)

// sendfile 配置
const options = {
  root: path.join(distPath),
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
}

// 返回首页
app.get('/', (req, res) => {
  res.sendfile('/index.html', options, (err) => {
    if (err) {
      console.log('err', err)
    }
  })
})

// 使用静态文件

app.use(express.static(distPath))

// 开启服务
app.listen(port, () => {
  console.log(`running in http://${host}:${port}`)
})
