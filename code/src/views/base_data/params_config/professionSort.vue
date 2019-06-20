<template>
  <el-container class="container">
    <el-main class="main-wrap">
      <div class="header">
        <span class="title-text">专业分类</span>
        <div class="btn-wrap">
          <el-button type="primary" size="small">添加</el-button>
          <el-button size="small" @click="backConigNav">返回</el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-table ref="professionTable" :data="professionTableData" border class="profession-table">
          <el-table-column prop="profession" label="专业分类" />
          <el-table-column width="180" label="操作" align="center">
            <template slot-scope="scope">
              <el-button class="no-border">编辑</el-button>
              <el-button class="no-border">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { getDictionaryItem, getDictionary } from '@/api/dictionary'
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
  created() {
    getDictionary().then(resp => {
      console.log('resp', resp)
    })
    getDictionaryItem().then(resp => {
      console.log('resp', resp)
    })
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

.container {
  padding: 25px;
  .main-wrap {
    @include boxShadow-container;
    .header {
      margin-top: 10px;
      @include gray-header;
      padding: 20px;
      background: #fff;
      .title-text {
        font-weight: bold;
      }
    }
    .table-wrap {
      padding: 30px;
      .profession-table {
        &/deep/ .el-table__header th {
          background: #f8f8f9;
        }
        &/deep/ .el-table_1_column_1 .cell {
          text-indent: 15px;
        }
      }
    }
  }
}
</style>
