const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  checkItems: state => state.baseData.checkItems,
  permissionRoles: state => state.baseData.permissionRoles
}
export default getters
