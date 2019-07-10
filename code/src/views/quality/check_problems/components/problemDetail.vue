<template>
  <publicPopups width="750px" title-text="问题详情" v-on="$listeners" @closePopupsBox="closeBox">
    <template slot="main-content">
      <div class="mian-container">
        <div class="status-wrap">
          <span
            :style="{'color': statusColors[Number(problemDetailData.status)]}"
            class="status">
            <i class="el-icon-s-opportunity" />
            {{ problemDetailData.statusName }}
          </span>
          <span class="btn-wrap">
            <el-button type="primary" size="small">生成整改单</el-button>
            <el-button size="small">生成回复单</el-button>
          </span>
        </div>
        <div class="detail-info-wrap">
          <div class="detail-info-item">
            <label>项目名称: </label>
            <div class="detail-info">{{ problemDetailData.projectName }}</div>
          </div>
          <div class="detail-info-item">
            <label>检查项: </label>
            <div class="detail-info">{{ problemDetailData.checkSettingName }}</div>
          </div>
          <div class="detail-info-item">
            <label>问题等级: </label>
            <div class="detail-info">{{ problemDetailData.levelName }}</div>
          </div>
          <div class="detail-info-item">
            <label>问题描述: </label>
            <div class="detail-info">{{ problemDetailData.problemContent }}</div>
          </div>
          <div class="detail-info-item">
            <label>部位: </label>
            <div class="detail-info">{{ problemDetailData.partName }}</div>
          </div>
          <div class="detail-info-item">
            <label>位置标记: </label>
            <template v-if="problemDetailData.markEntityList && problemDetailData.markEntityList.length > 0">
              <div class="detail-info">
                已标记
                <el-button class="no-border mark-btn" @click="showPlanMarkHandle">
                  <i class="el-icon-location"/>
                  查看标记
                </el-button>
              </div>
            </template>
            <template v-else>
              <div class="detail-info">未标记</div>
            </template>
          </div>
        </div>
        <el-card shadow="never">
          <div slot="header">
            <span>整改信息</span>
          </div>
          <div class="detail-info-wrap">
            <div class="detail-info-item">
              <label>责任单位: </label>
              <div class="detail-info">{{ dutyOrgData.fullName }}</div>
            </div>
            <div class="detail-info-item">
              <label>整改人: </label>
              <div class="detail-info">{{ dutyPersonData.name }}</div>
            </div>
            <div class="detail-info-item">
              <label>整改期限: </label>
              <div class="detail-info">{{ problemDetailData.deadline }}</div>
            </div>
            <div class="detail-info-item">
              <label>复检人: </label>
              <div class="detail-info">{{ checkPersonData.name }}</div>
            </div>
            <div class="detail-info-item">
              <label>抄送人: </label>
              <template v-if="problemDetailData.ccPersonEntityList">
                <div class="detail-info">
                  <span
                    v-for="(item, idx) in problemDetailData.ccPersonEntityList"
                    :key="idx"
                    class="text-span">
                    {{ item.name }}
                  </span>
                </div>
              </template>
            </div>
          </div>
        </el-card>
        <el-card shadow="never">
          <div slot="header">
            <span>问题跟踪</span>
          </div>
          <template v-if="problemDetailData.replyEntityList && problemDetailData.replyEntityList.length > 0">
            <ul class="track-list">
              <li
                v-for="(reply, ridx) in problemDetailData.replyEntityList"
                :key="ridx"
                class="track-item">
                <div class="user-problem-info-wrap">
                  <i class="user-img el-icon-user-solid"/>
                  <p>
                    <span v-if="reply.personEntity">{{ reply.personEntity.name }}</span>
                    <span class="date-text">{{ reply.createTime }}</span>
                  </p>
                  <p v-if="reply.orgEntity">{{ reply.orgEntity.fullName }}</p>
                </div>
                <p class="problem-status">#{{ reply.typeName }}</p>
                <p class="problem-content">{{ reply.content }}</p>
                <div v-if="reply.image && reply.image !== ''" class="photo-list">
                  <div
                    v-for="(img, imgidx) in String(reply.image).split(',')"
                    :key="imgidx"
                    class="photo-item">
                    <img
                      :src="GetOssImgFullPath(img)"
                      @click="showPhotoZoomHandle(reply.image)" >
                  </div>
                </div>
              </li>
            </ul>
          </template>
        </el-card>
      </div>
    </template>
    <template slot="footer-content">
      <el-button type="primary" size="small" class="close-box-btn" @click="closeBox">关闭</el-button>
    </template>
  </publicPopups>
</template>
<script>
import { Loading } from 'element-ui'
import { isEmpty } from '@/utils/public'
import { getCheckProblemDetail } from '@/api/quality/checkProblems'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { redStatus, greenStatus, orangeStatus, yellowStatus, grayStatus } from '@/styles/variables.scss'
export default {
  components: { PublicPopups },
  data() {
    return {
      curProblemData: {}, // 保存当前问题信息
      problemDetailData: {}, // 保存问题详情信息
      dutyOrgData: {}, // 保存责任单位信息
      dutyPersonData: {}, // 保存责任人信息
      checkPersonData: {}, // 保存复检人信息
      statusColors: [orangeStatus, redStatus, yellowStatus, greenStatus, grayStatus]
    }
  },
  watch: {
    curProblemData: function(newVal) {
      if (!isEmpty(newVal)) {
        this.getProblemDetailFunc()
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
    // 加载问题详情
    getProblemDetailFunc() {
      const loading = Loading.service({
        target: '.mian-container',
        text: '加载中...'
      })
      const id = this.curProblemData.id
      getCheckProblemDetail(id).then(resp => {
        this.$set(this, 'problemDetailData', resp.result)
        this.dutyOrgData = this.problemDetailData.dutyOrgEntity || {}
        this.dutyPersonData = this.problemDetailData.dutyPersonEntity || {}
        this.checkPersonData = this.problemDetailData.checkPersonEntity || {}
        loading.close()
      })
    },
    // 查看图片操作
    showPhotoZoomHandle(datas) {
      const imageDataList = []
      const dataList = datas.split(',')
      dataList.forEach(item => {
        imageDataList.push({
          imgSrc: item
        })
      })
      this.$emit('toPhotosZoom', imageDataList)
    },
    // 查看标记操作处理
    showPlanMarkHandle() {
      const detail = this.problemDetailData
      const markList = this.problemDetailData.markEntityList
      this.$emit('toShowPlanMark', detail, markList)
    },
    closeBox() {
      this.$emit('update:isProblemDetailShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.mian-container {
  padding: 0 20px;
  margin-top: 20px;
  color: #495060;
  .status-wrap  {
    @include flex-layout(space-between, center, null, null);
    .status {
      color: #ffbf00;
      &.pass {
        color: #4caf50;
      }
    }
  }
  .detail-info-wrap {
    margin-bottom: 25px;
    font-size: 14px;
    .detail-info-item {
      margin: 12px 0;
      label {
        width: 90px;
        text-align: right;
        display: inline-block;
        vertical-align: top;
      }
      .detail-info {
        width: calc(100% - 100px);
        line-height: 20px;
        font-size: 12px;
        padding-left: 15px;
        display: inline-block;
        .text-span {
          margin-right: 10px;
        }
        .mark-btn {
          font-size: 12px;
          color: #409eff;
          margin-left: 8px;
        }
      }
    }
  }
  .el-card {
    border: none;
    &/deep/.el-card__header {
      padding: 15px 0 5px 5px;
    }
    &/deep/.el-card__body {
      padding: 10px 0 0 0;
    }
  }
  .track-list {
    list-style: none;
    padding: 0;
    margin: 15px 0 0 0;
    .track-item {
      font-size: 12px;
      color: #80848f;
      width: 100%;
      margin-bottom: 10px;
      padding: 10px 10px 20px 70px;
      border: 1px solid #dddee1;
      box-shadow: 0 0 5px #dddee1;
      .user-problem-info-wrap {
        position: relative;
        .user-img {
          width: 40px;
          height: 40px;
          line-height: 40px;
          background: #d9d9d9;
          border-radius: 50px;
          position: absolute;
          left: -50px;
          top: -3px;
          color: #fff;
          font-size: 26px;
          text-align: center;
        }
        .date-text {
          float: right;
        }
      }
      p {
        margin: 7px 0;
        &.problem-status {
          color: #5cadff;
        }
      }
      .photo-list {
        @include flex-layout(flex-start, flex-start, null, wrap);
        .photo-item {
          width: 130px;
          height: 115px;
          border: 1px solid #dddee1;
          border-radius: 5px;
          margin: 10px 10px 0 0;
          padding: 10px;
          @include flex-layout(center, center, null, null);
          img {
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
