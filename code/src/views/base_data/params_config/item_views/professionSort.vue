<template>
  <el-container class="container">
    <el-main class="main-wrap">
      <div class="header">
        <span class="title-text">专业分类</span>
        <div class="btn-wrap">
          <el-button type="primary" size="small" @click="addProfessionHandle">添加</el-button>
          <el-button size="small" @click="backConigNav">返回</el-button>
        </div>
      </div>
      <div
        v-loading="isLoading"
        class="table-wrap">
        <el-table ref="professionTable" :data="professionTableData" border class="profession-table">
          <el-table-column prop="value" label="专业分类" />
          <el-table-column width="180" label="操作" align="center">
            <template slot-scope="scope">
              <el-button class="no-border" @click="editProfessionHandle(scope.row)">编辑</el-button>
              <el-button class="no-border" @click="delDictHandle(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <addProfession
      v-show="isAddProfessionShow"
      ref="addProfessionCom"
      :is-add-profession-show.sync="isAddProfessionShow"
      @refreshData="refreshData" />
  </el-container>
</template>
<script>
import { getDictionaryItem, delDictionaryItem } from '@/api/dictionary'
import { isEmpty } from '@/utils/public'
import AddProfession from '@/views/base_data/params_config/components/addProfession'
export default {
  name: 'Supplierprofession',
  components: { AddProfession },
  props: {
    paramsData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      professionTableData: [],
      isAddProfessionShow: false,
      isLoading: false
    }
  },
  created() {
    if (isEmpty(this.paramsData)) return
    this.getDictionaryItemFunc()
  },
  methods: {
    getDictionaryItemFunc() {
      this.isLoading = true
      const paramId = this.paramsData.id
      const _getParam = {
        'terms[0].column': 'dictId',
        'terms[0].value': paramId
      }
      getDictionaryItem(_getParam).then(resp => {
        this.professionTableData = resp.result
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    addProfessionHandle() {
      const _obj = {
        paramsData: this.paramsData
      }
      this.$refs.addProfessionCom.resetDataProperty(_obj)
      this.isAddProfessionShow = true
    },
    editProfessionHandle(data) {
      const _obj = {
        paramsData: this.paramsData,
        editparamsData: data,
        addOrEdit: 'edit'
      }
      this.$refs.addProfessionCom.resetDataProperty(_obj)
      this.isAddProfessionShow = true
    },
    delDictHandle(data) {
      const { id, value } = data
      this.$confirm(`确定删除 ${value} ?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        this.isLoading = true
        delDictionaryItem(id).then(resp => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.refreshData()
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    refreshData() {
      this.getDictionaryItemFunc()
    },
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
