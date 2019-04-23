<template>
  <div class="container-shadow">
    <div v-loading="addStaffLoading" class="container">
      <div class="header">
        <span>添加账号</span>
        <i class="el-icon-error" @click="closeBox" />
      </div>
      <el-form ref="addStaffForm" :model="addStaffForm" :rules="addStaffRules" class="add-staff-from">
        <el-form-item label="姓名" hide-required-asterisk="true" prop="name">
          <el-input v-model="addStaffForm.name" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model.number="addStaffForm.phone" />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="addStaffForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addStaffForm.email" />
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="expireDateRadio" prop="expireDateRadio">
            <el-radio label="permanent">永久有效</el-radio>
            <el-radio label="expire">失效时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="expireTime">
          <el-date-picker
            v-model="addStaffForm.expireTime"
            :disabled="datePickerDisable"
            size="small"
            align="center"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item class="btn-warp">
          <el-button @click.native="closeBox">取消</el-button>
          <el-button type="primary" @click="addStaffSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { isvalidUsername } from '@/utils/validate'
import { addStaff } from '@/api/base_data/accounts'

export default {
  // props: {
  //   showControl: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  data() {
    const validateUserName = (rule, value, callback) => {
      const { valid, msg } = isvalidUsername(value)
      if (!valid) {
        callback(new Error(msg))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (value.length < 11) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    const validateExpireTime = (rule, value, callback) => {
      if (this.expireDateRadio === 'expire' && value.length === 0) {
        callback(new Error('请选择日期'))
      } else {
        callback()
      }
    }
    return {
      addStaffForm: {
        name: '',
        phone: '',
        username: '',
        email: '',
        expireTime: '',
        password: ''
      },
      addStaffRules: {
        name: [{ required: true, trigger: 'blur', validator: validateUserName }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        expireTime: [{ required: true, trigger: 'change', validator: validateExpireTime }]
      },
      expireDateRadio: '',
      datePickerDisable: false,
      addStaffLoading: false,
      addStaffCount: 0,
      token: this.$store.getters.token
    }
  },
  watch: {
    // 监测有效时间单选框
    expireDateRadio(newVal) {
      if (newVal === 'permanent') {
        this.datePickerDisable = true
        if (this.addStaffForm.expireTime !== '') {
          this.addStaffForm.expireTime = ''
        }
      } else {
        this.datePickerDisable = false
      }
      console.log('this.addStaffForm.expireTime', this.addStaffForm.expireTime)
    }
  },
  methods: {
    closeBox() {
      this.$emit('closeAddStaffBox', this.addStaffCount)
      this.addStaffCount = 0
    },
    // 发送添加员工请求
    addStaffSubmit() {
      this.$refs.addStaffForm.validate(vaild => {
        if (vaild) {
          this.addStaffLoading = true
          this.addStaffForm.password = this.addStaffForm.phone
          addStaff(this.addStaffForm).then(respon => {
            this.addStaffLoading = false
            this.addStaffCount += 1
            // 重置表单
            this.resetForm('addStaffForm')
            this.$message({
              showClose: true,
              message: '新增成功',
              type: 'success',
              duration: 3 * 1000
            })
          }).catch(rej => {
            this.addStaffLoading = false
          })
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.expireDateRadio = ''
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
    height: 500px;
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
    .add-staff-from {
      padding: 10px  20px;
      .el-form-item {
        width: 80%;
        margin: 20px auto;
      }
      .el-input {
        width: 80%;
        margin-left: 10px;
      }
      .el-date-editor {
        width: 50% !important;
        margin-left: 25% !important;
      }
      .el-button {
        margin: 0 20px;
      }
      .btn-warp {
        margin-top: 30px;
        @include flex-center;
      }
    }
  }
}
</style>
