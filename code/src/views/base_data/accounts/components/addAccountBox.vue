<template>
  <publicPopups title-text="重置密码" v-on="$listeners" @closePupupsBox="closeBox" @formConfirm="addAccountSubmit">
    <template slot="main-content">
      <el-form ref="addAccountForm" :model="addAccountForm" :rules="addAccountRules" class="add-account-from">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addAccountForm.name" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model.number="addAccountForm.phone" />
        </el-form-item>
        <!-- <el-form-item label="账号" prop="username">
          <el-input v-model="addAccountForm.username" />
        </el-form-item> -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addAccountForm.email" />
        </el-form-item>
        <!-- <el-form-item label="特殊资源">
          <el-radio-group v-model="expireDateRadio" prop="expireDateRadio">
            <el-radio label="permanent">永久有效</el-radio>
            <el-radio label="expire">失效时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="expireTime" class="expireTime-wrap">
          <el-date-picker
            v-model="addAccountForm.expireTime"
            :disabled="datePickerDisable"
            size="small"
            align="center"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd" />
        </el-form-item> -->
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { isvalidUsername, isvalidPhoneNum } from '@/utils/validate'
import { addAccount } from '@/api/base_data/accounts'

export default {
  components: { PublicPopups },
  data() {
    // const validateExpireTime = (rule, value, callback) => {
    //   if (this.expireDateRadio === 'expire' && value.length === 0) {
    //     callback(new Error('请选择日期'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      addAccountForm: {
        name: '',
        phone: '',
        // username: '',
        email: ''
        // expireTime: '',
        // password: ''
      },
      addAccountRules: {
        name: [{ required: true, trigger: 'blur', validator: isvalidUsername }],
        phone: [{ required: true, trigger: 'blur', validator: isvalidPhoneNum }]
        // expireTime: [{ required: true, trigger: 'change', validator: validateExpireTime }]
      },
      // expireDateRadio: '',
      datePickerDisable: false,
      addAccountLoading: false,
      addAccountCount: 0,
      token: this.$store.getters.token
    }
  },
  watch: {
    // // 监测有效时间单选框
    // expireDateRadio(newVal) {
    //   if (newVal === 'permanent') {
    //     this.datePickerDisable = true
    //     if (this.addAccountForm.expireTime !== '') {
    //       this.addAccountForm.expireTime = ''
    //     }
    //   } else {
    //     this.datePickerDisable = false
    //   }
    // }
  },
  methods: {
    closeBox() {
      this.$emit('closeAddAccountBox', this.addAccountCount)
      this.addAccountCount = 0
    },
    // 发送添加员工请求
    addAccountSubmit() {
      this.$refs.addAccountForm.validate(vaild => {
        if (vaild) {
          this.addAccountLoading = true
          this.addAccountForm.password = this.addAccountForm.phone
          addAccount(this.addAccountForm).then(respon => {
            this.addAccountLoading = false
            this.addAccountCount += 1
            // 重置表单
            this.resetForm('addAccountForm')
            this.$message({
              showClose: true,
              message: '新增成功',
              type: 'success',
              duration: 3 * 1000
            })
          }).catch(rej => {
            this.addAccountLoading = false
          })
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      // this.expireDateRadio = ''
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.add-account-from {
  padding: 10px  20px;
  .el-form-item {
    width: 80%;
    margin: 20px auto;
  }
  .el-input {
    width: 80%;
    margin-left: 10px;
  }
  .expireTime-wrap {
    text-align: center;
    margin-bottom: 5px;
  }
  .el-date-editor {
    width: 135px !important;
  }
  .el-button {
    margin: 0 20px;
  }
  .btn-warp {
    margin-top: 30px;
    @include flex-layout(center, center, null, null);
  }
}
</style>
