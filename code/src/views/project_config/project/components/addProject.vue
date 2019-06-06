<template>
  <publicPopups title-text="增加项目" v-on="$listeners" @formConfirm="addProjectHandle" @closePopupsBox="closeBox">
    <template slot="main-content">
      <el-form v-loading="isLoading" ref="addProjectForm" :model="addProjectForm" :rules="addProjectRules" class="add-project-from">
        <el-form-item label="项目编号" prop="code">
          <el-input v-model="addProjectForm.code" />
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="addProjectForm.name" />
        </el-form-item>
        <el-form-item label="所属公司" prop="orgId">
          <selectTree
            v-model="companySelected"
            :tree-data="organizationData"
            :tree-prop="organTreeProp"
            prop="name"
            width="300"/>
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import { mapActions } from 'vuex'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import SelectTree from '@/components/selectTree'
import { addProject, editProject } from '@/api/project_config/project'
import { emptyTarget } from '@/utils/public'
export default {
  components: { PublicPopups, SelectTree },
  props: {
    isAddProjectShow: {
      type: Boolean,
      default: false
    },
    editProjectData: {
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
    return {
      addProjectForm: {
        name: '',
        code: '',
        orgId: '',
        sortIndex: 0
      },
      addProjectRules: {
        name: [{ required: true, trigger: 'blur', message: '项目名称不能为空' }],
        orgId: [{ required: true, trigger: 'change', message: '所属公司不能为空' }]
      },
      companySelected: '', // 保存所属公司选择
      organizationData: [], // 保存所有公司信息
      organTreeProp: {
        label: 'name',
        children: 'children'
      },
      isLoading: true,
      isChangeProject: false
    }
  },
  watch: {
    isAddProjectShow: function(newVal) {
      if (newVal) {
        // 加载组织架构数据
        const type = this.$store.getters.organizationType.organization
        this.getOrganization({ type }).then(resp => {
          this.isLoading = false
          this.organizationData = resp
          if (this.eventType === 'edit') {
            this.handleEditData()
          }
        })
      }
    },
    companySelected: function(newVal) {
      const data = this.getorganData(this.organizationData, 'name', newVal)
      if (data) {
        this.addProjectForm.orgId = data.id
      }
    }
  },
  methods: {
    ...mapActions({
      getOrganization: 'getOrganizationData'
    }),
    // 如果是编辑项目，则处理相关数据
    handleEditData() {
      const _keys = Object.keys(this.addProjectForm)
      if (_keys.length > 0) {
        _keys.forEach(key => {
          this.addProjectForm[key] = this.editProjectData[key]
        })
      }
      const _organ = this.getorganData(this.organizationData, 'orgId', this.editProjectData.orgId)
      if (_organ) { this.companySelected = _organ.name }
    },
    getorganData(arr, key, val) {
      for (const item of arr) {
        if (item[key] === val) {
          return item
        } else if (item.children && item.children.length > 0) {
          const _data = this.getorganData(item.children, key, val)
          if (_data) { return _data }
        }
      }
    },
    addProjectHandle() {
      this.$refs.addProjectForm.validate(valid => {
        if (valid) {
          let _method, _msg
          this.isLoading = true
          if (this.eventType === 'add') {
            _method = addProject(this.addProjectForm)
            _msg = '新增项目成功'
          } else if (this.eventType === 'edit') {
            _method = editProject(this.editProjectData.id, this.addProjectForm)
            _msg = '编辑项目成功'
          }
          _method.then(resp => {
            this.$message({
              message: _msg,
              type: 'success'
            })
            this.isLoading = false
            this.isChangeProject = true
            this.closeBox()
          }).catch(() => {
            this.isLoading = false
          })
        }
      })
    },
    closeBox() {
      this.$emit('update:isAddProjectShow', false)
      this.$emit('update:editProjectData', emptyTarget(this.editProjectData))
      this.$emit('update:eventType', 'add')
      this.$emit('projectOperaedHandle', this.isChangeProject)
      this.$refs.addProjectForm.resetFields()
      this.companySelected = ''
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.add-project-from {
  .el-form-item {
    margin: 20px;
    @include flex-layout(center, center, null, null);
    .el-input {
      width: 300px;
    }
    .el-select {
      width: 300px;
    }
  }
}
</style>
