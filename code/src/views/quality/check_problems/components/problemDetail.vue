<template>
  <publicPopups width="750px" title-text="问题详情" v-on="$listeners" @closePopupsBox="closeBox">
    <template slot="main-content">
      <div class="mian-container">
        <div class="status-wrap">
          <span class="status">
            <i class="el-icon-s-opportunity" />
            已销毁
          </span>
          <span class="btn-wrap">
            <el-button type="primary" size="small">生成整改单</el-button>
            <el-button size="small">生成回复单</el-button>
          </span>
        </div>
        <div class="detail-info-wrap">
          <div class="detail-info-item">
            <label>项目名称: </label>
            <div class="detail-info">模拟体验项目</div>
          </div>
          <div class="detail-info-item">
            <label>检查项: </label>
            <div class="detail-info">临边堆物</div>
          </div>
          <div class="detail-info-item">
            <label>问题等级: </label>
            <div class="detail-info">一般</div>
          </div>
          <div class="detail-info-item">
            <label>问题描述: </label>
            <div class="detail-info">楼层边口、通道口、脚手架边缘等堆放任何物件。</div>
          </div>
          <div class="detail-info-item">
            <label>部位: </label>
            <div class="detail-info">1栋1单元1层101</div>
          </div>
          <div class="detail-info-item">
            <label>位置标记: </label>
            <div class="detail-info">已标记</div>
          </div>
        </div>
        <el-card shadow="never">
          <div slot="header">
            <span>整改信息</span>
          </div>
          <div class="detail-info-wrap">
            <div class="detail-info-item">
              <label>责任单位: </label>
              <div class="detail-info">模拟体验项目</div>
            </div>
            <div class="detail-info-item">
              <label>整改人: </label>
              <div class="detail-info">临边堆物</div>
            </div>
            <div class="detail-info-item">
              <label>整改期限: </label>
              <div class="detail-info">一般</div>
            </div>
            <div class="detail-info-item">
              <label>复检人: </label>
              <div class="detail-info">楼层边口、通道口、脚手架边缘等堆放任何物件。</div>
            </div>
            <div class="detail-info-item">
              <label>抄送人: </label>
              <div class="detail-info">1栋1单元1层101</div>
            </div>
          </div>
        </el-card>
        <el-card shadow="never">
          <div slot="header">
            <span>问题跟踪</span>
          </div>
          <ul class="track-list">
            <li class="track-item">
              <div class="user-problem-info-wrap">
                <i class="user-img el-icon-user-solid"/>
                <p>
                  项目1
                  <span class="date-text">2019-05-23 18:26</span>
                </p>
                <p>模拟体验项目</p>
              </div>
              <p class="problem-status">#创建记录</p>
              <p class="problem-content">楼层边口、通道口、脚手架边缘等堆放任何物件。 测试</p>
              <div class="photo-list">
                <div class="photo-item" />
              </div>
            </li>
          </ul>
        </el-card>
      </div>
    </template>
    <template slot="footer-content">
      <el-button type="primary" size="small" class="close-box-btn">关闭</el-button>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  methods: {
    closeBox() {
      this.$emit('update:isProblemDetailShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.mian-container {
  max-height: 520px;
  margin-top: 20px;
  padding: 0 20px;
  overflow-y: auto;
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
      }
      .detail-info {
        padding-left: 15px;
        display: inline-block;
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
        }
      }
    }
  }
}
</style>
