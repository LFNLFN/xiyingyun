<template>
  <div class="tab-content">
    <el-container>
      <el-header>
        <h3>检查问题统计</h3>
        <div>
          <el-radio-group v-model="problemCountTimeType" size="small">
            <el-radio-button :label="1">全部</el-radio-button>
            <el-radio-button :label="2">本年</el-radio-button>
            <el-radio-button :label="8">本季</el-radio-button>
            <el-radio-button :label="3">上月</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="getProblemCountDate"
            type="daterange"
            size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            class="date-picker"
            @change="changeCountTime" />
        </div>
      </el-header>
      <el-main>
        <div class="chart-warp">
          <div v-loading="problemPieLoading" class="left-part">
            <problemCountPieChart :problem-count-data="problemCountData" />
          </div>
          <div v-loading="problemBarLoading" class="right-part">
            <companyProblemChart
              :org-problem-data="orgProblemData" />
          </div>
        </div>
      </el-main>
    </el-container>
    <el-container>
      <el-header>
        <h3>检查问题类型分析</h3>
        <div>
          <el-radio-group
            v-model="problemTypeTimeType"
            size="small">
            <el-radio-button :label="1">全部</el-radio-button>
            <el-radio-button :label="2">本年</el-radio-button>
            <el-radio-button :label="8">本季</el-radio-button>
            <el-radio-button :label="3">上月</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="getProblemTypeDate"
            type="daterange"
            size="small"
            clearable
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            class="date-picker"
            @change="changeTypeTime" />
        </div>
      </el-header>
      <el-main>
        <div v-loading="problemTypeLoading" class="chart-warp analysis-chart-warp">
          <ProblemAnalysisPieChart
            :problem-type-data="problemTypeData" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import problemCountPieChart from '@/views/project_portal/components/problemCountPieChart'
import ProblemAnalysisPieChart from '@/views/project_portal/components/problemAnalysisPieChart'
import CompanyProblemChart from '@/views/project_portal/components/companyProblemChart'
import { NumberAddZero, isEmpty } from '@/utils/public'
import { getProblemStatistics, getOrgProblemStatistics, getTypeStatistics } from '@/api/project_portal/index'
export default {
  components: { problemCountPieChart, ProblemAnalysisPieChart, CompanyProblemChart },
  data() {
    return {
      problemCountTimeType: 1, // 加载问题数据的时间类型 1:累计 2:本年 3:上月 8:本季度
      problemTypeTimeType: 1,
      getProblemCountDate: [], // 保存获取问题总数的起始日期
      getProblemTypeDate: [], // 保存获取问题类型的起始日期
      projectData: {}, // 保存项目数据
      problemCountData: {}, // 保存检查问题总数数据
      orgProblemData: [], // 保存承建商的检查问题数据
      problemTypeData: {}, // 保存问题类型分析数据
      problemPieLoading: true,
      problemBarLoading: true,
      problemTypeLoading: true
    }
  },
  watch: {
    projectData: function(newVal) {
      if ('projectId' in newVal) {
        this.getAllProblemFunc()
        this.getOrgProblemFunc()
        this.getProblemTypeFunc()
      }
    },
    problemCountTimeType: function(newVal) {
      const timeList = this.getTimeType(newVal)
      this.$set(this, 'getProblemCountDate', timeList)
      this.getAllProblemFunc()
      this.getOrgProblemFunc()
    },
    problemTypeTimeType: function(newVal) {
      const timeList = this.getTimeType(newVal)
      this.$set(this, 'getProblemTypeDate', timeList)
      this.getProblemTypeFunc()
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this.$set(this, key, obj[key])
      })
    },
    setTimeParams(timeList) {
      let params = {}
      if (timeList.length > 0) {
        params = {
          'beginDate': timeList[0],
          'endDate': timeList[1]
        }
      }
      return params
    },
    // 获取问题总数
    getAllProblemFunc(params = {}) {
      const projectId = this.projectData.id
      const timeType = this.problemCountTimeType
      this.problemPieLoading = true
      getProblemStatistics(projectId, timeType, params).then(resp => {
        const data = resp.result
        if (isEmpty(data)) {
          this.$message({
            message: '暂无数据...',
            type: 'warning',
            duration: 2000,
            showClose: true
          })
        }
        this.problemCountData = data
        this.problemPieLoading = false
      }).catch(() => {
        this.problemPieLoading = false
      })
    },
    // 获取承建单位检查问题统计
    getOrgProblemFunc(params = {}) {
      const projectId = this.projectData.id
      const timeType = this.problemCountTimeType
      this.problemBarLoading = true
      getOrgProblemStatistics(projectId, timeType, params).then(resp => {
        const data = resp.result
        if (isEmpty(data)) {
          this.$message({
            message: '暂无数据...',
            type: 'warning',
            duration: 2000,
            showClose: true
          })
        }
        this.orgProblemData = data
        this.problemBarLoading = false
      }).catch(() => {
        this.problemBarLoading = false
      })
    },
    // 获取问题类型分析
    getProblemTypeFunc(params = {}) {
      const projectId = this.projectData.id
      const timeType = this.problemTypeTimeType
      this.problemTypeLoading = true
      getTypeStatistics(projectId, timeType, params).then(resp => {
        const data = resp.result
        if (isEmpty(data)) {
          this.$message({
            message: '暂无数据...',
            type: 'warning',
            duration: 2000,
            showClose: true
          })
        }
        this.problemTypeData = data
        this.problemTypeLoading = false
      }).catch(() => {
        this.problemTypeLoading = false
      })
    },
    // 选取时间后加载问题总数和承建商问题统计
    changeCountTime(val) {
      if (!val) {
        this.getProblemCountDate = []
        if (this.problemCountTimeType !== 1) {
          this.problemCountTimeType = 1
          return
        }
      }
      const params = this.setTimeParams(this.getProblemCountDate)
      this.getAllProblemFunc(params)
      this.getOrgProblemFunc(params)
    },
    // 选取时间后获取问题类型分析数据
    changeTypeTime(val) {
      if (!val) {
        this.getProblemTypeDate = []
        if (this.problemTypeTimeType !== 1) {
          this.problemTypeTimeType = 1
          return
        }
      }
      const params = this.setTimeParams(this.getProblemTypeDate)
      this.getProblemTypeFunc(params)
    },
    // 根据时间类型设置时间值
    getTimeType(type) {
      const date = new Date()
      const year = date.getFullYear()
      const mon = NumberAddZero(date.getMonth() === 0 ? 12 : date.getMonth())
      const monLastDate = NumberAddZero(new Date(year, mon, 0).getDate())
      const cusSeason = Math.floor((mon % 3 === 0 ? (mon / 3) : (mon / 3 + 1)))
      const seasonList = [
        [`${year}-01-01`, `${year}-03-31`],
        [`${year}-04-01`, `${year}-06-30`],
        [`${year}-07-01`, `${year}-09-30`],
        [`${year}-10-01`, `${year}-12-31`]
      ]
      let backDate = []
      switch (type) {
        case 1:
          backDate = []
          break
        case 2:
          backDate = [`${year}-01-01`, `${year}-12-01`]
          break
        case 3:
          backDate = [`${year}-${mon}-01`, `${year}-${mon}-${monLastDate}`]
          break
        case 8:
          backDate = seasonList[cusSeason]
          break
      }
      return backDate
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
      .el-radio-group {
        &/deep/ .el-radio-button {
          &:focus {
            box-shadow: none;
          }
          .el-radio-button__inner {
            border: none;
            border-radius: 4px;
          }
          .el-radio-button__orig-radio:checked+.el-radio-button__inner {
            background: #fff;
            color: #606266;
            box-shadow: none;
          }
        }
      }
    }
    .el-main {
      .chart-warp {
        width: 100%;
        height: 335px;
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
        height: auto;
      }
    }
  }
}
</style>
