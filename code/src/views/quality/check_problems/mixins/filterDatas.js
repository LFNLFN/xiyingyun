import { Message } from 'element-ui'
import { getBuliding } from '@/api/project_config/building'
import { getParticipant } from '@/api/project_config/participant'
import { getProblemType, getCheckItems, getCreatedOrgan, getCreatedMembers } from '@/api/quality/checkProblems'

export default {
  data() {
    return {
      // 保存检查项数据的porps
      cascaderProps: {
        emitPath: false,
        value: 'id',
        label: 'name',
        children: 'children'
      },
      loadingcheckItems: false
    }
  },
  methods: {
    // 获取楼栋数据
    getBuildingDataFunc(visible) {
      if (visible || this.buildingDatas.length === 0) {
        const projectId = this.filterFormData.projectId
        const curProject = this.projectDetailDatas.find(item => item.id === projectId)
        const projectIdList = Array.of(projectId)
        if (curProject.section.length > 0) {
          curProject.section.forEach(item => {
            projectIdList.push(item.id)
          })
        }
        const params = {
          'terms[0].column': 'projectId$IN',
          'terms[0].value': projectIdList.join()
        }
        getBuliding(params).then(resp => {
          const buildingList = resp.result
          this.$set(this, 'buildingDatas', buildingList)
        })
      }
    },
    // 获取问题分类
    getProblemTypeFunc(visible) {
      if (!visible || this.problemTypeList.length > 0) return
      const params = {
        'terms[0].column': 'parentId',
        'terms[0].value': '-1'
      }
      getProblemType(params).then(resp => {
        const _data = resp.result
        this.$set(this, 'problemTypeList', _data)
      })
    },
    // 选择问题分类后马上加载检查项
    problemTypeCheckedHandle(val) {
      this.loadingcheckItems = true
      getCheckItems(val).then(resp => {
        const _data = resp.result[0].children
        this.$set(this, 'checkItems', _data)
        this.loadingcheckItems = false
      }).catch(() => {
        this.loadingcheckItems = false
      })
    },
    // 获取检查项
    getCheckItemsFunc(visible) {
      if (!visible || this.checkItems.length > 0) return
      if (this.filterFormData.problemType === null) {
        Message({
          type: 'warning',
          message: '请先选择问题分类'
        })
        return
      }
      if (this.loadingcheckItems) {
        Message({
          type: 'warning',
          message: '数据加载中...'
        })
        return
      }
      const type = this.filterFormData.problemType
      getCheckItems(type).then(resp => {
        const _data = resp.result[0].children
        this.$set(this, 'checkItems', _data)
        this.loadingcheckItems = false
      }).catch(() => {
        this.loadingcheckItems = false
      })
    },
    // 获取整改单位
    getParticipantFunc(visible) {
      if (!visible || this.amendOrganizations.length > 0) return
      const projectId = this.filterFormData.projectId
      getParticipant(projectId).then(resp => {
        this.$set(this, 'amendOrganizations', resp.result)
      })
    },
    // 获取创建单位
    getCreatedOrganFunc(visible) {
      if (!visible || this.createdOrganizations.length > 0) return
      const projectId = this.filterFormData.projectId
      getCreatedOrgan(projectId).then(resp => {
        this.$set(this, 'createdOrganizations', resp.result)
      })
    },
    getCreatedMembersFunc(visible) {
      if (!visible || this.createdMembers.length > 0) return
      const projectId = this.filterFormData.projectId
      getCreatedMembers(projectId).then(resp => {
        this.$set(this, 'createdMembers', resp.result)
      })
    }
  }
}
