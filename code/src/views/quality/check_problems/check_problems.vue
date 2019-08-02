<template>
  <el-container class="global-container">
    <el-header height="auto">
      <div class="search-wrap">
        <el-form>
          <el-form-item>
            <el-input v-model="searchFormData.searchKey" size="small">
              <template slot="append">
                <el-button
                  type="primary"
                  size="small"
                  class="search-btn"
                  @click="searchProblemsByKey">搜索</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-header>
    <el-main>
      <el-tabs v-model="showTabName" @tab-click="changTabShow">
        <el-tab-pane label="全部" name="allProblems">
          <tabProblems
            ref="allProblems"
            @showProblemDetail="toProblemDetailHandle" />
        </el-tab-pane>
        <el-tab-pane label="待指派" name="waitAssign">
          <tabProblems
            ref="waitAssign"
            @showProblemDetail="toProblemDetailHandle" />
        </el-tab-pane>
        <el-tab-pane label="待整改" name="waitAmend">
          <tabProblems
            ref="waitAmend"
            @showProblemDetail="toProblemDetailHandle" />
        </el-tab-pane>
        <el-tab-pane label="待销项" name="waitCancel">
          <tabProblems
            ref="waitCancel"
            @showProblemDetail="toProblemDetailHandle" />
        </el-tab-pane>
        <el-tab-pane label="已销项" name="canceled">
          <tabProblems
            ref="canceled"
            @showProblemDetail="toProblemDetailHandle" />
        </el-tab-pane>
        <el-tab-pane label="已作废" name="invalid">
          <tabProblems
            ref="invalid"
            @showProblemDetail="toProblemDetailHandle" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <problemDetail
      v-show="isProblemDetailShow"
      ref="problemDetailCom"
      :is-problem-detail-show.sync="isProblemDetailShow"
      @toPhotosZoom="toPhotosZoomHandle"
      @toShowPlanMark="toShowPlanMarkHandle" />
    <photosZoom
      v-show="isPhotosZoomShow"
      ref="photosZoomCom"
      :is-photos-zoom-show.sync="isPhotosZoomShow" />
    <showPlanMark
      v-show="isShowPlanMarkShow"
      ref="showPlanMarkCom"
      :is-show-plan-mark-show.sync="isShowPlanMarkShow" />
  </el-container>
</template>
<script>
import getProjectMixin from '@/mixins/getProjectStage'
import PhotosZoom from '@/components/PhotosZoom'
import TabProblems from '@/views/quality/check_problems/tabPanes/tabProblems'
import ShowPlanMark from '@/views/quality/check_problems/components/showPlanMark'
import ProblemDetail from '@/views/quality/check_problems/components/problemDetail'
export default {
  components: { TabProblems, ProblemDetail, PhotosZoom, ShowPlanMark },
  mixins: [getProjectMixin],
  data() {
    return {
      searchFormData: {
        searchKey: ''
      },
      showTabName: 'allProblems',
      tabStatusData: {
        'allProblems': null,
        'waitAssign': 0,
        'waitAmend': 1,
        'waitCancel': 2,
        'canceled': 3,
        'invalid': 4
      },
      projectDetailDatas: [], // 保存项目数据
      isProblemDetailShow: false,
      isPhotosZoomShow: false,
      isShowPlanMarkShow: false
    }
  },
  created() {
    this.getProjectFunc().then((data) => {
      const tabName = this.showTabName
      const _obj = {
        curTabStatus: this.tabStatusData[tabName],
        projectDetailDatas: this.projectDetailDatas
      }
      this.$refs[tabName].resetDataProperty(_obj)
    })
  },
  methods: {
    // 根据关键字搜索问题
    searchProblemsByKey() {
      const key = this.searchFormData.searchKey
      const tabName = this.showTabName
      const _obj = {
        searchProblemsKey: key
      }
      this.$refs[tabName].resetDataProperty(_obj)
    },
    // 更改要显示的tab
    changTabShow(tab, event) {
      const tabName = tab.name
      const _obj = {
        curTabStatus: this.tabStatusData[tabName],
        projectDetailDatas: this.projectDetailDatas
      }
      this.$refs[tabName].resetDataProperty(_obj)
    },
    // 展示问题详情
    toProblemDetailHandle(data) {
      const _obj = {
        curProblemData: data
      }
      this.$refs['problemDetailCom'].resetDataProperty(_obj)
      this.isProblemDetailShow = true
    },
    // 展示查看图片组件
    toPhotosZoomHandle(imgDatas) {
      const _obj = {
        photoList: imgDatas
      }
      this.$refs.photosZoomCom.resetDataProperty(_obj)
      this.isPhotosZoomShow = true
    },
    // 展示标记详情
    toShowPlanMarkHandle(pdata, mdata) {
      const _obj = {
        curProblemData: pdata,
        markList: mdata
      }
      this.$refs.showPlanMarkCom.resetDataProperty(_obj)
      this.isShowPlanMarkShow = true
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
@import "src/styles/variables.scss";

.el-container {
  .el-header {
    padding: 0;
    margin-top: 5px;
    .search-wrap {
      width: 100%;
      height: auto;
      background: #fff;
      .el-form {
        width: 400px;
        margin: 0 auto;
        padding: 40px 0 1px 0;
        &/deep/.el-input-group__append {
          border: none;
          padding: 9px 20px;
          overflow: hidden;
        }
        &/deep/.search-btn {
          padding: 10px 20px;
          color: #fff;
          background: #2d8cf0;
          border-color: #2d8cf0;
          border-radius: 0;
        }
      }
    }
  }
  .el-main {
    padding: 0;
    &/deep/.el-tabs {
      .el-tabs__header {
        margin: 0;
        padding: 20px 20px 0 20px;
        background: #fff;
      }
      .el-tabs__content {
        padding: 20px;
      }
    }
  }
}
</style>
