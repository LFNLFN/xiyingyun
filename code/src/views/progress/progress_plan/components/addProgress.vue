<template>
  <el-container class="global-container">
    <el-header>
      <h3 v-if="!isDisabled">
        新增进度计划
        <el-button type="primary" size="mini" @click="backHandle">返回</el-button>
      </h3>
      <h3 v-if="isDisabled">
        进度计划详情
        <el-button type="primary" size="mini" @click="backHandle">返回</el-button>
      </h3>
    </el-header>
    <el-main v-loading="isLoading">
      <el-form
        ref="progressForm"
        :model="formData"
        :rules="addProgressFormRules"
        :inline="true"
        label-position="left"
        label-width="150px"
        size="small"
        :disabled="isDisabled"
        class="add-check-form" >
        <el-header>
          <h4>
            基础信息
          </h4>
        </el-header>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item prop="projectId" label="项目名称">
              <el-select v-model="formData.projectId" size="small">
                <el-option
                  v-for="(item, idx) in projectDetailDatas"
                  :key="idx"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="progressName" label="计划名称">
              <el-input v-model="formData.progressName" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="unitId" label="楼栋">
              <el-select v-model="formData.unitId" size="small" multiple>
                <el-option
                  v-for="item in buildingDatas"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="process" label="工序项">
              <el-select v-model="formData.process" size="small">
                <el-option
                  v-for="(item, idx) in processItemDatas"
                  :key="idx"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="planCompleteDate" label="计划完成日期">
              <el-date-picker
                v-model="formData.planCompleteDate"
                value-format="yyyy-MM-dd"
                size="small"
                placeholder="请选择日期"
                class="date-select" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-header>
          <h4>
            责任人信息
          </h4>
        </el-header>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item prop="mainResponsor" label="计划第一责任人">
              <el-select v-model="formData.mainResponsor" size="small" filterable>
                <el-option
                  v-for="(item, idx) in responsorDatas"
                  :key="idx"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="relatedResponsor" label="相关责任人">
              <el-select v-model="formData.relatedResponsor" size="small" filterable multiple>
                <el-option
                  v-for="(item, idx) in responsorDatas"
                  :key="idx"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="!isDisabled" class="add-btn-wrap">
          <el-button size="small" @click="resetHandle">重置</el-button>
          <el-button type="primary" size="small" @click="addProgressHandle">新增</el-button>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import getProjectMixin from '@/mixins/getProjectStage'
import { getProgressItems, getResponsors, addProgressPlans, getPlanDetail } from '@/api/progress/index.js'
import { getBuliding } from '@/api/project_config/building'

export default {
  mixins: [getProjectMixin],
  data() {
    return {
      formData: {
        projectId: '',
        progressName: '',
        unitId: [],
        process: '',
        planCompleteDate: '',
        mainResponsor: '',
        relatedResponsor: []
      },
      processItemDatas: [], // 保存工序项数据
      buildingDatas: [], // 保存所有楼栋数据
      responsorDatas: [], // 保存责任人数据
      isLoading: false,
      addProgressFormRules: {
        projectId: [{ required: true, trigger: 'change', message: '请选择项目' }],
        progressName: [{ required: true, trigger: 'change', message: '请填写计划名称' }],
        unitId: [{ required: true, trigger: 'change', message: '请选择楼栋' }],
        process: [{ required: true, trigger: 'change', message: '请选择工序项' }],
        planCompleteDate: [{ type: 'date', required: true, trigger: 'change', message: '请选择计划完成日期' }],
        mainResponsor: [{ required: true, trigger: 'change', message: '请选择计划第一责任人' }],
        relatedResponsor: [{ required: true, trigger: 'change', message: '请选择相关责任人' }]
      },
      isDisabled: false
    }
  },
  watch: {
    'formData.projectId': function(newVal) {
      if (newVal !== '') {
        // 重置工序项项数据
        this.formData.process = ''
        this.$set(this, 'processItemDatas', [])
        // 重新加载楼栋数据
        this.formData.unitId = []
        this.$set(this, 'buildingDatas', [])
        // 重新加载责任人数据
        this.formData.mainResponsor = ''
        this.formData.relatedResponsor = []
        this.$set(this, 'responsorDatas', [])

        // 初始化数据
        this.isLoading = true
        this.initData().then(() => {
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
        })
      }
    }
  },
  created() {
    this.getProjectFunc().then((data) => {
      if (this.$route.params.projectId) {
        this.formData.projectId = this.$route.params.projectId
      } else if (this.$route.params.filterProjectId) {
        this.formData.projectId = this.$route.params.filterProjectId
      } else {
        this.formData.projectId = data[0].id
      }
    })
    if (this.$route.params.planId) {
      this.isDisabled = true

      getPlanDetail(this.$route.params.planId).then(resp => {
        const itemDatas = resp.result
        this.formData.progressName = itemDatas.name
        this.formData.unitId = itemDatas.unitIds
        this.formData.process = itemDatas.acceptItemId
        this.formData.planCompleteDate = itemDatas.planCompleteDate
        this.formData.mainResponsor = itemDatas.firstDutyPersonId
        this.formData.relatedResponsor = itemDatas.otherDutyPersonIds
      })
    }
  },
  methods: {
    backHandle() {
      this.$router.go(-1)
    },
    // 初始化数据操作
    async initData() {
      this.isLoading = true
      await this.getProgressItemsFunc()
      await this.getProgressBuildingFunc()
      await this.getResponsorFunc()
    },
    // 获取工序项数据
    getProgressItemsFunc() {
      const params = {
        'terms[0].column': 'type',
        'terms[0].value': 1
      }
      getProgressItems(params).then(resp => {
        const itemDatas = resp.result
        this.$set(this, 'processItemDatas', itemDatas)
      })
    },
    // 获取责任人数据
    getResponsorFunc() {
      getResponsors(this.formData.projectId).then(resp => {
        const itemDatas = resp.result
        this.$set(this, 'responsorDatas', itemDatas)
      })
    },
    // 获取楼栋数据
    getProgressBuildingFunc() {
      const projectId = this.formData.projectId
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
    },
    resetHandle() {
      this.formData = {
        projectId: this.formData.projectId,
        progressName: '',
        unitId: [],
        process: '',
        planCompleteDate: '',
        mainResponsor: '',
        relatedResponsor: []
      }
    },
    addProgressHandle() {
      const personEntityList = []
      personEntityList.push({
        type: 0,
        dutyOrgId: this.responsorDatas.find(item => item.id === this.formData.mainResponsor).orgId,
        dutyPersonId: this.responsorDatas.find(item => item.id === this.formData.mainResponsor).personId
      })
      console.log(this.formData.relatedResponsor)
      this.formData.relatedResponsor.forEach((id) => {
        personEntityList.push({
          type: 1,
          dutyOrgId: this.responsorDatas.find(item => item.id === id).orgId,
          dutyPersonId: this.responsorDatas.find(item => item.id === id).personId
        })
      })
      const progressData = {
        'projectId': this.formData.projectId, // 项目分期id
        'projectName': this.projectDetailDatas.find(item => item.id === this.formData.projectId).name, // 项目分期名称
        'acceptItemId': this.formData.process, // 工序项id
        'acceptItemName': this.processItemDatas.find(item => item.id === this.formData.process).name, // 工序项名称
        'unitIds': this.formData.unitId, // 楼栋id集合
        'planCompleteDate': this.formData.planCompleteDate, // 计划完成日期
        'name': this.formData.progressName, // 进度计划名称
        'personEntityList': personEntityList
      }
      addProgressPlans(progressData).then(resp => {
        this.$message({
          message: '提交成功',
          type: 'success'
        })
        this.$router.go(-1)
      }).catch(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
@import "src/styles/variables.scss";

.el-container {
  .el-header {
    background: #fff;
    .el-button {
      float: right;
    }
  }
  .el-main {
    background: #fff;
    position: relative;
    margin: 20px;
    .el-form {
      .el-form-item {
        .el-input, .el-date-editor {
          width: 300px;
        }
      }
    }
  }
  .add-btn-wrap {
      text-align: right;
      padding-right: 20px;
      padding-top: 10px;
  }
}
  .add-check-form {
  padding: 30px 20px 0 10px;
  &/deep/ .el-form-item {
    width: 100%;
    margin-top: 10px;
    .el-form-item__content {
      width: calc(100% - 130px);
    }
    .el-select, .el-cascader {
      width: 100%;
    }
  }
}
</style>
