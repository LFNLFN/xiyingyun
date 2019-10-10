<template>
  <!-- 项目管理页面 -->
  <el-container class="project-container">
    <el-header class="search-wrap" height="no">
      <div class="header">
        <span class="el-icon-tickets">筛选查询</span>
      </div>
      <el-form ref="searchForm" :inline="true" :model="searchForm" size="small" class="search-form">
        <el-form-item prop="projectSelected" label="项目名称">
          <el-select v-model="searchForm.projectSelected" filterable placeholder="请选择项目">
            <el-option
              v-for="(item, idx) in projectSeletorList"
              :key="idx"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="checkTime" label="查询时间:">
          <el-date-picker
            v-model="searchForm.checkTime"
            type="daterange"
            size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            class="date-select"
          />
        </el-form-item>
        <el-button type="primary" size="small" class="search-btn" @click="searchHandle">查询</el-button>
      </el-form>
    </el-header>
    <el-main class="main-wrap">
      <div class="table-wrap">
        <el-table
          v-loading="projectTableLoading"
          ref="projectTable"
          :data="attLogDetailTableData"
          row-key="id"
          border
          show-overflow-tooltip
          class="project-table el-table_tree">
          <el-table-column prop="userName" min-width="100" label="姓名" align="left" fixed="left"/>
          <el-table-column prop="orgName" min-width="200" label="部门" align="left"/>
          <el-table-column prop="userId" min-width="200" label="工号" align="left"/>
          <el-table-column prop="positionName" width="180" label="职位" align="left"/>
          <el-table-column v-for="(item, idx) in attLogHeader" :key="idx+''+item.dayOfWeek+''+item.dayOfMonth" min-width="100">
            <template slot="header" slot-scope="scope">
              <div class="header-week" v-if="item.dayOfWeek===6 || item.dayOfWeek===7" style="color: green">{{weekDayList[item.dayOfWeek]}}</div>
              <div class="header-date" v-if="item.dayOfWeek===6 || item.dayOfWeek===7" style="color: green">{{item.dayOfMonth}}</div>
              <div class="header-week" v-if="item.dayOfWeek!==6 && item.dayOfWeek!==7">{{weekDayList[item.dayOfWeek]}}</div>
              <div class="header-date" v-if="item.dayOfWeek!==6 && item.dayOfWeek!==7">{{item.dayOfMonth}}</div>
            </template>
            <template slot-scope="scope">
              <span>{{attLogDetailTableData[scope.$index].workDateLog[idx].logDetail}}</span>
            </template>
          </el-table-column>
          
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import {
  getProjectSelectorList,
  getAttLogResultList
} from '@/api/att_log/att_log'
import { formatDay, afterNowDay } from '@/utils/formatDate.js'
// old code
import { mapActions } from 'vuex'
import { delProject } from '@/api/project_config/project'
export default {
  data() {
    return {
      projectSeletorList: [],
      detailListParam: {
        checkDateFrom: afterNowDay(-7),
        checkDateTo: formatDay(new Date()),
        projectId: ''
      },
      attLogDetailTableData: [],
      attLogHeader: [],
      // old code
      searchForm: {
        projectSelected: '',
        checkTime: [afterNowDay(-7), formatDay(new Date())],
      },
      projectTableLoading: false,
      weekDayList: ['0', '一', '二', '三', '四', '五', '六', '日']
    }
  },
  watch: {
    'searchForm.projectSelected': function(newVal) {
      this.detailListParam.projectId = newVal
    },
    'searchForm.checkTime': function(newVal) {
      this.detailListParam.checkDateFrom = newVal[0]
      this.detailListParam.checkDateTo = newVal[1]
    }
  },
  mounted() {
    // 获取项目下拉列表内容
    this.initPage()
  },
  methods: {
    // 获取项目名称下拉列表
    getProjectSelectorListFunc() {
      getProjectSelectorList().then(resp => {
        this.projectSeletorList = resp.result
        this.searchForm.projectSelected = this.projectSeletorList[0].id
        this.detailListParam.projectId = this.projectSeletorList[0].id
      })
    },
    // 顶部搜索栏的查询功能（// 获取考勤日志详情）
    searchHandle() {
      getAttLogResultList(this.detailListParam).then(resp => {
        this.attLogDetailTableData = resp.result
        if (this.attLogDetailTableData.length > 0) {
          this.attLogHeader = this.attLogDetailTableData[0].workDateLog
        }
        this.$refs.projectTable.doLayout()
      }).catch(err => {
        console.log(err)
      })
    },
    // 初始化页面-解决一开始projectid为空的问题
    initPage() {
      getProjectSelectorList().then(resp => {
        this.projectSeletorList = resp.result
        this.searchForm.projectSelected = this.projectSeletorList[0].id
        this.detailListParam.projectId = this.projectSeletorList[0].id
        this.searchHandle()
      })
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.project-container {
  padding: 20px;
  .header {
    @include gray-header;
  }
  .search-wrap {
    @include boxShadow-container;
    .search-form {
      padding: 20px 40px;
      .el-form-item {
        margin: 0 15px 0 10px;
      }
    }
  }
  .main-wrap {
    margin-top: 30px;
    @include boxShadow-container;
    .table-wrap {
      padding: 20px;
      .project-table {
        .el-dropdown {
          margin-left: 10px;
        }
      }
    }
  }
  .header-week {
    width: 100%;
    text-align: left;
  }
  .header-date {
    width: 100%;
    text-align: right;
    margin-top: -15px;
    margin-bottom: -15px;
  }
}
</style>
