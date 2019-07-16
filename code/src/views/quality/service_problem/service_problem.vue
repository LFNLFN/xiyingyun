<template>
  <el-container class="global-container">
    <el-header height="auto">
      <div class="search-wrap">
        <el-form>
          <el-form-item>
            <el-input v-model="searchFormData.key" size="small">
              <template slot="append">
                <el-button type="primary" size="small" class="search-btn">搜索</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-header>
    <el-main>
      <el-tabs v-model="showTabName" @tab-click="changTabShow">
        <el-tab-pane label="全部" name="first">
          <tabProblems />
        </el-tab-pane>
        <el-tab-pane label="待整改" name="third">
          <tabProblems />
        </el-tab-pane>
        <el-tab-pane label="待销项" name="fourth">
          <tabProblems />
        </el-tab-pane>
        <el-tab-pane label="已销项" name="fiveth">
          <tabProblems />
        </el-tab-pane>
        <el-tab-pane label="已作废" name="sixth">
          <tabProblems />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import TabProblems from '@/views/quality/service_problem/components/tabProblems'
export default {
  components: { TabProblems },
  data() {
    return {
      searchFormData: {
        searchKey: ''
      },
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
@import "src/styles/variables.scss";

.el-container {
  .el-header {
    padding: 0;
    margin-top: 5px;
    .search-wrap {
      width: 100%;
      height: auto;
      background: #fff;
      .el-form {
        width: 400px;
        margin: 0 auto;
        padding: 40px 0 1px 0;
        &/deep/.el-input-group__append {
          border: none;
          padding: 9px 20px;
          overflow: hidden;
        }
        &/deep/.search-btn {
          padding: 10px 20px;
          color: #fff;
          background: #2d8cf0;
          border-color: #2d8cf0;
          border-radius: 0;
        }
      }
    }
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
