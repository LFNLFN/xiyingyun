<template>
  <el-container class="container">
    <el-aside width="no" class="side-wrap">
      <div class="header">
        <span>供应商信息</span>
        <span class="el-icon-circle-plus add-check-item-btn" @click="boxCtrl('supplier')"/>
      </div>
      <el-tree
        v-loading="suppTreeLoading"
        ref="suppTree"
        :data="suppTreeData"
        :props="suppTreeProp"
        :expand-on-click-node="false"
        :render-content="addTreeContRender"
        node-key="id"
        highlight-current
        current-node-key
        class="supplier-tree"
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
    <addSupplier
      v-show="isAddSuppShow"
      :supp-type-data="suppTypeData"
      :edit-supp-data="editSuppData"
      :supp-parent-id="suppParentId"
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
      :supp-tree-data="suppTreeData"
      :supp-tree-prop="suppTreeProp"
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
import AddSupplier from '@/views/base_data/suppliers/components/addSuppliers'
import AddPosition from '@/views/base_data/suppliers/components/addPosition'
import AddMember from '@/views/base_data/suppliers/components/AddMember'
import PullMember from '@/views/base_data/suppliers/components/PullMember'
import PositionMembers from '@/views/base_data/suppliers/components/PositionMembers'
import { getSuppliers, delSuppliers, getSuppType } from '@/api/base_data/suppliers'
import { getPosition, delPosition } from '@/api/base_data/suppliers'
import { emptyTarget } from '@/utils/public.js'
export default {
  components: { AddSupplier, AddPosition, AddMember, PullMember, PositionMembers },
  data() {
    return {
      // 供应商相关
      suppTreeData: [],
      suppTreeProp: {
        label: 'name',
        children: 'children'
      },
      isAddSuppShow: false,
      suppTreeLoading: false,
      suppTypeData: [], // 新增供应商类型，施工 or 监理
      editSuppData: {}, // 要编辑的供应商数据
      suppParentId: '', // 父级供应商ID
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
      eventType: 'add' // 事件类型，add：新增供应商，edit：编辑
    }
  },
  created() {
    // 获取供应商树
    this.getSuppTree()
    this.getSuppTypeFunc()
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
    // 获取供应商树
    getSuppTree() {
      this.suppTreeLoading = true
      getSuppliers().then(resp => {
        const treeList = resp.result
        this.suppTreeData = treeList.filter(tree => tree.type === 1)
        this.handleNodeClick(this.suppTreeData[0])
        this.suppTreeLoading = false
      }).catch(() => {
        this.postInfoLoading = false
        this.suppTreeLoading = false
      })
    },
    // 获取org_type，供应商类型
    getSuppTypeFunc() {
      getSuppType().then(resp => {
        const suppType = resp.result.data
        suppType.forEach(item => {
          const _obj = {
            id: item.id,
            value: item.value
          }
          this.suppTypeData.push(_obj)
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
    // 供应商树某节点被点击时的回调函数
    handleNodeClick(data, node, com) {
      if (!data) {
        this.postInfoLoading = false
        return
      }
      this.$nextTick(function() {
        this.$refs.suppTree.setCurrentKey(data.id)
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
      if (event === 'addMember') {
        this.addMemberCtrl(data)
      } else if (event === 'pullMember') {
        this.pullMemberCtrl(data)
      }
    },
    // 控制弹窗组件显隐
    boxCtrl(boxType) {
      switch (boxType) {
        case 'supplier':
          this.isAddSuppShow = !this.isAddSuppShow
          break
        case 'position':
          this.isAddPostShow = !this.isAddPostShow
          this.postDepartmentId = this.$refs.suppTree.getCurrentNode().id
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
    deleteSupp(data, type) {
      this.$confirm(`确定删除 ${data.name} ?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(acrion => {
        if (type === 'supplier') {
          this.suppTreeLoading = true
          delSuppliers(data.id).then(resp => {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success',
              duration: 3 * 1000
            })
            this.getSuppTree()
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
            this.getPositionFunc(this.$refs.suppTree.getCurrentNode())
          })
        }
      })
    },
    // 增加或编辑完成后的处理
    submitComplete(submit, boxType) {
      this.boxCtrl(boxType)
      // 重置porps数据
      this.editSuppData = {}
      this.suppParentId = ''
      this.editPostData = {}
      this.postParentId = ''
      this.eventType = 'add'
      this.addMemberPostData = {}
      this.pullMemberPostData = {}
      if (submit) {
        if (boxType === 'supplier') {
          this.getSuppTree()
        } else if (boxType === 'position') {
          this.getPositionFunc(this.$refs.suppTree.getCurrentNode())
        }
      }
    },
    // 下拉菜单处理
    handleyDropdown(order, data, type) {
      this.eventType = order
      switch (order) {
        case 'add':
          if (type === 'supplier') {
            this.suppParentId = data.id
          } else if (type === 'position') {
            this.postDepartmentId = this.$refs.suppTree.getCurrentNode().id
            this.postParentId = data.id
          }
          this.boxCtrl(type)
          break
        case 'edit':
          if (type === 'supplier') {
            this.editSuppData = data
          } else if (type === 'position') {
            this.editPostData = data
          }
          this.boxCtrl(type)
          break
        case 'delete':
          this.deleteSupp(data, type)
          break
      }
    },
    // 供应商树渲染函数
    addTreeContRender(h, { node, data, store }) {
      const roleData = data
      if (data.level === 0) {
        return (
          <span class='custom-tree-node'>
            <span>{node.label}</span>
            <span>
              <el-dropdown on-command={ (order) => this.handleyDropdown(order, roleData, 'supplier') }>
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
      } else {
        return (
          <span class='custom-tree-node'>
            <span>{node.label}</span>
          </span>
        )
      }
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
    .supplier-tree {
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
      }
    }
  }
}
</style>