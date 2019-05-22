<template>
  <publicPopups v-loading="isLoading" :title-text="titleText" width="600px" v-on="$listeners" @formConfirm="submitForm" @closePopupsBox="closeHandle">
    <template slot="main-content">
      <el-form ref="addPostForm" :model="addPostForm" :rules="addPostFormRules" class="add-post-from">
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="addPostForm.name" placeholder="请输入岗位名称" />
        </el-form-item>
        <el-form-item label="岗位描述" prop="remark">
          <el-input v-model="addPostForm.remark" :rows="3" type="textarea" placeholder="请输入岗位描述" />
        </el-form-item>
        <!-- <el-form-item label="角色类型" prop="">
          <el-select v-model="orgTypeSelect">
            <el-option/>
          </el-select>
        </el-form-item> -->
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { emptyTarget } from '@/utils/public'
import { addPosition, editPosition } from '@/api/base_data/organization'
export default {
  components: { PublicPopups },
  props: {
    postParentId: {
      type: String,
      default: ''
    },
    postDepartmentId: {
      type: String,
      default: ''
    },
    editPostData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    eventType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      isLoading: false,
      titleTextObj: {
        'add': '添加岗位',
        'edit': '编辑岗位'
      },
      titleText: '添加岗位',
      addPostForm: {
        id: '',
        name: '',
        remark: '',
        departmentId: '',
        parentId: ''
      },
      addPostFormRules: {
        name: [{ required: true, trigger: 'blur', message: '岗位名称不能为空' }]
      },
      isSubmit: false // 是否有提交表单数据
    }
  },
  watch: {
    editPostData: function(newVal) {
      const keys = Object.keys(this.addPostForm)
      keys.forEach(key => {
        this.addPostForm[key] = newVal[key]
      })
    },
    eventType: function(newVal) {
      this.titleText = this.titleTextObj[newVal]
    }
  },
  methods: {
    submitForm() {
      this.$refs.addPostForm.validate(valid => {
        if (valid) {
          let _method
          this.isLoading = true
          if (this.eventType === 'add') {
            this.addPostForm.departmentId = this.postDepartmentId
            this.addPostForm.parentId = this.postParentId
            _method = addPosition(this.addPostForm)
          } else if (this.eventType === 'edit') {
            _method = editPosition(this.addPostForm.id, this.addPostForm)
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
      this.$emit('submitComplete', this.isSubmit, 'position')
      this.$refs.addPostForm.resetFields()
      this.addPostForm = emptyTarget(this.addPostForm)
      this.isSubmit = false
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.add-post-from {
  .el-form-item {
    width: 80%;
    margin: 20px auto;
    .el-input, .el-textarea  {
      width: 350px;
    }
  }
}
</style>
