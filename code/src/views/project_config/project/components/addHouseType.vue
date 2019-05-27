<template>
  <publicPopups title-text="增加户型" v-on="$listeners" @formConfirm="addHouseTypeHandle" @closePopupsBox="closeBox">
    <template slot="main-content">
      <el-form v-loading="isLoading" ref="houseTypeForm" :model="houseTypeForm" :rules="houseTypeRules" class="add-project-from">
        <el-form-item label="户型名称" prop="name">
          <el-input v-model="houseTypeForm.name" />
        </el-form-item>
        <el-form-item label="户型结构" prop="structure">
          <el-input v-model="houseTypeForm.structure" />
        </el-form-item>
        <el-form-item label="户型面积" prop="constructionArea">
          <el-input v-model="houseTypeForm.constructionArea">
            <span slot="append" class="area-text">㎡</span>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
// import { emptyTarget } from '@/utils/public'
export default {
  components: { PublicPopups },
  props: {
    isAddHouseTypeShow: {
      type: Boolean,
      default: false
    },
    editHouseTypeData: {
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
      houseTypeForm: {
        name: '',
        structure: '',
        constructionArea: ''
      },
      houseTypeRules: {
        name: [{ required: true, trigger: 'blur', message: '户型名称不能为空' }],
        structure: [{ required: true, trigger: 'blur', message: '户型结构不能为空' }],
        constructionArea: [{ required: true, trigger: 'blur', message: '户型面积不能为空' }]
      },
      isLoading: false
    }
  },
  watch: {
    isAddHouseTypeShow: function(newVal) {
      if (newVal) {
        this.$refs.houseTypeForm.resetFields()
        if (this.eventType === 'edit') {
          // 加载组织架构数据
          this.handleEditData()
        }
      }
    }
  },
  methods: {
    // 如果是编辑户型，则处理相关数据
    handleEditData() {
      const _keys = Object.keys(this.houseTypeForm)
      if (_keys.length > 0) {
        _keys.forEach(key => {
          this.houseTypeForm[key] = this.editHouseTypeData[key]
        })
      }
    },
    // 新增户型处理
    addHouseTypeHandle() {
      this.$refs.houseTypeForm.validate(valid => {
        if (valid) {
          const houseTypeForm = this.houseTypeForm
          this.$emit('houseTypeHandle', houseTypeForm)
          this.closeBox()
        }
      })
    },
    // 关闭组件处理
    closeBox() {
      this.$emit('update:isAddHouseTypeShow', false)
      // this.$emit('update:editHouseTypeData', emptyTarget(this.editHouseTypeData))
      // this.$emit('update:eventType', 'add')
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
