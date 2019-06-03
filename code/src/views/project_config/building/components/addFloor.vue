<template>
  <publicPopups title-text="新增楼层" @closePopupsBox="closeBox">
    <template slot="main-content">
      <el-form
        ref="floorForm"
        :model="floorFormData">
        <el-form-item prop="" label="楼层名称">
          <el-input v-model="floorFormData.name" placeholder="请输入楼层名称" />
        </el-form-item>
        <el-form-item prop="" label="添加位置">
          <el-radio v-model="floorFormData.addPlace" label="top">顶层添加一层</el-radio>
          <el-radio v-model="floorFormData.addPlace" label="bottom">底层添加一层</el-radio>
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
      floorFormData: {
        name: '',
        addPlace: ''
      }
    }
  },
  methods: {
    closeBox() {
      console.log('closeBox')
      this.$emit('update:isAddFloorShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
.el-form {
  padding-top: 40px;
  .el-form-item {
    .el-input {
      width: 350px;
    }
  }
}
</style>
