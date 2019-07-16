<template>
  <el-container class="global-container">
    <el-main>
      <el-tabs v-model="showTabName" @tab-click="changTabShow">
        <el-tab-pane label="企业文档" name="company">
          <tabDocuments ref="company"/>
        </el-tab-pane>
        <el-tab-pane label="项目文档" name="project">
          <tabDocuments ref="project"/>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import TabDocuments from '@/views/publication/document_manage/components/tabDocuments'
export default {
  components: { TabDocuments },
  data() {
    return {
      showTabName: 'company'
    }
  },
  methods: {
    changTabShow(tab, event) {
      const tabLabel = tab.label
      const tabName = tab.name
      const _obj = {
        curTabName: tabLabel
      }
      this.$refs[tabName].resetDataProperty(_obj)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
@import "src/styles/variables.scss";

.el-container {
  .el-main {
    padding: 0;
    &/deep/.el-tabs {
      .el-tabs__header {
        margin: 0;
        padding: 20px 20px 0 20px;
        background: #fff;
      }
      .el-tabs__content {
        padding: 20px;
      }
    }
  }
}
</style>
