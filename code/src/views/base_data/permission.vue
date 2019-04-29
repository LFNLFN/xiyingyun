<template>
  <el-container>
    <el-aside width="250px" class="roles-tree-wrap">
      <div class="header">
        <span><i class="el-icon-tickets"/>角色列表</span>
      </div>
      <el-tree :data="rolesTreeData" :props="rolesTreeProps" class="roles-tree" />
    </el-aside>
    <el-main class="roles-detail-wrap">
      <div class="roles-members">
        <div class="header">
          <span><i class="el-icon-tickets"/>人员列表 </span>
          <el-button type="primary" size="small" class="manage-members-btn" @click="membersBoxCtrl">管理</el-button>
        </div>
        <el-row type="flex" justify="center" class="members-list">
          <el-col v-for="( mem, idx ) in rolesmembres" :key="idx" class="members-list-item">{{ mem }}</el-col>
        </el-row>
      </div>
      <div class="roles-premission">
        <div class="header">
          <span><i class="el-icon-tickets"/>角色权限</span>
          <el-button type="primary" size="small" class="manage-premission-btn">管理权限</el-button>
        </div>
      </div>
    </el-main>
    <manegeMembers v-show="isManageMemberShow" @closePupupsBox="membersBoxCtrl"/>
  </el-container>
</template>
<script>
import ManegeMembers from '@/views/base_data/components/permission/manageMembers'
export default {
  components: { ManegeMembers },
  data() {
    return {
      rolesTreeData: [
        {
          name: '管理员',
          children: [
            {
              name: '普通管理员'
            },
            {
              name: '超级管理员'
            }
          ]
        },
        {
          name: '访客'
        }
      ],
      rolesTreeProps: {
        label: 'name',
        children: 'children'
      },
      rolesmembres: ['张三', '赵茜', '五五', 'sunny', 'sbs'],
      isManageMemberShow: false
    }
  },
  methods: {
    membersBoxCtrl() {
      this.isManageMemberShow = !this.isManageMemberShow
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
  .roles-tree-wrap {
    margin: 20px;
    min-height: 300px;
    @include boxShadow-container;
    .roles-tree {
      padding: 10px;
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
</style>
