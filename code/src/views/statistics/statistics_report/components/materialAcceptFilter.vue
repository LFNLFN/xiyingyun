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
        <el-form-item label="材料分类: ">
          <el-cascader
            v-model="filterFormData.typeId"
            :clearabled="true"
            :options="materialTypeData"
            :props="materialTypeProp"
            :show-all-levels="false"
            size="small" />
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import getProjectMixin from '@/mixins/getProjectStage'
import { emptyTarget } from '@/utils/public'
import { companyMixin, materialTypeMixin, confirmMixin } from '@/views/statistics/statistics_report/mixins/statisticsFilter'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  mixins: [
    confirmMixin,
    getProjectMixin,
    companyMixin,
    materialTypeMixin
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
        typeId: ''
      },
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
        this.getMaterialTypeList()
      }
    },
    'filterFormData.orgId': function(newVal) {
      if (newVal !== '') {
        this.filterOrgProject(newVal)
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
      this.materialTypeData = []
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
      .el-select, .el-cascader {
        width: 100%;
      }
    }
  }
}
</style>
