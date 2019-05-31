<template>
  <el-container>
    <el-aside>
      <div class="side-wrap">
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
      </div>
    </el-aside>
    <el-main>
      <div class="main-wrap">
        <div class="header">
          <span>{{ buildingName }}</span>
          <div>
            <el-button size="mini" type="primary">新增楼层</el-button>
            <el-button size="mini">生成房间</el-button>
          </div>
        </div>
        <div class="building-wrap"/>
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
      projectSelected: '',
      buildingName: '楼栋一'
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  .header {
    @include gray-header;
  }
  .el-aside {
    min-height: 100%;
    padding: 20px 0 20px 20px;
    .side-wrap {
      height: 100%;
       @include boxShadow-container;
      .side-content-wrap {
        padding: 20px 10px;
        .el-select {
          width: 80%;
          margin: 0 10% 20px 10%;
        }
      }
    }
  }
  .el-main {
    height: 100%;
    .main-wrap {
      height: 100%;
      @include boxShadow-container;
    }
  }
}
</style>
