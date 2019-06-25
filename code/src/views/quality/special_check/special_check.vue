<template>
  <el-container>
    <el-main>
      <el-tabs v-model="showTabName" @tab-click="changTabShow">
        <el-tab-pane label="集团检查" name="first">
          <checkDetails />
        </el-tab-pane>
        <el-tab-pane label="区域检查" name="second">
          <checkDetails />
        </el-tab-pane>
        <el-tab-pane label="项目检查" name="third">
          <checkDetails />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import CheckDetails from '@/views/quality/special_check/components/checkDetails'
export default {
  components: { CheckDetails },
  data() {
    return {
      showTabName: 'first'
    }
  },
  methods: {
    changTabShow(tab, event) {
      console.log('tab', tab)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.el-container {
  min-height: calc(100vh - 50px);
  background: #f0f1f5;
  .el-header {
    padding: 20px;
    margin-top: 5px;
  }
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
