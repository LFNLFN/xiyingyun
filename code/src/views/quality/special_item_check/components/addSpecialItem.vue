<template>
  <publicPopups width="650px" title-text="新增专项检查" v-on="$listeners" @closePopupsBox="closeBox">
    <template slot="main-content">
      <el-form
        :model="addItemFormData"
        :inline="true"
        size="small">
        <el-form-item label="项目名称">
          <el-select v-model="addItemFormData.checkId">
            <el-option
              value="选项一" />
          </el-select>
        </el-form-item>
        <el-form-item label="检查批次名称">
          <el-input v-model="addItemFormData.checkId" />
        </el-form-item>
        <el-form-item label="检查人">
          <el-select v-model="addItemFormData.checkId">
            <el-option
              value="选项一" />
          </el-select>
        </el-form-item>
        <el-form-item label="督办人">
          <el-select v-model="addItemFormData.checkId">
            <el-option
              value="选项一" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任人">
          <el-select v-model="addItemFormData.checkId">
            <el-option
              value="选项一" />
          </el-select>
        </el-form-item>
        <el-form-item label="巡检模板">
          <el-select v-model="addItemFormData.checkId">
            <el-option
              value="选项一" />
          </el-select>
        </el-form-item>
        <el-form-item label="抄送人">
          <el-select v-model="addItemFormData.checkId">
            <el-option
              value="选项一" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划开始日期">
          <el-date-picker
            v-model="addItemFormData.date"
            size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="date-select" />
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  data() {
    return {
      addItemFormData: {
        checkId: '',
        date: ''
      }
    }
  },
  methods: {
    closeBox() {
      this.$emit('update:isAddSpecialItemShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.el-form {
  padding: 25px 20px 0 20px;
  &/deep/ .el-form-item {
    width: 100%;
    margin-bottom: 27px;
    .el-form-item__label {
      width: 115px;
      text-align: right;
    }
    .el-form-item__content {
      width: calc(100% - 130px);
      .el-select, .el-input {
        width: 100%;
      }
    }
  }
}
</style>
