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
