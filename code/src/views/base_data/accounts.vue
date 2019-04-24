<template>
  <el-container class="accounts-container">
    <!-- 头部信息筛选部分 -->
    <el-header class="search-container" height="no">
      <div class="search-header">
        <i class="el-icon-tickets"/>
        筛选查询
      </div>
      <el-form ref="searchForm" :rules="searchRules" :inline="true" :model="searchForm" size="small" class="search-form">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="searchForm.name" name="name" type="text" auto-complete="off" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号码">
          <el-input v-model="searchForm.phone" type="text" />
        </el-form-item>
        <el-button type="primary" size="small" class="search-btn" @click="filterStaffInfo">查询</el-button>
      </el-form>
    </el-header>
    <!-- 中间员工信息部分 -->
    <el-main class="staff-table-container">
      <div class="staff-header">
        <i class="el-icon-tickets"/>
        数据列表
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="staff-add-btn" @click.native="addStaffBoxShow">新增</el-button>
      </div>
      <el-table
        v-loading="isLoading"
        ref="staffTable"
        :data="tableData"
        :row-class-name="tableRowClass"
        border
        class="staff-table"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" width="100" label="姓名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="expireTime" label="失效时间" />
        <el-table-column width="220" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" class="staff-table-btn">编辑</el-button>
            <el-button size="mini" type="primary" class="staff-table-btn" @click="passwordBoxShow(scope.$index)">重置密码</el-button>
            <!-- status === 1 正常用户 -->
            <el-button v-if="scope.row.status===1" size="mini" type="primary" class="staff-table-btn" @click="staffDisable(scope.$index)">禁用</el-button>
            <!-- status === 0 被禁用用户 -->
            <el-button v-else size="mini" type="primary" class="staff-table-btn" @click="staffDisable(scope.$index)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- 底部批量操作、翻页部分 -->
    <el-footer>
      <div class="footer-operate-wrap">
        <el-checkbox v-model="allCheckdeValue" border size="mini" @change.native="tableToggleSelection">全选</el-checkbox>
        <el-select v-model="batchSelectedValue" clearable size="mini" placeholder="批量操作">
          <el-option value="changPassword" label="更改密码" />
          <el-option value="delete" label="启用" />
        </el-select>
        <el-button type="primary" size="mini">确定</el-button>
      </div>
      <el-pagination
        :total="pageTotal"
        background
        layout="prev, pager, next, jumper"
        @current-change="pageChangeHandle"/>
    </el-footer>
    <AddStaffBox v-show="showStarffBox" @closeAddStaffBox="addStaffBoxShow" />
    <ResetPassword v-show="showPasswordBox" :user-data="resetPasswordUser" @closePasswordBox="passwordBoxShow"/>
  </el-container>
</template>
<script>
import AddStaffBox from '@/views/base_data/components/accounts/AddStaffBox'
import ResetPassword from '@/views/base_data/components/accounts/ResetPassword'
import { getUsers, disableUser, enableUser } from '@/api/base_data/accounts'
export default{
  name: 'Accounts',
  components: { AddStaffBox, ResetPassword },
  data() {
    const validsearchForm = (rule, value, callback) => {
      if (this.searchForm.name.length === 0 && this.searchForm.phone.length === 0) {
        callback(new Error('请输入用户名称或手机号码'))
      } else {
        callback()
      }
    }
    return {
      searchForm: {
        name: '',
        phone: ''
      },
      searchRules: {
        name: [{ trigger: 'blur', validator: validsearchForm }],
        phone: [{ trigger: 'blur', validator: validsearchForm }]
      },
      tableData: [],
      batchSelectedValue: '',
      allCheckdeValue: false,
      multipleSelection: [],
      showStarffBox: false,
      showPasswordBox: false,
      resetPasswordUser: {},
      pageTotal: 0,
      isLoading: true
    }
  },
  created() {
    this.getUsersFunc()
  },
  methods: {
    // 控制表个行的classname
    tableRowClass({ row, idx }) {
      if (row.status === 0) {
        return 'disable-user'
      }
    },
    // 添加用户组件显隐
    addStaffBoxShow(addCount) {
      this.showStarffBox = !this.showStarffBox
      if (typeof addCount === 'number' && addCount > 0) {
        console.log('addCount', addCount)
        this.getUsersFunc()
      }
    },
    // 重置密码组件显隐
    passwordBoxShow(index) {
      if (typeof index === 'number') {
        this.resetPasswordUser = this.tableData[index]
      }
      this.showPasswordBox = !this.showPasswordBox
    },
    // 获取员工信息
    getUsersFunc(params) {
      this.isLoading = true
      if (!params || Object.keys(params).length === 0) {
        params = {
          pageIndex: 0,
          pageSize: 10
        }
      }
      getUsers(params).then(response => {
        this.tableData = response.result.data
        this.pageTotal = response.result.total
        this.isLoading = false
      }).catch(rej => {
        this.isLoading = false
      })
    },
    // 根据条件查询员工信息
    filterStaffInfo() {
      this.$refs.searchForm.validate(valid => {
        if (valid) {
          this.isLoading = true
          const params = {
            pageIndex: 1,
            pageSize: 10,
            name: this.searchForm.name,
            phone: this.searchForm.phone
          }
          this.getUsersFunc(params)
        }
      })
    },
    staffDisable(index) {
      const user = this.tableData[index]
      let tipsText = '禁用'
      if (user.id.length === 0) {
        this.$message({
          showClose: true,
          message: '操作失败，用户信息不完整',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }
      if (user.status === 0) {
        tipsText = '启用'
      }
      this.$confirm(`确定${tipsText} ${user.name}？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        this.isLoading = true
        let method
        if (user.status === 1) {
          method = disableUser(user.id)
        } else if (user.status === 0) {
          method = enableUser(user.id)
        }
        method.then(resp => {
          this.$message({
            showClose: true,
            message: `${tipsText}成功`,
            type: 'success',
            duration: 3 * 1000
          })
          this.getUsersFunc()
          this.isLoading = false
        }).catch(() => {
          this.isLoading = false
        })
      })
    },
    // 表格多选控制
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (val.length === this.tableData.length) {
        this.allCheckdeValue = true
      } else if (val.length === 0) {
        this.allCheckdeValue = false
      }
    },
    // 控制表格全选
    tableToggleSelection(rows) {
      this.$refs.staffTable.toggleAllSelection()
    },
    // 点击分页按钮处理
    pageChangeHandle(val) {
      const params = {
        pageIndex: val - 1,
        pageSize: 10
      }
      this.getUsersFunc(params)
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";

.accounts-container {
  padding: 20px;
  .search-container {
    @include boxShadow-container;
    .search-header {
      @include gray-header;
    }
    .search-form {
      padding: 20px 40px;
      .el-form-item {
        margin: 0 15px 0 10px;
      }
    }
  }
  .staff-table-container {
    margin-top: 30px;
    @include boxShadow-container;
    .staff-header {
      @include gray-header;
      .staff-add-btn {
        float: right;
        height: 30px;
        margin: 5px 5px 0 0;
      }
    }
    .staff-table {
      .cell {
        text-align: center;
      }
      .staff-table-btn {
        padding: 5px 10px !important;
      }
    }
    .disable-user {
      background: #f3f3f3 !important;

      .staff-table-btn {
        background: #b7b6b6 !important;
        border-color: #b7b6b6 !important;
      }
    }
  }
  .el-footer {
    padding: 0;
    margin-top: 30px;
    @include flex-space-between-center;
    @include flex-wrap;
    .el-select {
      width: 100px;
      margin: 0 10px;
    }
    .footer-operate-wrap {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
  }
}
</style>
