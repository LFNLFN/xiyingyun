<template>
  <div class="tab-content">
    <el-container>
      <el-header>
        <h3>实测实量</h3>
        <div>
          <el-select v-model="sectionSelected">
            <el-option
              v-for="item in projectSectionList"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </div>
      </el-header>
      <el-main>
        <div v-loading="isLoading" class="chart-wrap">
          <EChartsTool
            ref="eChartsTool"
            :chart-option-data="chartOptionData" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import EChartsTool from '@/components/EChartsTool'
import { getMeasureSection, getMeasureProcess } from '@/api/project_portal/index'
export default {
  components: { EChartsTool },
  data() {
    return {
      projectData: {},
      sectionSelected: '',
      projectSectionList: [], // 保存标段数据
      isLoading: true,
      xAxisDatas: [], // 图标x轴数据
      chartOptionData: {
        tooltip: {
          trigger: 'axis',
          padding: [5, 5, 5, 5],
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          show: true,
          bottom: 0,
          itemHeight: 10,
          itemWidth: 10,
          verticalAlign: 'middle',
          textStyle: {
            fontSize: 12
          }
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '甲方',
            type: 'bar',
            label: {
              show: false
            },
            data: []
          },
          {
            name: '监理',
            type: 'bar',
            label: {
              show: false
            },
            data: []
          },
          {
            name: '施工',
            type: 'bar',
            label: {
              show: false
            },
            data: []
          }
        ]
      }
    }
  },
  watch: {
    projectData: function(newVal) {
      if ('projectId' in newVal) {
        this.initPage()
      }
    },
    sectionSelected: function(newVal) {
      if (newVal !== '') {
        this.getMeasureProcessFunc()
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
    initPage() {
      const projectId = this.projectData.id
      getMeasureSection(projectId).then(resp => {
        const data = resp.result
        this.$set(this, 'projectSectionList', data)
        if (data.length > 0) {
          this.sectionSelected = data[0].id
        } else {
          this.isLoading = false
        }
      })
    },
    // 获取实测实量数据
    getMeasureProcessFunc() {
      const sectionId = this.sectionSelected
      this.isLoading = true
      getMeasureProcess(sectionId).then(resp => {
        const data = resp.result
        const [checkItems, supPassingRate, consPassingRate, partPassingRate] = [[], [], [], []]
        data.forEach(item => {
          checkItems.push(item.checkItemName)
          supPassingRate.push(item.supPassingRate)
          consPassingRate.push(item.consPassingRate)
          partPassingRate.push(item.partPassingRate)
        })
        this.$set(this.chartOptionData.xAxis, 'data', checkItems)
        this.$set(this.chartOptionData.series[0], 'data', partPassingRate)
        this.$set(this.chartOptionData.series[1], 'data', consPassingRate)
        this.$set(this.chartOptionData.series[2], 'data', supPassingRate)
        this.$refs['eChartsTool'].refreshChart()
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
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
    .el-header{
      border-bottom: 1px solid #ccc;
      @include flex-layout(space-between, center, null, null);
      &/deep/ .date-select {
        width: 220px;
      }
    }
    .el-main {
      .chart-wrap {
        width: 100%;
        height: 330px;
        padding: 10px 10px 20px 10px;
      }
    }
  }
}
</style>
