<template>
  <el-container>
    <el-main>
      <el-form
        :model="filterFormData"
        :inline="true"
        class="filter-form">
        <el-form-item label="项目名称">
          <el-select v-model="filterFormData.selected" size="small">
            <el-option
              value="模拟项目一" />
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋">
          <el-select v-model="filterFormData.selected" size="small">
            <el-option
              value="移动" />
          </el-select>
        </el-form-item>
        <template v-if="fullFilterForm">
          <el-form-item label="验收状态">
            <el-select v-model="filterFormData.selected" size="small">
              <el-option
                value="待验收" />
              <el-option
                value="验收通过" />
            </el-select>
          </el-form-item>
          <el-form-item label="工序验收项">
            <el-select v-model="filterFormData.selected" size="small">
              <el-option
                value="待验收" />
              <el-option
                value="验收通过" />
            </el-select>
          </el-form-item>
          <el-form-item prop="date" label="报检日期">
            <el-date-picker
              v-model="filterFormData.date"
              type="daterange"
              size="small"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="date-select" />
          </el-form-item>
        </template>
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
      </el-form>
      <el-table
        :data="acceptTableData"
        size="small"
        class="no-border-gary-head" >
        <el-table-column label="状态" />
        <el-table-column label="项目名称" />
        <el-table-column label="部位" />
        <el-table-column label="工序验收项" />
        <el-table-column label="报检日期" />
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
    <acceptDetail
      v-show="isAcceptDetailShow"
      :is-accept-detail-show.sync="isAcceptDetailShow" />
  </el-container>
</template>
<script>
import AcceptDetail from '@/views/quality/process_acceptance/components/AcceptDetail'
export default {
  components: { AcceptDetail },
  data() {
    return {
      filterFormData: {
        date: '',
        selected: ''
      },
      fullFilterForm: false,
      acceptTableData: [],
      isAcceptDetailShow: false,
      pageIndex: 0,
      pageTotal: 10
    }
  },
  methods: {
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
      .el-form-item {
        margin: 10px 15px;
        .el-select, .date-select {
          width: 200px;
        }
        .form-ctrl-btn {
          font-size: 14px;
        }
      }
    }
    .el-table {
      margin-top: 25px;
    }
    .pager-wrap {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
