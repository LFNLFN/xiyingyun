<template>
  <el-container>
    <el-main>
      <el-form
        :model="filterFormData"
        :inline="true"
        label-position="right"
        label-width="80px"
        class="filter-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-select v-model="filterFormData.selected" size="small">
                <el-option
                  value="模拟项目一" />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="fullFilterForm">
            <el-col :span="8">
              <el-form-item label="批次名称">
                <el-select v-model="filterFormData.selected" size="small">
                  <el-option
                    value="移动" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="材料类型">
                <el-select v-model="filterFormData.selected" size="small">
                  <el-option
                    value="甲方" />
                  <el-option
                    value="监理" />
                  <el-option
                    value="施工" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态">
                <el-select v-model="filterFormData.selected" size="small">
                  <el-option
                    value="甲方" />
                  <el-option
                    value="监理" />
                  <el-option
                    value="施工" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="date" label="进场时间">
                <el-date-picker
                  v-model="filterFormData.date"
                  type="daterange"
                  size="small"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="date-select" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用部位">
                <el-select v-model="filterFormData.selected" size="small">
                  <el-option
                    value="待验收" />
                  <el-option
                    value="验收通过" />
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" size="mini">查询</el-button>
              <el-button size="mini">重置</el-button>
              <el-button
                size="mini"
                class="no-border form-ctrl-btn"
                @click="fullFilterForm = !fullFilterForm">
                {{ fullFilterForm ? '收缩' : '展开' }}
                <span
                  :class="{'el-icon-arrow-up': fullFilterForm, 'el-icon-arrow-down': !fullFilterForm}"
                  class="btn-icon" />
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="operate-wrap">
        <el-button type="primary" size="small">新增</el-button>
      </div>
      <el-table
        :data="materialTableData"
        :cell-class-name="setTableCellStyle"
        :header-cell-class-name="setTableCellStyle"
        size="small"
        class="no-border-gary-head" >
        <el-table-column label="状态" />
        <el-table-column label="项目名称" />
        <el-table-column label="材料进场申请名称" />
        <el-table-column label="材料类型" />
        <el-table-column label="接收单位" />
        <el-table-column label="接收人" />
        <el-table-column label="监理接收人" />
        <el-table-column label="建设单位接收人" />
        <el-table-column label="供货类别" />
        <el-table-column label="是否送检" />
        <el-table-column label="送检结果" />
        <el-table-column label="进场日期" />
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

.el-container {
  min-height: calc(100vh - 50px);
  background: #f0f1f5;
  padding: 20px;
  .el-main {
    background: #fff;
    .filter-form {
      @include flex-layout(flex-start, center, null, wrap);
      .el-row {
        width: 100%;
      }
      .el-form-item {
        margin: 0 0 15px 0;
        .el-select, .date-select {
          width: 200px;
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
