<template>
  <publicPopups :title-text="titleText" width="600px" v-on="$listeners" @formConfirm="submitForm" @closePopupsBox="closeHandle">
    <template v-loading="isLoading" slot="main-content">
      <el-form ref="addOrganForm" :model="addOrganForm" :rules="organFormRules" class="add-organ-from">
        <el-form-item label="机构编码" prop="code">
          <el-input v-model="addOrganForm.code" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="addOrganForm.name" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="机构全称" prop="fullName">
          <el-input v-model="addOrganForm.fullName" placeholder="请输入机构全称" />
        </el-form-item>
        <el-form-item label="机构类型" prop="orgType">
          <el-select v-model="addOrganForm.orgType">
            <el-option
              v-for="(item, idx) in orgTypeData"
              :key="idx"
              :label="item.value"
              :value="item.id"
              clearable>
              {{ item.value }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { addOrganization, editOrganization } from '@/api/base_data/organization'
export default {
  components: { PublicPopups },
  props: {
    organParentId: {
      type: String,
      default: ''
    },
    editOrganData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    orgTypeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    eventType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      titleTextObj: {
        'add': '添加机构',
        'edit': '编辑机构'
      },
      titleText: '添加机构',
      addOrganForm: {
        id: '',
        code: '',
        name: '',
        fullName: '',
        parentId: '',
        type: 0,
        orgType: ''
      },
      organFormRules: {
        name: [{ required: true, trigger: 'blur', message: '机构名称不能为空' }],
        orgType: [{ required: true, trigger: 'change', message: '机构类型不能为空' }]
      },
      isLoading: false,
      isSubmit: false // 是否有提交表单数据
    }
  },
  watch: {
    editOrganData: function(newVal) {
      const keys = Object.keys(this.addOrganForm)
      const newValKeys = Object.keys(newVal)
      if (newValKeys.length > 0) {
        keys.forEach(key => {
          this.addOrganForm[key] = newVal[key]
        })
      }
    },
    eventType: function(newVal) {
      this.titleText = this.titleTextObj[newVal]
    }
  },
  methods: {
    submitForm() {
      this.$refs.addOrganForm.validate(valid => {
        if (valid) {
          let _method
          this.isLoading = true
          // this.addOrganForm.id = this.editData.id
          if (this.eventType === 'add') {
            this.addOrganForm.parentId = this.organParentId
            _method = addOrganization(this.addOrganForm)
          } else if (this.eventType === 'edit') {
            _method = editOrganization(this.addOrganForm.id, this.addOrganForm)
          }
          _method.then(resp => {
            this.isLoading = false
            this.isSubmit = true
            this.$message({
              showClose: true,
              message: `${this.titleText}成功`,
              type: 'success',
              duration: 3 * 1000
            })
            this.closeHandle()
          }).catch(() => {
            this.isLoading = false
          })
        }
      })
    },
    closeHandle() {
      // 重置数据
      this.$emit('submitComplete', this.isSubmit, 'organization')
      this.$refs.addOrganForm.resetFields()
      this.addOrganForm.id = ''
      this.addOrganForm.parentId = ''
      this.isSubmit = false
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.add-organ-from {
  .el-form-item {
    width: 80%;
    margin: 20px auto;
    .el-input {
      width: 350px;
    }
  }
}
</style>
