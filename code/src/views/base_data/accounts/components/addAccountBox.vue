<template>
  <publicPopups title-text="重置密码" v-on="$listeners" @closePopupsBox="closeBox" @formConfirm="addAccountSubmit">
    <template slot="main-content">
      <el-form
        v-loading="addAccountLoading"
        ref="addAccountForm"
        :model="addAccountForm"
        :rules="addAccountRules"
        class="add-account-from">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addAccountForm.name" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model.number="addAccountForm.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addAccountForm.email" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <template>
            <el-select v-model="roleSelecteList" multiple placeholder="请选择">
              <el-option
                v-for="(item, idx) in permissionRoles"
                :key="idx"
                :value="item.name"/>
            </el-select>
          </template>
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
import { addAccount, editAccountInfo } from '@/api/base_data/accounts'
import { mapActions } from 'vuex'

export default {
  components: { PublicPopups },
  props: {
    showStarffBox: {
      type: Boolean,
      default: false
    },
    editAccountData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    eventType: {
      type: String,
      default: ''
    }
  },
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
        email: '',
        // expireTime: '',
        roles: []
      },
      addAccountRules: {
        name: [{ required: true, trigger: 'blur', validator: isvalidUsername }],
        phone: [{ required: true, trigger: 'blur', validator: isvalidPhoneNum }]
      },
      // expireDateRadio: '',
      // datePickerDisable: false,
      rolesIdList: [], // 保存选择的角色数据的ID
      roleSelecteList: [], // 保存选择的角色数据
      permissionRoles: [], // 保存获取到的角色数据
      addAccountLoading: false,
      isAddAccount: false
    }
  },
  watch: {
    // 监测角色选择
    roleSelecteList: function(newVal) {
      const roles = this.addAccountForm.roles
      roles.splice(0, roles.length)
      this.permissionRoles.forEach(role => {
        if (newVal.find(s => s === role.name)) {
          roles.push(role.id)
        }
      })
    },
    showStarffBox: function(newVal) {
      if (newVal) {
        if (this.eventType === 'edit') {
          const _keys = Object.keys(this.addAccountForm)
          _keys.forEach(key => {
            this.addAccountForm[key] = this.editAccountData[key]
          })
        }
      }
    }
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
  created() {
    this.getPerRoles().then(resp => {
      this.permissionRoles = resp
    })
  },
  methods: {
    ...mapActions([
      'getPerRoles'
    ]),
    // 发送添加员工请求
    addAccountSubmit() {
      this.$refs.addAccountForm.validate(vaild => {
        if (vaild) {
          let _method, msg
          this.addAccountLoading = true
          if (this.eventType === 'add') {
            _method = addAccount(this.addAccountForm)
            msg = '新增成功'
          } else if (this.eventType === 'edit') {
            const personId = this.editAccountData.id
            _method = editAccountInfo(personId, this.addAccountForm)
            msg = '编辑成功'
          }
          _method.then(respon => {
            this.addAccountLoading = false
            this.isAddAccount = true
            // 重置表单
            this.closeBox()
            this.$message({
              showClose: true,
              message: msg,
              type: 'success',
              duration: 3 * 1000
            })
          }).catch(rej => {
            this.addAccountLoading = false
          })
        }
      })
    },
    // 重置数据，关闭窗口
    closeBox() {
      this.$emit('accSubmitHandle', this.isAddAccount)
      this.$refs.addAccountForm.resetFields()
      this.roleSelecteList = []
      this.isAddAccount = false
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
  .el-input, .el-select {
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
