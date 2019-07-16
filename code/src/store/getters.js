import { getFromlocalStorage } from '@/store/utils/utils.js'

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  fullScreen: state => state.app.fullScreen,
  fullScreenBtnPath: state => state.app.fullScreenBtnPath,
  showFullScreenBtn: state => state.app.showFullScreenBtn,
  // 用户数据
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  userAllInfo: state => state.user.userAllInfo,
  // 基础资料相关数据
  permissionRoles: state => state.baseData.permissionRoles,
  organizationType: state => state.baseData.organizationType,
  // 项目配置相关数据
  projectList: state => getFromlocalStorage(state, 'projectConfig', 'projectList'),
  projectDetails: state => getFromlocalStorage(state, 'projectConfig', 'projectDetails'),
  addUnitAndRoomsData: state => state.projectConfig.addUnitAndRoomsData
  // 质量管理相关数据
}
export default getters
