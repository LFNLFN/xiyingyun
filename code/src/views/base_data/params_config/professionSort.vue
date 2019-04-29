<template>
  <el-container>
    <el-main>
      <div class="header">
        <span class="el-icon-tickets"> 专业分类</span>
        <div class="btn-wrap">
          <el-button size="small">添加</el-button>
          <el-button type="primary" size="small" @click="backConigNav">返回</el-button>
        </div>
      </div>
      <el-table ref="professionTable" :data="professionTableData" border class="profession-table">
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="professionCheckedVal" />
          </template>
        </el-table-column>
        <el-table-column prop="profession" label="专业分类" align="center" />
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: 'Supplierprofession',
  data() {
    return {
      professionTableData: [
        {
          profession: '土建工程'
        },
        {
          profession: '水电工程'
        },
        {
          profession: '装潢工程'
        },
        {
          profession: '重整工程'
        }
      ],
      professionCheckedVal: ''
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
    .profession-table {
      width: 600px;
      margin: 50px auto;
    }
  }
}
</style>
