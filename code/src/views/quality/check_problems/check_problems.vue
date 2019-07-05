<template>
  <el-container>
    <el-header height="auto">
      <div class="search-wrap">
        <el-form>
          <el-form-item>
            <el-input v-model="searchFormData.key" size="small">
              <template slot="append">
                <el-button type="primary" size="small" class="search-btn">搜索</el-button>
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
            ref="allProblems" />
        </el-tab-pane>
        <el-tab-pane label="待指派" name="waitAssign">
          <tabProblems
            ref="waitAssign" />
        </el-tab-pane>
        <el-tab-pane label="待整改" name="waitAmend">
          <tabProblems
            ref="waitAmend" />
        </el-tab-pane>
        <el-tab-pane label="待销项" name="waitCancel">
          <tabProblems
            ref="waitCancel" />
        </el-tab-pane>
        <el-tab-pane label="已销项" name="canceled">
          <tabProblems
            ref="canceled" />
        </el-tab-pane>
        <el-tab-pane label="已作废" name="invalid">
          <tabProblems
            ref="invalid"
            :project-detail-datas="projectDetailDatas" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <problemDetail
      v-show="isProblemDetailShow"
      :is-problem-detail-show.sync="isProblemDetailShow" />
  </el-container>
</template>
<script>
import { mapActions } from 'vuex'
import TabProblems from '@/views/quality/check_problems/tabPanes/tabProblems'
import ProblemDetail from '@/views/quality/check_problems/components/problemDetail'
export default {
  components: { TabProblems, ProblemDetail },
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
      isProblemDetailShow: false
    }
  },
  created() {
    this.pageInit()
  },
  methods: {
    ...mapActions([
      'getProjectDetailsVuex'
    ]),
    pageInit() {
      // 加载项目数据
      this.getProjectDetailsVuex().then(resp => {
        resp.forEach((project, idx) => {
          const stages = project.childrenWithDetail
          if (stages && stages.length > 0) {
            stages.forEach(stage => {
              this.projectDetailDatas.push({
                id: stage.id,
                parentId: stage.parentId,
                name: `${project.name}--${stage.name}`,
                section: stage.childrenWithDetail || []
              })
            })
          }
        })
        const tabName = this.showTabName
        const _obj = {
          curTabStatus: this.tabStatusData[tabName],
          projectDetailDatas: this.projectDetailDatas
        }
        this.$refs[tabName].resetDataProperty(_obj)
      })
    },
    changTabShow(tab, event) {
      const tabName = tab.name
      const _obj = {
        curTabStatus: this.tabStatusData[tabName],
        projectDetailDatas: this.projectDetailDatas
      }
      this.$refs[tabName].resetDataProperty(_obj)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.el-container {
  min-height: calc(100vh - 50px);
  background: #f0f1f5;
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
