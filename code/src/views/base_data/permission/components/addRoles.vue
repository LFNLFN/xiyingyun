<template>
  <publicPopups v-loading="isLoading" :title-text="titleText" width="600px" v-on="$listeners" @formConfirm="submitForm">
    <template slot="main-content">
      <el-form ref="addRolesForm" :model="addRolesForm" :rules="rolesFormRules" class="add-roles-from">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRolesForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="describe">
          <el-input v-model="addRolesForm.describe" :rows="4" type="textarea" placeholder="请输入角色描述" />
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { addRoles } from '@/api/base_data/permission.js'
export default {
  components: { PublicPopups },
  props: {
    roleData: {
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
    const validRoleName = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('角色名称不能为空'))
      }
      callback()
    }
    return {
      addRolesForm: {
        name: '',
        describe: ''
      },
      rolesFormRules: {
        name: [{ required: true, trigger: 'blur', validator: validRoleName }]
      },
      titleTextObj: {
        'add': '新增角色',
        'edit': '编辑角色'
      },
      titleText: '新增角色',
      isLoading: false
    }
  },
  watch: {
    roleData: function(newVal) {
      const keys = Object.keys(newVal)
      if (this.eventType === 'edit' && keys.length > 0) {
        this.addRolesForm = newVal
      }
    },
    eventType: function(newVal) {
      this.titleText = this.titleTextObj[newVal]
    }
  },
  methods: {
    submitForm() {
      this.$refs.addRolesForm.validate(valid => {
        if (valid) {
          this.isLoading = true
          addRoles(this.addRolesForm).then(resp => {
            console.log('resp', resp)
            this.isLoading = false
            this.$message({
              showClose: true,
              message: `${this.titleText}成功`,
              type: 'success',
              duration: 3 * 1000
            })
          }).catch(rej => {
            this.isLoading = false
          })
        }
      })
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.add-roles-from {
  .el-form-item {
    width: 80%;
    margin: 20px auto;
    .el-input, .el-textarea {
      width: 350px;
    }
  }
}
</style>
