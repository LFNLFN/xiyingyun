<template>
  <el-container class="global-container">
    <el-main>
      <el-form
        ref="filterForm"
        :model="filterFormData"
        :inline="true"
        label-position="right"
        class="filter-form">
        <el-row :gutter="20">
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
            <el-form-item prop="unitId" label="楼栋">
              <el-select
                v-model="filterFormData.unitId"
                size="small"
                @visible-change="(visiable) => getBuildingDataFunc(visiable)">
                <el-option
                  v-for="(item, idx) in buildingDatas"
                  :key="idx"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="fullFilterForm">
            <el-col :span="8">
              <el-form-item prop="status" label="验收状态">
                <el-select v-model="filterFormData.status" size="small">
                  <el-option
                    v-for="(item, idx) in acceptanceStatus"
                    :key="idx"
                    :label="item.name"
                    :value="item.type" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="acceptItemId" label="工序验收项">
                <el-select
                  v-model="filterFormData.acceptItemId"
                  :loading="processItemDatas.length === 0"
                  size="small"
                  @visible-change="(visiable) => getProcessItemFunc(visiable)">
                  <el-option
                    v-for="(item, idx) in processItemDatas"
                    :key="idx"
                    :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="applyDate" label="报检日期">
                <el-date-picker
                  v-model="filterFormData.applyDate"
                  type="daterange"
                  size="small"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  class="date-select" />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="8">
            <el-form-item class="operate-wrap">
              <el-button type="primary" size="mini" @click="getProcessAcceptFunc">查询</el-button>
              <el-button size="mini" @click="resetFilterForm">重置</el-button>
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
      <el-table
        :data="acceptTableData"
        class="no-border-gary-head"
        @row-click="showProcessAccepDetail" >
        <el-table-column prop="statusName" label="状态">
          <template slot-scope="scope">
            <span :style="{ 'background': acceptStatusColors[Number(scope.row.status)] }" class="status-icon" />
            <span>{{ scope.row.statusName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column prop="partName" label="部位" />
        <el-table-column prop="acceptItemName" label="工序验收项" />
        <el-table-column prop="applyDate" label="报检日期" />
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
      ref="acceptDetailCom"
      :is-accept-detail-show.sync="isAcceptDetailShow"
      @toPhotosZoom="toPhotosZoomHandle"
      @refreshProcessData="getProcessAcceptFunc" />
    <photosZoom
      v-show="isPhotosZoomShow"
      ref="photosZoomCom"
      :is-photos-zoom-show.sync="isPhotosZoomShow" />
  </el-container>
</template>
<script>
import { getBuliding } from '@/api/project_config/building'
import { getProcessAccept, getProcessItems } from '@/api/quality/processAcceptance'
import PhotosZoom from '@/components/PhotosZoom'
import GetProjectMixin from '@/mixins/getProjectStage'
import AcceptanceStatusData from '@/mixins/acceptanceStatusData'
import AcceptDetail from '@/views/quality/process_acceptance/components/AcceptDetail'
import { redStatus, greenStatus, orangeStatus, yellowStatus, grayStatus } from '@/styles/variables.scss'
export default {
  components: { AcceptDetail, PhotosZoom },
  mixins: [GetProjectMixin, AcceptanceStatusData],
  data() {
    return {
      filterFormData: {
        projectId: '',
        unitId: '',
        status: null,
        acceptItemId: '',
        applyDate: ''
      },
      fullFilterForm: false,
      projectDetailDatas: [], // 保存项目数据
      buildingDatas: [], // 保存楼栋数据
      processItemDatas: [], // 保存工序项数据
      // acceptanceStatus: [
      //   { type: 0, name: '验收通过' },
      //   { type: 1, name: '未验收' },
      //   { type: 2, name: '待验收' },
      //   { type: 3, name: '验收不通过' },
      //   { type: 4, name: '已作废' }
      // ], // 保存验收状态数据
      acceptStatusColors: [greenStatus, yellowStatus, orangeStatus, redStatus, grayStatus],
      acceptTableData: [], // 保存工序验收数据
      pageSize: 10,
      pageIndex: 1,
      pageTotal: 0,
      isAcceptDetailShow: false,
      isPhotosZoomShow: false,
      isTableLoading: false
    }
  },
  watch: {
    'filterFormData.projectId': function(newVal, oldVal) {
      this.$set(this, 'buildingDatas', [])
    }
  },
  created() {
    this.getProjectFunc().then((data) => {
      const _projectId = data[0].id
      this.filterFormData.projectId = _projectId
      this.getProcessAcceptFunc()
    })
  },
  methods: {
    // 获取工序验收数据
    getProcessAcceptFunc() {
      const params = {}
      const _keys = Object.keys(this.filterFormData)
      let paramIndex = 0
      _keys.forEach((key) => {
        const _data = this.filterFormData[key]
        if (_data !== null && _data !== '') {
          if (key === 'applyDate' && Array.isArray(_data)) {
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
      params[`sorts[0].name`] = 'applyDate'
      params[`sorts[0].order`] = 'desc'
      params['pageIndex'] = this.pageIndex - 1
      params['pageSize'] = this.pageSize
      getProcessAccept(params).then(resp => {
        const data = resp.result
        this.pageTotal = data.total
        this.pageIndex = data.pageIndex + 1
        this.acceptTableData = data.data
      })
    },
    // 获取楼栋数据
    getBuildingDataFunc(visible) {
      if (visible && this.buildingDatas.length === 0) {
        const projectId = this.filterFormData.projectId
        const curProject = this.projectDetailDatas.find(item => item.id === projectId)
        const projectIdList = Array.of(projectId)
        if (curProject.section.length > 0) {
          curProject.section.forEach(item => {
            projectIdList.push(item.id)
          })
        }
        const params = {
          'terms[0].column': 'projectId$IN',
          'terms[0].value': projectIdList.join()
        }
        getBuliding(params).then(resp => {
          const buildingList = resp.result
          this.$set(this, 'buildingDatas', buildingList)
        })
      }
    },
    // 获取工序验收项
    getProcessItemFunc(visible) {
      if (visible && this.processItemDatas.length === 0) {
        getProcessItems().then(resp => {
          const processList = resp.result
          const _processItems = []
          processList.forEach(process => {
            const itemList = process.acceptItemList
            if (itemList && itemList.length > 0) {
              _processItems.push(...itemList)
            }
          })
          this.$set(this, 'processItemDatas', _processItems)
          console.log('processItemDatas', this.processItemDatas)
        })
      }
    },
    // 展示工序验收详情
    showProcessAccepDetail(row) {
      const _obj = {
        acceptData: row,
        acceptStatusColors: this.acceptStatusColors
      }
      this.$refs.acceptDetailCom.resetDataProperty(_obj)
      this.isAcceptDetailShow = true
    },
    // 展示图片查看组件
    toPhotosZoomHandle(imgDatas) {
      const _obj = {
        photoList: imgDatas
      }
      this.$refs.photosZoomCom.resetDataProperty(_obj)
      this.isPhotosZoomShow = true
    },
    // 重置搜索条件表单
    resetFilterForm() {
      this.$refs.filterForm.resetFields()
    },
    // 分页切换处理
    pageChangeHandle(page) {
      this.pageIndex = page
      this.getProcessAcceptFunc()
    },
    // 每页显示条数切换处理
    pageSizeChangeHandle(val) {
      this.pageSize = val
      this.getProcessAcceptFunc()
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
        .el-form-item__content {
          width: 100%;
        }
        label {
          width: 100px;
        }
        .el-select, .date-select {
          width: calc(100% - 112px);
        }
        &.operate-wrap {
          padding-left: 50px;
          .form-ctrl-btn {
            font-size: 14px;
          }
        }
      }
    }
    .el-table {
      margin-top: 25px;
      &/deep/ .status-icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        vertical-align: text-top;
        border-radius: 15px;
        margin-right: 3px;
      }
      &/deep/ .cell {
        font-size: 12px;
        padding-left: 20px
      }
      &/deep/ .el-table__body .el-table__row {
        cursor: pointer;
      }
    }
    .pager-wrap {
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
