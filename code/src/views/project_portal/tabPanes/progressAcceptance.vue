<template>
  <div class="tab-content">
    <el-container>
      <el-header>
        <h3>工序验收</h3>
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
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b} </br> {a} : {c} ({d}%)'
      },
      xAxis: [
        {
          type: 'category',
          data: ['主体线管预埋工程（梁板）', '内墙拉毛', '外墙拉毛', '强电工程-线槽、桥架等安装', '抹灰工程（内抹）', '抹灰工程（外抹）', '木模工程', '消防工程-喷淋系统', '消防工程-消火栓系统', '砌体线管预埋工程', '给水工程', '钢筋工程（墙柱钢筋）', '钢筋工程（梁板钢筋）', '铝模工程', '防水基层', '防水质量', '砌筑工程', '混凝土工程']
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: '占比',
          type: 'bar',
          label: {
            show: false
          },
          itemStyle: {
            color: '#87cefa'
          },
          data: [100, 100, 100, 100, 100, 98, 100, 100, 100, 100, 85, 100, 100, 100, 100, 100, 100, 96]
        }
      ]
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this.$set(this, key, obj[key])
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
        .chart-container {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
