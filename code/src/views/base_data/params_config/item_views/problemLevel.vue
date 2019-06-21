<template>
  <el-container>
    <el-main>
      <div class="header">
        <span class="el-icon-tickets"> 供应商性质</span>
        <div class="btn-wrap">
          <el-button size="small">添加</el-button>
          <el-button type="primary" size="small" @click="backConigNav">返回</el-button>
        </div>
      </div>
      <el-table ref="levelTable" :data="levelTableData" border class="level-table">
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="levelCheckedVal" />
          </template>
        </el-table-column>
        <el-table-column prop="level" label="问题等级" align="center" />
        <el-table-column prop="cycle" label="默认跟进周期" align="center" />
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: 'Supplierlevel',
  data() {
    return {
      levelTableData: [
        {
          level: '一般',
          cycle: '7天'
        },
        {
          level: '紧急',
          cycle: '3天'
        },
        {
          level: '加急',
          cycle: '1天'
        }
      ],
      levelCheckedVal: ''
    }
  },
  methods: {
    backConigNav() {
      this.$emit('changeSowCom', 'configNav')
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
  padding: 20px;
  .el-main {
    @include boxShadow-container;
    .header {
      @include gray-header;
    }
    .params-item-wrap {
      padding: 20px 30px;
      .el-row {
        padding: 0 10px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #c7c6c6;
      }
    }
    .level-table {
      width: 600px;
      margin: 50px auto;
    }
  }
}
</style>
