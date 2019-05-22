<template>
  <el-container>
    <el-aside>
      <div class="header">
        <span>楼栋列表</span>
      </div>
      <div class="side-content-wrap">
        <el-select v-model="projectSelected" placeholder="请选择项目">
          <el-option value="三水城市花园" />
          <el-option value="市桥城市花园" />
        </el-select>
        <el-tree
          ref="projectTree"
          :data="projectTreeData"
          :props="projectTreeProp"
          :expand-on-click-node="false"
          highlight-current
          current-node-key
          class="project-tree"/>
      </div>
    </el-aside>
    <el-main>
      <div class="header">
        <span>楼栋一</span>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      projectTreeData: [],
      projectTreeProp: {
        name: '',
        children: []
      },
      projectSelected: ''
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-container {
  .header {
    @include gray-header;
  }
  .el-aside {
    max-width: 500px;
    margin: 20px 0 0 20px;
    @include boxShadow-container;
    .side-content-wrap {
      padding: 20px 10px;
      .el-select {
        width: 80%;
        margin: 20px 10%;
      }
    }
  }
  .el-main {
    @include boxShadow-container;
    margin: 20px 20px 0 20px;
  }
}
</style>
