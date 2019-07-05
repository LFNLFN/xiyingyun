<template>
  <el-container>
    <el-main>
      <el-tabs v-model="showTabName" @tab-click="changTabShow">
        <el-tab-pane label="集团检查" name="first">
          <TapCheckDatas />
        </el-tab-pane>
        <el-tab-pane label="区域检查" name="second">
          <TapCheckDatas />
        </el-tab-pane>
        <el-tab-pane label="项目检查" name="third">
          <TapCheckDatas />
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <specialItemDetail
      v-show="isItemDetailShow"
      :is-item-detail-show.sync="isItemDetailShow" />
  </el-container>
</template>
<script>
import SpecialItemDetail from '@/views/quality/special_item_check/components/specialItemDetail'
import TapCheckDatas from '@/views/quality/special_item_check/tabPanes/tapCheckDatas'
export default {
  components: { TapCheckDatas, SpecialItemDetail },
  data() {
    return {
      showTabName: 'first',
      isItemDetailShow: false
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
