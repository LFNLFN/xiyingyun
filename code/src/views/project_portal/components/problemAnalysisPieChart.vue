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
          name: '其他',
          value: 38
        },
        {
          name: '其他',
          value: 21
        },
        {
          name: '混凝土外观检查',
          value: 12
        },
        {
          name: '其他',
          value: 8
        },
        {
          name: '电气线槽、线管安装工艺要求',
          value: 6
        },
        {
          name: '幕墙、隔墙',
          value: 5
        },
        {
          name: '通风管道安装',
          value: 4
        },
        {
          name: '监控机房施工工艺检查',
          value: 3
        },
        {
          name: '砌筑质量',
          value: 3
        },
        {
          name: '消防管道',
          value: 2
        }
      ],
      qualityChartOption: {},
      safeChartData: [
        {
          name: '电缆进出线洞口、墙壁桥架孔洞封堵情况检查',
          value: 2
        },
        {
          name: '混凝土反坎',
          value: 1
        },
        {
          name: '其他',
          value: 1
        },
        {
          name: '其他',
          value: 1
        },
        {
          name: '支架、吊架制作安装基本要求',
          value: 1
        },
        {
          name: '通风管道连接',
          value: 1
        },
        {
          name: '空鼓、开裂',
          value: 1
        },
        {
          name: '出屋面反坎',
          value: 1
        },
        {
          name: '砂浆配合比',
          value: 1
        },
        {
          name: '凿毛',
          value: 1
        },
        {
          name: '给水管道安装基本要求',
          value: 1
        }
      ],
      safeChartOption: {}
    }
  },
  mounted() {
    // const legend = {
    //   bottom: 0,
    //   padding: [5, 5, 5, 5],
    //   itemHeight: 10,
    //   itemWidth: 10,
    //   orient: 'vertical',
    //   textStyle: {
    //     fontSize: 12,
    //     width: '33%'
    //   }
    // }
    const tooltip = {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    }
    this.qualityChartOption = {
      title: {
        text: '质量风险',
        top: 'middle',
        left: 'middle',
        textAlign: 'center'
      },
      tooltip: tooltip,
      series: {
        name: 'item',
        type: 'pie',
        radius: ['40%', '60%'],
        label: {
          formatter: '{d}%'
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
      tooltip: tooltip,
      series: {
        name: 'item',
        type: 'pie',
        radius: ['40%', '60%'],
        label: {
          formatter: '{d}%'
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
