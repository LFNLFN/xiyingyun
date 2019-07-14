import Vue from 'vue'
import { getDictionaryItem } from '@/api/dictionary'
import { getProjectTree, getProjectDetail } from '@/api/project_config/project'
import { getParticipant } from '@/api/project_config/participant'

// 保存项目配置部分需要的数据
const projectConfig = {
  state: {
    /* --------- 项目管理相关数据 ------------ */
    projectList: [], // 保存项目列表
    projectDetails: [], // 保存包含项目分期、标段的数据
    projectStatus: [], // 保存项目状态数据
    deliveryType: [], // 保存交付类型数据
    constructionType: [], // 保存施工阶段数据
    districtData: [], // 保存城市数据
    /* --------- 楼栋管理相关数据 ----------- */
    addUnitAndRoomsData: {
      allUnitData: [],
      unitFormData: {},
      roomsData: [],
      status: 'addBuild',
      isNextAddUnit: false,
      isBuildRooms: true
    }, // 保存添加单元以及房间所需的数据
    /* --------- 参建方管理相关数据 ------------ */
    projectParticipants: []
  },
  mutations: {
    // 保存项目数据
    SET_PROJECT_LIST: (state, list) => {
      Vue.set(state, 'projectList', list)
      try {
        localStorage.setItem('projectList', JSON.stringify(list))
      } catch (e) {
        console.log('set localStorage error: ', e)
      }
    },
    // 保存项目详情数据
    SET_PROJECT_DETAILS: (state, list) => {
      Vue.set(state, 'projectDetails', list)
      try {
        localStorage.setItem('projectDetails', JSON.stringify(list))
      } catch (e) {
        console.log('set localStorage error: ', e)
      }
    },
    // 保存数据字典的数据
    SET_DICTIONARY_ITEM: (state, _obj) => {
      Vue.set(state, _obj.key, _obj.data)
    },
    // 设置楼栋数据
    SET_UNITROOM_DATA: (state, _obj) => {
      const keys = Object.keys(_obj)
      keys.forEach(key => {
        Vue.set(state.addUnitAndRoomsData, key, _obj[key])
      })
      console.log('state.addUnitAndRoomsData', state.addUnitAndRoomsData)
    },
    // 重置楼栋房间信息
    RESET_UNITROOM_DATA: (state) => {
      const _obj = {
        allUnitData: [],
        unitFormData: {},
        roomsData: [],
        status: 'addBuild',
        isNextAddUnit: false,
        isAddRooms: true
      }
      Vue.set(state, 'addUnitAndRoomsData', _obj)
    },
    // 保存参建房数据
    SET_PROJECT_PARTICIPANTS: (state, _list) => {
      Vue.set(state, 'projectParticipants', _list)
    }
  },
  actions: {
    // 从数据字典中加载项目管理需要的数据，并保存
    getDictionaryItemFunc({ commit, state }, _obj) {
      const key = _obj.dataKey
      const params = _obj.params
      return new Promise((reslove, reject) => {
        if (state[key] === undefined || state[key].length === 0) {
          getDictionaryItem(params).then(resp => {
            const data = resp.result
            if (state[key]) {
              commit('SET_DICTIONARY_ITEM', { key, data })
            }
            reslove(data)
          }).catch((err) => {
            reject(err)
          })
        } else {
          reslove(state[key])
        }
      })
    },
    // 加载项目列表并保存
    getProjectListVuex({ commit, state }, _obj = { isGet: false }) {
      return new Promise((reslove, reject) => {
        let localProjectList
        try {
          localProjectList = JSON.parse(localStorage.projectList)
        } catch (e) {
          localProjectList = []
        }
        if ((state.projectList.length === 0 && localProjectList.length === 0) || _obj.isGet) {
          getProjectTree().then(resp => {
            const _list = resp.result
            reslove(_list)
            commit('SET_PROJECT_LIST', _list)
          }).catch((rej) => {
            reject(rej)
          })
        } else {
          state.projectList.length > 0 ? reslove(state.projectList) : reslove(localProjectList)
        }
      })
    },
    // 加载项目详情列表
    getProjectDetailsVuex({ commit, state }, _obj = { isGet: false }) {
      return new Promise((reslove, reject) => {
        let localprojectDetails
        try {
          localprojectDetails = JSON.parse(localStorage.projectDetails)
        } catch (e) {
          localprojectDetails = []
        }
        if ((state.projectDetails.length === 0 && localprojectDetails.length === 0) || _obj.isGet) {
          getProjectDetail().then(resp => {
            const _list = resp.result
            reslove(_list)
            commit('SET_PROJECT_DETAILS', _list)
          }).catch((rej) => {
            reject(rej)
          })
        } else {
          state.projectDetails.length > 0 ? reslove(state.projectDetails) : reslove(localprojectDetails)
        }
      })
    },
    // 加载项目参建方数据
    getProjectParticipants({ commit, state }, _obj = { isGet: false }) {
      return new Promise((reslove, reject) => {
        if (state.projectParticipants.length === 0 || _obj.isGet) {
          const projectId = _obj.projectId
          getParticipant(projectId).then(resp => {
            const _list = resp.result
            reslove(_list)
            commit('SET_PROJECT_PARTICIPANTS', _list)
          }).catch((rej) => {
            reject(rej)
          })
        } else {
          reslove(state.projectParticipants)
        }
      })
    }
  }
}
export default projectConfig
