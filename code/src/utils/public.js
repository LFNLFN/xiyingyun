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
