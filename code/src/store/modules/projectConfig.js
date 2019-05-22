// 保存项目配置部分需要的数据
const projectConfig = {
  state: {
    projectList: []
  },
  mutations: {
    SET_PROJECT_LIST: (state, list) => {
      state.projectList = list
      try {
        localStorage.setItem('projectList', JSON.stringify(list))
      } catch (e) {
        console.log('set localStorage error: ', e)
      }
    }
  },
  actions: {}
}
export default projectConfig
