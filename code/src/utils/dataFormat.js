export function getPersonNameStr(nameArr) {
  let nameStr = ''
  nameArr.forEach((e, i, s) => {
    nameStr += e.personName + ','
  })
  return nameStr.slice(0, -1)
}

// 下划线转换驼峰
export function toHump(name) {
  return name.replace(/\_(\w)/g, function(all, letter) {
    return letter.toUpperCase();
  });
}
// 驼峰转换下划线
export function toLine(name) {
  return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}
