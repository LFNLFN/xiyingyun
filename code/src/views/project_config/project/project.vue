<template>
  <el-container class="project-container">
    <el-header class="search-wrap" height="no">
      <div class="header">
        <span class="el-icon-tickets">筛选查询</span>
      </div>
      <el-form ref="searchForm" :inline="true" :model="searchForm" size="small" class="search-form">
        <el-form-item prop="projectName" label="项目名称">
          <el-input v-model="searchForm.projectName" type="text" auto-complete="off" placeholder="请输入项目名称" />
        </el-form-item>
        <el-button type="primary" size="small" class="search-btn" click="searchProjectHandle">查询</el-button>
      </el-form>
    </el-header>
    <el-main class="main-wrap">
      <div class="header">
        <span class="el-icon-tickets">数据列表</span>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" class="account-add-btn" @click="projectCtrl('add')">新增</el-button>
      </div>
      <el-table
        v-loading="projectTableLoading"
        ref="projectTable"
        :data="projectTableData"
        :cell-style="tableCellStyleFcun"
        :header-cell-style="tableCellStyleFcun"
        row-key="id"
        class="project-table el-table_tree">
        <el-table-column prop="name" label="项目名称" align="left" />
        <el-table-column prop="companyName" width="120" label="状态" align="center" />
        <el-table-column width="220" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" class="no-border" @click="projectCtrl('edit', scope.row)">编辑</el-button>
            <el-dropdown size="small" @command="(order)=>projectOperaHandle(order, scope.row)">
              <el-button size="mini" class="no-border">更多操作</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="addStage">新增分期</el-dropdown-item>
                <el-dropdown-item command="edit">设置运营图</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- <el-footer class="footer-wrap">
      <div class="footer-operatete-wrap">
        <el-checkbox v-model="allCheckdeValue" border size="mini">全选</el-checkbox>
        <el-select v-model="batchOperateValue" clearable size="mini" placeholder="批量操作">
          <el-option value="disable" label="删除" />
        </el-select>
        <el-button type="primary" size="mini">确定</el-button>
      </div>
      <el-pagination
        :total="pageTotal"
        background
        layout="prev, pager, next, jumper"/>
    </el-footer> -->
    <addProject
      v-show="isAddProjectShow"
      :edit-project-data="editProjectData"
      :event-type="eventType"
      :is-add-project-show.sync="isAddProjectShow"
      @projectOperaedHandle="projectOperaedHandle"/>
  </el-container>
</template>
<script>
import AddProject from '@/views/project_config/project/components/addProject'
import { getProject, delProject } from '@/api/project_config/project'
import { mapMutations } from 'vuex'
export default {
  components: { AddProject },
  data() {
    return {
      searchForm: {
        projectName: ''
      },
      projectTableData: [], // 项目数据
      editProjectData: {}, // 要编辑的项目数据
      eventType: 'add',
      projectTableLoading: false,
      isAddProjectShow: false,
      pageTotal: 20
    }
  },
  created() {
    this.getProjectFunc()
  },
  methods: {
    ...mapMutations({
      saveProjectList: 'SET_PROJECT_LIST'
    }),
    // 表格样式操作
    tableCellStyleFcun({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return 'padding: 10px 20px;'
      }
    },
    // 加载项目列表
    getProjectFunc(params = {}) {
      this.projectTableLoading = true
      getProject(params).then(resp => {
        const list = resp.result.data
        this.projectTableLoading = false
        this.projectTableData = list
        this.saveProjectList(list)
      }).catch(() => {
        this.projectTableLoading = false
      })
    },
    // 查询项目处理
    searchProjectHandle() {
      const params = {
        'items[0].column': 'name',
        'items[0].value': this.searchForm.projectName
      }
      this.getProjectFunc(params)
    },
    // 添加、编辑项目处理
    projectCtrl(order, data) {
      this.isAddProjectShow = !this.isAddProjectShow
      if (order === 'edit') {
        this.editProjectData = data
        this.eventType = 'edit'
      }
    },
    // 删除项目处理
    delProjectHandle(data) {
      this.$confirm(`确定删除 ${data.name} 项目?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.projectTableLoading = true
        delProject(data.id).then(resp => {
          this.$message({
            message: '删除项目成功',
            type: 'success'
          })
          this.getProjectFunc()
        }).catch(() => {
          this.projectTableLoading = false
        })
      })
    },
    // 项目操作处理
    projectOperaHandle(order, data) {
      switch (order) {
        case 'addStage':
          console.log('data.id', data.id)
          this.$router.push({ name: 'ProjectStage', params: { projectId: data.id }})
          break
        case 'delete':
          this.delProjectHandle(data)
      }
    },
    // 项目操作完成后要执行的操作
    projectOperaedHandle() {
      this.getProjectFunc()
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.project-container {
  padding: 20px;
  .header {
    @include gray-header;
  }
  .search-wrap {
    @include boxShadow-container;
    .search-form {
      padding: 20px 40px;
      .el-form-item {
        margin: 0 15px 0 10px;
      }
    }
  }
  .main-wrap {
    margin-top: 30px;
    @include boxShadow-container;
    .project-table {
    }
  }
  .footer-wrap {
    padding: 0;
    margin-top: 30px;
    @include flex-layout(space-between, center, null, wrap);
    .el-select {
      width: 100px;
      margin: 0 10px;
    }
    .footer-operatete-wrap {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
  }
}
.el-dropdown-menu {
  text-align: center;
}
</style>
