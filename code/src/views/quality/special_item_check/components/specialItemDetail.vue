<template>
  <leftSlidePopup :show="isPopupShow" width="680px" @leaveOver="closeBoxHandle">
    <div slot="main-content" class="container">
      <el-tabs v-model="showTabName" class="tabs-container">
        <el-tab-pane label="基础信息" name="baseInfos">
          <div class="base-Info-wrap">
            <div v-for="(value, name) in detailData" :key="name" class="Info-item">
              <span class="info-label">{{ name }}: </span>
              <span class="info-text">{{ value }}</span>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="检查问题" name="checkProblems">
          <div class="check-problem-wrap">
            <div class="btn-wrap">
              <el-button size="mini">导出检查问题报告</el-button>
              <el-button size="mini">导出整改回复报告</el-button>
            </div>
            <el-row class="count-wrap">
              <el-col :span="4" @click.native="selectProblemType(problemData.allProblemList)">
                <p>全部</p>
                <p class="all-problem-type-text">{{ problemData.allProblemList? problemData.allProblemList.length : 0 }}</p>
              </el-col>
              <el-col :span="4" @click.native="selectProblemType(problemData.assignProblemList)">
                <p>待指派</p>
                <p class="to-be-assigned-text">{{ problemData.assignProblemList? problemData.assignProblemList.length : 0 }}</p>
              </el-col>
              <el-col :span="4" @click.native="selectProblemType(problemData.rectificationProblemList)">
                <p>待整改</p>
                <p class="to-be-rectified-text">{{ problemData.rectificationProblemList? problemData.rectificationProblemList.length : 0 }}</p>
              </el-col>
              <el-col :span="4" @click.native="selectProblemType(problemData.waitSalesProblemList)">
                <p>待销项</p>
                <p class="to-be-destroyed-text">{{ problemData.waitSalesProblemList? problemData.waitSalesProblemList.length : 0 }}</p>
              </el-col>
              <el-col :span="4" @click.native="selectProblemType(problemData.hasSalesProblemList)">
                <p>已销项</p>
                <p class="already-destroyed-text">{{ problemData.hasSalesProblemList? problemData.hasSalesProblemList.length : 0 }}</p>
              </el-col>
              <el-col :span="4" @click.native="selectProblemType(problemData.invalidProblemList)">
                <p>已作废</p>
                <p class="already-obsolete-text">{{ problemData.invalidProblemList? problemData.invalidProblemList.length : 0 }}</p>
              </el-col>
            </el-row>
            <div class="percent-wrap">
              <span>整改完成率：{{ problemData.rectificationRate }}</span>
              <span>按时整改率：{{ problemData.timelyRate }}</span>
            </div>
            <div v-for="(item) in displayProblemList" :key="item.id" class="problem-wrap">
              <div class="header">
                <span class="status">
                  <i :style="{background: problemTypeMsg[item.status].color}" class="status-icon"/>
                  {{ problemTypeMsg[item.status].title }}
                </span>
                <el-button class="detail-btn no-border" size="mini" @click="checkProblemDetail">查看详情 ></el-button>
              </div>
              <div class="main">
                <div class="main-header">
                  <div>
                    <h3>{{ item.checkProblemDesc }}</h3>
                    <p>{{ item.content }}</p>
                  </div>
                  <span class="time-limit">整改期限：{{ item.deadline }}</span>
                </div>
                <div class="photo-wrap"><img :src="GetOssImgFullPath(item.image)" alt=""/></div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="close-box-btn" @click="popupHideHandle">
        <i class="el-icon-close" />
      </div>
      <!-- <problemDetail
        v-show="isProblemDetailShow"
        ref="problemDetailCom"
        :is-problem-detail-show.sync="isProblemDetailShow"
        @toPhotosZoom="toPhotosZoomHandle"
        @toShowPlanMark="toShowPlanMarkHandle"
      /> -->
    </div>
  </leftSlidePopup>
</template>
<script>
import problemTypeData from '@/mixins/problemTypeData.js'
import LeftSlidePopup from '@/components/Pop-ups/LeftSlidePopup'
import problemDetail from "@/views/quality/special_item_check/problemDetail.vue"
export default {
  components: {
    LeftSlidePopup,
    problemDetail
  },
  mixins: [problemTypeData],
  props: {
    isItemDetailShow: {
      type: Boolean,
      default: false
    },
    // 基础信息
    detailData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    problemData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      isPopupShow: true,
      showTabName: 'baseInfos',
      displayProblemList: []
    }
  },
  methods: {
    popupHideHandle() {
      // this.isPopupShow = false
      this.$emit('update:isItemDetailShow', false)
    },
    closeBoxHandle() {
      this.$emit('update:isItemDetailShow', false)
    },
    checkProblemDetail() {
      // this.$emit('update:isProblemDetailShow', false)
    },
    selectProblemType(arr) {
      this.displayProblemList = arr
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/variables.scss';
@import 'src/styles/mixin.scss';
@import 'src/styles/problemType.scss';

.container {
  height: 100%;
  padding: 15px;
  position: relative;
  .close-box-btn {
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: absolute;
    right: 0;
    top: 3px;
    color: #f00;
    font-size: 30px;
    cursor: pointer;
  }
  .tabs-container {
    width: 100%;
    height: 100%;
    .base-Info-wrap {
      padding: 15px 20px 20px 20px;
      .Info-item {
        width: 100%;
        margin:  10px 0;
        font-size: 14px;
        color: #495060;
        .info-label, .info-text {
          display: inline-block;
          // height: 30px;
          // line-height: 30px;
        }
        .info-label {
          width: 130px;
          font-weight: bold;
          text-align: right;
          vertical-align: top;
        }
        .info-text {
          width: calc(100% - 135px);
          padding-left: 5px;
          line-height: 20px;
        }
      }
    }
    .check-problem-wrap {
      padding: 15px;
      font-size: 14px;
      .count-wrap {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-top: 10px;
        .el-col {
          border-right: 1px solid #ccc;
          p {
            text-align: center;
            margin: 5px 0;
          }
        }
      }
      .percent-wrap {
        margin-top: 10px;
        span {
          margin-right: 20px;
        }
      }
      .problem-wrap {
        margin-top: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        .header {
          padding: 10px;
          border-bottom: 1px solid #ccc;
          @include flex-layout(space-between, center, null, null);
          .status {
            .status-icon {
              padding: 1px 9px;
              margin-right: 5px;
              background: #f00;
            }
            .detail-btn {
              color: #409EFF;
            }
          }
        }
        .main {
          padding: 10px;
          .main-header {
            @include flex-layout(space-between, center, null, null);
            h3 {
              margin: 10px 0;
            }
            .time-limit {
              font-size: 12px;
              padding: 10px 15px;
              border-radius: 6px;
              background: #dddee1;
            }
          }
        }
      }
    }
  }
}
</style>
