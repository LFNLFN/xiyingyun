<template>
  <leftSlidePopup :show="isPopupShow" width="680px" @leaveOver="closeBoxHandle">
    <div slot="main-content" class="container">
      <el-tabs v-model="showTabName" class="tabs-container">
        <el-tab-pane label="基础信息" name="baseInfos">
          <div class="base-Info-wrap">
            <div class="Info-item">
              <span class="info-label">项目名称：</span>
              <span class="info-text">相如大街项目-二期</span>
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
              <el-col :span="4">
                <p>全部</p>
                <p>3</p>
              </el-col>
              <el-col :span="4">
                <p>待指派</p>
                <p>0</p>
              </el-col>
              <el-col :span="4">
                <p>待整改</p>
                <p>5</p>
              </el-col>
              <el-col :span="4">
                <p>待销项</p>
                <p>2</p>
              </el-col>
              <el-col :span="4">
                <p>已销项</p>
                <p>6</p>
              </el-col>
              <el-col :span="4">
                <p>已作废</p>
                <p>4</p>
              </el-col>
            </el-row>
            <div class="percent-wrap">
              <span>整改完成率：100.00%</span>
              <span>按时整改率：100.00%</span>
            </div>
            <div class="problem-wrap">
              <div class="header">
                <span class="status">
                  <i class="status-icon" />
                  待整改
                </span>
                <el-button class="detail-btn no-border" size="mini">查看详情 ></el-button>
              </div>
              <div class="main">
                <div class="main-header">
                  <h3>安全管理</h3>
                  <span class="time-limit">整改期限：2019-07-04</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="close-box-btn" @click="popupHideHandle">
        <i class="el-icon-close" />
      </div>
    </div>
  </leftSlidePopup>
</template>
<script>
import LeftSlidePopup from '@/components/Pop-ups/LeftSlidePopup'
export default {
  components: {
    LeftSlidePopup
  },
  props: {
    isItemDetailShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isPopupShow: true,
      showTabName: 'baseInfos'
    }
  },
  methods: {
    popupHideHandle() {
      this.isPopupShow = false
    },
    closeBoxHandle() {
      this.$emit('update:isItemDetailShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

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
