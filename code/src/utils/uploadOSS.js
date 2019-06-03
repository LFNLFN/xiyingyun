import { getStsToken } from '@/api/public.js'
const OSS = require('ali-oss')

export function upload(file) {
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
      const imgName = 'aerialview_'
      const fileName = `${imgName}${Date.parse(new Date())}`
      client.put(fileName, file, { 'ContentType': 'image/jpeg' }).then(({ res, url, name }) => {
        // console.log('res', res)
        // console.log('url', url)
        // console.log('name', name)
        reslove({ res, url, name })
      }).catch((e) => {
        reject(e)
      })
    }).catch((e) => {
      reject(e)
    })
  })
}
