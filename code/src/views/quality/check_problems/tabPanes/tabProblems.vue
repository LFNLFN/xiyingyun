<template>
  <div class="main-content">
    <div class="filter-wrap">
      <el-form
        ref="filterForm"
        :inline="true"
        class="filter-form">
        <el-form-item label="快捷筛选:" class="block-item">
          <el-button
            :class="{'is-active': otherFilterCond['deadline'] !== null}"
            size="small"
            @click="addQuickFilterData('deadline')">已逾期</el-button>
          <el-button
            :class="{'is-active': otherFilterCond['creatorId'] !== null}"
            size="small"
            @click="addQuickFilterData('creatorId')">我创建的</el-button>
          <el-button
            :class="{'is-active': otherFilterCond['dutyPersonId'] !== null}"
            size="small"
            @click="addQuickFilterData('dutyPersonId')">我整改的</el-button>
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
          <template v-if="fullFilterForm">
            <el-col :span="8">
              <el-form-item prop="problemType" label="分类:">
                <el-select
                  :loading="problemTypeList.length === 0"
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
                  :loading="buildingDatas.length === 0"
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
                  :loading="amendOrganizations.length === 0"
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
            <!-- <el-col :span="8">
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
            </el-col> -->
            <el-col :span="8">
              <el-form-item prop="creatorId" label="创建人:">
                <el-select
                  :loading="createdMembers.length === 0"
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
                  :loading="createdOrganizations.length === 0"
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
              <el-button size="mini" @clock="resetForm">重置</el-button>
              <el-dropdown
                trigger="click"
                size="small">
                <el-button size="mini">
                  导出 <i class="el-icon-caret-bottom" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>整改通知单</el-dropdown-item>
                  <el-dropdown-item>整改回复单</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
      <el-card
        v-for="(item, idx) in checkProblemDatas"
        :key="idx"
        class="problem-list-item">
        <div
          :style="{'background-image': `url(${GetOssImgFullPath(item.images.split(',')[0])})`}"
          class="img-wrap"
          @click="toProblemDetailHandle(item)">
          <span
            :class="{'active': checkProblemIdSelected.includes(item.id)}"
            class="check-box"
            @click.stop="problemIdSelectedHandle(item.id)">
            <i class="el-icon-check" />
          </span>
        </div>
        <div class="detail-wrap">
          <div class="header">
            <span>{{ item.statusName }}</span>
            <span class="time-text">{{ item.deadline.split(' ')[0] }}</span>
          </div>
          <p class="content-text">{{ item.problemContent }}</p>
          <div class="footer">
            <span>{{ item.partName }}</span>
            <span>{{ item.levelName }}</span>
          </div>
        </div>
      </el-card>
    </div>
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
  </div>
</template>
<script>
import { isEmpty } from '@/utils/public'
import filterDatas from '@/views/quality/check_problems/mixins/filterDatas'
import { getCheckProblems } from '@/api/quality/checkProblems'
export default {
  mixins: [filterDatas],
  data() {
    return {
      /* -------------- 筛选表单相关数据 -----------------*/
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
      /* -------------- 筛选表单选项相关数据 -----------------*/
      projectDetailDatas: [], // 保存所有项目数据
      curTabStatus: null, // 保存当前tab代表的问题检查数据状态
      problemTypeList: [], // 保存问题分类
      checkItems: [], // 保存检查项
      checkBatchs: [], // 保存检查批次
      buildingDatas: [], // 保存楼栋数据
      amendOrganizations: [], // 保存整改单位
      createdOrganizations: [], // 保存创建单位
      createdMembers: [], // 保存创建人员
      otherFilterCond: {
        'deadline': null,
        'creatorId': null,
        'dutyPersonId': null,
        'problemContent': null
      }, // 保存快速筛选的添加
      searchProblemsKey: '',
      /* -------------- 问题检查相关数据 -----------------*/
      checkProblemDatas: [], // 保存问题检查数据
      checkProblemIdSelected: [], // 保存已选择的问题数据的id
      pageIndex: 1,
      pageSize: 20,
      pageTotal: 0,
      fullFilterForm: false
    }
  },
  watch: {
    projectDetailDatas: function(newVal, oldVal) {
      if (!isEmpty(newVal)) {
        this.filterFormData.projectId = newVal[0].id
        this.getCheckProblemsFunc()
      }
    },
    searchProblemsKey: function(newVal) {
      if (newVal === '') {
        this.otherFilterCond['problemContent'] = null
        this.getCheckProblemsFunc()
      } else {
        this.addQuickFilterData('problemContent')
      }
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this.$set(this, key, obj[key])
      })
    },
    // 添加快速筛选添加
    addQuickFilterData(cond) {
      if (this.otherFilterCond[cond] !== null) {
        this.otherFilterCond[cond] = null
      } else {
        if (cond === 'deadline') {
          const [curYear, curMon, curDay] = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]
          const curTime = `${curYear}-${curMon > 9 ? curMon : '0' + curMon}-${curDay > 9 ? curDay : '0' + curMon}`
          this.otherFilterCond[cond] = {
            'column': 'deadline',
            'termType': 'lte',
            'value': curTime
          }
        } else if (cond === 'creatorId' || cond === 'dutyPersonId') {
          const userInfo = this.$store.getters.userAllInfo
          this.otherFilterCond[cond] = {
            'column': cond,
            'value': userInfo.id
          }
        } else if (cond === 'problemContent') {
          this.otherFilterCond[cond] = {
            'column': cond,
            'termType': 'like',
            'value': this.searchProblemsKey
          }
        }
      }
      this.getCheckProblemsFunc()
    },
    // 获取加载问题数据的筛选条件
    getParams() {
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
      const _otherKeys = Object.keys(this.otherFilterCond)
      _otherKeys.forEach(key => {
        const _data = this.otherFilterCond[key]
        if (_data !== null) {
          const _condKeys = Object.keys(_data)
          _condKeys.forEach(ckey => {
            params[`terms[${paramIndex}].${ckey}`] = _data[ckey]
          })
          paramIndex++
        }
      })
      params['pageSize'] = this.pageSize
      params['pageIndex'] = this.pageIndex - 1
      console.log('params', params)
      return params
    },
    // 加载问题数据
    getCheckProblemsFunc() {
      const params = this.getParams()
      const message = this.$message({
        message: '正在加载问题数据...',
        duration: 0
      })
      getCheckProblems(params).then(resp => {
        console.log('resp', resp)
        const _data = resp.result
        this.checkProblemDatas = _data.data
        this.pageTotal = _data.total
        this.pageIndex = _data.pageIndex + 1
        message.close()
        if (this.checkProblemDatas.length === 0) {
          this.$message({
            message: '暂无数据...',
            duration: 2000,
            showClose: true
          })
        }
      }).catch(() => {
        message.close()
      })
    },
    // 问题选择操作处理
    problemIdSelectedHandle(id) {
      const index = this.checkProblemIdSelected.indexOf(id)
      if (index < 0) {
        this.checkProblemIdSelected.push(id)
      } else {
        this.checkProblemIdSelected.splice(index, 1)
      }
    },
    // 展示问题详情
    toProblemDetailHandle(data) {
      this.$emit('showProblemDetail', data)
    },
    // 重置表单
    resetForm() {
      this.$refs.filterForm.resetFields()
    },
    // 换页处理
    pageChangeHandle(page) {
      this.pageIndex = page
      this.getCheckProblemsFunc()
    },
    // 切换每页条数
    pageSizeChangeHandle(val) {
      this.pageSize = val
      this.getCheckProblemsFunc()
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.main-content {
  .filter-wrap {
    .filter-form {
      padding: 15px 20px;
      background: #fff;
      &/deep/ .el-form-item {
        width: 100%;
        white-space: nowrap;
        margin: 15px 0 0 0;
        .el-form-item__content {
          width: calc(100% - 102px);
        }
        .el-form-item__label {
          width: 90px;
          text-align: right
        }
        &.block-item {
          display: block;
          .el-button+.el-button {
            margin-left: 0px;
          }
          .is-active {
            color: #fff;
            border-color: #3a8ee6;
            background: #3a8ee6;
          }
        }
        .el-cascader, .el-select, .date-select {
          width: 100%;
        }
        &.btn-wrap {
          padding-left: 50px;
          .el-dropdown {
            margin-left: 13px;
            .el-button--mini {
              padding: 7px 8px;
            }
          }
          .form-ctrl-btn {
            font-size: 14px;
          }
        }
      }
    }
  }
  .problem-list-wrap {
    @include flex-layout(flex-start, center, row, wrap);
    .problem-list-item {
      // height: 250px;
      font-size: 14px;
      margin: 2% 2% 0 0;
      border: 1px solid #c1c1c1;
      &/deep/.el-card__body {
        padding: 0;
      }
      .img-wrap {
        width: 100%;
        padding-top: 65%;
        overflow: hidden;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
        background: #ccc;
        position: relative;
        .check-box {
          display: block;
          position: absolute;
          top: 5px;
          right: 5px;
          width: 22px;
          height: 22px;
          color: #fff;
          background: #fff;
          border-radius: 3px;
          text-align: center;
          line-height: 20px;
          border: 1px solid #ccc;
          font-size: 20px;
          cursor: pointer;
          &.active {
            border-color: #2d8cf0;
            background-color: #2d8cf0;
          }
        }
      }
      .detail-wrap {
        padding: 10px 12px;
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
    @media screen and (min-width: 1514px) {
      .problem-list-item {
        width: 15%;
        &:nth-of-type(6n) {
          margin-right: 0;
        }
      }
    }
    @media screen and (max-width: 1514px) and (min-width: 1301px) {
      .problem-list-item {
        width: 18.4%;
        &:nth-of-type(5n) {
          margin-right: 0;
        }
      }
    }
    @media screen and (max-width: 1300px) and (min-width: 1025px) {
      .problem-list-item {
        width: 23.5%;
        &:nth-of-type(4n) {
          margin-right: 0;
        }
      }
    }
    @media screen and (max-width: 1024px) {
      .problem-list-item {
        width: 32%;
        &:nth-of-type(3n) {
          margin-right: 0;
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
