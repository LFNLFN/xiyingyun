<template>
  <div class="container">
    <el-dropdown
      trigger="click"
      size="small"
      placement="bottom-start"
      @command="systemChangeHandle" >
      <span class="el-dropdown-link">
        {{ seletedText }}<i class="el-icon-caret-bottom el-icon--right" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="project">工程管理</el-dropdown-item>
        <el-dropdown-item command="publicService">公共业务管理</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  data() {
    return {
      seletedText: '工程管理'
    }
  },
  methods: {
    systemChangeHandle(order) {
      console.log('order', order)
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
    color: #000;
    .el-dropdown-link {
      cursor: pointer;
    }
  }
}

.el-dropdown-menu {
  margin-top: 0;
}
</style>
