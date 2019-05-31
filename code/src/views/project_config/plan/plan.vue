<template>
  <el-container>
    <!-- <el-header>
      <span>所属项目：</span>
      <el-select v-model="projectSelected">
        <el-option value="三水城市花园" />
        <el-option value="市桥城市花园" />
      </el-select>
    </el-header> -->
    <el-main>
      <div class="header">
        <span>平面图列表</span>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addPlanHandle">添加</el-button>
      </div>
      <div class="select-wrap">
        <span>所属项目：</span>
        <el-select v-model="projectSelected">
          <el-option value="三水城市花园" />
          <el-option value="市桥城市花园" />
        </el-select>
      </div>
      <div class="table-wrap">
        <el-table
          ref="planTable"
          :data="planTableData">
          <el-table-column porp="" label="名称" align="center"/>
          <el-table-column porp="" label="类型" align="center"/>
          <el-table-column porp="" width="250" label="操作" align="center">
            <template slot-scope="scope" width="180">
              <el-button size="mini" type="primary">编辑</el-button>
              <el-button size="mini" type="primary">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="pageTotal"
          :page-size="10"
          background
          layout="prev, pager, next, jumper"/>
      </div>
    </el-main>
    <addPlan
      v-show="isAddPlanShow"
      :is-add-plan-show.sync="isAddPlanShow"/>
  </el-container>
</template>
<script>
import AddPlan from '@/views/project_config/plan/components/addPlan'
export default {
  components: { AddPlan },
  data() {
    return {
      projectSelected: '',
      planTableData: [],
      isAddPlanShow: false,
      pageTotal: 10
    }
  },
  methods: {
    addPlanHandle() {
      this.isAddPlanShow = !this.isAddPlanShow
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-container {
  .el-main {
    margin: 20px 15px;
    @include boxShadow-container;
    .header {
      @include gray-header;
    }
    .select-wrap {
      margin: 30px 0;
      padding-left: 50px;
      @include flex-layout(flex-start, center, null, null);
      .el-select {
        width: 300px;
      }
    }
    .table-wrap {
      padding: 20px;
      .el-table {
        border: 1px solid #EBEEF5;
        border-bottom: none;
        &/deep/.el-table__header th {
          background: #f8f8f9;
        }
      }
    }
    .el-pagination {
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>
