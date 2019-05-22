<template>
  <publicPopups width="550px" title-text="更改手机号码" v-on="$listeners" @closePopupsBox="submitedHandle">
    <template slot="main-content">
      <el-steps :active="curStepIndex" align-center finish-status="finish">
        <el-step title="验证身份" icon="el-icon-s-claim" />
        <el-step title="修改手机号码" icon="el-icon-edit" />
        <el-step title="完成更换" icon="el-icon-success" />
      </el-steps>
      <template v-if="showComHandle('verifyIdentidy')">
        <div class="content-wrap">
          <div class="phone-tips-wrap">
            <p>
              <span class="blod-text">已绑定的手机：</span>
              {{ bindingPhoneNum }}
            </p>
            <p class="small-text">若该手机号已无法使用请联系客服</p>
          </div>
          <el-form>
            <el-form-item label="输入验证码">
              <el-input placeholder="请输入验证码">
                <el-button slot="append">发送验证码</el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template v-else-if="showComHandle('changePhone')">
        <div class="content-wrap">
          <el-form>
            <el-form-item label="手机号码">
              <el-input placeholder="请输入手机号码"/>
            </el-form-item>
            <el-form-item label="输入验证码">
              <el-input placeholder="请输入验证码">
                <el-button slot="append">发送验证码</el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template v-else-if="showComHandle('success')">
        <div class="content-wrap">
          <div class="success-wrap">
            <i class="el-icon-success" />
            <span>更换完成</span>
          </div>
        </div>
      </template>
    </template>
    <template slot="footer-content">
      <el-button size="danger" @click="nextStepHandle">{{ btnText[curStepIndex] }}</el-button>
      <div class="tips-wrap">
        <span class="title-text">温馨提示：</span>
        <template v-if="showComHandle('verifyIdentidy')">
          <span>
            <p>• 为保障您的帐号安全，变更重要信息需要身份验证</p>
            <p>• 若有疑问请联系在线客服或拨打400-0000-000（周一至周日 8:00-18:00）</p>
          </span>
        </template>
        <template v-else>
          <span>
            <p>• 绑定手机可提高帐号安全性</p>
            <p>• 一个手机号只能绑定一个帐号</p>
          </span>
        </template>
      </div>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  data() {
    return {
      bindingPhoneNum: '13760026422', // 保存原来绑定的手机号码
      components: ['verifyIdentidy', 'changePhone', 'success'],
      curStepIndex: 0, // 保存当前步骤index
      btnText: ['下一步', '保存', '完成'] //  保存按钮文字
    }
  },
  methods: {
    showComHandle(comName) {
      return this.components[this.curStepIndex] === comName
    },
    nextStepHandle() {
      if (this.curStepIndex === 2) {
        this.curStepIndex = 0
        this.$emit('update:isChangePhoneShow', false)
      } else {
        this.curStepIndex += 1
      }
    },
    submitedHandle() {
      this.$emit('update:isChangePhoneShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
  .el-steps {
    width: 100%;
    padding: 20px;
    &/deep/.el-step__title {
      font-size: 14px;
    }
  }
  .content-wrap {
    height: 200px;
    @include flex-layout(center, center, null, wrap);
    .phone-tips-wrap {
      text-align: center;
      font-size: 18px;
      p {
        // margin-top: 0;
        // margin-bottom: 20px;
        margin: 10px 0;
      }
      .bold-text {
        font-weight: bold;
      }
      .small-text {
        font-size: 12px;
      }
    }
    .el-form {
      // padding: 20px;
      .el-form-item {
        @include flex-layout(center, center, null, nowrap);
        &/deep/.el-form-item__label {
          width: 90px;
          text-align: left;
        }
        .el-input {
          width: 300px;
        }

      }
    }
    .success-wrap {
      width: 100%;
      text-align: center;
      padding: 20px 0 30px 0;
      i {
        font-size: 60px;
        color: #4CAF50;
      }
      span {
        display: block;
        font-size: 20px;
        margin-top: 20px;
        color: #4CAF50;
      }
    }
  }
  .tips-wrap {
    width: 100%;
    text-align: center;
    margin-top: 30px;
    .title-text {
      font-size: 12px;
      font-weight: bold;
      width: 62px;
      vertical-align: top;
    }
    span {
      display: inline-block;
      p {
        text-align: left;
        font-size: 10px;
        margin: 0 0 10px 0;
      }
    }
  }
}
</style>
