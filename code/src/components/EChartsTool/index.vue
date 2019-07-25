<template>
  <div ref="chartContainer" class="chart-container" />
</template>
<script>
import echarts from 'echarts'
import { isEmpty } from '@/utils/public'
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
      if (isEmpty(newVal)) {
        this.clearChart()
      } else {
        this.refreshChart()
      }
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
      this.refreshChart()
      window.addEventListener('resize', () => {
        this.chartEntity.resize()
      })
    },
    refreshChart() {
      if (!this.chartEntity) {
        this.chartEntity = echarts.init(this.$refs.chartContainer)
      }
      this.chartEntity.setOption(this.chartOptionData)
    },
    clearChart() {
      this.chartEntity.clear()
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
