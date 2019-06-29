<template>
  <div class="tab-content">
    <el-container>
      <el-header>
        <h3>检查问题统计</h3>
        <div>
          <el-button class="no-border">全部</el-button>
          <el-button class="no-border">本年</el-button>
          <el-button class="no-border">本季</el-button>
          <el-button class="no-border">本月</el-button>
          <el-date-picker
            v-model="getProblemDate"
            type="daterange"
            size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="date-picker" />
        </div>
      </el-header>
      <el-main>
        <p class="count-text">问题总数：86</p>
        <div class="chart-warp">
          <div class="left-part">
            <!-- <el-row>
              <el-col :span="12">
                <EChartsTool :chart-option-data="chartOptionData" />
              </el-col>
              <el-col :span="12">
                <EChartsTool :chart-option-data="chartOptionData" />
              </el-col>
            </el-row> -->
            <problemCountPieChart />
          </div>
          <div class="right-part">
            <companyProblemChart />
          </div>
        </div>
      </el-main>
    </el-container>
    <el-container>
      <el-header>
        <h3>检查问题类型分析</h3>
        <div>
          <el-button class="no-border">全部</el-button>
          <el-button class="no-border">本年</el-button>
          <el-button class="no-border">本季</el-button>
          <el-button class="no-border">本月</el-button>
          <el-date-picker
            v-model="getProblemDate"
            type="daterange"
            size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="date-picker" />
        </div>
      </el-header>
      <el-main>
        <div class="chart-warp analysis-chart-warp">
          <ProblemAnalysisPieChart />
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import problemCountPieChart from '@/views/project_portal/components/problemCountPieChart'
import ProblemAnalysisPieChart from '@/views/project_portal/components/problemAnalysisPieChart'
import CompanyProblemChart from '@/views/project_portal/components/companyProblemChart'
export default {
  components: { problemCountPieChart, ProblemAnalysisPieChart, CompanyProblemChart },
  data() {
    return {
      getProblemDate: '',
      pieChartData: [
        {
          name: '待整改',
          value: 18
        },
        {
          name: '待销项',
          value: 0
        },
        {
          name: '已销项',
          value: 102
        }
      ],
      chartOptionData: {}
    }
  },
  mounted() {
    this.chartOptionData = {
      title: {
        text: '质量风险',
        top: 'middle',
        left: 'middle',
        textAlign: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        bottom: 0,
        padding: [5, 5, 5, 5],
        data: this.pieChartData,
        itemHeight: 10,
        itemWidth: 10,
        textStyle: {
          fontSize: 12
        }
      },
      series: {
        name: 'item',
        type: 'pie',
        radius: ['50%', '70%'],
        label: {
          show: false
        },
        data: this.pieChartData
      }
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.tab-content {
  padding: 0px;
  .el-container {
    margin-bottom: 15px;
    border-radius: 8px;
    background: #fff;
    .el-header {
      border-bottom: 1px solid #ccc;
      @include flex-layout(space-between, center, null, null);
      &/deep/ .date-picker {
        width: 220px;
      }
    }
    .el-main {
      .count-text {
        font-weight: bold;
      }
      .chart-warp {
        width: 100%;
        height: 250px;
        @include flex-layout(flex-start, center, null, null);
        .left-part, .right-part {
          width: 50%;
          height: 100%;
          .el-row, .el-col {
            height: 100%;
          }
          .pie-chart-container {
            height: 100%;
          }
        }
      }
      .analysis-chart-warp {
        height: 350px;
      }
    }
  }
}
</style>
