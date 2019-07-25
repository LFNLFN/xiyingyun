<template>
  <div class="content-wrap">
    <p class="count-text">问题总数：{{ problemCount }}</p>
    <el-row>
      <el-col :span="12">
        <EChartsTool :chart-option-data="qualityChartOption" />
      </el-col>
      <el-col :span="12">
        <EChartsTool :chart-option-data="safeChartOption" />
      </el-col>
    </el-row>
    <div class="legend-wrap">
      <span
        v-for="(item, idx) in chartLegendData"
        :key="idx"
        class="legend-item">
        <span
          :style="{'background': item.itemStyle.color}"
          class="icon" />
        {{ item.name }}
      </span>
    </div>
  </div>
</template>
<script>
import EChartsTool from '@/components/EChartsTool'
import { isEmpty, DeepClone } from '@/utils/public'
export default {
  components: { EChartsTool },
  props: {
    problemCountData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      problemCount: 0,
      chartOptionConfig: {
        0: {
          title: '质量风险',
          dataKey: 'qualityChartOption'
        },
        1: {
          title: '安全文明',
          dataKey: 'safeChartOption'
        }
      },
      chartLegendData: [
        {
          name: '待整改',
          valueKey: 'rectification_num',
          itemStyle: { color: '#ed3f14' }
        },
        {
          name: '待销项',
          valueKey: 'waitsales_num',
          itemStyle: { color: '#ff9900' }
        },
        {
          name: '已销项',
          valueKey: 'hassales_num',
          itemStyle: { color: '#19be6b' }
        }
      ],
      chartTooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      chartTitle: {
        text: '',
        top: 'middle',
        left: 'middle',
        textAlign: 'center'
      },
      chartSeries: {
        name: 'item',
        type: 'pie',
        radius: ['50%', '70%'],
        label: {
          show: false
        }
      },
      qualityChartOption: {},
      safeChartOption: {}
    }
  },
  watch: {
    problemCountData: function(newVal) {
      this.resetData()
      if (!isEmpty(newVal)) {
        const keys = Object.keys(newVal)
        keys.forEach((key, idx) => {
          const curVal = newVal[key]
          const seriesData = []
          this.chartLegendData.forEach(item => {
            seriesData.push({
              name: item.name,
              value: curVal[item.valueKey],
              itemStyle: item.itemStyle
            })
          })
          const title = DeepClone(this.chartTitle)
          const tooltip = DeepClone(this.chartTooltip)
          const series = DeepClone(this.chartSeries)
          title.text = this.chartOptionConfig[key].title
          series['data'] = seriesData
          const optionKey = this.chartOptionConfig[key].dataKey
          const _option = {
            title: title,
            tooltip: tooltip,
            series: series
          }
          this.$set(this, optionKey, _option)
          this.problemCount += Number(curVal.problem_num)
        })
      } else {
        this.resetData()
      }
    }
  },
  methods: {
    resetData() {
      this.$set(this, 'qualityChartOption', {})
      this.$set(this, 'safeChartOption', {})
      this.problemCount = 0
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.content-wrap {
  width: 100%;
  height: 100%;
  .count-text {
    margin: 0;
    height: 35px;
    line-height: 35px;
    font-weight: bold;
  }
  .el-row {
    height: calc(100% - 85px);
  }
  .el-col {
    height: 100%
  }
  .legend-wrap {
    height: 50px;
    @include flex-layout(center, center, null, null);
    .legend-item {
      font-size: 14px;
      margin: 0 5px;
      .icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 3px;
        border-radius: 3px;
      }
    }
  }
}
</style>
