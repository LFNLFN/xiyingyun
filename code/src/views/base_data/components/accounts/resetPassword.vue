<template>
  <!-- <publicPopups title-text="重置密码" @closePop="closeBox" @formConfirm="passwordSubmit"> -->
  <publicPopups title-text="重置密码" v-on="$listeners" @formConfirm="passwordSubmit">
    <template slot="main-content">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
        <el-form-item label="请输入旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="请输入新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="请再次输入新密码" prop="reputNewPassword">
          <el-input v-model="passwordForm.reputNewPassword" type="password" />
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { resetPassword } from '@/api/base_data/accounts'
import { isvalidPassword } from '@/utils/validate'
export default {
  components: { PublicPopups },
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
  created() {
    console.log('listeners', this.$listeners)
    console.log('attr', this.$attr)
  },
  methods: {
    // closeBox() {
    //   this.$emit('closePasswordBox')
    // },
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
        'oldPassword': String(this.passwordForm.oldPassword),
        'password': String(this.passwordForm.newPassword)
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
.el-form {
  padding: 20px 50px;
  .btn-warp {
    margin-top: 30px;
    @include flex-center;
  }
}
</style>

