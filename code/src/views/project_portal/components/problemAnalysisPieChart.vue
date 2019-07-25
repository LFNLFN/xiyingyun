<template>
  <div class="content-wrap">
    <el-row>
      <el-col :span="12">
        <div class="chart-wrap">
          <EChartsTool :chart-option-data="qualityChartOption" />
        </div>
        <div class="legend-wrap">
          <el-row :gutter="15">
            <el-col
              v-for="(item, idx) in qualityLegendData"
              :key="idx"
              :span="8">
              <span class="legend-item">
                <span
                  :style="{'background': item.itemStyle.color}"
                  class="icon" />
                {{ item.name }}
              </span>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-wrap">
          <EChartsTool :chart-option-data="safeChartOption" />
        </div>
        <div class="legend-wrap">
          <el-row :gutter="15">
            <el-col
              v-for="(item, idx) in safeLegendData"
              :key="idx"
              :span="8">
              <span class="legend-item">
                <span
                  :style="{'background': item.itemStyle.color}"
                  class="icon" />
                {{ item.name }}
              </span>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import EChartsTool from '@/components/EChartsTool'
import { isEmpty, DeepClone, getRandomString } from '@/utils/public'
export default {
  components: { EChartsTool },
  props: {
    problemTypeData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      colorPool: ['#ffc53d', '#73d13d', '#597ef7', '#ff7a45', '#ffec3d', '#36cfc9', '#9254de', '#ffa940', '#bae637', '#40a9ff', '#f759ab', '#80848f', '#19be6b', '#0066CC', '#FFB114', '#FFE600'],
      chartOptionConfig: {
        0: {
          title: '质量风险',
          dataKey: 'qualityChartOption',
          legendKey: 'qualityLegendData'
        },
        1: {
          title: '安全文明',
          dataKey: 'safeChartOption',
          legendKey: 'safeLegendData'
        }
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
        radius: ['45%', '60%'],
        label: {
          formatter: '{d}%'
        },
        data: []
      },
      chartTooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      qualityChartOption: {},
      safeChartOption: {},
      qualityLegendData: [],
      safeLegendData: []
    }
  },
  watch: {
    problemTypeData: function(newVal) {
      this.resetData()
      if (!isEmpty(newVal)) {
        const keys = Object.keys(newVal)
        keys.forEach(key => {
          const curVal = newVal[key]
          const seriesData = []
          curVal.forEach((item, vidx) => {
            seriesData.push({
              name: item.checkSettingName,
              value: item.num,
              itemStyle: {
                color: this.getItemColor(vidx)
              }
            })
          })
          const title = DeepClone(this.chartTitle)
          const tooltip = DeepClone(this.chartTooltip)
          const series = DeepClone(this.chartSeries)
          title.text = this.chartOptionConfig[key].title
          series['data'] = seriesData
          const optionKey = this.chartOptionConfig[key].dataKey
          const legendKey = this.chartOptionConfig[key].legendKey
          const _option = {
            title: title,
            tooltip: tooltip,
            series: series
          }
          this.$set(this, optionKey, _option)
          this.$set(this, legendKey, seriesData)
          // console.log(legendKey, this[legendKey])
          // console.log(optionKey, this[optionKey])
        })
      }
    }
  },
  mounted() {
    this.qualityChartOption = {
    }
    this.safeChartOption = {
    }
  },
  methods: {
    getItemColor(index) {
      let color = this.colorPool[index]
      if (color === undefined) {
        const colorStr = getRandomString(6, '0123456789abcdef')
        color = `#${colorStr}`
      }
      return color
    },
    resetData() {
      this.$set(this, 'qualityChartOption', {})
      this.$set(this, 'safeChartOption', {})
      this.$set(this, 'qualityLegendData', [])
      this.$set(this, 'safeLegendData', [])
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.content-wrap {
  width: 100%;
  // height: 100%;
  .el-row, .el-col {
    .chart-wrap {
      height: 350px;
    }
    .legend-wrap {
      padding: 10px;
      .legend-item {
        display: block;
        padding-left: 18px;
        width: 100%;
        font-size: 12px;
        position: relative;
        line-height: 18px;
        .icon {
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 3px;
          position: absolute;
          top: 2px;
          left: 0;
        }
      }
    }
  }
}
</style>
