import { getFromlocalStorage } from '@/store/utils/utils.js'

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 用户数据
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  // 基础资料相关数据
  checkItems: state => state.baseData.checkItems,
  permissionRoles: state => state.baseData.permissionRoles,
  organizationType: state => state.baseData.organizationType,
  // 项目配置相关数据
  projectList: state => getFromlocalStorage(state, 'projectConfig', 'projectList'),
  projectDetails: state => getFromlocalStorage(state, 'projectConfig', 'projectDetails'),
  addUnitAndRoomsData: state => state.projectConfig.addUnitAndRoomsData
}
export default getters
