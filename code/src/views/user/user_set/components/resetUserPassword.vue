<template>
  <publicPopups width="550px" title-text="重置密码" v-on="$listeners" @closePopupsBox="submitedHandle">
    <template slot="main-content">
      <el-form
        ref="resetForm"
        v-model="resetForm"
        :rules="resetFormRules">
        <el-form-item prop="phone" label="手机号/账号">
          <el-input placeholder="请输入手机号或账号"/>
        </el-form-item>
        <el-form-item prop="verifyNum" label="短信验证码">
          <el-input placeholder="请输入验证码">
            <el-button slot="append" @click="sendVerifyNumHandle">{{ verifyNumBtnText }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" label="输入密码">
          <el-input placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item prop="reIptPassword" label="确认密码">
          <el-input placeholder="请再次输入密码"/>
        </el-form-item>
      </el-form>
    </template>
    <template slot="footer-content">
      <el-button size="danger">重置</el-button>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { isvalidPassword, isvalidPhoneNum } from '@/utils/validate'
export default {
  components: { PublicPopups },
  data() {
    const validReputPassword = (rule, val, callback) => {
      if (val !== this.resetForm.password) {
        callback(new Error('两次输入密码不一致'))
      }
    }
    return {
      resetForm: {
        phone: '',
        verifyNum: '',
        password: '',
        reIptPassword: ''
      },
      resetFormRules: {
        phone: [{ required: true, trigger: 'blur', validator: isvalidPhoneNum }],
        verifyNum: [{ required: true, trigger: 'blur', message: '验证码不能为空' }],
        password: [{ required: true, trigger: 'change', validator: isvalidPassword }],
        reIptPassword: [{ required: true, trigger: 'change', validator: validReputPassword }]
      },
      verifyNumBtnText: '发送验证码',
      sendingVerifyNum: false
    }
  },
  methods: {
    sendVerifyNumHandle() {
      if (this.sendingVerifyNum) return
      this.sendingVerifyNum = true
      let timeNum = 60
      this.verifyNumBtnText = `${timeNum}秒后可重发`
      const verifyTimer = setInterval(() => {
        timeNum--
        this.verifyNumBtnText = `${timeNum}秒后可重发`
        if (timeNum === 0) {
          clearInterval(verifyTimer)
          this.sendingVerifyNum = false
          this.verifyNumBtnText = '重新发送'
        }
      }, 1000)
    },
    submitedHandle() {
      this.$emit('update:isResetPswShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
  .el-form {
    padding: 40px 20px 10px 20px;
    .el-form-item {
      @include flex-layout(center, center, null, nowrap);
      &/deep/.el-form-item__label {
        width: 100px;
        text-align: right;
        margin-left: 0;
      }
      .el-input {
        width: 300px;
        &/deep/.el-input-group__append {
          padding: 7px;
        }
      }

    }
  }
}
</style>
