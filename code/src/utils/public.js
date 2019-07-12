export function emptyTarget(data) {
  if (Array.isArray(data)) {
    return data.splice(0, data.length)
  } else if (typeof data === 'object') {
    const keys = Object.keys(data)
    const _obj = {}
    keys.forEach(key => {
      const cur = data[key]
      if (Array.isArray(cur)) {
        _obj[key] = []
      } else if (typeof cur === 'object') {
        _obj[key] = emptyTarget(cur)
      } else if (typeof cur === 'string') {
        _obj[key] = ''
      } else if (typeof cur === 'number') {
        _obj[key] = null
      }
    })
    return _obj
  }
}

export function searchArrByKeyVal(arr, key, val) {
  let backData
  for (const item of arr) {
    if (typeof item === 'object') {
      if (item[key] === val) {
        backData = item
        break
      } else {
        const _keys = Object.keys(item)
        for (const k of _keys) {
          if (Array.isArray(item[k])) {
            const _data = searchArrByKeyVal(item[k], key, val)
            if (_data) {
              backData = _data
              break
            }
          }
        }
      }
    }
  }
  return backData
}

export function isEmpty(target) {
  if (typeof target === 'object') {
    const _keys = Object.keys(target)
    return _keys.length === 0
  } else if (Array.isArray(target)) {
    return target.length === 0
  }
}

export function getRandomString(len) {
  let _backStr = ''
  const soruce = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const rdmIndex = (str) => {
    return Math.random() * str.length
  }
  while (_backStr.length < len) {
    _backStr += soruce.charAt(rdmIndex(soruce))
  }
  return _backStr
}

// 返回 xxxx-xx-xx xx:xx:xx 格式的日期
export function dateFormatter() {
  const date = new Date()
  const year = date.getFullYear()
  const mon = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minu = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  return `${year}-${mon}-${day} ${hour}:${minu}:${second}`
}
