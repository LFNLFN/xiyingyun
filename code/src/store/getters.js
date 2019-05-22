const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  checkItems: state => state.baseData.checkItems,
  permissionRoles: state => state.baseData.permissionRoles,
  projectList: state => {
    let _list
    try {
      _list = JSON.parse(localStorage.projectList)
    } catch (e) {
      _list = state.projectConfig.projectList
      console.log('set localStorage error: ', e)
    }
    return _list
  }
}
export default getters
