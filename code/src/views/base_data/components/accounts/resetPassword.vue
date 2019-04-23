<template>
  <div class="container-shadow">
    <div v-loading="resetLoading" class="container">
      <div class="header">
        <span>重置密码</span>
        <i class="el-icon-error" @click="closeBox" />
      </div>
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
        <el-form-item label="请输入旧密码" prop="oldPassword">
          <el-input v-model.number="passwordForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="请输入新密码" prop="newPassword">
          <el-input v-model.number="passwordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="请再次输入新密码" prop="reputNewPassword">
          <el-input v-model.number="passwordForm.reputNewPassword" type="password" />
        </el-form-item>
        <el-form-item class="btn-warp">
          <el-button @click="closeBox">取消</el-button>
          <el-button type="primary" @click="passwordSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { resetPassword } from '@/api/base_data/accounts'
import { isvalidPassword } from '@/utils/validate'
export default {
  props: {
    userData: {
      type: Object,
      default: () => {
        return {
          birthday: '',
          createTime: 0,
          creatorId: '',
          creatorIdProperty: '',
          email: '',
          expireTime: '',
          gender: '',
          id: '',
          name: '',
          phone: '',
          status: 0,
          username: ''
        }
      }
    }
  },
  data() {
    const validPassword = (rule, val, callback) => {
      const { valid, msg } = isvalidPassword(val)
      if (!valid) {
        callback(new Error(msg))
      } else if (this.passwordForm.oldPassword === this.passwordForm.newPassword) {
        callback(new Error('新旧密码不能一样'))
      } else {
        callback()
      }
    }
    const validReputPassword = (rule, val, callback) => {
      if (val !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      }
    }
    return {
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        reputNewPassword: ''
      },
      passwordRules: {
        oldPassword: [{ required: true, trigger: 'blur', validator: validPassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: validPassword }],
        reputNewPassword: [{ required: true, trigger: 'blur', validator: validReputPassword }]
      },
      resetLoading: false
    }
  },
  methods: {
    closeBox() {
      this.$emit('closePasswordBox')
    },
    passwordSubmit() {
      console.log('userData: ', this.userData)
      this.resetLoading = true
      const userId = this.userData.id
      if (userId.length === 0) {
        this.$message({
          showClose: true,
          message: '重置密码失败，用户信息不完整',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }
      const passwordObj = {
        oldPassword: this.passwordForm.oldPassword,
        password: this.passwordForm.newPassword
      }
      resetPassword(userId, passwordObj).then(resp => {
        this.$message({
          showClose: true,
          message: '重置密码成功',
          type: 'success',
          duration: 3 * 1000
        })
        console.log('reset resp: ', resp)
        this.resetLoading = false
      }).catch(() => {
        this.resetLoading = false
      })
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.container-shadow {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: rgba(255, 255, 255, .6);
  @include flex-center;
  .container {
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    background: #fff;
    width: 500px;
    overflow: hidden;
    .header {
      padding: 10px 5px 10px 20px;
      height: 50px;
      background: #e6e6e6;
      font-size: 24px;
      i {
        cursor: pointer;
        float: right;
        color: #f00;
        font-size: 30px;
      }
    }
    .el-form {
      padding: 20px 50px;
      .btn-warp {
        margin-top: 30px;
        @include flex-center;
      }
    }
  }
}
</style>

