import { getStsToken } from '@/api/public.js'
const OSS = require('ali-oss')

export function uploadImg(file, fileName) {
  return new Promise((reslove, reject) => {
    getStsToken().then(resp => {
      const data = resp.result
      const client = new OSS({
        accessKeyId: data.accessKeyId,
        accessKeySecret: data.accessKeySecret,
        bucket: 'estate-dev',
        endpoint: 'oss-cn-shenzhen.aliyuncs.com',
        stsToken: data.securityToken
      })
      const __fileName = `${fileName}_${Date.parse(new Date())}`
      client.put(__fileName, file, { 'ContentType': 'image/jpeg' }).then(({ res, url, name }) => {
        reslove({ res, url, name })
      }).catch((e) => {
        reject(e)
      })
    }).catch((e) => {
      reject(e)
    })
  })
}
