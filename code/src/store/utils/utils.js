/* ----- vuex utils -------- */

export function getFromlocalStorage(state, moduleName, key) {
  let _list = []
  const _data = state[moduleName][key]
  if (_data.length > 0) {
    _list = _data
  } else {
    try {
      _list = JSON.parse(localStorage.getItem(key))
    } catch (e) {
      console.log('set localStorage error: ', e)
    }
  }
  return _list
}
