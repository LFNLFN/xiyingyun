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
      <el-table v-loading="isLoading" ref="staffTable" :data="tableData" border class="staff-table" @selection-change="handleSelectionChange" >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="name" width="100" label="姓名"/>
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="expireTime" label="失效时间" />
        <el-table-column width="220" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" class="staff-table-btn">编辑</el-button>
            <el-button size="mini" type="primary" class="staff-table-btn">重置密码</el-button>
            <el-button size="mini" type="primary" class="staff-table-btn">删除</el-button>
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
          <el-option value="delete" label="删除" />
        </el-select>
        <el-button type="primary" size="mini">确定</el-button>
      </div>
      <el-pagination :total="pageTotal" background layout="prev, pager, next, jumper" />
    </el-footer>
    <AddStaffBox v-show="showStarffBox" @closeAddStaffBox="addStaffBoxShow" />
  </el-container>
</template>
<script>
import AddStaffBox from '@/views/base_data/components/AddStaffBox'
import { getUsers } from '@/api/base_data/accounts'
export default{
  name: 'Accounts',
  components: { AddStaffBox },
  data() {
    const validsearchForm = (rule, value, callback) => {
      if (this.searchForm.name.length === 0 && this.searchForm.phone.length === 0) {
        callback(new Error('请输入用户名称或手机号码'))
      } else {
        callback()
      }
    }
    return {
      token: this.$store.getters.token,
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
      pageTotal: 0,
      isLoading: true
    }
  },
  created() {
    this.getUsersMethod({})
  },
  methods: {
    addStaffBoxShow() {
      this.showStarffBox = !this.showStarffBox
    },
    // 获取员工信息
    getUsersMethod(params) {
      if (Object.keys(params).length === 0) {
        params = {
          pageIndex: 1,
          pageSize: 10,
          token: this.token
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
    filterStaffInfo() {
      this.$refs.searchForm.validate(valid => {
        console.log('valid', valid)
        if (valid) {
          this.isLoading = true
          const params = {
            pageIndex: 1,
            pageSize: 10,
            name: this.searchForm.name,
            phone: this.searchForm.phone,
            token: this.token
          }
          this.getUsersMethod(params)
        }
      })
    },
    handleSelectionChange(val) {
      console.log('val ', val)
      this.multipleSelection = val
      if (val.length === this.tableData.length) {
        this.allCheckdeValue = true
      } else if (val.length === 0) {
        this.allCheckdeValue = false
      }
    },
    tableToggleSelection(rows) {
      console.log('this.$refs.staffTable ', this.$refs.staffTable)
      this.$refs.staffTable.toggleAllSelection()
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss">
@mixin header {
  height: 40px;
  background: #e6e6e6;
  line-height: 40px;
  padding-left: 10px;
}
@mixin container {
  padding: 0px;
  border: 1px solid #e6e6e6;
  border-top: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.accounts-container {
  padding: 20px;
  .search-container {
    @include container;
    .search-header {
      @include header;
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
    @include container;
    .staff-header {
      @include header;
      .staff-add-btn {
        float: right;
        height: 30px;
        margin: 5px 5px 0 0;
      }
    }
    .staff-table {
      text-align: center;
      .cell {
        text-align: center;
      }
      .staff-table-btn {
        padding: 5px 10px !important;
      }
    }
  }
  .el-footer {
    padding: 0;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
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
