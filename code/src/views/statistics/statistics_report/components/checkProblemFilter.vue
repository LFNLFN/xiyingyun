<template>
  <publicPopups :title-text="reportInfo.name" width="550px" v-on="$listeners" @formConfirm="confirmHandle" @closePopupsBox="closeBox">\
    <template slot="main-content">
      <el-form
        :inline="true"
        size="small">
        <el-form-item label="区域公司: ">
          <el-select v-model="filterFormData.orgId">
            <el-option
              v-for="item in areaCompanys"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择项目: ">
          <el-select
            v-model="filterFormData.projectId">
            <el-option
              v-for="item in companyProjects"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围: ">
          <el-date-picker
            v-model="timeSelected"
            type="daterange"
            size="small"
            clearable
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="date-picker"/>
        </el-form-item>
        <el-form-item label="检查类型: ">
          <el-select v-model="filterFormData.problemType">
            <el-option
              v-for="item in problemTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="整改单位: ">
          <el-select
            v-model="filterFormData.dutyOrgId"
            :loading="dutyOrgList.length === 0"
            :disabled="dutyOrgList.length === 0">
            <el-option
              v-for="item in dutyOrgList"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业分类: ">
          <el-select v-model="filterFormData.professionalId">
            <el-option
              v-for="item in professionDatas"
              :key="item.id"
              :label="item.describe"
              :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import getProjectMixin from '@/mixins/getProjectStage'
import problemTypeMixin from '@/mixins/problemTypeData'
import { emptyTarget } from '@/utils/public'
import { companyMixin, professionMixin, dutyOrgsMixin, confirmMixin } from '@/views/statistics/statistics_report/mixins/statisticsFilter'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  mixins: [
    confirmMixin,
    getProjectMixin,
    companyMixin,
    problemTypeMixin,
    professionMixin,
    dutyOrgsMixin
  ],
  props: {
    showBoxName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      reportInfo: {},
      filterFormData: {
        orgId: '',
        projectId: '',
        beginDate: '',
        endDate: '',
        problemType: '',
        dutyOrgId: '',
        professionalId: ''
      },
      timeSelected: [],
      companyProjects: []
    }
  },
  watch: {
    showBoxName: function(newVal) {
      const com = this.reportInfo.component
      if (com && com === newVal) {
        this.getOrganTree()
        this.getProjectFunc().then((projects) => {
          this.$set(this, 'companyProjects', projects)
        })
        this.getProfession()
      }
    },
    'filterFormData.orgId': function(newVal) {
      if (newVal !== '') {
        this.filterOrgProject(newVal)
      }
    },
    'filterFormData.projectId': function(newVal) {
      if (newVal !== '') {
        this.getdutyOrgs()
      }
    },
    timeSelected: function(newVal) {
      if (newVal && newVal.length > 0) {
        const timeList = newVal[1].split(' ')
        const time = `${timeList[0]} 23:59:59`
        this.filterFormData.beginDate = newVal[0]
        this.filterFormData.endDate = time
      }
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this.$set(this, key, obj[key])
      })
    },
    resetData() {
      this.areaCompanys = []
      this.companyProjects = []
      this.dutyOrgList = []
      this.professionDatas = []
      this.timeSelected = []
      this.$set(this, 'filterFormData', emptyTarget(this.filterFormData))
    },
    closeBox() {
      this.resetData()
      this.$emit('update:showBoxName', '')
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.el-form {
  padding: 30px 30px 0 20px;
  &/deep/.el-form-item {
    width: 100%;
    .el-form-item__label {
      width: 110px;
      text-align: right;
    }
    .el-form-item__content {
      width: calc(100% - 120px);
      .el-select, .el-date-editor {
        width: 100%;
      }
    }
  }
}
</style>
