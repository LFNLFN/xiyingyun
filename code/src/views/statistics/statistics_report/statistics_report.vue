<template>
  <el-container class="global-container">
    <el-main>
      <el-table
        :data="formattedMaterialTableData"
        :cell-class-name="setTableCellStyle"
        :header-cell-class-name="setTableCellStyle"
        class="no-border-gary-head"
      >
        <el-table-column prop="name" label="报表名称"/>/>
        <el-table-column width="120px" label="操作" align="center">
          <template slot-scope="scope">
            <el-button class="no-border" size="mini" @click="showFilterBox(scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <checkProblemFilter
      v-show="showBoxName === 'checkProblemFilterCom'"
      ref="checkProblemFilterCom"
      :show-box-name.sync="showBoxName"
    />
    <processAcceptFilter
      v-show="showBoxName === 'processAcceptFilterCom'"
      ref="processAcceptFilterCom"
      :show-box-name.sync="showBoxName"
    />
    <measureFilter
      v-show="showBoxName === 'measureFilterCom'"
      ref="measureFilterCom"
      :show-box-name.sync="showBoxName"
    />
    <projectInitFilter
      v-show="showBoxName === 'projectInitFilterCom'"
      ref="projectInitFilterCom"
      :show-box-name.sync="showBoxName"
    />
    <memberWorkFilter
      v-show="showBoxName === 'memberWorkFilterCom'"
      ref="memberWorkFilterCom"
      :show-box-name.sync="showBoxName"
    />
    <onlineStatisticsFilter
      v-show="showBoxName === 'onlineStatisticsFilterCom'"
      ref="onlineStatisticsFilterCom"
      :show-box-name.sync="showBoxName"
    />
    <memberWorkCountFilter
      v-show="showBoxName === 'memberWorkCountFilterCom'"
      ref="memberWorkCountFilterCom"
      :show-box-name.sync="showBoxName"
    />
    <materialAcceptFilter
      v-show="showBoxName === 'materialAcceptFilterCom'"
      ref="materialAcceptFilterCom"
      :show-box-name.sync="showBoxName"
    />
  </el-container>
</template>
<script>
import CheckProblemFilter from "@/views/statistics/statistics_report/components/checkProblemFilter";
import ProcessAcceptFilter from "@/views/statistics/statistics_report/components/processAcceptFilter";
import MeasureFilter from "@/views/statistics/statistics_report/components/measureFilter";
import ProjectInitFilter from "@/views/statistics/statistics_report/components/projectInitFilter";
import OnlineStatisticsFilter from "@/views/statistics/statistics_report/components/onlineStatisticsFilter";
import MemberWorkCountFilter from "@/views/statistics/statistics_report/components/memberWorkCountFilter";
import MemberWorkFilter from "@/views/statistics/statistics_report/components/memberWorkFilter";
import MaterialAcceptFilter from "@/views/statistics/statistics_report/components/materialAcceptFilter";
import permissionOfPage from "@/mixins/permissionOfPage";
export default {
  mixins: [permissionOfPage],
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
    const domainName = "https://report-dev.gzxiyingyun.com";
    return {
      filterFormData: {
        date: "",
        selected: ""
      },
      fullFilterForm: false,
      materialTableData: [
        {
          // name: "检查问题明细表",
          name: "日常检查明细表",
          component: "checkProblemFilterCom",
          url: `${domainName}/ReportServer?reportlet=ProblemCheckDetail.cpt`,
          visible: "problem_check_detail_get"
        },
        {
          name: "实测实量明细表",
          component: "measureFilterCom",
          url: `${domainName}/ReportServer?reportlet=MeasuredQuantityDetail.cpt`,
          visible: "measured_quantity_detail_get"
        },
        {
          name: "工序验收明细表",
          component: "processAcceptFilterCom",
          url: `${domainName}/ReportServer?reportlet=ProcessAcceptDetail.cpt`,
          visible: "process_accept_detail_get"
        },
        {
          name: "项目初始化统计表",
          component: "projectInitFilterCom",
          url: `${domainName}/ReportServer?reportlet=ProjectInitSituation.cpt`,
          visible: "project_init_get"
        },
        {
          // name: "日常质量、安全检查上线情况统计表",
          name: "日常检查使用情况统计表",
          component: "onlineStatisticsFilterCom",
          url: `${domainName}/ReportServer?reportlet=ProblemCheckOnlineSituation.cpt`,
          visible: "problem_check_used_get"
        },
        {
          name: "实测实量使用情况统计表",
          component: "onlineStatisticsFilterCom",
          url: `${domainName}/ReportServer?reportlet=MeasuredQuantityOnline.cpt`,
          visible: "measured_quantity_used_get"
        },
        {
          name: "工序验收使用情况统计表",
          component: "onlineStatisticsFilterCom",
          url: `${domainName}/ReportServer?reportlet=ProcessAcceptOnline.cpt`,
          visible: "process_accept_used_get"
        },
        {
          name: "人员工作量统计表",
          component: "memberWorkCountFilterCom",
          url: `${domainName}/ReportServer?reportlet=PersonWorkload.cpt`,
          visible: "person_workload_get"
        },
        {
          name: "人员工作量报表(区域平台)",
          component: "memberWorkFilterCom",
          url: `${domainName}/ReportServer?reportlet=PersonWorkloadArea.cpt`,
          visible: "person_area_workload_get"
        },
        {
          name: "材料进场统计表",
          component: "materialAcceptFilterCom",
          url: `${domainName}/ReportServer?reportlet=MetarialAcceptStatistics.cpt`,
          visible: "metarial_accept_get"
        },
        {
          name: "材料进场明细表",
          component: "materialAcceptFilterCom",
          url: `${domainName}/ReportServer?reportlet=MetarialAcceptDetail.cpt`,
          visible: "metarial_accept_detail_get"
        }
      ],
      showBoxName: "",
      formattedMaterialTableData: []
    };
  },
  methods: {
    setTableCellStyle() {
      return "nowrap-row";
    },
    showFilterBox(data) {
      const com = data.component;
      const _obj = {
        reportInfo: data
      };
      this.$refs[com].resetDataProperty(_obj);
      this.showBoxName = com;
    }
  },
  created() {
    this.formattedMaterialTableData = this.materialTableData.filter(
      item => this.pagePermission[item.visible] === true
    );
  }
};
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
