import { getStsToken } from '@/api/public.js'
import { getRandomString } from '@/utils/public'
import md5 from 'js-md5'
const OSS = require('ali-oss')
const bucket = process.env.OSS_BUCKET
const endpoint = process.env.OSS_ENDPOINT

export function uploadImg(file, fileName) {
  return new Promise((reslove, reject) => {
    getStsToken().then(resp => {
      const data = resp.result
      const client = new OSS({
        accessKeyId: data.accessKeyId,
        accessKeySecret: data.accessKeySecret,
        bucket: bucket,
        endpoint: endpoint,
        stsToken: data.securityToken
      })
      const randomStr = getRandomString(8)
      const nameList = file.name.split('.')
      const fileType = nameList[nameList.length - 1]
      const __fileName = md5(`${fileName}_${Date.parse(new Date())}_${randomStr}`) + `.${fileType}`
      console.log('__fileName', __fileName)
      client.put(__fileName, file, { 'ContentType': 'image/jpeg' }).then(({ res, url, name }) => {
        url = __fileName
        reslove({ res, url, name })
      }).catch((e) => {
        reject(e)
      })
    }).catch((e) => {
      reject(e)
    })
  })
}

// export function getOssImgFullPath(src) {
//   if (src === '') {
//     return ''
//   } else {
//     return `http://${bucket}.${endpoint}/${src}`
//   }
// }
