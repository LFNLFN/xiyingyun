<template>
  <el-container class="global-container">
    <el-main>
      <el-form
        :model="filterFormData"
        :inline="true"
        label-position="right"
        label-width="80px"
        class="filter-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="区域公司">
              <el-select
                v-model="filterFormData.orgId"
                size="small">
                <el-option
                  v-for="(item, idx) in areaCompanys"
                  :key="idx"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称">
              <el-select
                v-model="filterFormData.projectId"
                size="small">
                <el-option
                  v-for="(item, idx) in companyProjects"
                  :key="idx"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="fullFilterForm">
            <el-col :span="8">
              <el-form-item label="材料类型">
                <el-cascader
                  v-model="filterFormData.typeId"
                  :clearabled="true"
                  :options="materialTypeData"
                  :props="materialTypeProp"
                  :show-all-levels="false"
                  size="small" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="材料状态">
                <el-select v-model="filterFormData.status" size="small" placeholder="全部">
                  <el-option
                    v-for="item in materialStatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="批次名称">
                <el-input v-model="filterFormData.batchName" size="small" placeholder="请输入批次名称"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="使用部位">
                <el-input v-model="filterFormData.part" size="small" placeholder="请输入使用部位"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="date" label="进场时间">
                <el-date-picker
                  v-model="timeSelected"
                  type="daterange"
                  size="small"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  class="date-select" />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="8">
            <el-form-item class="btn-item">
              <el-button type="primary" size="mini" @click="getMaterialDatas">查询</el-button>
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
      <el-table
        :data="materialTableData"
        :cell-class-name="setTableCellStyle"
        :header-cell-class-name="setTableCellStyle"
        size="small"
        class="no-border-gary-head"
        @row-click="showMaterialDetail" >
        <el-table-column prop="statusName" min-width="100" label="状态">
          <template slot-scope="scope">
            <span :style="{ 'background': acceptStatusColors[Number(scope.row.status)] }" class="status-icon" />
            <span>{{ scope.row.statusName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" min-width="180" label="项目名称" />
        <el-table-column prop="name" min-width="180" label="材料进场申请名称" />
        <el-table-column prop="metarialTypeName" label="材料类型" />
        <el-table-column prop="consOrgName" min-width="200" label="接收单位" />
        <el-table-column prop="consPersonName" label="接收人" />
        <el-table-column prop="superPersonName" label="监理接收人" />
        <el-table-column prop="buildPersonName" min-width="200" label="建设单位接收人" />
        <el-table-column prop="typeName" min-width="100" label="供货类别" />
        <el-table-column :formatter="tableFormatter" min-width="100" align="center" label="是否送检" />
        <el-table-column prop="checkStatusName" min-width="100" label="送检结果" />
        <el-table-column prop="sealDate" min-width="150" label="进场日期" />
      </el-table>
      <el-pagination
        :total="pageTotal"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :current-page="pageIndex"
        background
        layout="total, prev, pager, next, sizes, jumper"
        class="pager-wrap"
        @current-change="pageChangeHandle"
        @size-change="pageSizeChangeHandle"/>
    </el-main>
    <materialDetail
      v-show="isMaterialDetailShow"
      ref="materialDetailCom"
      :is-material-detail-show.sync="isMaterialDetailShow"
      @toPhotosZoom="toPhotosZoomHandle" />
    <photosZoom
      v-show="isPhotosZoomShow"
      ref="photosZoomCom"
      :is-photos-zoom-show.sync="isPhotosZoomShow" />
  </el-container>
</template>
<script>
import { mapActions } from 'vuex'
import PhotosZoom from '@/components/PhotosZoom'
import MaterialDetail from '@/views/material/material_acceptance/components/materialDetail'
import getProjectMixin from '@/mixins/getProjectStage'
import materialAcceptStatus from '@/mixins/materialAcceptStatus'
import { getMaterialType, getMaterialAcceptData } from '@/api/material/material_acceptance'
import { redStatus, greenStatus, orangeStatus, yellowStatus, grayStatus, blueStatus } from '@/styles/variables.scss'
export default {
  components: { MaterialDetail, PhotosZoom },
  mixins: [getProjectMixin, materialAcceptStatus],
  data() {
    return {
      filterFormData: {
        orgId: '',
        projectId: '',
        batchName: '',
        typeId: '',
        status: '',
        part: '',
        startDate: '',
        endDate: ''
      },
      timeSelected: [], // 保存选择的时间数据
      areaCompanys: [], // 保存区域公司数据
      companyProjects: [], // 保存选址区域公司后获取的项目数据
      materialTypeData: [], // 保存材料类型数据
      materialTypeProp: {
        label: 'name',
        value: 'id',
        children: 'children',
        emitPath: false
      }, // 保存材料类型级联选择器的配置数据
      materialTableData: [], // 保存获取的材料验收分页数据
      acceptStatusColors: [
        yellowStatus,
        orangeStatus,
        orangeStatus,
        greenStatus,
        redStatus,
        redStatus,
        grayStatus,
        blueStatus,
        grayStatus
      ], // 保存状态颜色数据
      pageIndex: 1,
      pageSize: 20,
      pageTotal: 0,
      fullFilterForm: false,
      isPhotosZoomShow: false,
      isMaterialDetailShow: false
    }
  },
  watch: {
    'filterFormData.orgId': function(newVal) {
      if (newVal !== '') {
        const orgIdList = Array.of(newVal)
        const orgData = this.areaCompanys.find(item => {
          return item.id === newVal
        })
        if (orgData.children) {
          orgData.children.forEach(org => {
            orgIdList.push(org.id)
          })
        }
        const _projects = this.projectDetailDatas.filter(project => {
          return orgIdList.includes(project.parent.orgId)
        })
        this.$set(this, 'companyProjects', _projects)
      }
    },
    timeSelected: function(newVal) {
      if (newVal && newVal.length > 0) {
        this.filterFormData.startDate = newVal[0]
        this.filterFormData.endDate = newVal[1]
      } else {
        this.filterFormData.startDate = ''
        this.filterFormData.endDate = ''
      }
    }
  },
  created() {
    const message = this.$message({
      message: '数据加载中',
      duration: 0
    })
    this.initPage().then(() => {
      message.close()
      this.getMaterialDatas()
    }).catch(() => {
      message.close()
    })
  },
  methods: {
    ...mapActions({
      getOrganization: 'getOrganizationData'
    }),
    tableFormatter(row, column, cellValue, index) {
      if (index === 9) {
        console.log('column', column)
        if (row.checkStatus) {
          return '是'
        } else {
          return '否'
        }
      }
    },
    // 页面初始化
    async initPage() {
      const type = this.$store.getters.organizationType.organization
      await this.getOrganization({ type, reGet: true }).then(resp => {
        resp.forEach(item => {
          if ('children' in item) {
            this.areaCompanys.push(...item.children)
          }
        })
      })
      await this.getProjectFunc().then((data) => {
        this.$set(this, 'companyProjects', data)
      })
      await getMaterialType().then(resp => {
        this.$set(this, 'materialTypeData', resp.result)
      })
    },
    // 设置分页查询材料验收数据的参数
    setParams() {
      const params = {}
      const keys = Object.keys(this.filterFormData)
      let paramsIndex = 0
      keys.forEach(key => {
        const curVal = this.filterFormData[key]
        if (curVal !== '' && curVal !== null) {
          params[`terms[${paramsIndex}].column`] = key
          params[`terms[${paramsIndex}].value`] = curVal
          if (key === 'startDate') {
            params[`terms[${paramsIndex}].column`] = 'sealDate'
            params[`terms[${paramsIndex}].termType`] = 'gt'
            params[`terms[${paramsIndex}].value`] = curVal
          } else if (key === 'endDate') {
            params[`terms[${paramsIndex}].column`] = 'sealDate'
            params[`terms[${paramsIndex}].termType`] = 'lt'
            params[`terms[${paramsIndex}].value`] = curVal
          }
          paramsIndex++
        }
      })
      params[`sorts[0].name`] = 'createTime'
      params[`sorts[0].order`] = 'desc'
      params['pageIndex'] = this.pageIndex - 1
      params['pageSize'] = this.pageSize
      console.log('params', params)
      return params
    },
    // 分页查询处理
    getMaterialDatas() {
      const params = this.setParams()
      getMaterialAcceptData(params).then(resp => {
        console.log('resp', resp)
        const data = resp.result.data
        this.pageTotal = resp.result.total
        this.pageIndex = resp.result.pageIndex + 1
        this.$set(this, 'materialTableData', data)
      })
    },
    // 查看材料验收记录详情
    showMaterialDetail(row) {
      const obj = {
        materialAcceptData: row
      }
      this.$refs['materialDetailCom'].resetDataProperty(obj)
      this.isMaterialDetailShow = true
    },
    setTableCellStyle() {
      return 'nowrap-row'
    },
    // 展示查看图片组件
    toPhotosZoomHandle(imgDatas) {
      const _obj = {
        photoList: imgDatas
      }
      this.$refs.photosZoomCom.resetDataProperty(_obj)
      this.isPhotosZoomShow = true
    },
    pageChangeHandle(page) {
      this.pageIndex = page
      this.getMaterialDatas()
    },
    pageSizeChangeHandle(page) {
      this.pageSize = page
      this.getMaterialDatas()
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
        margin: 15px 0 0 0;
        &.btn-item {
          padding-left: 10px;
        }
        .el-form-item__content {
          width: calc(100% - 102px);
        }
        .el-form-item__label {
          width: 90px;
          text-align: right
        }
        .el-select,
        .el-cascader,
        .date-select,
        .el-input {
          width: 100%;
        }
      }
    }
    .el-table {
      margin-top: 35px;
      &/deep/ .el-table__body tr {
        cursor: pointer;
      }
      &/deep/ .status-icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        vertical-align: text-top;
        border-radius: 15px;
        margin-right: 3px;
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
