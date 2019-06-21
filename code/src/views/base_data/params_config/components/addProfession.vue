<template>
  <publicPopups title-text="添加专业" @closePopupsBox="closeBox" @formConfirm="addProfessionsubmit">
    <template slot="main-content">
      <el-form
        v-loading="isLoading"
        ref="profeForm"
        :model="profeFormData"
        :rules="profeFormRules"
        class="">
        <el-form-item prop="name" label="专业名称">
          <el-input v-model="profeFormData.name" size="small"/>
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import { isEmpty } from '@/utils/public'
import { addDictionaryItem, editDictionaryItem } from '@/api/dictionary'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  props: {
    isAddProfessionShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      profeFormData: {
        name: ''
      },
      profeFormRules: {
        name: [{ required: true, trigger: 'blur', message: '专业名称不能为空' }]
      },
      paramsData: {},
      editparamsData: {},
      addOrEdit: 'add',
      isLoading: false
    }
  },
  watch: {
    isAddProfessionShow: function(newVal) {
      if (newVal && this.addOrEdit === 'edit') {
        if (!isEmpty(this.editparamsData)) {
          this.profeFormData.name = this.editparamsData.value
        }
      }
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this[key] = obj[key]
      })
    },
    addProfessionsubmit() {
      this.$refs.profeForm.validate(valid => {
        if (valid) {
          this.isLoading = true
          const itemId = this.editparamsData.id
          const paramObj = {
            describe: this.profeFormData.name,
            dictId: this.paramsData.id,
            text: this.profeFormData.name,
            value: this.profeFormData.name
          }
          if (this.addOrEdit === 'add') {
            addDictionaryItem(paramObj).then(resp => {
              this.successHandle('新增成功...')
            }).catch(() => {
              this.isLoading = false
            })
          } else if (this.addOrEdit === 'edit') {
            editDictionaryItem(itemId, paramObj).then(resp => {
              this.successHandle('编辑成功...')
            }).catch(() => {
              this.isLoading = false
            })
          }
        }
      })
    },
    successHandle(msg) {
      this.$message({
        type: 'success',
        message: msg
      })
      this.isLoading = false
      this.closeBox()
      this.$emit('refreshData')
    },
    closeBox() {
      this.paramsData = {}
      this.editparamsData = {}
      this.addOrEdit = 'add'
      this.$refs.profeForm.resetFields()
      this.$emit('update:isAddProfessionShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
.el-form {
  margin-top: 30px;
  .el-input {
    width: 370px;
  }
}
</style>
