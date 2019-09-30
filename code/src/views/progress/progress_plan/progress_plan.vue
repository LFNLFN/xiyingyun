<template>
  <!-- 实测实量页面 -->
  <el-container class="global-container">
    <el-main v-loading="isLoading">
      <el-form
        ref="filterForm"
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
          <el-col :span="8">
            <el-form-item prop="acceptItemId" label="工序项">
              <el-select v-model="filterFormData.acceptItemId" size="small">
                <el-option
                  v-for="item in processItemDatas"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="operate-wrap">
              <el-button type="primary" size="mini" @click="getProgressPlansFunc">查询</el-button>
              <el-button size="mini" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="add-btn-wrap">
        <el-button type="primary" size="small" @click="addProgressHandle">新增</el-button>
      </div>
      <el-table
        :data="progressTableData"
        size="small"
        class="no-border-gary-head"
        @row-click="showProgressDetail" >
        <el-table-column
          prop="projectName"
          label="项目名称" />
        <el-table-column
          prop="name"
          label="计划名称" />
        <el-table-column
          prop="acceptItemName"
          label="工序项" />
        <el-table-column
          prop="planCompleteDate"
          label="计划期限"
          header-align="center"
          align="center" />
        <el-table-column
          prop="creatorName"
          label="创建人"
          header-align="center"
          align="center" />
        <el-table-column
          prop="createTime"
          label="创建日期"
          header-align="center"
          align="center" />
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
    <progressDetail
      v-show="isMeasureDetailShow"
      ref="measureDetailCom"
      :is-measure-detail-show.sync="isMeasureDetailShow"
      @toPhotosZoom="toPhotosZoomHandle" />
    <addProgress
      v-show="isAddMeasureShow"
      ref="addMeasureCom"
      :is-add-measure-show.sync="isAddMeasureShow"
      @refreshMeasure="getProgressPlansFunc" />
    <photosZoom
      v-show="isPhotosZoomShow"
      ref="photosZoomCom"
      :is-photos-zoom-show.sync="isPhotosZoomShow" />
  </el-container>
</template>
<script>
import personTypeData from '@/mixins/personTypeData'
import getProjectMixin from '@/mixins/getProjectStage'
import ProgressDetail from '@/views/progress/progress_plan/components/progressDetail'
import AddProgress from '@/views/progress/progress_plan/components/addProgress'
import PhotosZoom from '@/components/PhotosZoom'
import { getProgressPlans, getProgressItems } from '@/api/progress/index.js'
export default {
  components: { ProgressDetail, AddProgress, PhotosZoom },
  mixins: [getProjectMixin, personTypeData],
  data() {
    return {
      filterFormData: {
        projectId: '',
        createTime: [],
        acceptItemId: '',
        type: null
      },
      processItemDatas: [], // 保存所有工序项
      progressTableData: [], // 保存加载的进度计划数据
      pageIndex: 0,
      pageSize: 10,
      pageTotal: 10,
      isMeasureDetailShow: false,
      isAddMeasureShow: false,
      isLoading: false,
      isPhotosZoomShow: false
    }
  },
  created() {
    this.getProjectFunc().then((data) => {
      this.filterFormData.projectId = data[0].id
      // 初始化数据
      this.initData().then(() => {
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    })
  },
  methods: {
    // 初始化数据操作
    async initData() {
      this.isLoading = true
      await this.getProgressPlansFunc()
      await this.getProgressItemsFunc()
    },
    // 获取进度计划数据
    getProgressPlansFunc() {
      const message = this.$message({
        message: '正在加载进度计划数据...',
        duration: 0
      })
      const params = {
        'sorts[0].name': 'createTime',
        'sorts[0].order': 'desc'
      }
      const _keys = Object.keys(this.filterFormData)
      let paramIndex = 0
      _keys.forEach((key) => {
        const _data = this.filterFormData[key]
        if (_data !== null && _data !== '') {
          if (key === 'createTime' && Array.isArray(_data)) {
            const termType = ['gte', 'lte']
            _data.forEach((item, idx) => {
              params[`terms[${paramIndex}].column`] = key
              params[`terms[${paramIndex}].value`] = item
              params[`terms[${paramIndex}].termType`] = termType[idx]
              paramIndex++
            })
          } else {
            params[`terms[${paramIndex}].column`] = key
            params[`terms[${paramIndex}].value`] = _data
            paramIndex++
          }
        }
      })
      params['pageSize'] = this.pageSize
      params['pageIndex'] = this.pageIndex - 1
      console.log('params', params)
      getProgressPlans(params).then(resp => {
        console.log('getProgressPlans resp', resp)
        const _data = resp.result
        this.$set(this, 'progressTableData', _data.data)
        this.pageTotal = _data.total
        this.pageIndex = _data.pageIndex + 1
        message.close()
      })
    },
    // 获取工序项数据
    getProgressItemsFunc() {
      const params = {
        'terms[0].column': 'type',
        'terms[0].value': 1
      }
      getProgressItems(params).then(resp => {
        const itemDatas = resp.result
        this.$set(this, 'processItemDatas', itemDatas)
      })
    },
    // 新增实测实量处理
    addProgressHandle() {
      const _obj = {
        measureItemDatas: this.measureItemDatas,
        projectDetailDatas: this.projectDetailDatas
      }
      this.$refs.addMeasureCom.resetDataProperty(_obj)
      this.isAddMeasureShow = true
    },
    // 展示实测实量详情处理
    showProgressDetail(row) {
      const _obj = {
        measureData: row
      }
      this.$refs.measureDetailCom.resetDataProperty(_obj)
      this.isMeasureDetailShow = true
    },
    pageChangeHandle(page) {
      this.pageIndex = page
      this.getMeasureDatasFunc()
    },
    pageSizeChangeHandle(val) {
      this.pageSize = val
      this.getMeasureDatasFunc()
    },
    resetForm() {
      this.$refs.filterForm.resetFields()
    },
    // 展示图片查看组件
    toPhotosZoomHandle(imgDatas) {
      const _obj = {
        photoList: imgDatas
      }
      this.$refs.photosZoomCom.resetDataProperty(_obj)
      this.isPhotosZoomShow = true
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
      &/deep/ .el-table__body {
        .el-table__row {
          cursor: pointer;
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
