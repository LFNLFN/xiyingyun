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
        <el-button type="primary" size="small" class="search-btn" @click="searchProjectHandle">查询</el-button>
      </el-form>
    </el-header>
    <el-main class="main-wrap">
      <div class="header">
        <span class="el-icon-tickets">数据列表</span>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" class="account-add-btn" @click="projectOperaHandle('addProject')">新增</el-button>
      </div>
      <div class="table-wrap">
        <el-table
          v-loading="projectTableLoading"
          ref="projectTable"
          :data="projectTableData"
          row-key="id"
          class="project-table el-table_tree">
          <el-table-column prop="name" min-width="200" label="项目名称" align="left" />
          <el-table-column prop="companyName" label="状态" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.type !== 0">{{ getProjectStatus(scope.row) }}</span>
            </template>
          </el-table-column>
          <el-table-column width="200" label="操作" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.type === 0">
                <el-button size="mini" class="no-border" @click="projectOperaHandle('editProject', scope.row)">编辑</el-button>
                <el-dropdown size="small" @command="(order)=>projectOperaHandle(order, scope.row)">
                  <el-button size="mini" class="no-border">更多操作</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="addStage">新增分期</el-dropdown-item>
                    <el-dropdown-item command="setMap">设置运营图</el-dropdown-item>
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template v-else-if="scope.row.type === 1">
                <el-button size="mini" class="no-border" @click="projectOperaHandle('editStage', scope.row)">编辑</el-button>
                <el-dropdown size="small" @command="(order)=>projectOperaHandle(order, scope.row)">
                  <el-button size="mini" class="no-border">更多操作</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="addSection">新增标段</el-dropdown-item>
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <template v-else-if="scope.row.type === 2">
                <el-button size="mini" class="no-border" @click="projectOperaHandle('editSection', scope.row)">编辑</el-button>
                <el-dropdown size="small" @command="(order)=>projectOperaHandle(order, scope.row)">
                  <el-button size="mini" class="no-border">更多操作</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="setContract">分包设置</el-dropdown-item>
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
      :event-type.sync="eventType"
      :is-add-project-show.sync="isAddProjectShow"
      @projectOperaedHandle="projectOperaedHandle"/>
  </el-container>
</template>
<script>
import { mapActions } from 'vuex'
import AddProject from '@/views/project_config/project/components/addProject'
import { delProject } from '@/api/project_config/project'
export default {
  components: { AddProject },
  data() {
    return {
      searchForm: {
        projectName: ''
      },
      projectTableData: [], // 保存显示到table的项目数据
      projectList: [], // 保存所有项目数据
      editProjectData: {}, // 要编辑的项目数据
      projectIdAndStatus: {}, // key：项目id，value：项目状态
      eventType: 'add',
      projectTableLoading: false,
      isAddProjectShow: false,
      pageTotal: 20
    }
  },
  created() {
    // 获取项目列表
    this.getProjectTreeFunc()
    // 获取项目详情列表
    this.getProjectDetailFunc()
  },
  methods: {
    ...mapActions([
      'getDictionaryItemFunc',
      'getProjectListVuex',
      'getProjectDetailsVuex'
    ]),
    // 加载项目列表
    getProjectTreeFunc() {
      this.projectTableLoading = true
      this.getProjectListVuex({ isGet: true }).then(resp => {
        const list = resp
        this.projectTableLoading = false
        this.projectList = list
        this.projectTableData = list
      }).catch(() => {
        this.projectTableLoading = false
      })
    },
    // 加载项目详情树
    getProjectDetailFunc() {
      this.getProjectDetailsVuex({ isGet: true }).then(resp => {
        const data = resp
        this.getStatusFromProject(data)
      })
    },
    // 从项目详情中获取项目状态
    getStatusFromProject(list) {
      // 从数据字典中获取项目状态数据
      const params = {
        'terms[0].column': 'dictId',
        'terms[0].value': 'project_status'
      }
      this.getDictionaryItemFunc({ dataKey: 'projectStatus', params: params }).then(resp => {
        this.setProjectIdAndStatus(list, resp)
      })
    },
    // 遍历项目详情，获取项目状态ID及项目状态名称
    setProjectIdAndStatus(list, dictData) {
      list.forEach(v => {
        if (v.estateProjectDetailEntity) {
          const statusId = v.estateProjectDetailEntity.typeId
          if (statusId) {
            this.projectIdAndStatus[v.id] = (dictData.find(val => val.id === statusId)).value
          }
        }
        if (v.childrenWithDetail && v.childrenWithDetail.length > 0) {
          this.setProjectIdAndStatus(v.childrenWithDetail, dictData)
        }
      })
    },
    // 获取项目状态显示到table中
    getProjectStatus(data) {
      const projectId = data.id
      return this.projectIdAndStatus[projectId]
    },
    // 按条件查询项目处理
    searchProjectHandle() {
      const projectName = this.searchForm.projectName
      if (projectName === '') {
        this.projectTableData = this.projectList
      } else {
        this.projectTableData = this.getTargetsByProjects(this.projectList, 'name', projectName)
      }
    },
    getTargetsByProjects(projects, key, val) {
      const backProjects = []
      projects.forEach(pro => {
        const match = pro[key].match(val)
        if (match) {
          backProjects.push(pro)
        }
      })
      return backProjects
    },
    // 项目操作完成后要执行的操作
    projectOperaedHandle(order) {
      if (order) {
        this.getProjectTreeFunc()
        this.getProjectDetailFunc()
      }
    },
    // 项目操作处理
    projectOperaHandle(order, data) {
      switch (order) {
        // 新增项目
        case 'addProject':
          this.isAddProjectShow = !this.isAddProjectShow
          break
        // 编辑项目
        case 'editProject':
          this.isAddProjectShow = !this.isAddProjectShow
          this.editProjectData = data
          this.eventType = 'edit'
          break
        // 增加项目分期
        case 'addStage':
          this.$router.push({ name: 'ProjectStage', query: {
            projectId: data.id,
            eventType: 'add'
          }})
          break
        // 编辑项目分期
        case 'editStage':
          this.$router.push({ name: 'ProjectStage', query: {
            projectId: data.id,
            eventType: 'edit'
          }})
          break
        // 设置运营图
        case 'setMap':
          console.log('setNap')
          break
        // 增加分期标段
        case 'addSection':
          this.$router.push({ name: 'stageSection', query: {
            projectId: '',
            parentId: data.id,
            eventType: 'add'
          }})
          break
        // 编辑分期标段
        case 'editSection':
          this.$router.push({ name: 'stageSection', query: {
            projectId: data.id,
            parentId: data.parentId,
            eventType: 'edit'
          }})
          break
        // 标段分包设置
        case 'setContract':
          console.log('setContract')
          break
        // 删除处理
        case 'delete':
          this.delProjectHandle(data)
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
          this.getProjectTreeFunc()
          this.getProjectDetailFunc()
        }).catch(() => {
          this.projectTableLoading = false
        })
      })
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
    .table-wrap {
      padding: 20px;
      .project-table {
        .el-dropdown {
          margin-left: 10px;
        }
      }
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
  .el-dropdown-menu__item {
    padding: 3px 15px;
  }
}
</style>
