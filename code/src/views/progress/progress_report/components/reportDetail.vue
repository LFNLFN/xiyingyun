<template>
  <publicPopups width="750px" title-text="进度上报" v-on="$listeners" @closePopupsBox="closeBox">
    <template slot="main-content">
      <div class="mian-container">
        <div class="status-wrap">
          <span :style="{ 'background': acceptStatusColors[Number(reportDetailData.status)] }" class="status-icon" />
          <span>{{ reportDetailData.statusName }}</span>
        </div>
        <div class="detail-info-wrap">
          <div class="detail-info-item">
            <label>项目名称: </label>
            <div class="detail-info">{{ reportDetailData.projectName }}</div>
          </div>
          <div class="detail-info-item">
            <label>部位: </label>
            <div class="detail-info">{{ reportDetailData.partName }}</div>
          </div>
          <div class="detail-info-item">
            <label>工序项: </label>
            <div class="detail-info">{{ reportDetailData.settingName }}</div>
          </div>
          <div class="detail-info-item">
            <label>上报人: </label>
            <div class="detail-info">{{ reportDetailData.reportPersonName }}</div>
          </div>
          <div class="detail-info-item">
            <label>上报时间: </label>
            <div class="detail-info">{{ reportDetailData.reportDate }}</div>
          </div>
          <div class="detail-info-item">
            <label>审批人: </label>
            <div class="detail-info">{{ reportDetailData.approvalPersonName }}</div>
          </div>
          <div class="detail-info-item">
            <label>抄送人: </label>
            <div class="detail-info">{{ reportDetailData.ccPersonNames }}</div>
          </div>
        </div>
        <div class="detail-info-wrap">
          <el-collapse>
            <el-collapse-item title="操作日志" name="1">
              <div v-for="(item, idx) in reportDetailData.replyEntityList" :key="idx" class="detail-info-item" >
                <div class="detail-log">{{ item.createTime }}</div>
                <div class="detail-log">{{ item.personName }}</div>
                <div class="detail-log">{{ item.typeName }}</div>
                <div class="detail-log">{{ item.content }}</div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <el-dialog :visible.sync="dialogVisible" title="确认操作" width="30%" append-to-body>
        <el-input v-model="reasonText" :rows="3" type="textarea" placeholder="请输入原因" />
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" size="small" @click="confirmApproval">确 定</el-button>
        </span>
      </el-dialog>
    </template>
    <template slot="footer-content">
      <el-button v-if="reportDetailData.status===1&&reportDetailData.approvalPersonId==userInfo.id" type="primary" size="small" @click="progressHandle(0)">审批通过</el-button>
      <el-button v-if="reportDetailData.status===1&&reportDetailData.approvalPersonId==userInfo.id" size="small" @click="progressHandle(1)">审批不通过</el-button>
      <el-button v-if="reportDetailData.status!==3" type="danger" plain size="small" @click="progressHandle(2)">作废</el-button>
      <div/>
    </template>
  </publicPopups>
</template>
<script>
import { Loading } from 'element-ui'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import progressReportStatus from '@/mixins/progressReportStatus'
import { redStatus, greenStatus, orangeStatus, grayStatus } from '@/styles/variables.scss'
import { getReportDetail, reportApproval, reportInvalid } from '@/api/progress/index.js'

export default {
  components: { PublicPopups },
  mixins: [progressReportStatus],
  data() {
    return {
      reportId: '',
      acceptStatusColors: [
        redStatus,
        orangeStatus,
        greenStatus,
        grayStatus
      ], // 保存状态颜色数据
      reportDetailData: '',
      userInfo: {},
      dialogVisible: false,
      reasonText: '',
      replyType: 0
    }
  },
  methods: {
    resetDataProperty(id) {
      this.reportId = id
      this.userInfo = this.$store.getters.userAllInfo
      this.getReportDetailFunc()
    },
    // 加载问题详情
    getReportDetailFunc() {
      const loading = Loading.service({
        target: '.mian-container',
        text: '加载中...'
      })
      const id = this.reportId
      getReportDetail(id).then(resp => {
        this.$set(this, 'reportDetailData', resp.result)
        loading.close()
      })
    },
    progressHandle(val) {
      if (val === 0) {
        this.reasonText = '审批通过'
        this.replyType = 3
      } else if (val === 1) {
        this.reasonText = ''
        this.replyType = 2
      } else if (val === 2) {
        this.reasonText = ''
        this.replyType = 4
      }
      this.dialogVisible = true
    },
    confirmApproval() {
      if (this.reasonText === '') {
        this.$message({
          message: '请输入原因',
          type: 'warning'
        })
        return false
      }
      const param = { mainId: this.reportId, replyType: this.replyType, replyContent: this.reasonText }
      if (this.replyType === 4) {
        reportInvalid(param).then(resp => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.$emit('update:isReportDetailShow', false)
        })
      } else {
        reportApproval(param).then(resp => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.$emit('update:isReportDetailShow', false)
        })
      }
    },
    closeBox() {
      this.$emit('update:isReportDetailShow', false)
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
    // @include flex-layout(space-between, center, null, null);
    margin-bottom: 35px;
    &/deep/ .status-icon {
      display: inline-block;
      width: 12px;
      height: 12px;
      vertical-align: text-top;
      border-radius: 15px;
      margin-right: 3px;
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
      .detail-log {
        display: inline-block;
        margin-left: 35px;
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
    }
  }
}
</style>
