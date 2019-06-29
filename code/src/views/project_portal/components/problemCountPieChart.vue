<template>
  <div class="content-wrap">
    <el-row>
      <el-col :span="12">
        <EChartsTool :chart-option-data="qualityChartOption" />
      </el-col>
      <el-col :span="12">
        <EChartsTool :chart-option-data="safeChartOption" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import EChartsTool from '@/components/EChartsTool'
export default {
  components: { EChartsTool },
  data() {
    return {
      qualityChartData: [
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
      qualityChartOption: {},
      safeChartData: [
        {
          name: '待整改',
          value: 22
        },
        {
          name: '待销项',
          value: 15
        },
        {
          name: '已销项',
          value: 92
        }
      ],
      safeChartOption: {}
    }
  },
  mounted() {
    this.qualityChartOption = {
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
        data: this.qualityChartData
      }
    }
    this.safeChartOption = {
      title: {
        text: '安全文明',
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
        data: this.safeChartData
      }
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.content-wrap {
  width: 100%;
  height: 100%;
  .el-row, .el-col {
    height: 100%;
  }
}
</style>
