<template>
  <div class="content-wrap">
    <EChartsTool :chart-option-data="chartOptionData" />
  </div>
</template>
<script>
import EChartsTool from '@/components/EChartsTool'
export default {
  components: { EChartsTool },
  data() {
    return {
      chartOptionData: {}
    }
  },
  mounted() {
    this.chartOptionData = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        padding: [5, 5, 5, 5]
        // formatter: '{b} </br> {a0} : {c0}% </br> {a1} : {c1}% </br> {a2} : {c2}%'
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
          data: ['电白二建', '金粤装饰', '时代天元', '广东顺宇', '深圳市瑞玮']
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '问题数',
          splitNumber: 6
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
          label: {
            show: false
          },
          data: [185, 83, 15, 23, 14],
          itemStyle: {
            color: '#2d8cf0'
          }
        },
        {
          name: '整改率',
          type: 'line',
          label: {
            show: true,
            formatter: '{c}%'
          },
          yAxisIndex: 1,
          data: [47, 60, 52, 38, 42],
          itemStyle: {
            color: '#ffa51e'
          }
        }
      ]
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
