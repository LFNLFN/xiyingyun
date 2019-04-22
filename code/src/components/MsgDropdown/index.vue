<template>
  <el-dropdown class="message-container">
    <div class="message-logo-wrap">
      <img src="@/assets/navbar_images/message.png" class="message-logo">
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>全部消息</el-dropdown-item>
      <el-dropdown-item>产品消息</el-dropdown-item>
      <el-dropdown-item>安全消息</el-dropdown-item>
      <el-dropdown-item>服务消息</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
.message-container  {
  cursor: pointer;
  height: 50px;
  .message-logo-wrap {
    height: 50px;
    width: 50px;

    .message-logo {
      width: 70%;
      height: 70%;
      margin-top: 15%;
      margin-left: 15%;
    }
  }
}
</style>
