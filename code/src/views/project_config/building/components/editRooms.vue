<template>
  <publicPopups title-text="编辑楼层" width="700px" @closePopupsBox="closeBox">
    <template slot="main-content">
      <div />
    </template>
    <template slot="footer-content">
      <el-button size="small">上一步</el-button>
      <el-button type="primary" size="small">确定</el-button>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  data() {
    return {
    }
  },
  methods: {
    closeBox() {
      console.log('closeBox')
      this.$emit('update:isEditRoomsShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
</style>
