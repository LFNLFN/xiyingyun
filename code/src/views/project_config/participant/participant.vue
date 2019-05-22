<template>
  <el-container>
    <el-header>
      <span>所属项目：</span>
      <el-select v-model="projectSelected">
        <el-option value="三水城市花园" />
        <el-option value="市桥城市花园" />
      </el-select>
    </el-header>
    <el-main>
      <div class="header">
        <span>参建方列表</span>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addParticiHandle">添加</el-button>
      </div>
      <div class="table-wrap">
        <el-table
          ref="particiTable"
          :data="particiTableData"
          border>
          <el-table-column porp="" label="项目名称" align="center"/>
          <el-table-column porp="" label="类型" align="center"/>
          <el-table-column porp="" width="100" label="负责人" align="center"/>
          <el-table-column porp="" width="250" label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" class="post-table-btn">添加人员</el-button>
              <el-button size="mini" type="primary" class="post-table-btn">新增人员</el-button>
              <el-dropdown size="small">
                <el-button size="mini" type="primary" class="post-table-btn">更多操作</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">新增子级</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
    <participant
      v-show="isAddParticiShow"
      :is-add-partici-show.sync="isAddParticiShow"/>
  </el-container>
</template>
<script>
import Participant from '@/views/project_config/participant/components/addParticipant'
export default {
  components: { Participant },
  data() {
    return {
      projectSelected: '',
      particiTableData: [],
      isAddParticiShow: false,
      pageTotal: 10
    }
  },
  methods: {
    addParticiHandle() {
      this.isAddParticiShow = !this.isAddParticiShow
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-container {
  .el-header {
    margin: 30px 0;
    padding-left: 50px;
    @include flex-layout(flex-start, center, null, null);
    .el-select {
      width: 300px;
    }
  }
  .el-main {
    margin: 0 20px;
    @include boxShadow-container;
    .header {
      @include gray-header;
    }
    .table-wrap {
      padding: 20px;
    }
    .el-pagination {
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>
