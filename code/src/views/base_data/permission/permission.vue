<template>
  <el-container>
    <el-aside width="250px" class="roles-tree-wrap">
      <div class="header">
        <span>角色列表</span>
        <el-button type="primary" circle size="small" class="el-icon-plus add-roles-btn" @click="addRolesBoxCtrl"/>
      </div>
      <el-tree
        :data="rolesTreeData"
        :props="rolesTreeProps"
        :expand-on-click-node="false"
        class="roles-tree" />
        <!-- <el-tree
        :data="rolesTreeData"
        :props="rolesTreeProps"
        :expand-on-click-node="false"
        :render-content="addTreeContRender"
        class="roles-tree" /> -->
    </el-aside>
    <el-main class="roles-detail-wrap">
      <div class="roles-members">
        <div class="header">
          <span>人员列表 </span>
          <el-button type="primary" size="small" class="manage-members-btn" @click="membersBoxCtrl">管理</el-button>
        </div>
        <el-row type="flex" justify="center" class="members-list">
          <el-col v-for="( mem, idx ) in rolesmembres" :key="idx" class="members-list-item">{{ mem }}</el-col>
        </el-row>
      </div>
      <div class="roles-premission">
        <div class="header">
          <span>角色权限</span>
          <el-button type="primary" size="small" class="manage-premission-btn">管理权限</el-button>
        </div>
      </div>
    </el-main>
    <manegeMembers
      v-show="isManageMemberShow"
      @closePupupsBox="membersBoxCtrl"/>
    <AddRoles
      v-show="isAddRolesShow"
      :role-data="editRoleData"
      :event-type="addOrEditRole"
      @closePupupsBox="addRolesBoxCtrl"/>
  </el-container>
</template>
<script>
import ManegeMembers from '@/views/base_data/permission/components/manageMembers'
import AddRoles from '@/views/base_data/permission/components/addRoles'
import { getRoles } from '@/api/base_data/permission.js'
export default {
  components: { ManegeMembers, AddRoles },
  data() {
    return {
      rolesTreeData: [],
      rolesTreeProps: {
        label: 'name',
        children: 'children'
      },
      rolesmembres: ['张三', '赵茜', '五五', 'sunny', 'sbs'],
      isManageMemberShow: false,
      isAddRolesShow: false,
      editRoleData: {}, // 保存要编辑的角色的数据
      addOrEditRole: '' // 决定添加角色还是编辑角色，add：添加，edit：编辑

    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 成员管理组件显隐控制
    membersBoxCtrl() {
      this.isManageMemberShow = !this.isManageMemberShow
    },
    // 添加角色组件显隐控制
    addRolesBoxCtrl() {
      this.isAddRolesShow = !this.isAddRolesShow
    },
    // 删除角色
    deleteRole() {
      this.$confirm('确定删除该角色？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'wraning'
      }).then(action => {
        console.log('delete role')
      })
    },
    // 获取角色列表
    getRolesList(params = {}) {
      getRoles(params).then(resp => {
        this.rolesTreeData = resp.result.data
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
          this.deleteRole()
          break
      }
    }
    // 角色树渲染函数
    // addTreeContRender(h, { node, data, store }) {
    //   console.log('data', data)
    //   const roleData = data
    //   return (
    //     <span class='custom-tree-node'>
    //       <span>{node.label}</span>
    //       <span>
    //         <el-dropdown trigger='click' on-command={ (order) => this.dropdownHandle(order, roleData) }>
    //           <el-button type='primary' circle size='mini' class='el-icon-edit tree-edit-btn'></el-button>
    //           <el-dropdown-menu slot='dropdown'>
    //             <el-dropdown-item command='add'>新增</el-dropdown-item>
    //             <el-dropdown-item command='edit'>编辑</el-dropdown-item>
    //             <el-dropdown-item command='delete'>删除</el-dropdown-item>
    //           </el-dropdown-menu>
    //         </el-dropdown>
    //       </span>
    //     </span>
    //   )
    // }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss">
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
    .roles-members {
      @include boxShadow-container;
      .manage-members-btn {
        // float: right;
        // margin: 5
      }
      .members-list {
        padding: 15px;
        .members-list-item {
          padding: 5px;
          text-align: center;
          margin: 5px;
        }
      }
    }
    .roles-premission {
      margin-top: 40px;
      @include boxShadow-container;
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
