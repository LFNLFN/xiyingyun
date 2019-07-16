<template>
  <div class="main-content">
    <el-form
      :inline="true"
      label-position="right"
      label-width="90px"
      class="filter-form">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="所在区域:">
            <el-select v-model="filterFormData.name" size="small">
              <el-option
                value="移动" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="projectId" label="选择项目:">
            <el-select v-model="filterFormData.projectId" size="small">
              <el-option
                v-for="item in projectDetailDatas"
                :key="item.id"
                :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="检查人:">
            <el-select v-model="filterFormData.name" size="small">
              <el-option
                value="移动" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="btn-wrap">
            <el-button type="primary" size="mini">查询</el-button>
            <el-button size="mini">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="operate-wrap">
      <el-button type="primary" size="small" @click="toAddSpecialItem">新增</el-button>
    </div>
    <el-table
      :data="tableData"
      size="small"
      class="no-border-gary-head" >
      <el-table-column label="项目名称" />
      <el-table-column label="检查批次名称" />
      <el-table-column label="检查人" />
      <el-table-column label="责任人" />
      <el-table-column label="计划开始日期" />
      <el-table-column width="80" label="操作">
        <template slot-scope="scope">
          <el-button size="small" class="no-border">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="pageTotal"
      :page-size="10"
      :page-sizes="[10, 20, 30, 40]"
      :current-page="pageIndex"
      background
      layout="total, prev, pager, next, sizes, jumper"
      class="pager-wrap"
      @current-change="pageChangeHandle"
      @size-change="pageSizeChangeHandle"/>
  </div>
</template>
<script>
import { isEmpty } from '@/utils/public'
export default {
  data() {
    return {
      projectDetailDatas: [],
      filterFormData: {
        projectId: '',
        name: ''
      },
      tableData: [],
      pageIndex: 0,
      pageTotal: 10
    }
  },
  watch: {
    projectDetailDatas: function(newVal, oldVal) {
      if (!isEmpty(newVal)) {
        this.filterFormData.projectId = newVal[0].id
      }
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this.$set(this, key, obj[key])
      })
    },
    // 新增专项处理
    toAddSpecialItem() {
      this.$emit('addSpecialItem')
    },
    pageChangeHandle(page) {
      this.pageIndex = page
    },
    pageSizeChangeHandle(val) {
      console.log('val', val)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.main-content {
  padding: 20px;
  background: #fff;
  .filter-form {
    &/deep/ .el-form-item {
      width: 100%;
      white-space: nowrap;
      margin: 15px 0 0 0;
      .el-form-item__content {
        width: 100%;
      }
      .el-form-item__label {
        width: 90px;
        text-align: right
      }
      .el-select, .date-select {
        width: calc(100% - 102px);
      }
      &.btn-wrap {
        padding-left: 20px;
      }
      .form-ctrl-btn {
        font-size: 14px;
      }
    }
  }
  .operate-wrap {
    padding: 20px 10px;
  }
  .el-table {
    margin-top: 5px;
  }
  .pager-wrap {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
