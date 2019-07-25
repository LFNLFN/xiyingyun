<template>
  <div class="content-wrap">
    <EChartsTool :chart-option-data="chartOptionData" />
  </div>
</template>
<script>
import EChartsTool from '@/components/EChartsTool'
export default {
  components: { EChartsTool },
  props: {
    orgProblemData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      chartOptionData: {},
      yAxisSplitNum: 5
    }
  },
  watch: {
    orgProblemData: function(newVal) {
      const [orgNameList, problemCountList, dutyRate] = [[], [], []]
      this.chartOptionData = {}
      if (newVal.length > 0) {
        newVal.forEach(item => {
          orgNameList.push(item.dutyOrgEntity.name)
          problemCountList.push(item.sumNum)
          dutyRate.push(Math.floor((item.num / item.sumNum * 10000) / 100))
        })
        // console.log('orgNameList', orgNameList)
        // console.log('problemCountList', problemCountList)
        // console.log('dutyRate', dutyRate)
      }
      this.buildChartOption(orgNameList, problemCountList, dutyRate)
    }
  },
  methods: {
    // 构建图表配置数据
    buildChartOption(names = [], counts = [], rates = [], configObj) {
      const { maxNum, intervalNum } = this.getYAxisConfig(counts)
      this.chartOptionData = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          padding: [5, 5, 5, 5]
          // formatter: '{b} </br> {a0} : {c0} </br> {a1} : {c1}%'
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
        xAxis: [
          {
            type: 'category',
            data: names
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '问题数',
            // splitNumber: 6,
            max: maxNum,
            interval: intervalNum
          },
          {
            type: 'value',
            name: '整改率',
            max: 100,
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '问题数',
            type: 'bar',
            data: counts,
            itemStyle: {
              color: '#2d8cf0'
            }
          },
          {
            name: '整改率',
            type: 'line',
            yAxisIndex: 1,
            data: rates,
            itemStyle: {
              color: '#ffa51e'
            }
          }
        ]
      }
    },
    // 配置问题数Y轴刻度
    getYAxisConfig(counts) {
      const countMax = Math.max.apply(null, counts)
      const maxNum = countMax + (countMax % this.yAxisSplitNum)
      const intervalNum = maxNum / this.yAxisSplitNum
      return { maxNum, intervalNum }
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.content-wrap {
  width: 100%;
  height: 100%;
}
</style>
