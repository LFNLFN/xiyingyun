<template>
  <el-container class="container">
    <el-header height="auto">
      <div class="project-info-wrap">
        <div class="project-name-wrap">
          <i class="project-name-icon el-icon-s-management" />
          <span>模拟体验项目</span>
        </div>
        <el-row>
          <el-col>
            <el-row :gutter="10" class="info-row">
              <el-col :span="8">
                主项目名称：
                <span class="info-text">模拟体验项目</span>
              </el-col>
              <el-col :span="8">
                建筑面积：
                <span class="info-text">0.12万平方米</span>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="info-row">
              <el-col :span="8">
                状态：
                <span class="info-text">在建</span>
              </el-col>
              <el-col :span="8">
                阶段：
                <span class="info-text">--</span>
              </el-col>
              <el-col :span="8">
                交付类型：
                <span class="info-text">毛坯交付</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-main>
      <el-tabs v-model="showTabName" @tab-click="changTabShow">
        <el-tab-pane :lazy="true" label="主体进度" name="mainProgress">
          <mainProgress />
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="检查问题" name="chenckProblem">
          <checkProblems />
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="实测实量" name="measure">
          <Measure />
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="工序验收" name="progressAcceptance">
          <progressAcceptance />
        </el-tab-pane>
        <!-- <el-tab-pane :lazy="true" label="形象进度" name="imageProgress">
          <mainProgress />
        </el-tab-pane> -->
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import MainProgress from '@/views/project_portal/tabPanes/mainProgress'
import CheckProblems from '@/views/project_portal/tabPanes/checkProblems'
import Measure from '@/views/project_portal/tabPanes/measure'
import ProgressAcceptance from '@/views/project_portal/tabPanes/progressAcceptance'
export default {
  components: { MainProgress, CheckProblems, Measure, ProgressAcceptance },
  data() {
    return {
      searchFormData: {
        searchKey: ''
      },
      showTabName: 'mainProgress'
    }
  },
  methods: {
    changTabShow(tab, event) {
      console.log('tab', tab)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
@import "src/styles/variables.scss";

.container {
  min-height: calc(100vh - #{$navbarHeight});
  background: #f0f1f5;
  .el-header {
    padding: 20px 20px 0 65px;
    margin-top: 5px;
    background: #fff;
    .project-info-wrap {
      padding-top: 15px;
      .project-name-wrap {
        font-size: 22px;
        width: 100%;
        height: 30px;
        line-height: 30px;
        margin-bottom: 15px;
        .project-name-icon {
          width: 30px;
          height: 30px;
          line-height: 30px;
           font-size: 20px;
          text-align: center;
          border-radius: 30px;
          color: #fff;
          background: #009dff;
          float: left;
          margin-left: -40px;
        }
      }
      .info-row {
        padding: 5px 0;
        font-size: 14px;
        .info-text {
          color: #80848f;
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
