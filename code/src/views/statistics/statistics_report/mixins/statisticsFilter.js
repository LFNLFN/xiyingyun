import { mapActions } from 'vuex'
import { getBuliding } from '@/api/project_config/building'
import { getDictionaryItem } from '@/api/dictionary'
import { getParticipant } from '@/api/project_config/participant'
import { getdutyOrganization } from '@/api/statistics/statisticsREport'
import { getMaterialType } from '@/api/material/material_acceptance'

// 获取区域公司
export const companyMixin = {
  data() {
    return {
      areaCompanys: []
    }
  },
  methods: {
    ...mapActions({
      getOrganization: 'getOrganizationData'
    }),
    getOrganTree() {
      const type = this.$store.getters.organizationType.organization
      this.getOrganization({ type, reGet: true }).then(resp => {
        resp.forEach(item => {
          if ('children' in item) {
            this.areaCompanys.push(...item.children)
          }
        })
      })
    },
    // 根据已选择的公司过滤出该公司的项目
    filterOrgProject(newVal) {
      if (newVal !== '') {
        const orgIdList = Array.of(newVal)
        const orgData = this.areaCompanys.find(item => {
          return item.id === newVal
        })
        if (orgData.children) {
          orgData.children.forEach(org => {
            orgIdList.push(org.id)
          })
        }
        const _projects = this.projectDetailDatas.filter(project => {
          return orgIdList.includes(project.parent.orgId)
        })
        this.$set(this, 'companyProjects', _projects)
      }
    }
  }
}

// 获取专业分类
export const professionMixin = {
  data() {
    return {
      professionDatas: []
    }
  },
  methods: {
    getProfession() {
      const params = {
        'terms[0].column': 'dictId',
        'terms[0].value': 'professionType'
      }
      getDictionaryItem(params).then(resp => {
        this.$set(this, 'professionDatas', resp.result)
      })
    }
  }
}

// 获取企业类型
export const orgTypeMixin = {
  data() {
    return {
      orgTypeDatas: []
    }
  },
  methods: {
    getOrgTypeData() {
      const params = {
        'terms[0].column': 'dictId',
        'terms[0].value': 'supplier_type'
      }
      getDictionaryItem(params).then(resp => {
        this.$set(this, 'orgTypeDatas', resp.result)
      })
    }
  }
}

// 获取参建方
export const participantMixin = {
  data() {
    return {
      participantData: []
    }
  },
  methods: {
    getParticipantData() {
      const projectId = this.filterFormData.projectId
      getParticipant(projectId).then(resp => {
        this.$set(this, 'participantData', resp.result)
      })
    }
  }
}

// 获取整改单位
export const dutyOrgsMixin = {
  data() {
    return {
      dutyOrgList: []
    }
  },
  methods: {
    getdutyOrgs() {
      const projectId = this.filterFormData.projectId
      getdutyOrganization(projectId).then(resp => {
        this.$set(this, 'dutyOrgList', resp.result)
      })
    }
  }
}

// 获取项目楼栋数据
export const buildingMixin = {
  data() {
    return {
      buildingDatas: []
    }
  },
  methods: {
    getBuildingDatas() {
      const projectId = this.filterFormData.projectId
      const curProject = this.companyProjects.find(item => item.id === projectId)
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
  }
}

// 点击确认后处理
export const confirmMixin = {
  methods: {
    confirmHandle() {
      const _keys = Object.keys(this.filterFormData)
      const toLink = this.reportInfo.url
      let params = ''
      _keys.forEach((key, idx) => {
        const _value = this.filterFormData[key]
        if (idx === 0 && !toLink.match(/\?/)) {
          params += `?${key}=${_value}`
        } else {
          params += `&${key}=${_value}`
        }
      })
      this.resetData()
      this.$emit('update:showBoxName', '')
      window.open(toLink + params)
    }
  }
}

// 获取材料类型
export const materialTypeMixin = {
  data() {
    return {
      materialTypeData: [], // 保存材料类型数据
      materialTypeProp: {
        label: 'name',
        value: 'id',
        children: 'children',
        emitPath: false
      } // 保存材料类型级联选择器的配置数据
    }
  },
  methods: {
    getMaterialTypeList() {
      getMaterialType().then(resp => {
        this.$set(this, 'materialTypeData', resp.result)
      })
    }
  }
}
