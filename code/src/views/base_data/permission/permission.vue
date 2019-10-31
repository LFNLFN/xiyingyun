<template>
  <el-container>
    <el-aside v-loading="roleTreeLoading" width="250px" class="roles-tree-wrap">
      <div class="header">
        <span>角色列表</span>
        <el-button
          type="primary"
          circle
          size="small"
          class="el-icon-plus add-roles-btn"
          :disabled="!(pagePermission['add-role'])"
          @click="addRolesBoxCtrl('add')"
        />
      </div>
      <el-tree
        ref="rolesTree"
        :data="rolesTreeData"
        :props="rolesTreeProps"
        :expand-on-click-node="false"
        :render-content="addTreeContRender"
        node-key="id"
        highlight-current
        class="roles-tree"
        @node-click="nodeClickHandle"
      />
    </el-aside>
    <el-container>
      <el-header height="50px" class="header-wrap" style="margin-top: 12px">
        <div class="item-warp">
          <span
            :class="{'is-active': currentComponent === 'Members'}"
            class="item-tag"
            @click="currentComponent='Members'"
          >人员</span>
          <span
            :class="{'is-active': currentComponent === 'Warrant'}"
            class="item-tag"
            @click="currentComponent='Warrant'"
          >功能授权</span>
        </div>
        <!-- <span><i class="el-icon-close" @click="closeBox" /></span> -->
      </el-header>
      <el-main class="roles-detail-wrap">
        <!-- 封装组件 -->
        <memberList
          v-show="currentComponent==='Members'"
          :is-table-loading="isTableLoading"
          :member-table-data="memberTableData"
          :page-total="pageTotal"
          @changePage="pageChangeHandle"
        />
        <functionAutz v-show="currentComponent==='Warrant'" :current-role="currentRole"/>
        <div class="roles-members" v-if="false">
          <div class="header">
            <span>人员列表</span>
            <!-- <el-button type="primary" size="small" class="manage-members-btn" @click="membersBoxCtrl">添加人员</el-button> -->
          </div>
          <div class="search-wrap">
            <el-form ref="searchForm" :inline="true" :model="searchFormData">
              <el-form-item label="姓名">
                <el-input v-model="searchFormData.name" size="small" placeholder="请输入姓名"/>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="searchFormData.phone" size="small" placeholder="请输入手机号"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchHandle" :disabled="!(pagePermission.get)">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table-wrap">
            <el-table
              v-loading="isTableLoading"
              ref="memberTable"
              :data="memberTableData"
              size="small"
              class="member-table"
            >
              <el-table-column prop="name" width="100" label="姓名" align="center"/>
              <el-table-column prop="phone" label="手机" align="center"/>
              <el-table-column label="操作" width="120" align="center">
                <template slot-scope="scope">
                  <el-button>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            :total="pageTotal"
            :page-size="10"
            background=""
            layout="prev, pager, next, jumper"
            @current-change="pageChangeHandle"
          />
        </div>
      </el-main>
    </el-container>
    <AddRoles
      v-show="isAddRolesShow"
      :role-data="editRoleData"
      :event-type="addOrEditRole"
      @submitComplete="submitComplete"
    />
  </el-container>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import AddRoles from "@/views/base_data/permission/components/addRoles";
import memberList from "@/views/base_data/permission/components/memberList";
import functionAutz from "@/views/base_data/permission/components/functionAutz/functionAutz";
import { delRoles, getRolesPerson } from "@/api/base_data/permission.js";
import permissionOfPage from "@/mixins/permissionOfPage";
export default {
  components: { AddRoles, memberList, functionAutz },
  mixins: [permissionOfPage],
  data() {
    return {
      currentComponent: "Members",
      rolesTreeData: [],
      rolesTreeProps: {
        label: "name",
        children: "children"
      },
      memberTableData: [],
      searchFormData: {
        name: "",
        phone: ""
      },
      isAddRolesShow: false,
      roleTreeLoading: false,
      isTableLoading: false,
      editRoleData: {}, // 保存要编辑的角色的数据
      addOrEditRole: "", // 决定添加角色还是编辑角色，add：添加，edit：编辑
      pageTotal: 0,
      currentRole: {}
    };
  },
  created() {
    this.getRolesList();
  },
  beforeDestroy() {
    this.GetInfo()
  },
  methods: {
    ...mapActions(["getPerRoles", 'GetInfo']),
    ...mapMutations({
      clearRoles: "CLEAR_PER_ROLES"
    }),
    // 添加角色组件显隐控制
    addRolesBoxCtrl(eventType) {
      if (eventType) {
        this.addOrEditRole = eventType;
      }
      this.isAddRolesShow = !this.isAddRolesShow;
    },
    // 分页查询控制
    pageChangeHandle(index) {},
    // 获取角色用户
    getRolesPersonFun(data, paramObj = {}) {
      this.isTableLoading = true;
      const { name, phone, pageIndex } = paramObj;
      const param = {
        name: name || "",
        phone: phone || "",
        pageIndex: pageIndex || 0,
        pageSize: 10
      };
      getRolesPerson(data.id, param)
        .then(resp => {
          this.memberTableData = resp.result.reverse(); // 因为要升序
          if (resp.pageTotal) {
            this.pageTotal = resp.pageTotal;
          } else {
            this.pageTotal = resp.result.length;
          }
          this.isTableLoading = false;
        })
        .catch(() => {
          this.isTableLoading = false;
        });
    },
    // 按条件查询角色人员
    searchHandle() {
      const param = {
        name: this.searchFormData.name,
        phone: this.searchFormData.phone
      };
      const data = this.$refs.rolesTree.getCurrentNode();
      this.getRolesPersonFun(data, param);
    },
    // 角色节点点击处理
    nodeClickHandle(data, node) {
      this.currentRole = data;
      this.$nextTick(function() {
        this.$refs.rolesTree.setCurrentKey(data.id);
      });
      this.getRolesPersonFun(data);
    },
    // 删除角色
    deleteRole(data) {
      this.$confirm("确定删除该角色？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "wraning"
      }).then(action => {
        this.roleTreeLoading = true;
        delRoles(data.id)
          .then(resp => {
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
              duration: 3 * 1000
            });
            this.clearRoles();
            this.getRolesList();
          })
          .catch(() => {
            this.roleTreeLoading = false;
          });
      });
    },
    // 获取角色列表
    getRolesList(params = {}) {
      this.roleTreeLoading = true;
      this.getPerRoles()
        .then(resp => {
          this.roleTreeLoading = false;
          this.rolesTreeData = resp;
        })
        .catch((err) => {
          this.roleTreeLoading = false;
        });
    },
    // 下拉菜单处理
    dropdownHandle(order, data) {
      if (!order) {
        return;
      }
      switch (order) {
        case "add":
          this.addOrEditRole = order;
          this.addRolesBoxCtrl();
          break;
        case "edit":
          this.editRoleData = Object.assign({}, data);
          this.addOrEditRole = order;
          this.addRolesBoxCtrl();
          break;
        case "delete":
          this.deleteRole(data);
          break;
      }
    },
    // 新增角色后处理
    submitComplete(submit) {
      this.addRolesBoxCtrl();
      if (submit) {
        // 清空vuex中保存的权限角色，重新加载
        this.clearRoles();
        this.getRolesList();
      }
    },
    // 角色树渲染函数
    addTreeContRender(h, { node, data, store }) {
      const roleData = data;
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-dropdown
              on-command={order => this.dropdownHandle(order, roleData)}
            >
              <el-button
                type="primary"
                circle
                size="mini"
                class="el-icon-edit tree-edit-btn"
              />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit" disabled={ !this.pagePermission['update-role'] }>编辑</el-dropdown-item>
                <el-dropdown-item command="delete" disabled={ !this.pagePermission['delete-role'] }>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      );
    }
  }
};
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
  .header-wrap {
    background: #fff;
    padding: 0 10px 0 0;
    border-bottom: 1px solid #ccc;
    @include flex-layout(space-between, center, null, null);
    .item-warp {
      height: 100%;
      .item-tag {
        padding: 0 15px;
        display: inline-block;
        height: 100%;
        line-height: 50px;
        cursor: pointer;
        &.is-active {
          border-bottom: 2px solid #03a9f4;
          color: #03a9f4;
          margin-top: 1px;
        }
      }
    }
    i {
      cursor: pointer;
      float: right;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .header {
    @include gray-header;
  }
  .el-button {
    padding: 7px 7px;
  }
  .add-roles-btn {
    font-size: 14px;
    padding: 5px;
  }
  .roles-tree-wrap {
    margin: 20px;
    min-height: 300px;
    @include boxShadow-container;
    .roles-tree {
      padding: 10px;
      .el-tree-node__content {
        margin: 5px 0;
      }
    }
  }
  &/deep/.roles-detail-wrap {
    padding-left: 0;
    .roles-members {
      @include boxShadow-container;
      .manage-members-btn {
        // float: right;
        // margin: 5
      }
    }
    .search-wrap {
      padding: 30px 20px;
      .el-form {
        .el-form-item {
          margin-bottom: 0px;
        }
        .el-input {
          width: 150px;
        }
        .el-button {
          margin-left: 20px;
        }
      }
    }
    .table-wrap {
      padding: 0 20px;
      .member-table {
        border: 1px solid #ccc;
        margin-bottom: 20px;
      }
    }
    .el-pagination {
      text-align: center;
      margin-bottom: 20px;
    }
  }
}
.custom-tree-node {
  @include flex-layout(space-between, center, null, null);
  padding-right: 8px;
  flex: 1;
  .tree-edit-btn {
    padding: 3px;
  }
}
</style>
