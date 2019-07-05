<template>
  <div class="main-content">
    <div class="filter-wrap">
      <el-form
        :inline="true"
        class="filter-form">
        <el-form-item label="快捷筛选:" class="block-item">
          <el-checkbox-group v-model="checkedBoxValList" size="small">
            <el-checkbox-button label="已逾期" />
            <el-checkbox-button label="我创建的" />
            <el-checkbox-button label="我整改的" />
            <el-checkbox-button label="逾期整改" />
          </el-checkbox-group>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item prop="projectId" label="项目名称:">
              <el-select
                v-model="filterFormData.projectId"
                size="small">
                <el-option
                  v-for="(item, idx) in projectDetailDatas"
                  :key="idx"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-="fullFilterForm">
            <el-col :span="8">
              <el-form-item prop="problemType" label="分类:">
                <el-select
                  v-model="filterFormData.problemType"
                  size="small"
                  @visible-change="(visiable) => getProblemTypeFunc(visiable)"
                  @change="problemTypeCheckedHandle">
                  <el-option
                    v-for="(item, idx) in problemTypeList"
                    :key="idx"
                    :label="item.name"
                    :value="item.problemType" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="checkSettingId" label="检查项:">
                <el-cascader
                  v-model="filterFormData.checkSettingId"
                  :clearable="true"
                  :options="checkItems"
                  :props="cascaderProps"
                  :show-all-levels="false"
                  size="small"
                  @visible-change="(visiable) => getCheckItemsFunc(visiable)" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检查批次:">
                <el-select
                  v-model="filterFormData.name"
                  size="small">
                  <el-option
                    v-for="(item, idx) in checkBatchs"
                    :key="idx"
                    :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="unitId" label="楼栋:">
                <el-select
                  v-model="filterFormData.unitId"
                  size="small"
                  @visible-change="(visiable) => getBuildingDataFunc(visiable)">
                  <el-option
                    v-for="(item, idx) in buildingDatas"
                    :key="idx"
                    :value="item.id"
                    :label="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="dutyOrgId" label="整改单位:">
                <el-select
                  v-model="filterFormData.dutyOrgId"
                  size="small"
                  @visible-change="(visiable) => getParticipantFunc(visiable)">
                  <el-option
                    v-for="(item, idx) in amendOrganizations"
                    :key="idx"
                    :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="createTime" label="创建时间:">
                <el-date-picker
                  v-model="filterFormData.createTime"
                  type="daterange"
                  size="small"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  class="date-select" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="creatorId" label="创建人:">
                <el-select
                  v-model="filterFormData.creatorId"
                  size="small"
                  @visible-change="(visiable) => getCreatedMembersFunc(visiable)">
                  <el-option
                    v-for="(item, idx) in createdMembers"
                    :key="idx"
                    :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="creatorOrgId" label="创建单位:">
                <el-select
                  v-model="filterFormData.creatorOrgId"
                  size="small"
                  @visible-change="(visiable) => getCreatedOrganFunc(visiable)">
                  <el-option
                    v-for="(item, idx) in createdOrganizations"
                    :key="idx"
                    :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="8">
            <el-form-item class="btn-wrap">
              <el-button type="primary" size="mini" @click="getCheckProblemsFunc">查询</el-button>
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
    </div>
    <div class="problem-list-wrap">
      <el-card class="problem-list-item">
        <div class="img-wrap">
          <el-image src="" class="problem-img" />
        </div>
        <div class="detail-wrap">
          <div class="header">
            <span>待销项</span>
            <span>2019-05-07</span>
          </div>
          <p class="content-text">卷材与基底粘结不牢、空鼓、搭接宽度不够、收口错误、铺设范围等</p>
          <div class="footer">
            <span>1栋1单元1层101</span>
            <span>一般</span>
          </div>
        </div>
      </el-card>
    </div>
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
import filterDatas from '@/views/quality/check_problems/mixins/filterDatas'
import { getCheckProblems } from '@/api/quality/checkProblems'
export default {
  mixins: [filterDatas],
  // props: {
  //   projectDetailDatas: {
  //     type: Array,
  //     default: () => {
  //       return []
  //     }
  //   }
  // },
  data() {
    return {
      filterFormData: {
        projectId: '',
        problemType: null,
        checkSettingId: '',
        unitId: '',
        dutyOrgId: '',
        createTime: [],
        creatorId: '',
        creatorOrgId: ''
      },
      projectDetailDatas: [], // 保存所有项目数据
      curTabStatus: null, // 保存当前tab代表的问题检查数据状态
      checkedBoxValList: [],
      problemTypeList: [], // 保存问题分类
      checkItems: [], // 保存检查项
      checkBatchs: [], // 保存检查批次
      buildingDatas: [], // 保存楼栋数据
      amendOrganizations: [], // 保存整改单位
      createdOrganizations: [], // 保存创建单位
      createdMembers: [], // 保存创建人员
      pageIndex: 0,
      pageTotal: 10,
      fullFilterForm: false
    }
  },
  watch: {
    projectDetailDatas: function(newVal, oldVal) {
      if (!isEmpty(newVal)) {
        this.filterFormData.projectId = newVal[0].id
        this.getCheckProblemsFunc()
      }
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this[key] = obj[key]
      })
    },
    // 获取问题数据
    getParams() {
      console.log('filterFormData', this.filterFormData)
      const params = {
        'sorts[0].name': 'createTime',
        'sorts[0].order': 'desc',
        'terms[0].column': 'status',
        'terms[0].value': this.curTabStatus
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
      console.log('params', params)
      return params
    },
    getCheckProblemsFunc() {
      const params = this.getParams()
      getCheckProblems(params).then(resp => {
        console.log('resp', resp)
      })
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
  .filter-wrap {
    .filter-form {
      padding: 20px;
      background: #fff;
      &/deep/ .el-form-item {
        width: 100%;
        white-space: nowrap;
        margin: 20px 0 0 0;
        .el-form-item__content {
          width: 100%;
        }
        .el-form-item__label {
          width: 90px;
          text-align: right
        }
        &.block-item {
          display: block;
        }
        .el-cascader, .el-select, .date-select {
          width: calc(100% - 102px);
        }
        .el-cascader {
          overflow: hidden;
        }
        &.btn-wrap {
          padding-left: 50px;
          .form-ctrl-btn {
            font-size: 14px;
          }
        }
      }
    }
  }
  .problem-list-wrap {
    .problem-list-item {
      width: 200px;
      height: 250px;
      font-size: 14px;
      margin: 15px 15px 0 0;
      &/deep/.el-card__body {
        padding: 0;
      }
      .img-wrap {
        width: 200px;
        height: 132px;
        @include flex-layout(center, center, null, null);
        problem-img {
          width: 100%;
        }
      }
      .detail-wrap {
        padding: 10px 20px;
        .header, .footer {
          @include flex-layout(space-between, center, null, null);
        }
        .content-text {
          height: 40px;
          margin: 12px 0;
          color: #80848f;
          line-height: 20px;
          @include ellipsis-textarea(2)
        }
        .footer {
          color: #80848f;
        }
      }
    }
  }
  .pager-wrap {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
