<template>
  <div class="container">
    <el-dropdown
      trigger="click"
      size="small"
      placement="bottom-start"
      @command="systemChangeHandle" >
      <span class="el-dropdown-link">
        <i class="el-icon-location-outline el-icon--left" />{{ seletedText }}<i class="el-icon-caret-bottom el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown" >
        <el-dropdown-item command="project">工程管理</el-dropdown-item>
        <el-dropdown-item command="public">系统设置</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  data() {
    return {
      seletedText: '系统设置'
    }
  },
  methods: {
    systemChangeHandle(order) {
      console.log(order)
      this.$store.commit('TOGGLE_SIDEBARTYPE', order)
      if (order==='project') {
        this.seletedText = '工程管理'
        this.$router.push({path:'/website_info'})
      }
      if (order==='public') {
        this.seletedText = '系统设置'
        this.$router.push({path:'/'})
      }
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
.container {
  display: inline-block;
  height: 50px;
  margin-left: 30px;
  vertical-align: top;
  &/deep/ .el-dropdown {
    // color: #000;
    color: #409EFF;
    .el-dropdown-link {
      cursor: pointer;
    }
  }
}

.el-dropdown-menu {
  margin-top: 0;
}
</style>
