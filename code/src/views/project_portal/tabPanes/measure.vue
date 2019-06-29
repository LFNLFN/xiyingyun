<template>
  <div class="tab-content">
    <el-container>
      <el-header>
        <h3>实测实量</h3>
        <div>
          <el-select v-model="sectionSelected">
            <el-option
              value="1标段" />
          </el-select>
        </div>
      </el-header>
      <el-main>
        <div class="chart-wrap">
          <EChartsTool :chart-option-data="chartOptionData" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import EChartsTool from '@/components/EChartsTool'
export default {
  components: { EChartsTool },
  data() {
    return {
      sectionSelected: '',
      chartOptionData: {}
    }
  },
  mounted() {
    this.chartOptionData = {
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
      xAxis: [
        {
          type: 'category',
          data: ['混凝土结构工程', '砌筑工程', '抹灰工程', '铝合金门窗工程']
        }
      ],
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
          data: [92, 97, 93, 99]
        },
        {
          name: '监理',
          type: 'bar',
          label: {
            show: false
          },
          data: [98, 87, 99, 92]
        },
        {
          name: '施工',
          type: 'bar',
          label: {
            show: false
          },
          data: [97, 95, 98, 92]
        }
      ]
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
