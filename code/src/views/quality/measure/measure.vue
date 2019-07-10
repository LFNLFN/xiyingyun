<template>
  <el-container>
    <el-main>
      <el-form
        :model="filterFormData"
        :inline="true"
        class="filter-form">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-select v-model="filterFormData.projectId" size="small">
                <el-option
                  v-for="(item, idx) in projectDetailDatas"
                  :key="idx"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="fullFilterForm">
            <el-col :span="8">
              <el-form-item label="楼栋">
                <el-select v-model="filterFormData.selected" size="small">
                  <el-option
                    value="移动" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类型">
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
              <el-form-item label="实测实量项">
                <el-select v-model="filterFormData.selected" size="small">
                  <el-option
                    value="待验收" />
                  <el-option
                    value="验收通过" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="date" label="创建日期">
                <el-date-picker
                  v-model="filterFormData.date"
                  type="daterange"
                  size="small"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="date-select" />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="8">
            <el-form-item class="operate-wrap">
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
      <div class="add-btn-wrap">
        <el-button type="primary" size="small" @click="addMeasureHandle">新增</el-button>
      </div>
      <el-table
        :data="measureTableData"
        size="small"
        class="no-border-gary-head" >
        <el-table-column label="项目名称" />
        <el-table-column label="部位" />
        <el-table-column label="实测实量项" />
        <el-table-column label="类型" />
        <el-table-column label="合格率" />
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
    <measureDetail
      v-show="isMeasureDetailShow"
      :is-measure-detail-show.sync="isMeasureDetailShow" />
    <addMeasure
      v-show="isAddMeasureShow"
      :is-add-measure-show.sync="isAddMeasureShow" />
  </el-container>
</template>
<script>
import getProjectMixin from '@/mixins/getProjectStage'
import MeasureDetail from '@/views/quality/measure/components/measureDetail'
import AddMeasure from '@/views/quality/measure/components/addMeasure'
export default {
  components: { MeasureDetail, AddMeasure },
  mixins: [getProjectMixin],
  data() {
    return {
      filterFormData: {
        projectId: '',
        date: '',
        selected: ''
      },
      fullFilterForm: false,
      measureTableData: [],
      pageIndex: 0,
      pageTotal: 10,
      isMeasureDetailShow: false,
      isAddMeasureShow: false
    }
  },
  created() {
    this.getProjectFunc((data) => {
      console.log('data', data)
      this.filterFormData.projectId = data[0].id
    })
  },
  methods: {
    addMeasureHandle() {
      this.isAddMeasureShow = true
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
  min-height: calc(100vh - #{$navbarHeight});;
  background: #f0f1f5;
  padding: 20px;
  .el-main {
    background: #fff;
    .filter-form {
      &/deep/ .el-form-item {
        width: 100%;
        white-space: nowrap;
        margin: 20px 0 0 0;
        .el-form-item__label {
          width: 110px;
          text-align: right;
        }
        .el-form-item__content {
          width: calc(100% - 110px);
        }
        .el-select, .date-select {
          width: 100%;
        }
        &.operate-wrap {
          padding-left: 50px;
          .form-ctrl-btn {
            font-size: 14px;
          }
        }
      }
    }
    .add-btn-wrap {
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
}
</style>
