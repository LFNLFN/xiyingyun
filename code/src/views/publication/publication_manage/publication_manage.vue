<template>
  <el-container class="global-container">
    <el-main>
      <div class="operate-wrap">
        <el-button type="primary" size="small" @click="addPublicationHandle">新增</el-button>
      </div>
      <el-table
        :data="materialTableData"
        :cell-class-name="setTableCellStyle"
        :header-cell-class-name="setTableCellStyle"
        size="small"
        class="no-border-gary-head" >
        <el-table-column label="状态" />
        <el-table-column label="公告名称" />
        <el-table-column label="有效截止日期" />
        <el-table-column label="创建时间" />
        <el-table-column width="250px" label="操作" align="center">
          <template v-if="true">
            <el-button class="no-border" size="mini">编辑</el-button>
            <el-button class="no-border" size="mini">发布</el-button>
          </template>
          <template v-else>
            <el-button class="no-border" size="mini">撤销</el-button>
          </template>
          <el-button class="no-border" size="mini">授权</el-button>
          <el-button class="no-border" size="mini">删除</el-button>
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
    </el-main>
    <measureDetail
      v-show="isMeasureDetailShow"
      :is-measure-detail-show.sync="isMeasureDetailShow" />
  </el-container>
</template>
<script>
import MeasureDetail from '@/views/quality/measure/components/measureDetail'
export default {
  components: { MeasureDetail },
  data() {
    return {
      filterFormData: {
        date: '',
        selected: ''
      },
      fullFilterForm: false,
      materialTableData: [],
      pageIndex: 0,
      pageTotal: 10,
      isMeasureDetailShow: false
    }
  },
  methods: {
    setTableCellStyle() {
      return 'nowrap-row'
    },
    addPublicationHandle() {
      this.$router.push({ name: 'addPublication' })
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
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.el-container {
  padding: 20px;
  .el-main {
    background: #fff;
    .operate-wrap {
      padding: 20px 10px;
    }
    .el-table {
      margin-top: 5px;
      & /deep/.nowrap-row {
        .cell {
          white-space: nowrap;
        }
      }
    }
    .pager-wrap {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
