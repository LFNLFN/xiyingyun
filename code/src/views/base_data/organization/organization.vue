<template>
  <el-container class="container">
    <el-aside width="no" class="side-wrap">
      <div class="header">
        <span>组织架构</span>
        <span class="el-icon-circle-plus add-check-item-btn" @click="boxCtrl('organization')"/>
      </div>
      <el-tree
        v-loading="organTreeLoading"
        ref="organTree"
        :data="organTreeData"
        :props="organTreeProp"
        :expand-on-click-node="false"
        :render-content="addTreeContRender"
        node-key="id"
        highlight-current
        current-node-key
        class="organization-tree"
        @node-click="handleNodeClick"/>
    </el-aside>
    <el-main v-loading="postInfoLoading" class="main-wrap">
      <div class="post-info-wrap">
        <div class="header">
          <span>岗位信息</span>
          <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="boxCtrl('position')">添加</el-button>
        </div>
        <div class="post-table-wrap">
          <el-table
            ref="postTable"
            :show-header="false"
            :data="postTableData"
            :cell-class-name="postTableCellClass"
            row-key="id"
            class="post-table el-table_base-data-position"
            @row-click="postMemberCtrl">
            <el-table-column prop="name" />
            <el-table-column width="250" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" class="post-table-btn" @click.stop="pullMemberCtrl(scope.row)">添加人员</el-button>
                <el-button size="mini" type="primary" class="post-table-btn" @click.stop="addMemberCtrl(scope.row)">新增人员</el-button>
                <el-dropdown size="small" @command="(order)=>handleyDropdown(order, scope.row, 'position')">
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
        </div>
      </div>
    </el-main>
    <addOrganization
      v-show="isAddOrganShow"
      :org-type-data="orgTypeData"
      :edit-organ-data="editOrganData"
      :organ-parent-id="organParentId"
      :event-type="eventType"
      @submitComplete="submitComplete"/>
    <addPosition
      v-show="isAddPostShow"
      :post-parent-id="postParentId"
      :post-department-id="postDepartmentId"
      :edit-post-data="editPostData"
      :event-type="eventType"
      @submitComplete="submitComplete"/>
    <addMember
      v-show="isAddMemberShow"
      :position-data="addMemberPostData"
      @submitComplete="submitComplete"/>
    <PullMember
      v-show="isPullMemberShow"
      :organ-tree-data="organTreeData"
      :organ-tree-prop="organTreeProp"
      :position-data="pullMemberPostData"
      :box-show="isPullMemberShow"
      @submitComplete="submitComplete"/>
    <PositionMembers
      v-show="isPostMembersShow"
      :position-data="postMembersPostData"
      :is-box-show="isPostMembersShow"
      @closeBox="postMemberCtrl"
      @postMemberEmitEvent="postMemberEmitEvent" />
  </el-container>
</template>
<script>
import AddOrganization from '@/views/base_data/organization/components/addOrganization'
import AddPosition from '@/views/base_data/organization/components/addPosition'
import AddMember from '@/views/base_data/organization/components/AddMember'
import PullMember from '@/views/base_data/organization/components/PullMember'
import PositionMembers from '@/views/base_data/organization/components/PositionMembers'
import { getOrganization, delOrganization, getOrgType } from '@/api/base_data/organization'
import { getPosition, delPosition } from '@/api/base_data/organization'
import { emptyTarget } from '@/utils/public.js'
export default {
  components: { AddOrganization, AddPosition, AddMember, PullMember, PositionMembers },
  data() {
    return {
      // 组织架构相关
      organTreeData: [],
      organTreeProp: {
        label: 'name',
        children: 'children'
      },
      isAddOrganShow: false,
      organTreeLoading: false,
      orgTypeData: [], // 新增组织架构类型，公司 or 部门
      editOrganData: {}, // 要编辑的组织架构数据
      organParentId: '', // 父级组织架构ID
      // 岗位信息相关
      isAddPostShow: false,
      postInfoLoading: true,
      postTableData: [], // 岗位信息
      editPostData: {}, // 要编辑的岗位数据
      postParentId: '', // 父级岗位或公司/部门ID
      postDepartmentId: '', // 职位所属的公司或部门ID
      // 新增人员相关
      isAddMemberShow: false,
      addMemberPostData: {}, // 新增人员的岗位信息
      // 添加人员相关
      isPullMemberShow: false,
      pullMemberPostData: {}, // 添加人员的岗位信息
      // 岗位人员数据相关
      isPostMembersShow: false,
      postMembersPostData: {}, // 查看岗位人员组件的岗位数据
      // 通用的传送到子组件的数据
      eventType: 'add' // 事件类型，add：新增组织架构，edit：编辑
    }
  },
  created() {
    // 获取组织架构树
    this.getOrganTree()
    this.getOrgTypeFunc()
  },
  methods: {
    // 设置岗位信息表格单元格的classname
    postTableCellClass(data) {
      if (!data.row.children && data.columnIndex === 0) {
        return 'isnt-tree'
      } else if (data.row.children) {
        return 'is-tree'
      }
    },
    // 获取组织架构树
    getOrganTree() {
      this.organTreeLoading = true
      getOrganization().then(resp => {
        const treeList = resp.result
        this.organTreeData = treeList.filter(tree => tree.type === 0)
        this.handleNodeClick(this.organTreeData[0])
        this.organTreeLoading = false
      }).catch(() => {
        this.postInfoLoading = false
        this.organTreeLoading = false
      })
    },
    // 获取org_type，组织架构类型
    getOrgTypeFunc() {
      getOrgType().then(resp => {
        const orgType = resp.result.data
        orgType.forEach(item => {
          const _obj = {
            id: item.id,
            value: item.value
          }
          this.orgTypeData.push(_obj)
        })
      })
    },
    // 获取相关岗位信息
    getPositionFunc(data) {
      const params = {
        'terms[0].column': 'departmentId',
        'terms[0].value': data.id
      }
      getPosition(params).then(resp => {
        this.postTableData = resp.result
        this.postInfoLoading = false
      }).catch(() => {
        this.postInfoLoading = false
      })
    },
    // 组织架构树某节点被点击时的回调函数
    handleNodeClick(data, node, com) {
      if (!data) {
        this.postInfoLoading = false
        return
      }
      this.$nextTick(function() {
        this.$refs.organTree.setCurrentKey(data.id)
      })
      this.postInfoLoading = true
      this.getPositionFunc(data)
    },
    // 增加人员组件的控制
    addMemberCtrl(data) {
      if (data) {
        this.addMemberPostData = data
      }
      this.isAddMemberShow = !this.isAddMemberShow
    },
    // 引入人员组件的控制
    pullMemberCtrl(data) {
      if (data) {
        this.pullMemberPostData = data
      }
      this.isPullMemberShow = !this.isPullMemberShow
    },
    // 控制查看岗位人员信息组件的显隐
    postMemberCtrl(row) {
      if (row) {
        this.postMembersPostData = row
      }
      if (this.isPostMembersShow) {
        this.postMembersPostData = emptyTarget(this.postMembersPostData)
      }
      this.isPostMembersShow = !this.isPostMembersShow
    },
    // 岗位人员信息组件处点击新增/添加人员按钮处理
    postMemberEmitEvent(event, data) {
      console.log('postMemberEmitEvent', `this.${event}`)
      if (event === 'addMember') {
        this.addMemberCtrl(data)
      } else if (event === 'pullMember') {
        this.pullMemberCtrl(data)
      }
    },
    // 控制弹窗组件显隐
    boxCtrl(boxType) {
      switch (boxType) {
        case 'organization':
          this.isAddOrganShow = !this.isAddOrganShow
          break
        case 'position':
          this.isAddPostShow = !this.isAddPostShow
          this.postDepartmentId = this.$refs.organTree.getCurrentNode().id
          break
        case 'addMember':
          this.isAddMemberShow = !this.isAddMemberShow
          break
        case 'pullMember':
          this.isPullMemberShow = !this.isPullMemberShow
          break
      }
    },
    // 删除处理
    deleteOrgan(data, type) {
      this.$confirm(`确定删除 ${data.name} ?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(acrion => {
        if (type === 'organization') {
          this.organTreeLoading = true
          delOrganization(data.id).then(resp => {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.getOrganTree()
          })
        } else if (type === 'position') {
          this.postInfoLoading = true
          delPosition(data.id).then(resp => {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.getPositionFunc(this.$refs.organTree.getCurrentNode())
          })
        }
      })
    },
    // 增加或编辑完成后的处理
    submitComplete(submit, boxType) {
      this.boxCtrl(boxType)
      // 重置porps数据
      this.editOrganData = {}
      this.organParentId = ''
      this.editPostData = {}
      this.postParentId = ''
      this.eventType = 'add'
      this.addMemberPostData = {}
      this.pullMemberPostData = {}
      if (submit) {
        if (boxType === 'organization') {
          this.getOrganTree()
        } else if (boxType === 'position') {
          this.getPositionFunc(this.$refs.organTree.getCurrentNode())
        }
      }
    },
    // 下拉菜单处理
    handleyDropdown(order, data, type) {
      this.eventType = order
      switch (order) {
        case 'add':
          if (type === 'organization') {
            this.organParentId = data.id
          } else if (type === 'position') {
            this.postDepartmentId = this.$refs.organTree.getCurrentNode().id
            this.postParentId = data.id
          }
          this.boxCtrl(type)
          break
        case 'edit':
          if (type === 'organization') {
            this.editOrganData = data
          } else if (type === 'position') {
            this.editPostData = data
          }
          this.boxCtrl(type)
          break
        case 'delete':
          this.deleteOrgan(data, type)
          break
      }
    },
    // 组织架构树渲染函数
    addTreeContRender(h, { node, data, store }) {
      const roleData = data
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
          <span>
            <el-dropdown on-command={ (order) => this.handleyDropdown(order, roleData, 'organization') }>
              <el-button type='primary' circle size='mini' class='el-icon-edit tree-edit-btn'></el-button>
              <el-dropdown-menu slot='dropdown'>
                <el-dropdown-item command='add'>新增</el-dropdown-item>
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

.container {
  .header {
    @include gray-header;
  }
  .side-wrap {
    margin: 20px;
    margin-right: 5px;
    @include boxShadow-container;
    .organization-tree {
      font-size: 14px;
      min-width: 250px;
      min-height: 300px;
      padding: 10px;
    }
    .add-check-item-btn {
      font-size: 28px;
      color: #409EFF;
      cursor: pointer;
    }
  }
  .main-wrap {
    .el-button {
      padding: 5px 7px;
    }
    .post-info-wrap {
      @include boxShadow-container;
      .post-table-wrap{
        padding: 20px 10px;
        .post-table {
          .el-table__body {
            tr {
              cursor: pointer !important;
            }
          }
          .el-dropdown {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>