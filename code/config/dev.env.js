'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://api-dev.gzxiyingyun.com"',
  OSS_BUCKET: '"estate-dev"',
  OSS_ENDPOINT: '"oss-cn-shenzhen.aliyuncs.com"'
})
