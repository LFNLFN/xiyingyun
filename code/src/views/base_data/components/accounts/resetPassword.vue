<template>
  <publicPopups title-text="重置密码" v-on="$listeners" @closePupupsBox="closeBox" @formConfirm="resetHandle">
    <template slot="main-content">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
        <el-form-item v-if="!isBatch" label="请输入旧密码" prop="oldPassword">
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
import { resetPassword, batchResetPswd } from '@/api/base_data/accounts'
import { isvalidPassword } from '@/utils/validate'
export default {
  components: { PublicPopups },
  props: {
    isBatch: {
      type: Boolean,
      default: false
    },
    userData: {
      type: Array,
      default: () => {
        return [
          {
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
        ]
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
        oldPassword: [{ required: true, trigger: 'change', validator: validPassword }],
        newPassword: [{ required: true, trigger: 'change', validator: validPassword }],
        reputNewPassword: [{ required: true, trigger: 'change', validator: validReputPassword }]
      },
      resetLoading: false
    }
  },
  methods: {
    resetHandle() {
      if (this.isBatch) {
        this.batchResetSubmit()
      } else {
        this.passwordSubmit()
      }
    },
    passwordSubmit() {
      const userId = this.userData[0].id
      if (userId.length === 0) {
        this.$message({
          showClose: true,
          message: '重置密码失败，用户信息不完整',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }
      this.resetLoading = true
      const passwordObj = {
        // 'oldPassword': String(this.passwordForm.oldPassword),
        'password': String(this.passwordForm.reputNewPassword)
      }
      resetPassword(userId, passwordObj).then(resp => {
        console.log('reset resp', resp)
        this.resetSuccess()
      }).catch(() => {
        this.resetLoading = false
      })
    },
    batchResetSubmit() {
      const idArr = []
      for (const user of this.userData) {
        idArr.push(user.id)
      }
      if (idArr.length === 0) {
        this.$message({
          showClose: true,
          message: '重置密码失败，用户信息不完整',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }
      this.resetLoading = true
      const passwordObj = {
        'password': String(this.passwordForm.reputNewPassword)
      }
      batchResetPswd(idArr, passwordObj).then(resp => {
        this.resetSuccess()
      }).catch(() => {
        this.resetLoading = false
      })
    },
    resetSuccess() {
      this.$message({
        showClose: true,
        message: '重置密码成功',
        type: 'success',
        duration: 3 * 1000
      })
      this.$refs['passwordForm'].resetFields()
      this.resetLoading = false
    },
    closeBox() {
      this.$refs['passwordForm'].resetFields()
      this.$emit('closePasswordBox')
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

