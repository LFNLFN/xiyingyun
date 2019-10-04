<template>
  <!-- 进度上报页面 -->
  <el-container class="global-container">
    <el-main v-loading="isLoading">
      <el-form
        ref="filterForm"
        :model="filterFormData"
        :inline="true"
        class="filter-form">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-select v-model="filterFormData.projectId" size="small">
                <el-option
                  v-for="(item, idx) in projectDetailDatas"
                  :key="idx"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="settingId" label="工序项">
              <el-select v-model="filterFormData.settingId" size="small">
                <el-option
                  v-for="item in processItemDatas"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="fullFilterForm">
            <el-col :span="8">
              <el-form-item prop="unitIds" label="楼栋">
                <el-select v-model="filterFormData.unitIds" size="small" multiple>
                  <el-option
                    v-for="item in buildingDatas"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="status" label="状态">
                <el-select v-model="filterFormData.status" size="small">
                  <el-option
                    v-for="(item, idx) in progressReportStatus"
                    :key="idx"
                    :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="reportDate" label="上报日期">
                <el-date-picker
                  v-model="filterFormData.reportDate"
                  type="daterange"
                  size="small"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  class="date-select" />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="8">
            <el-form-item class="operate-wrap">
              <el-button type="primary" size="mini" @click="getProgressReportsFunc">查询</el-button>
              <el-button size="mini" @click="resetForm">重置</el-button>
              <el-button
                size="mini"
                class="no-border form-ctrl-btn"
                @click="fullFilterForm = !fullFilterForm">
                {{ fullFilterForm ? '收缩' : '展开' }}
                <span
                  :class="{'el-icon-arrow-up': fullFilterForm, 'el-icon-arrow-down': !fullFilterForm}"
                  class="btn-icon" />
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="progressTableData"
        size="small"
        class="no-border-gary-head"
        @row-click="showProgressDetail" >
        <el-table-column prop="status" label="状态" >
          <template slot-scope="scope">
            <span :style="{ 'background': acceptStatusColors[Number(scope.row.status)] }" class="status-icon" />
            <span>{{ scope.row.statusName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="项目名称" />
        <el-table-column
          prop="partName"
          label="部位" />
        <el-table-column
          prop="settingName"
          label="工序项" />
        <el-table-column
          prop="reportPersonName"
          label="上报人"
          header-align="center"
          align="center" />
        <el-table-column
          prop="reportDate"
          label="上报日期"
          header-align="center"
          align="center" />
      </el-table>
      <el-pagination
        :total="pageTotal"
        :page-size="10"
        :page-sizes="[10, 20, 30, 40]"
        :current-page="pageIndex"
        background
        layout="total, prev, pager, next, sizes, jumper"
        class="pager-wrap"
        @current-change="pageChangeHandle"
        @size-change="pageSizeChangeHandle"/>
    </el-main>
    <reportDetail
      v-show="isReportDetailShow"
      ref="reportDetailCom"
      :is-report-detail-show.sync="isReportDetailShow" />
  </el-container>
</template>
<script>
import personTypeData from '@/mixins/personTypeData'
import getProjectMixin from '@/mixins/getProjectStage'
import progressReportStatus from '@/mixins/progressReportStatus'
import { getProgressReports, getProgressItems } from '@/api/progress/index.js'
import { getBuliding } from '@/api/project_config/building'
import { redStatus, greenStatus, orangeStatus, grayStatus } from '@/styles/variables.scss'
import ReportDetail from '@/views/progress/progress_report/components/reportDetail'

export default {
  components: { ReportDetail },
  mixins: [getProjectMixin, personTypeData, progressReportStatus],
  data() {
    return {
      fullFilterForm: false,
      filterFormData: {
        projectId: '',
        settingId: '',
        unitIds: [],
        status: '',
        reportDate: ''
      },
      buildingDatas: [], // 保存所有楼栋
      processItemDatas: [], // 保存所有工序项
      progressTableData: [], // 保存加载的进度上报数据
      pageIndex: 0,
      pageSize: 10,
      pageTotal: 10,
      isLoading: false,
      acceptStatusColors: [
        redStatus,
        orangeStatus,
        greenStatus,
        grayStatus
      ], // 保存状态颜色数据
      isReportDetailShow: false
    }
  },
  watch: {
    'filterFormData.projectId': async function(newVal) {
      if (newVal !== '') {
        // 重置工序项项数据
        this.filterFormData.settingId = ''
        this.$set(this, 'processItemDatas', [])
        // 重新加载楼栋数据
        this.filterFormData.unitId = []
        this.$set(this, 'buildingDatas', [])

        // 初始化数据
        this.isLoading = true
        await this.getProgressItemsFunc()
        await this.getProgressBuildingFunc()
        this.isLoading = false
      }
    },
    'isReportDetailShow': async function(newVal) {
      if (newVal === false) {
        await this.getProgressReportsFunc()
      }
    }
  },
  created() {
    this.getProjectFunc().then((data) => {
      // this.filterFormData.projectId = data[0].id
      // 初始化数据
      this.initData().then(() => {
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    })
  },
  methods: {
    // 初始化数据操作
    async initData() {
      this.isLoading = true
      await this.getProgressReportsFunc()
      await this.getProgressItemsFunc()
      await this.getProgressBuildingFunc()
    },
    // 获取进度汇报数据
    getProgressReportsFunc() {
      const message = this.$message({
        message: '正在加载进度汇报数据...',
        duration: 0
      })
      const params = {}
      params['pageSize'] = this.pageSize
      params['pageIndex'] = this.pageIndex - 1

      params['projectId'] = this.filterFormData.projectId
      params['settingId'] = this.filterFormData.settingId
      params['unitIds'] = this.filterFormData.unitIds.join(',')
      params['status'] = this.filterFormData.status
      params['beginReportDate'] = this.filterFormData.reportDate[0]
      params['endReportDate'] = this.filterFormData.reportDate[1]

      getProgressReports(params).then(resp => {
        console.log('getProgressReports resp', resp)
        const _data = resp.result
        this.$set(this, 'progressTableData', _data.data)
        this.pageTotal = _data.total
        this.pageIndex = _data.pageIndex
        message.close()
      })
    },
    // 获取楼栋数据
    getProgressBuildingFunc() {
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
    // 展示进度上报详情处理
    showProgressDetail(row) {
      this.$refs['reportDetailCom'].resetDataProperty(row.id)
      this.isReportDetailShow = true
    },
    pageChangeHandle(page) {
      this.pageIndex = page
      this.getProgressReportsFunc()
    },
    pageSizeChangeHandle(val) {
      this.pageSize = val
      this.getProgressReportsFunc()
    },
    resetForm() {
      this.filterFormData.projectId = ''
      this.$refs.filterForm.resetFields()
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.el-container {
  padding: 20px;
  .el-main {
    background: #fff;
    .filter-form {
      &/deep/ .el-form-item {
        width: 100%;
        white-space: nowrap;
        margin: 20px 0 0 0;
        .el-form-item__label {
          width: 110px;
          text-align: right;
        }
        .el-form-item__content {
          width: calc(100% - 110px);
        }
        .el-select, .date-select {
          width: 100%;
        }
        &.operate-wrap {
          padding-left: 50px;
          .form-ctrl-btn {
            font-size: 14px;
          }
        }
      }
    }
    .add-btn-wrap {
      padding: 20px 10px;
    }
    .el-table {
      margin-top: 35px;
      &/deep/ .el-table__body tr {
        cursor: pointer;
      }
      &/deep/ .status-icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        vertical-align: text-top;
        border-radius: 15px;
        margin-right: 3px;
      }
      & /deep/.nowrap-row {
        .cell {
          white-space: nowrap;
        }
      }
    }
    .pager-wrap {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
