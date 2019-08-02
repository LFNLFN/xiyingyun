<template>
  <el-container class="global-container">
    <el-main>
      <el-table
        :data="materialTableData"
        :cell-class-name="setTableCellStyle"
        :header-cell-class-name="setTableCellStyle"
        class="no-border-gary-head" >
        <el-table-column prop="name" label="报表名称" />/>
        <el-table-column width="120px" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              class="no-border"
              size="mini"
              @click="showFilterBox(scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <checkProblemFilter
      v-show="showBoxName === 'checkProblemFilterCom'"
      ref="checkProblemFilterCom"
      :show-box-name.sync="showBoxName" />
    <processAcceptFilter
      v-show="showBoxName === 'processAcceptFilterCom'"
      ref="processAcceptFilterCom"
      :show-box-name.sync="showBoxName" />
    <measureFilter
      v-show="showBoxName === 'measureFilterCom'"
      ref="measureFilterCom"
      :show-box-name.sync="showBoxName" />
    <projectInitFilter
      v-show="showBoxName === 'projectInitFilterCom'"
      ref="projectInitFilterCom"
      :show-box-name.sync="showBoxName" />
    <memberWorkFilter
      v-show="showBoxName === 'memberWorkFilterCom'"
      ref="memberWorkFilterCom"
      :show-box-name.sync="showBoxName" />
    <onlineStatisticsFilter
      v-show="showBoxName === 'onlineStatisticsFilterCom'"
      ref="onlineStatisticsFilterCom"
      :show-box-name.sync="showBoxName" />
    <memberWorkCountFilter
      v-show="showBoxName === 'memberWorkCountFilterCom'"
      ref="memberWorkCountFilterCom"
      :show-box-name.sync="showBoxName" />
    <materialAcceptFilter
      v-show="showBoxName === 'materialAcceptFilterCom'"
      ref="materialAcceptFilterCom"
      :show-box-name.sync="showBoxName" />
  </el-container>
</template>
<script>
import CheckProblemFilter from '@/views/statistics/statistics_report/components/checkProblemFilter'
import ProcessAcceptFilter from '@/views/statistics/statistics_report/components/processAcceptFilter'
import MeasureFilter from '@/views/statistics/statistics_report/components/measureFilter'
import ProjectInitFilter from '@/views/statistics/statistics_report/components/projectInitFilter'
import OnlineStatisticsFilter from '@/views/statistics/statistics_report/components/onlineStatisticsFilter'
import MemberWorkCountFilter from '@/views/statistics/statistics_report/components/memberWorkCountFilter'
import MemberWorkFilter from '@/views/statistics/statistics_report/components/memberWorkFilter'
import MaterialAcceptFilter from '@/views/statistics/statistics_report/components/materialAcceptFilter'
export default {
  components: {
    CheckProblemFilter,
    ProcessAcceptFilter,
    MeasureFilter,
    ProjectInitFilter,
    OnlineStatisticsFilter,
    MemberWorkCountFilter,
    MemberWorkFilter,
    MaterialAcceptFilter
  },
  data() {
    const domainName = 'https://report-dev.gzxiyingyun.com'
    return {
      filterFormData: {
        date: '',
        selected: ''
      },
      fullFilterForm: false,
      materialTableData: [
        {
          name: '检查问题明细表',
          component: 'checkProblemFilterCom',
          url: `${domainName}/ReportServer?reportlet=ProblemCheckDetail.cpt`
        },
        {
          name: '工序验收明细表',
          component: 'processAcceptFilterCom',
          url: `${domainName}/ReportServer?reportlet=ProcessAcceptDetail.cpt`
        },
        {
          name: '实测实量明细表',
          component: 'measureFilterCom',
          url: `${domainName}/ReportServer?reportlet=MeasuredQuantityDetail.cpt`
        },
        {
          name: '项目初始化统计表',
          component: 'projectInitFilterCom',
          url: `${domainName}/ReportServer?reportlet=ProjectInitSituation.cpt`
        },
        {
          name: '日常质量、安全检查上线情况统计表',
          component: 'onlineStatisticsFilterCom',
          url: `${domainName}/ReportServer?reportlet=ProblemCheckOnlineSituation.cpt`
        },
        {
          name: '实测实量上线情况统计表',
          component: 'onlineStatisticsFilterCom',
          url: `${domainName}/ReportServer?reportlet=MeasuredQuantityOnline.cpt`
        },
        {
          name: '工序验收上线情况统计表',
          component: 'onlineStatisticsFilterCom',
          url: `${domainName}/ReportServer?reportlet=ProcessAcceptOnline.cpt`
        },
        {
          name: '人员工作量统计表',
          component: 'memberWorkCountFilterCom',
          url: `${domainName}/ReportServer?reportlet=PersonWorkload.cpt`
        },
        {
          name: '人员工作量报表(区域平台)',
          component: 'memberWorkFilterCom',
          url: `${domainName}/ReportServer?reportlet=PersonWorkloadArea.cpt`
        },
        {
          name: '材料进场统计表',
          component: 'materialAcceptFilterCom',
          url: `${domainName}/ReportServer?reportlet=MetarialAcceptStatistics.cpt`
        },
        {
          name: '材料进场明细表',
          component: 'materialAcceptFilterCom',
          url: `${domainName}/ReportServer?reportlet=MetarialAcceptDetail.cpt`
        }
      ],
      showBoxName: ''
    }
  },
  methods: {
    setTableCellStyle() {
      return 'nowrap-row'
    },
    showFilterBox(data) {
      const com = data.component
      const _obj = {
        reportInfo: data
      }
      this.$refs[com].resetDataProperty(_obj)
      this.showBoxName = com
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
    .el-table {
      margin-top: 5px;
      &/deep/.el-table_1_column_1 .cell {
        padding-left: 20px;
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
