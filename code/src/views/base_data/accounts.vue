<template>
  <el-container class="accounts-container">
    <!-- 头部信息筛选部分 -->
    <el-header class="accounts-header" height="no">
      <div class="accounts-header-title">
        <i class="el-icon-tickets"/>
        筛选查询
      </div>
      <el-form ref="searchForm" :rules="searchRules" :inline="true" :model="searchForm" size="small" class="accounts-header-form">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="searchForm.name" name="name" type="text" auto-complete="off" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号码">
          <el-input v-model="searchForm.phone" type="text" />
        </el-form-item>
        <el-button type="primary" size="small" class="search-btn" @click="filterAccountInfo">查询</el-button>
      </el-form>
    </el-header>
    <!-- 中间员工信息部分 -->
    <el-main class="accounts-main">
      <div class="accounts-main-title">
        <i class="el-icon-tickets"/>
        数据列表
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="account-add-btn" @click.native="addAccountBoxShow">新增</el-button>
      </div>
      <el-table
        v-loading="isLoading"
        ref="accountTable"
        :data="tableData"
        :row-class-name="tableRowClass"
        border
        class="account-table"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" width="100" label="姓名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="expireTime" label="失效时间" />
        <el-table-column width="220" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" class="account-table-btn" @click="editAccount">编辑</el-button>
            <el-button size="mini" type="primary" class="account-table-btn" @click="passwordBoxShow(false, scope.$index)">重置密码</el-button>
            <!-- status === 1 正常用户 -->
            <el-button v-if="scope.row.status===1" size="mini" type="primary" class="account-table-btn" @click="accountOperate(scope.$index)">禁用</el-button>
            <!-- status === 0 被禁用用户 -->
            <el-button v-else size="mini" type="primary" class="account-table-btn" @click="accountOperate(scope.$index)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- 底部批量操作、翻页部分 -->
    <el-footer>
      <div class="footer-operatete-wrap">
        <el-checkbox v-model="allCheckdeValue" border size="mini" @change.native="tableToggleSelection">全选</el-checkbox>
        <el-select v-model="batchOperateValue" clearable size="mini" placeholder="批量操作">
          <el-option value="changePassword" label="更改密码" />
          <el-option value="enable" label="启用" />
          <el-option value="disable" label="禁用" />
        </el-select>
        <el-button type="primary" size="mini" @click="batchSelected">确定</el-button>
      </div>
      <el-pagination
        :total="pageTotal"
        background
        layout="prev, pager, next, jumper"
        @current-change="pageChangeHandle"/>
    </el-footer>
    <AddAccountBox v-show="showStarffBox" @closeAddAccountBox="addAccountBoxShow" />
    <ResetPassword v-show="showPasswordBox" :is-batch="isBatchResetPassword" :user-data="resetPasswordAccs" @closePasswordBox="passwordBoxHidden"/>
  </el-container>
</template>
<script>
import AddAccountBox from '@/views/base_data/components/accounts/AddAccountBox'
import ResetPassword from '@/views/base_data/components/accounts/ResetPassword'
import { getUsers, disableAcc, enableAcc, batchOperateAcc } from '@/api/base_data/accounts'
export default{
  name: 'Accounts',
  components: { AddAccountBox, ResetPassword },
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
      batchOperateValue: '',
      allCheckdeValue: false,
      multipleSelectedAcc: [],
      showStarffBox: false,
      showPasswordBox: false,
      isBatchResetPassword: false,
      resetPasswordAccs: [],
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
    // 控制添加用户组件显隐
    addAccountBoxShow(addCount) {
      this.showStarffBox = !this.showStarffBox
      if (typeof addCount === 'number' && addCount > 0) {
        this.getUsersFunc()
      }
    },
    // 编辑用户
    editAccount(evt) {
      console.log('event', evt)
    },
    // 重置密码组件显隐
    passwordBoxShow(isBatch, index) {
      if (isBatch) {
        this.resetPasswordAccs = this.multipleSelectedAcc
        this.isBatchResetPassword = true
      } else {
        this.resetPasswordAccs.splice(0, this.resetPasswordAccs.length)
        this.resetPasswordAccs.push(this.tableData[index])
      }
      this.showPasswordBox = true
    },
    // 重置密码组件隐藏
    passwordBoxHidden() {
      this.showPasswordBox = false
      if (this.isBatchResetPassword) {
        this.isBatchResetPassword = false
        this.$refs['accountTable'].clearSelection()
      }
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
    // 根据条件查询账号信息
    filterAccountInfo() {
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
    accountOperate(index) {
      const user = this.tableData[index]
      let tipsText = ''
      if (user.id.length === 0) {
        this.$message({
          showClose: true,
          message: '操作失败，用户信息不完整',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }
      user.status === 0 ? tipsText = '启用' : tipsText = '禁用'
      this.$confirm(`确定${tipsText} ${user.name}？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        this.isLoading = true
        let method
        if (user.status === 1) {
          method = disableAcc(user.id)
        } else if (user.status === 0) {
          method = enableAcc(user.id)
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
    batchAccountOperate(order, accounts) {
      let [tipsText, nameStrs] = ['', '']
      const [idArr, nameArr] = [[], []]
      for (const acc of accounts) {
        idArr.push(acc.id)
        nameArr.push(acc.name)
      }
      nameStrs = nameArr.join('，')
      order === 'disable' ? tipsText = '禁用' : tipsText = '启用'
      this.$confirm(`确定${tipsText} ${nameStrs}？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchOperateAcc(order, idArr).then(resp => {
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
    // 批量操作
    batchSelected() {
      switch (this.batchOperateValue) {
        case 'changePassword':
          this.passwordBoxShow(true)
          break
        default:
          this.batchAccountOperate(this.batchOperateValue, this.multipleSelectedAcc)
      }
    },
    // 表格多选控制
    handleSelectionChange(val) {
      this.multipleSelectedAcc = val
      val.length === this.tableData.length ? this.allCheckdeValue = true : this.allCheckdeValue = false
    },
    // 控制表格全选
    tableToggleSelection(rows) {
      this.$refs.accountTable.toggleAllSelection()
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
  .accounts-header {
    @include boxShadow-container;
    .accounts-header-title {
      @include gray-header;
    }
    .accounts-header-form {
      padding: 20px 40px;
      .el-form-item {
        margin: 0 15px 0 10px;
      }
    }
  }
  .accounts-main {
    margin-top: 30px;
    @include boxShadow-container;
    .accounts-main-title {
      @include gray-header;
      .account-add-btn {
        float: right;
        height: 30px;
        margin-top: 5px;
      }
    }
    .account-table {
      .cell {
        text-align: center;
      }
      .account-table-btn {
        padding: 5px 10px !important;
      }
    }
    .disable-user {
      background: #f3f3f3 !important;

      .account-table-btn {
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
    .footer-operatete-wrap {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
  }
}
</style>
