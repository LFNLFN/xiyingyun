const getLocalStroageData = function(key, BackData) {
  try {
    BackData = JSON.parse(localStorage.getItem(key))
  } catch (e) {
    console.log('set localStorage error: ', e)
  }
  return BackData
}

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  checkItems: state => state.baseData.checkItems,
  permissionRoles: state => state.baseData.permissionRoles,
  organizationType: state => state.baseData.organizationType,
  projectList: state => {
    let _list = []
    if (state.projectConfig.projectList.length > 0) {
      _list = state.projectConfig.projectList
    } else {
      _list = getLocalStroageData('projectList', _list)
    }
    return _list
  },
  projectDetails: state => {
    let _list
    if (state.projectConfig.projectDetails.length > 0) {
      _list = JSON.parse(localStorage.projectDetails)
    } else {
      _list = getLocalStroageData('projectDetails', _list)
    }
    return _list
  }
}
export default getters
