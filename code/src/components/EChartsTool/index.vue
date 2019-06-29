<template>
  <div ref="chartContainer" class="chart-container" />
</template>
<script>
import echarts from 'echarts'
export default {
  props: {
    chartOptionData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      chartEntity: null
    }
  },
  watch: {
    chartOptionData: function(newVal) {
      this.buildChart()
    }
  },
  mounted() {
    this.buildChart()
  },
  beforeDestroy() {
    if (!this.chartEntity) {
      return
    }
    this.chartEntity.dispose()
    this.chartEntity = null
  },
  methods: {
    buildChart() {
      this.chartEntity = echarts.init(this.$refs.chartContainer)
      this.chartEntity.setOption(this.chartOptionData)
      window.addEventListener('resize', () => {
        this.chartEntity.resize()
      })
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.chart-container {
  width: 100%;
  height: 100%;
}
</style>
