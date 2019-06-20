<template>
  <publicPopups title-text="新增人员" width="600px" v-on="$listeners" @closePopupsBox="closeHandle" @formConfirm="addAccountSubmit">
    <template slot="main-content">
      <el-form v-loading="addMemberLoading" ref="addMemberForm" :model="addMemberForm" :rules="addMemberRules" class="add-member-from">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addMemberForm.name" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addMemberForm.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addMemberForm.email" />
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
        <el-form-item label="岗位" prop="email">
          <el-input :value="positionData.name" :disabled="true" />
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { mapActions } from 'vuex'
import { isvalidUsername, isvalidPhoneNum } from '@/utils/validate'
import { addAccount } from '@/api/base_data/accounts'

export default {
  components: { PublicPopups },
  props: {
    positionData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const validateRoles = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请选择角色'))
      } else {
        callback()
      }
    }
    return {
      addMemberForm: {
        name: '',
        phone: '',
        email: '',
        roles: []
      },
      addMemberRules: {
        name: [{ required: true, trigger: 'blur', validator: isvalidUsername }],
        phone: [{ required: true, trigger: 'blur', validator: isvalidPhoneNum }],
        roles: [{ required: true, trigger: 'change', validator: validateRoles }]
      },
      rolesIdList: [], // 保存选择的角色数据的ID
      addMemberLoading: false,
      roleSelecteList: [], // 保存选择的角色数据
      permissionRoles: [] // 保存获取到的角色数据
    }
  },
  watch: {
    roleSelecteList: function(newVal) {
      const roles = this.addMemberForm.roles
      roles.splice(0, roles.length)
      this.permissionRoles.forEach(role => {
        if (newVal.find(s => s === role.name)) {
          roles.push(role.id)
        }
      })
    }
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
      this.$refs.addMemberForm.validate(vaild => {
        if (vaild) {
          if (!this.positionData.id || this.positionData.id === '') {
            this.$message({
              showClose: true,
              message: '新增失败，无法获取员工的职位信息！',
              type: 'error',
              duration: 5 * 1000
            })
            return
          }
          this.addMemberLoading = true
          const params = {
            isManager: 0,
            status: 1,
            name: this.addMemberForm.name,
            phone: this.addMemberForm.phone,
            email: this.addMemberForm.eail || '',
            positionIds: Array.of(this.positionData.id),
            roles: this.addMemberForm.roles
          }
          addAccount(params).then(respon => {
            // 重置表单
            this.closeHandle()
            this.$message({
              showClose: true,
              message: '新增成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.addMemberLoading = false
          }).catch(rej => {
            this.addMemberLoading = false
          })
        }
      })
    },
    // 重置表单及其他数据
    closeHandle() {
      this.$emit('submitComplete', false, 'addMember')
      this.$refs.addMemberForm.resetFields()
      this.roleSelecteList = []
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.add-member-from {
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
