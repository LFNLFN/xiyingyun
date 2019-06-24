<template>
  <publicPopups width="650px" title-text="验收详情" v-on="$listeners" @closePopupsBox="closeBox">
    <template slot="main-content">
      <div class="mian-container">
        <div class="status-wrap">
          <span class="status">
            <i class="el-icon-s-opportunity" />
            待验收
          </span>
          <span class="btn-wrap">
            <el-button type="danger" size="small">作废</el-button>
          </span>
        </div>
        <div class="process-info-wrap">
          <div class="process-info-item">
            <label>项目名称: </label>
            <div class="process-info">模拟体验项目</div>
          </div>
          <div class="process-info-item">
            <label>工序验收项: </label>
            <div class="process-info">防水工程（卫生间、厨房、阳台）</div>
          </div>
          <div class="process-info-item">
            <label>部位: </label>
            <div class="process-info">1栋-204，1栋-203，1栋-202，1栋-201</div>
          </div>
          <div class="process-info-item">
            <label>申报人: </label>
            <div class="process-info">前山桥彭于晏</div>
          </div>
          <div class="process-info-item">
            <label>施工单位: </label>
            <div class="process-info">中国建设集团有限公司测试</div>
          </div>
          <div class="process-info-item">
            <label>验收人: </label>
            <div class="process-info">安洋</div>
          </div>
          <div class="process-info-item">
            <label>抄送人: </label>
            <div class="process-info">安洋</div>
          </div>
        </div>
        <div class="accept-tab-wrap">
          <div class="info-wrap">
            <p class="title">1.品牌型号符合合同要求</p>
            <p class="content">涂膜防水的品种、牌号及配合比，必须符合工程要求和有关规范要求，每批产品应附有出厂合格证。</p>
          </div>
          <div class="accept-wrap">
            <span class="accept-tab">自检合格</span>
            <span class="user-date-info">2019-06-18 20:31:30 前山桥彭于晏</span>
          </div>
          <div v-show="false" class="photo-wrap">
            <ul class="photo-list">
              <li>
                <img src="http://estate-dev.oss-cn-shenzhen.aliyuncs.com/project_plan_1560769936000" >
              </li>
            </ul>
          </div>
        </div>
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
      this.$emit('update:isAcceptDetailShow', false)
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
  .process-info-wrap {
    margin-bottom: 25px;
    font-size: 14px;
    .process-info-item {
      margin: 12px 0;
      label {
        width: 90px;
        text-align: right;
        display: inline-block;
      }
      .process-info {
        padding-left: 15px;
        display: inline-block;
      }
    }
  }
  .accept-tab-wrap {
    padding: 10px 15px;
    margin-top: 10px;
    border: 1px solid #dddee1;
    border-radius: 10px;
    font-size: 14px;
    .info-wrap {
      padding-bottom: 10px;
      border-bottom: 1px solid #dddee1;
      p {
        margin: 5px 0 0 0
      }
    }
    .accept-wrap {
      margin-top: 15px;
      padding-bottom: 10px;
      @include flex-layout(space-between, center, null, null);
      .accept-tab {
        font-size: 12px;
        color: #fff;
        padding: 5px 15px;
        background: #80848f;
        border-radius: 15px;
      }
      .user-date-info {
        font-size: 10px;
      }
    }
    .photo-wrap {
      .photo-list {
        margin: 0;
        padding: 1px;
        list-style: none;
        @include flex-layout(flex-start, center, null, wrap);
        li {
          width: 120px;
          height: 120px;
          margin: 10px;
          border: 1px solid #dddee1;
          border-radius: 10px;
          @include flex-layout(center, center, null, wrap);
          img {
            width: 90%;
          }
        }
      }
    }
  }
}
</style>
