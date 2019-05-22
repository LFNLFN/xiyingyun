<template>
  <publicPopups width="600px" title-text="新增平面图" v-on="$listeners" @closePopupsBox="closeBox">
    <template slot="main-content">
      <el-form>
        <el-form-item label="所属项目">
          <span>三水城市花园</span>
        </el-form-item>
        <el-form-item label="平面图名称" porp="name">
          <el-input />
        </el-form-item>
        <el-form-item label="平面图类型" porp="type">
          <el-radio v-model="planTypeSelected" label="1">备选项</el-radio>
          <el-radio v-model="planTypeSelected" label="2">备选项</el-radio>
        </el-form-item>
        <el-form-item label="户型/合同" porp="houseType">
          <el-select v-model="houseTypeSelected">
            <el-option value="三水城市花园" />
            <el-option value="市桥城市花园" />
          </el-select>
        </el-form-item>
        <el-form-item label="平面图预览">
          <span>三水城市花园</span>
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  props: {
    isAddPlanShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      planFormData: {
        name: '',
        type: '',
        houseType: ''
      },
      houseTypeSelected: '',
      planTypeSelected: ''
    }
  },
  methods: {
    closeBox() {
      this.$emit('update:isAddPlanShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
.el-form {
  padding: 0 30px;
  margin: 20px 0;
  .el-form-item {
    .el-input {
      width: 350px;
    }
    .el-select {
      width: 350px;
    }
    &/deep/.el-form-item__label {
      width: 90px;
      text-align: left;
    }
  }
}
</style>
