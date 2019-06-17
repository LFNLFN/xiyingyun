<template>
  <publicPopups :title-text="titleText" width="600px" v-on="$listeners" @formConfirm="submitForm" @closePopupsBox="closeHandle">
    <template v-loading="isLoading" slot="main-content">
      <el-form ref="addSuppForm" :model="addSuppForm" :rules="suppFormRules" class="add-supp-from">
        <el-form-item label="机构编码" prop="code">
          <el-input v-model="addSuppForm.code" size="small" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="addSuppForm.name" size="small" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="机构全称" prop="fullName">
          <el-input v-model="addSuppForm.fullName" size="small" placeholder="请输入机构全称" />
        </el-form-item>
        <el-form-item label="负责人" prop="official">
          <el-input v-model="addSuppForm.official" size="small" placeholder="请输入负责人姓名" />
        </el-form-item>
        <el-form-item label="负责人电话" prop="phone">
          <el-input v-model="addSuppForm.phone" size="small" placeholder="请输入负责人手机号码" />
        </el-form-item>
        <el-form-item label="机构类型" prop="orgType">
          <el-select v-model="addSuppForm.orgType" size="small">
            <el-option
              v-for="(item, idx) in suppTypeData"
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
import { addSuppliers, editSuppliers } from '@/api/base_data/suppliers'
export default {
  components: { PublicPopups },
  props: {
    suppParentId: {
      type: String,
      default: ''
    },
    editSuppData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    suppTypeData: {
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
      test: [{
        id: '0',
        value: 'ceshi'
      }],
      titleTextObj: {
        'add': '添加机构',
        'edit': '编辑机构'
      },
      titleText: '添加机构',
      addSuppForm: {
        id: '',
        code: '',
        name: '',
        fullName: '',
        official: '',
        phone: '',
        parentId: '',
        type: 1,
        orgType: ''
      },
      suppFormRules: {
        name: [{ required: true, trigger: 'blur', message: '机构名称不能为空' }],
        orgType: [{ required: true, trigger: 'change', message: '机构类型不能为空' }]
      },
      isLoading: false,
      isSubmit: false // 是否有提交表单数据
    }
  },
  watch: {
    editSuppData: function(newVal) {
      const keys = Object.keys(this.addSuppForm)
      const newValKeys = Object.keys(newVal)
      if (newValKeys.length > 0) {
        keys.forEach(key => {
          this.addSuppForm[key] = newVal[key]
        })
        console.log('this.addSuppForm', this.addSuppForm)
      }
    },
    eventType: function(newVal) {
      this.titleText = this.titleTextObj[newVal]
    }
  },
  methods: {
    submitForm() {
      this.$refs.addSuppForm.validate(valid => {
        if (valid) {
          let _method
          this.isLoading = true

          if (this.eventType === 'add') {
            this.addSuppForm.parentId = this.suppParentId
            _method = addSuppliers(this.addSuppForm)
          } else if (this.eventType === 'edit') {
            _method = editSuppliers(this.addSuppForm.id, this.addSuppForm)
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
      this.$emit('submitComplete', this.isSubmit, 'supplier')
      this.$refs.addSuppForm.resetFields()
      this.addSuppForm.id = ''
      this.addSuppForm.parentId = ''
      this.isSubmit = false
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.add-supp-from {
  .el-form-item {
    width: 85%;
    margin: 20px auto;
    &/deep/.el-form-item__label {
      width: 95px;
    }
    .el-input, .el-select {
      width: 350px;
    }
  }
}
</style>
