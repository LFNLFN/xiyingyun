<template>
  <el-container class="global-container">
    <el-main>
      <el-table
        :data="materialTableData"
        :cell-class-name="setTableCellStyle"
        :header-cell-class-name="setTableCellStyle"
        class="no-border-gary-head" >
        <el-table-column prop="name" label="报表名称" />/>
        <el-table-column width="120px" label="操作" align="center">
          <template slot-scope="scope">
            <el-button class="no-border" size="mini">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
        :total="pageTotal"
        :page-size="10"
        :page-sizes="[10, 20, 30, 40]"
        :current-page="pageIndex"
        background
        layout="total, prev, pager, next, sizes, jumper"
        class="pager-wrap"
        @current-change="pageChangeHandle"
        @size-change="pageSizeChangeHandle"/> -->
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
      materialTableData: [
        { name: '检查问题明细表' },
        { name: '工序验收明细表' },
        { name: '实测实量明细表' },
        { name: '人员工作量统计表' },
        { name: '验房问题明细表' },
        { name: '材料进场统计表' },
        { name: '项目初始化情况统计表' },
        { name: '日常质量、安全检查上线情况统计表' },
        { name: '实测实量上线情况统计表' },
        { name: '工序验收上线情况统计表' },
        { name: '材料进场明细表' },
        { name: '人员工作量报表(区域平台)' },
        { name: '评估管理报表' }
      ],
      pageIndex: 0,
      pageTotal: 10,
      isMeasureDetailShow: false
    }
  },
  methods: {
    setTableCellStyle() {
      return 'nowrap-row'
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
    .el-table {
      margin-top: 5px;
      &/deep/.el-table_1_column_1 .cell {
        padding-left: 20px;
      }
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
