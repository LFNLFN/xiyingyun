<template>
  <publicPopups title-text="引入成员" v-on="$listeners" @formConfirm="pullStaffSubmit">
    <template slot="main-content">
      <div class="pull-staff-header">
        <el-input size="small" placeholder="请输入手机号或者姓名"/>
        <el-button type="primary" size="mini">查询</el-button>
      </div>
      <div class="pull-staff-main">
        <el-table
          v-loading="tableLoading"
          ref="staffTable"
          :data="staffTableData"
          border
          class="staff-table">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column prop="index" width="55" label="序号" align="center"/>
          <el-table-column prop="name" label="用户名" align="center"/>
          <el-table-column prop="phone" label="手机号" align="center"/>
        </el-table>
      </div>
      <div class="pull-staff-footer">
        <el-pagination
          :total="pageTotal"
          :page-size="5"
          :pager-count="5"
          background
          layout="prev, pager, next, jumper"/>
      </div>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  data() {
    return {
      staffTableData: [
        {
          index: 1,
          name: '张三',
          phone: '12345678910'
        }
      ],
      pageTotal: 100,
      tableLoading: false
    }
  },
  methods: {
    pullStaffSubmit() {
      console.log('submit')
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.pull-staff-header {
  padding: 20px;
  .el-input {
    width: 300px;
    margin-right: 20px;
  }
}
.pull-staff-main {
  padding: 0 15px;
}
.pull-staff-footer {
  padding: 0 30px;
  margin: 30px 0 10px 0;
}
</style>

