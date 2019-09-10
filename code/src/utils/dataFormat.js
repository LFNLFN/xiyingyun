export function getPersonNameStr(nameArr) {
  let nameStr = ''
  nameArr.forEach((e, i, s) => {
    nameStr += e.personName + ','
  })
  return nameStr.slice(0, -1)
}
