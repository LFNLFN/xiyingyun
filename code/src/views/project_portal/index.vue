<template>
  <el-container class="container global-container">
    <el-header height="auto">
      <div class="project-info-wrap">
        <div class="project-name-wrap">
          <i class="project-name-icon el-icon-s-management" />
          <span>{{ projectData.name }}</span>
        </div>
        <el-row>
          <el-col>
            <el-row :gutter="10" class="info-row">
              <el-col :span="8">
                主项目名称：
                <span class="info-text">{{ projectData.parentName }}</span>
              </el-col>
              <el-col :span="8">
                建筑面积：
                <span
                  v-if="fullProjectData.estateProjectDetailEntity"
                  class="info-text">{{ Number(fullProjectData.estateProjectDetailEntity.constructionArea) / 10000 || 0 }} 万平方米</span>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="info-row">
              <el-col :span="8">
                状态：
                <span
                  v-if="fullProjectData.estateProjectDetailEntity"
                  class="info-text">{{ getProjectStatusName(fullProjectData.estateProjectDetailEntity.typeId) }}</span>
              </el-col>
              <el-col :span="8">
                阶段：
                <span
                  v-if="fullProjectData.estateProjectDetailEntity"
                  class="info-text">{{ getProjectStatusName(fullProjectData.estateProjectDetailEntity.constructionStage) }}</span>
              </el-col>
              <el-col :span="8">
                交付类型：
                <span
                  v-if="fullProjectData.estateProjectDetailEntity"
                  class="info-text">{{ getProjectStatusName(fullProjectData.estateProjectDetailEntity.deliveryType) }}</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-main>
      <el-tabs v-model="showTabName" @tab-click="changTabShow">
        <el-tab-pane :lazy="true" label="主体进度" name="mainProgress">
          <mainProgress
            ref="mainProgress" />
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="检查问题" name="chenckProblem">
          <checkProblems
            ref="chenckProblem" />
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="实测实量" name="measure">
          <Measure
            ref="measure" />
        </el-tab-pane>
        <!-- <el-tab-pane :lazy="true" label="工序验收" name="progressAcceptance">
          <progressAcceptance
            ref="progressAcceptance" />
        </el-tab-pane> -->
        <!-- <el-tab-pane :lazy="true" label="形象进度" name="imageProgress">
          <mainProgress />
        </el-tab-pane> -->
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import getProjectMixin from '@/mixins/getProjectStage'
import MainProgress from '@/views/project_portal/tabPanes/mainProgress'
import CheckProblems from '@/views/project_portal/tabPanes/checkProblems'
import Measure from '@/views/project_portal/tabPanes/measure'
import ProgressAcceptance from '@/views/project_portal/tabPanes/progressAcceptance'
import { getDictionaryItem } from '@/api/dictionary'
export default {
  components: { MainProgress, CheckProblems, Measure, ProgressAcceptance },
  mixins: [getProjectMixin],
  data() {
    return {
      searchFormData: {
        searchKey: ''
      },
      showTabName: 'mainProgress',
      projectData: {}, // 项目简略信息
      fullProjectData: {}, // 项目所有信息
      projectStatusData: [] // 项目状态相关的数据，包含项目状态，交付类型，阶段数据
    }
  },
  created() {
    this.initPage().then(() => {
      this.changTabShow()
    }).catch(() => {
      console.log('error')
    })
  },
  methods: {
    async initPage() {
      await this.getProjectFunc().then((data) => {
        const projectId = this.$route.query.projectId
        this.projectData = data.find(item => {
          return item.id === projectId
        })
        this.fullProjectData = this.projectData.source
      })
      await this.getProjectStatusDatas()
    },
    // 获取项目状态，交付类型，项目阶段数据
    getProjectStatusDatas() {
      const params = {
        'terms[0].column': 'dictId',
        'terms[0].termType': 'in',
        'terms[0].value': 'project_status,construction_type,delivery_type'
      }
      return new Promise((resolve, reject) => {
        getDictionaryItem(params).then(resp => {
          this.$set(this, 'projectStatusData', resp.result)
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 根据状态id获取状态名称
    getProjectStatusName(id) {
      const statuDatas = this.projectStatusData.find(item => {
        return item.id === id
      })
      if (statuDatas) {
        return statuDatas.value
      }
      return ''
    },
    changTabShow() {
      this.$nextTick(() => {
        const tabName = this.showTabName
        const _obj = {
          projectData: this.fullProjectData
        }
        this.$refs[tabName].resetDataProperty(_obj)
      })
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
@import "src/styles/variables.scss";

.container {
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
