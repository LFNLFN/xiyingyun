<template>
  <el-container class="container global-container">
    <el-main>
      <el-tabs v-model="showTabName" @tab-click="changTabShow">
        <el-tab-pane label="质量风险" name="quality">
          <tabCheckItems
            ref="groupCheck" />
        </el-tab-pane>
        <el-tab-pane label="安全文明" name="safety">
          <tabCheckItems
            ref="groupCheck" />
        </el-tab-pane>
        <el-tab-pane label="实测实量" name="measured">
          <tabCheckItems
            ref="groupCheck" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import TabCheckItems from '@/views/base_data/check_items/tabPanes/tabCheckItems'
export default {
  components: { TabCheckItems },
  data() {
    return {
      showTabName: 'quality'
    }
  },
  methods: {
    changTabShow(tab) {
      console.log(tab)
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.container {
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
