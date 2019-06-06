<template>
  <el-container>
    <el-aside v-loading="roleTreeLoading" width="250px" class="roles-tree-wrap">
      <div class="header">
        <span>角色列表</span>
        <el-button type="primary" circle size="small" class="el-icon-plus add-roles-btn" @click="addRolesBoxCtrl"/>
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
        @node-click="nodeClickHandle" />
    </el-aside>
    <el-main class="roles-detail-wrap">
      <div class="roles-members">
        <div class="header">
          <span>人员列表 </span>
          <!-- <el-button type="primary" size="small" class="manage-members-btn" @click="membersBoxCtrl">添加人员</el-button> -->
        </div>
        <div class="search-wrap">
          <el-form
            ref="searchForm"
            :inline="true"
            :model="searchFormData">
            <el-form-item label="姓名">
              <el-input v-model="searchFormData.name" size="small" placeholder="请输入姓名"/>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="searchFormData.phone" size="small" placeholder="请输入手机号"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchHandle">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-wrap">
          <el-table
            v-loading="iStableLoading"
            ref="memberTable"
            :data="memberTableData"
            size="small"
            class="member-table">
            <el-table-column prop="name" width="100" label="姓名" align="center" />
            <el-table-column prop="phone" label="手机" align="center" />
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
          background
          layout="prev, pager, next, jumper"
          @current-change="pageChangeHandle"/>
      </div>
    </el-main>
    <AddRoles
      v-show="isAddRolesShow"
      :role-data="editRoleData"
      :event-type="addOrEditRole"
      @submitComplete="submitComplete"/>
  </el-container>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import AddRoles from '@/views/base_data/permission/components/addRoles'
import { delRoles, getRolesPerson } from '@/api/base_data/permission.js'
export default {
  components: { AddRoles },
  data() {
    return {
      rolesTreeData: [],
      rolesTreeProps: {
        label: 'name',
        children: 'children'
      },
      memberTableData: [],
      searchFormData: {
        name: '',
        phone: ''
      },
      isAddRolesShow: false,
      roleTreeLoading: false,
      iStableLoading: false,
      editRoleData: {}, // 保存要编辑的角色的数据
      addOrEditRole: '', // 决定添加角色还是编辑角色，add：添加，edit：编辑
      pageTotal: 0
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    ...mapActions([
      'getPerRoles'
    ]),
    ...mapMutations({
      clearRoles: 'CLEAR_PER_ROLES'
    }),
    // 添加角色组件显隐控制
    addRolesBoxCtrl() {
      this.isAddRolesShow = !this.isAddRolesShow
    },
    // 分页查询控制
    pageChangeHandle(index) {

    },
    // 获取角色用户
    getRolesPersonFun(data, paramObj = {}) {
      this.iStableLoading = true
      const { name, phone, pageIndex } = paramObj
      const param = {
        name: name || '',
        phone: phone || '',
        pageIndex: pageIndex || 0,
        pageSize: 10
      }
      getRolesPerson(data.id, param).then(resp => {
        this.memberTableData = resp.result
        if (resp.pageTotal) {
          this.pageTotal = resp.pageTotal
        } else {
          this.pageTotal = resp.result.length
        }
        this.iStableLoading = false
      }).catch(() => {
        this.iStableLoading = false
      })
    },
    // 按条件查询角色人员
    searchHandle() {
      const param = {
        name: this.searchFormData.name,
        phone: this.searchFormData.phone
      }
      const data = this.$refs.rolesTree.getCurrentNode()
      this.getRolesPersonFun(data, param)
    },
    // 角色节点点击处理
    nodeClickHandle(data, node) {
      this.$nextTick(function() {
        this.$refs.rolesTree.setCurrentKey(data.id)
      })
      this.getRolesPersonFun(data)
    },
    // 删除角色
    deleteRole(data) {
      this.$confirm('确定删除该角色？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'wraning'
      }).then(action => {
        this.roleTreeLoading = true
        delRoles(data.id).then(resp => {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.clearRoles()
          this.getRolesList()
        }).catch(() => {
          this.roleTreeLoading = false
        })
      })
    },
    // 获取角色列表
    getRolesList(params = {}) {
      this.roleTreeLoading = true
      this.getPerRoles().then(resp => {
        this.roleTreeLoading = false
        this.rolesTreeData = resp
      }).catch(() => {
        this.roleTreeLoading = false
      })
    },
    // 下拉菜单处理
    dropdownHandle(order, data) {
      if (!order) {
        return
      }
      switch (order) {
        case 'add':
          this.addOrEditRole = order
          this.addRolesBoxCtrl()
          break
        case 'edit':
          this.editRoleData = data
          this.addOrEditRole = order
          this.addRolesBoxCtrl()
          break
        case 'delete':
          this.deleteRole(data)
          break
      }
    },
    // 新增角色后处理
    submitComplete(submit) {
      this.addRolesBoxCtrl()
      if (submit) {
        // 清空vuex中保存的权限角色，重新加载
        this.clearRoles()
        this.getRolesList()
      }
    },
    // 角色树渲染函数
    addTreeContRender(h, { node, data, store }) {
      const roleData = data
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
          <span>
            <el-dropdown on-command={ (order) => this.dropdownHandle(order, roleData) }>
              <el-button type='primary' circle size='mini' class='el-icon-edit tree-edit-btn'></el-button>
              <el-dropdown-menu slot='dropdown'>
                <el-dropdown-item command='edit'>编辑</el-dropdown-item>
                <el-dropdown-item command='delete'>删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      )
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
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
  .roles-detail-wrap {
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
