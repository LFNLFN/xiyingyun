<template>
  <el-container>
    <el-main>
      <div class="header">
        <span>平面图列表</span>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addPlanHandle">添加</el-button>
      </div>
      <div class="select-wrap">
        <span>所属项目：</span>
        <el-select v-model="projectSelected" @change="getPlansFunc">
          <el-option
            v-for="(item, idx) in projectStageList"
            :key="idx"
            :value="item.id"
            :label="item.name" />
        </el-select>
      </div>
      <div v-loading="isPlanTableLoading" class="table-wrap">
        <el-table
          ref="planTable"
          :data="planTableData">
          <el-table-column prop="name" label="名称" align="center"/>
          <el-table-column :formatter="planTypeFormatter" prop="type" label="类型" align="center"/>
          <el-table-column width="250" label="操作" align="center">
            <template slot-scope="scope" width="180">
              <el-button size="mini" type="primary" @click="editPlanHandle(scope.row)">编辑</el-button>
              <el-button size="mini" type="primary" @click="delPlanHandle(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="pageTotal"
          :page-size="10"
          background
          layout="prev, pager, next, jumper"
          @current-change="pageChangeHandle"/>
      </div>
    </el-main>
    <addPlan
      v-show="isAddPlanShow"
      ref="addPlanCom"
      :is-add-plan-show.sync="isAddPlanShow"
      @refreshPlansData="getPlansFunc"/>
  </el-container>
</template>
<script>
import { mapActions } from 'vuex'
import { getPlans, delPlan } from '@/api/project_config/plan'
import planTypeMixin from '@/mixins/planTypeData'
import AddPlan from '@/views/project_config/plan/components/addPlan'
export default {
  components: { AddPlan },
  mixins: [planTypeMixin],
  data() {
    return {
      projectSelected: '',
      projectStageList: [],
      curProjectStage: {},
      planTableData: [],
      isAddPlanShow: false,
      isPlanTableLoading: false,
      pageTotal: 10
    }
  },
  // watch: {
  //   projectSelected: function(newVal) {
  //     if (newVal !== '') {
  //       this.curProjectStage = this.projectStageList.find(item => {
  //         return item.id === newVal
  //       })
  //       console.log('this.curProjectStage', this.curProjectStage)
  //     }
  //   }
  // },
  created() {
    // 获取项目列表
    this.getProjectDetailsVuex().then(resp => {
      console.log('resp', resp)
      const projectList = resp
      // 处理项目数据
      projectList.forEach(project => {
        const stageList = project.childrenWithDetail
        if (stageList && stageList.length > 0) {
          stageList.forEach(stage => {
            this.projectStageList.push({
              name: `${project.name}--${stage.name}`,
              id: stage.id,
              stageDetail: stage.estateProjectDetailEntity
            })
          })
        }
      })
      this.projectSelected = this.projectStageList[0].id
      this.getPlansFunc()
    })
  },
  methods: {
    ...mapActions([
      'getProjectDetailsVuex'
    ]),
    // 平面图表格的平面图类型数据格式化
    planTypeFormatter(row, column) {
      const curType = this.planTypeList.find(item => {
        return item.id === row.type
      })
      return curType.name
    },
    // 加载平面图
    getPlansFunc() {
      const projectId = this.projectSelected
      const params = {
        'terms[0].column': 'projectId',
        'terms[0].value': projectId,
        pageIndex: this.pageIndex,
        pageSize: 10
      }
      this.isPlanTableLoading = true
      getPlans(params).then(resp => {
        const result = resp.result
        this.pageTotal = result.total
        this.isPlanTableLoading = false
        this.$set(this, 'planTableData', result.data)
      }).then(() => {
        this.isPlanTableLoading = false
      })
    },
    // 添加平面图操作处理
    addPlanHandle() {
      const _obj = {
        projectsData: this.projectStageList,
        projectSelected: this.projectSelected
      }
      this.$refs.addPlanCom.resetDataProperty(_obj)
      this.isAddPlanShow = true
    },
    // 编辑平面图处理
    editPlanHandle(data) {
      const _obj = {
        editPlanData: data,
        projectsData: this.projectStageList,
        isAddOrEdit: 'edit'
      }
      this.$refs.addPlanCom.resetDataProperty(_obj)
      this.isAddPlanShow = true
    },
    // 删除平面图处理
    delPlanHandle(data) {
      console.log('delete plan data', data)
      this.$confirm(`确定删除平面图：${data.name}`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        if (action) {
          this.isPlanTableLoading = true
          delPlan(data.id).then(resp => {
            this.$message({
              message: '删除平面图成功',
              type: 'success'
            })
            this.getPlansFunc()
          })
        }
      })
    },
    // 换页处理
    pageChangeHandle(curPage) {
      this.pageIndex = curPage
      this.getPlansFunc()
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-container {
  .el-main {
    margin: 20px 15px;
    @include boxShadow-container;
    .header {
      @include gray-header;
    }
    .select-wrap {
      margin: 30px 0;
      padding-left: 50px;
      @include flex-layout(flex-start, center, null, null);
      .el-select {
        width: 300px;
      }
    }
    .table-wrap {
      padding: 20px;
      .el-table {
        border: 1px solid #EBEEF5;
        border-bottom: none;
        &/deep/.el-table__header th {
          background: #f8f8f9;
        }
      }
    }
    .el-pagination {
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>
