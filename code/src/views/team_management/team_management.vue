<template>
  <!-- 班组管理页面 -->
  <el-container class="project-container">
    <el-header class="search-wrap" height="no">
      <div class="header">
        <span class="el-icon-tickets">筛选查询</span>
      </div>
      <el-form ref="searchForm" :inline="true" :model="searchForm" size="small" class="search-form">
        <!-- <el-form-item prop="projectName" label="项目名称">
          <el-input v-model="searchForm.projectName" type="text" auto-complete="off" placeholder="请输入项目名称" />
        </el-form-item>
        <el-button type="primary" size="small" class="search-btn" @click="searchProjectHandle">查询</el-button>-->
        <el-form-item prop="projectSelected" label="项目名称">
          <el-select v-model="searchForm.projectSelected" filterable placeholder="请选择项目">
            <el-option
              v-for="(item, idx) in projectSeletorList"
              :key="idx"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-button type="primary" size="small" class="search-btn" @click="searchHandle">查询</el-button>
        <el-button type="primary" size="small" class="search-btn" @click="teamOperation('add')">新增班组</el-button>
        <!-- <el-button type="primary" size="small" class="search-btn" plain @click="teamOperation('pull')">添加班组</el-button> -->
      </el-form>
    </el-header>
    <el-main class="main-wrap">
      <div class="header">
        <span class="el-icon-tickets">数据列表</span>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-circle-plus-outline"
          class="account-add-btn"
          @click="teamOperation('pull')"
        >添加班组</el-button>
      </div>
      <div class="table-wrap">
        <el-table
          v-loading="projectTableLoading"
          ref="projectTable"
          :data="projectTeamList"
          @cell-click="viewTeamDetail"
          row-key="id"
          border=""
          show-overflow-tooltip
          class="project-table el-table_tree"
        >
          <el-table-column prop="name" min-width="180" label="班组公司名称" align="left" fixed="left"/>
          <el-table-column prop="official" width="120" label="负责人" align="left"/>
          <el-table-column prop="personNum" :formatter="(row => { return row.personNum? row.personNum : 0 })" label="班组人数" width="100" align="left"/>
          <el-table-column prop="constructionScope" min-width="180" label="施工范围" align="left"/>
          <el-table-column width="200" label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" class="search-btn" @click="teamOperation('edit', scope.row)">编辑</el-button>
              <el-button
                type="text"
                class="search-btn"
                @click="teamOperation('delete', scope.row)"
              >删除</el-button>
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
    </el-footer>-->
    <!-- <addProject
      v-show="isAddProjectShow"
      :title-text="titleText"
      :edit-project-data="editProjectData"
      :event-type.sync="eventType"
      :is-add-project-show.sync="isAddProjectShow"
      @projectOperaedHandle="projectOperaedHandle"
    /> -->
    <pullTeam
      v-show="isPullTeamShow"
      :project-id="searchForm.projectSelected"
      :project-participant-ids="projectTeamIds"
      :is-pull-team-show.sync="isPullTeamShow"
      @reloadParticipant="reloadParticipant"/>
  </el-container>
</template>
<script>
import {
  getWorkTypeList,
  getProjectList,
  getProjectTeamList,
  deleteTeam
} from "@/api/team_management/team_management";
import pullTeam from '@/views/team_management/components/pullTeam'
// old code
// import {
//   getProjectSelectorList,
//   getAttLogDetailList
// } from '@/api/att_log/att_log.js'
import { mapActions } from "vuex";
import AddProject from "@/views/project_config/project/components/addProject";
import { delProject } from "@/api/project_config/project";
export default {
  components: { AddProject, pullTeam },
  data() {
    return {
      projectSeletorList: [],
      detailListParam: {
        checkDateFrom: "2019-08-24",
        checkDateTo: "2019-09-02",
        projectId: ""
      },
      projectTeamList: [],
      isPullTeamShow: false,
      projectTeamIds: [],
      // old code
      attLogDetailTableData: [],
      searchForm: {
        projectSelected: "",
        checkTime: ["2019-08-24", "2019-09-02"],
        // old code
        projectName: ""
      },
      projectTableData: [], // 保存显示到table的项目数据
      projectList: [], // 保存所有项目数据
      editProjectData: {}, // 要编辑的项目数据
      projectIdAndStatus: {}, // key：项目id，value：项目状态
      eventType: "add",
      titleText: "新增项目",
      projectTableLoading: false,
      isAddProjectShow: false,
      pageTotal: 20
    };
  },
  watch: {
    "searchForm.projectSelected": function(newVal) {
      this.detailListParam.projectId = newVal;
    },
    "searchForm.checkTime": function(newVal) {
      this.detailListParam.checkDateFrom = newVal[0];
      this.detailListParam.checkDateTo = newVal[1];
    }
  },
  mounted() {
    // 获取项目下拉列表内容
    this.initPage();
    // old code
    // 获取项目列表
    this.getProjectTreeFunc();
    // 获取项目详情列表
    this.getProjectDetailFunc();
  },
  methods: {
    // 班组的增删改查
    teamOperation(operation, row) {
      switch (operation) {
        // 新增班组
        case "add":
          this.$router.push({
            name: "teamStage",
            query: {
              operation: "add",
              projectId: this.searchForm.projectSelected
            }
          });
          break;
        // 编辑班组
        case "edit":
          this.$router.push({
            name: "teamStage",
            query: {
              operation: "edit",
              projectId: this.searchForm.projectSelected,
              orgId: row.id
            }
          });
          break;
        // 删除班组
        case "delete":
          this.$confirm("确定删除该班组?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showClose: false,
            type: "warning"
          })
            .then(() => {
              deleteTeam({
                projectId: this.searchForm.projectSelected,
                orgId: row.id
              })
                .then(() => {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.searchHandle();
                })
                .catch(err => {
                  this.$message.error(err);
                });
            })
            .catch(err => {
              console.log(err);
            });
          break;
        // 添加班组
        case "pull":
          this.isPullTeamShow = !this.isPullTeamShow
          break;
      }
    },
    // 查看班组详情
    viewTeamDetail(row, column, cell, event) {
      if (column.label === "操作") return false;
      this.$router.push({
        name: "teamStage",
        query: {
          operation: "detail",
          projectId: this.searchForm.projectSelected,
          orgId: row.id
        }
      });
    },
    // 获取项目名称下拉列表
    getProjectSelectorListFunc() {
      getProjectList().then(resp => {
        this.projectSeletorList = resp.result;
        this.searchForm.projectSelected = this.projectSeletorList[0].id;
        this.detailListParam.projectId = this.projectSeletorList[0].id;
      });
    },
    // 重新加载参建方数据
    reloadParticipant(reload) {
      if (reload) {
        this.searchHandle(this.searchForm.projectSelected)
      }
    },
    // 顶部搜索栏的查询功能
    searchHandle() {
      // getAttLogDetailList(this.detailListParam).then(resp => {
      //   this.attLogDetailTableData = resp.result
      // }).catch(err => {
      //   console.log(err)
      // })
      getProjectTeamList(this.searchForm.projectSelected)
        .then(resp => {
          this.projectTeamIds = []
          this.projectTeamList = resp.result;
          this.projectTeamList.forEach((e,i,s) => {
            this.projectTeamIds.push(e.id)
          })
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 初始化页面-解决一开始projectid为空的问题
    initPage() {
      getProjectList().then(resp => {
        this.projectSeletorList = resp.result;
        this.searchForm.projectSelected = this.projectSeletorList[0].id;
        this.detailListParam.projectId = this.projectSeletorList[0].id;
        this.searchHandle();
      });
    },
    // old code
    ...mapActions([
      "getDictionaryItemFunc",
      "getProjectListVuex",
      "getProjectDetailsVuex"
    ]),
    // 加载项目列表
    getProjectTreeFunc() {
      this.projectTableLoading = true;
      this.getProjectListVuex({ isGet: true })
        .then(resp => {
          const list = resp;
          this.projectTableLoading = false;
          this.projectList = list;
          this.projectTableData = list;
        })
        .catch(() => {
          this.projectTableLoading = false;
        });
    },
    // 加载项目详情树
    getProjectDetailFunc() {
      this.getProjectDetailsVuex({ isGet: true }).then(resp => {
        const data = resp;
        this.getStatusFromProject(data);
      });
    },
    // 从项目详情中获取项目状态
    getStatusFromProject(list) {
      // 从数据字典中获取项目状态数据
      const params = {
        "terms[0].column": "dictId",
        "terms[0].value": "project_status"
      };
      this.getDictionaryItemFunc({
        dataKey: "projectStatus",
        params: params
      }).then(resp => {
        this.setProjectIdAndStatus(list, resp);
      });
    },
    // 遍历项目详情，获取项目状态ID及项目状态名称
    setProjectIdAndStatus(list, dictData) {
      list.forEach(v => {
        if (v.estateProjectDetailEntity) {
          const statusId = v.estateProjectDetailEntity.typeId;
          if (statusId) {
            this.projectIdAndStatus[v.id] = dictData.find(
              val => val.id === statusId
            ).value;
          }
        }
        if (v.childrenWithDetail && v.childrenWithDetail.length > 0) {
          this.setProjectIdAndStatus(v.childrenWithDetail, dictData);
        }
      });
    },
    // 获取项目状态显示到table中
    getProjectStatus(data) {
      const projectId = data.id;
      return this.projectIdAndStatus[projectId];
    },
    // 按条件查询项目处理
    searchProjectHandle() {
      const projectName = this.searchForm.projectName;
      if (projectName === "") {
        this.projectTableData = this.projectList;
      } else {
        this.projectTableData = this.getTargetsByProjects(
          this.projectList,
          "name",
          projectName
        );
      }
    },
    getTargetsByProjects(projects, key, val) {
      const backProjects = [];
      projects.forEach(pro => {
        const match = pro[key].match(val);
        if (match) {
          backProjects.push(pro);
        }
      });
      return backProjects;
    },
    // 项目操作完成后要执行的操作
    projectOperaedHandle(order) {
      if (order) {
        this.getProjectTreeFunc();
        this.getProjectDetailFunc();
      }
    },
    // 项目操作处理
    projectOperaHandle(order, data) {
      switch (order) {
        // 新增项目
        case "addProject":
          this.isAddProjectShow = !this.isAddProjectShow;
          this.titleText = "新增项目";
          break;
        // 编辑项目
        case "editProject":
          this.isAddProjectShow = !this.isAddProjectShow;
          this.editProjectData = data;
          this.eventType = "edit";
          this.titleText = "编辑项目";
          break;
        // 增加项目分期
        case "addStage":
          this.$router.push({
            name: "ProjectStage",
            query: {
              projectId: data.id,
              eventType: "add"
            }
          });
          this.titleText = "增加项目分期";
          break;
        // 编辑项目分期
        case "editStage":
          this.$router.push({
            name: "ProjectStage",
            query: {
              projectId: data.id,
              eventType: "edit"
            }
          });
          this.titleText = "编辑项目分期";
          break;
        // 设置运营图
        case "setMap":
          console.log("setNap");
          this.titleText = "设置运营图";
          break;
        // 增加分期标段
        case "addSection":
          this.$router.push({
            name: "stageSection",
            query: {
              projectId: "",
              parentId: data.id,
              eventType: "add"
            }
          });
          this.titleText = "增加分期标段";
          break;
        // 编辑分期标段
        case "editSection":
          this.$router.push({
            name: "stageSection",
            query: {
              projectId: data.id,
              parentId: data.parentId,
              eventType: "edit"
            }
          });
          this.titleText = "编辑分期标段";
          break;
        // 标段分包设置
        case "setContract":
          console.log("setContract");
          this.titleText = "标段分包设置";
          break;
        // 删除处理
        case "delete":
          this.delProjectHandle(data);
          this.titleText = "删除处理";
      }
    },
    // 删除项目处理
    delProjectHandle(data) {
      this.$confirm(`确定删除 ${data.name} 项目?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.projectTableLoading = true;
        delProject(data.id)
          .then(resp => {
            this.$message({
              message: "删除项目成功",
              type: "success"
            });
            this.getProjectTreeFunc();
            this.getProjectDetailFunc();
          })
          .catch(() => {
            this.projectTableLoading = false;
          });
      });
    }
  }
};
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
