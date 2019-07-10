<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left">
      <h3 class="title">房地产数据企业服务系统</h3>
      <h5 class="title-second">Estate Enterprise Data Service System</h5>
      <el-form-item prop="username" class="login-item">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="off"
          placeholder="请输入用户名称" />
      </el-form-item>
      <el-form-item prop="password" class="login-item">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="new-password"
          placeholder="请输入登录密码"
          @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item class="no-lineheight">
        <el-checkbox v-model="isRememberPwd">记住密码</el-checkbox>
        <!-- <el-button class="no-border forget-pwd-btn">忘记密码</el-button> -->
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { isvalidUsername } from '@/utils/validate'
import { Encrypt, Decrypt } from '@/utils/secret'
export default {
  name: 'Login',
  data() {
    // 用户密码验证规则
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于8位'))
      } else {
        callback()
      }
      callback()
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: isvalidUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      isRememberPwd: false,
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // 检查localStorage是否保存有用户名密码
    const __info = this.$GetLocalStorage('loginSave')
    if (__info && __info !== '') {
      const loginTime = __info.loginTime
      const __infoObj = JSON.parse(Decrypt(__info.loginInfo, Date.parse(loginTime)))
      this.loginForm.username = __infoObj.username
      this.loginForm.password = __infoObj.password
      this.isRememberPwd = true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (this.isRememberPwd) {
            // 记住密码处理
            const now = new Date()
            const EncryptStr = Encrypt(JSON.stringify(this.loginForm), now.getTime())
            const _saveObj = {
              loginInfo: EncryptStr,
              loginTime: now
            }
            this.$SetLocalStorage('loginSave', _saveObj)
          } else {
            // 取消记住密码处理
            this.$RemoveLocalStorage('loginSave')
          }
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

$bg:#2d3a4b;
$dark_gray:#889aa4;
$font_blue:#2b85e4;
$light_while:#fff;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  // background: url(../../assets/login_images/login_bg.jpg) no-repeat;
  background: #f1f2f6;
  background-size: 100% 100%;
  @include flex-layout(center, center, null, null);
  .login-form {
    width: 520px;
    padding: 35px 35px 15px 35px;
    &/deep/.el-input {
      display: inline-block;
      height: 47px;
      width: calc(100% - 54px);
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 5px;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    &/deep/.el-form-item.login-item {
      background: #e8f0fe;
      border-radius: 5px;
      color: #495060;
      border: 1px solid #dddee1;
    }
    &/deep/.el-form-item.no-lineheight {
      .el-form-item__content {
        line-height: 0;
      }
      .forget-pwd-btn {
        padding: 2px 9px;
        float: right;
        color: $font_blue;
      }
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 15px 6px 15px;
    color: #495060;
    width: 50px;
    text-align: center;
    display: inline-block;
    border-right: 1px solid #dddee1;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $font_blue;
    margin: 0px auto 10px auto;
    text-align: center;
    font-weight: bold;
    letter-spacing: 3px;
  }
  .title-second {
    font-size: 20px;
    font-weight: 400;
    color: $font_blue;
    margin: 0px auto 30px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
