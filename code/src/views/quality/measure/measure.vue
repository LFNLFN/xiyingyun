<template>
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
          <template v-if="fullFilterForm">
            <el-col :span="8">
              <el-form-item prop="unitId" label="楼栋">
                <el-select v-model="filterFormData.unitId" size="small">
                  <el-option
                    v-for="item in buildingDatas"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="type" label="类型">
                <el-select v-model="filterFormData.type" size="small">
                  <el-option
                    v-for="(item, idx) in personType"
                    :key="idx"
                    :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="checkItemId" label="实测实量项">
                <el-select v-model="filterFormData.checkItemId" size="small">
                  <el-option
                    v-for="item in measureItemDatas"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="createTime" label="创建日期">
                <el-date-picker
                  v-model="filterFormData.createTime"
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
              <el-button type="primary" size="mini" @click="getMeasureDatasFunc">查询</el-button>
              <el-button size="mini" @click="resetForm">重置</el-button>
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
        class="no-border-gary-head"
        @row-click="showMeasuerDetail" >
        <el-table-column
          prop="projectName"
          label="项目名称" />
        <el-table-column
          prop="partName"
          label="部位" />
        <el-table-column
          prop="checkItemName"
          label="实测实量项" />
        <el-table-column
          :formatter="measTypeFormatter"
          label="类型"
          header-align="center"
          align="center" />
        <el-table-column
          :formatter="measRateFormatter"
          prop="passingRate"
          label="合格率"
          header-align="center"
          align="center" />
        <el-table-column
          prop="createTime"
          label="报检日期"
          header-align="center" />
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
      ref="measureDetailCom"
      :is-measure-detail-show.sync="isMeasureDetailShow" />
    <addMeasure
      v-show="isAddMeasureShow"
      ref="addMeasureCom"
      :is-add-measure-show.sync="isAddMeasureShow"
      @refreshMeasure="getMeasureDatasFunc" />
  </el-container>
</template>
<script>
import personTypeData from '@/mixins/personTypeData'
import getProjectMixin from '@/mixins/getProjectStage'
import MeasureDetail from '@/views/quality/measure/components/measureDetail'
import AddMeasure from '@/views/quality/measure/components/addMeasure'
import { getBuliding } from '@/api/project_config/building'
import { getMeasureDatas, getMeasuerItems } from '@/api/quality/measure'
export default {
  components: { MeasureDetail, AddMeasure },
  mixins: [getProjectMixin, personTypeData],
  data() {
    return {
      filterFormData: {
        projectId: '',
        createTime: [],
        unitId: '',
        checkItemId: '',
        type: null
      },
      fullFilterForm: false,
      buildingDatas: [], // 保存所有楼栋数据
      measureItemDatas: [], // 保存所有实测实量项
      measureTableData: [], // 保存加载的实测实量数据
      pageIndex: 0,
      pageSize: 10,
      pageTotal: 10,
      isMeasureDetailShow: false,
      isAddMeasureShow: false,
      isLoading: false
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
      await this.getMeasureDatasFunc()
      await this.getMeasuerItemsFunc()
      await this.getMeasBuildingFunc()
    },
    // 格式化实测实量类型数据
    measTypeFormatter(row) {
      const type = this.personType.find(item => {
        return item.id === Number(row.type)
      })
      return type.name
    },
    // 格式化实测实量合格率
    measRateFormatter(row) {
      return `${row.passingRate}%`
    },
    // 获取实测实量数据
    getMeasureDatasFunc() {
      const message = this.$message({
        message: '正在加载实测实量数据...',
        duration: 0
      })
      const params = {
        'sorts[0].name': 'createTime',
        'sorts[0].order': 'desc'
      }
      const _keys = Object.keys(this.filterFormData)
      let paramIndex = 1
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
      getMeasureDatas(params).then(resp => {
        console.log('getMeasureDatas resp', resp)
        const _data = resp.result
        this.$set(this, 'measureTableData', _data.data)
        this.pageTotal = _data.total
        this.pageIndex = _data.pageIndex + 1
        message.close()
      })
    },
    // 获取实测实量项数据
    getMeasuerItemsFunc() {
      const params = {
        'terms[0].column': 'type',
        'terms[0].value': 1
      }
      getMeasuerItems(params).then(resp => {
        const itemDatas = resp.result.data
        this.$set(this, 'measureItemDatas', itemDatas)
      })
    },
    // 获取楼栋数据
    getMeasBuildingFunc() {
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
    },
    // 新增实测实量处理
    addMeasureHandle() {
      const _obj = {
        measureItemDatas: this.measureItemDatas,
        projectDetailDatas: this.projectDetailDatas
      }
      this.$refs.addMeasureCom.resetDataProperty(_obj)
      this.isAddMeasureShow = true
    },
    // 展示实测实量详情处理
    showMeasuerDetail(row) {
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
      this.refs.filterForm.resetFields()
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
