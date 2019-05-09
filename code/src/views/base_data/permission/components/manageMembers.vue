<template>
  <publicPopups title-text="人员管理" width="600px" v-on="$listeners">
    <template slot="main-content">
      <div class="members-search-wrap">
        <el-input size="small" placeholder="请输入手机号或姓名"/>
        <el-button type="primary" size="mini">查询</el-button>
      </div>
      <div class="members-table-wrap">
        <el-table
          v-loading="tableLoading"
          ref="staffTable"
          :data="membersTableData"
          border
          class="members-table">
          <el-table-column prop="name" label="姓名" align="center"/>
          <el-table-column prop="username" label="账号" align="center"/>
          <el-table-column prop="phone" label="手机号" align="center"/>
          <el-table-column prop="expireTime" label="失效日期" align="center"/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="members-pagination">
        <el-pagination
          :total="pageTotal"
          :page-size="5"
          :pager-count="5"
          background
          layout="prev, pager, next, jumper"/>
      </div>
    </template>
    <template slot="footer-content">
      <el-button type="primary">添加人员</el-button>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  data() {
    return {
      membersTableData: [
        {
          name: '张三',
          username: 'admin',
          phone: '12345678910',
          expireTime: '2020-05-05'
        }
      ],
      pageTotal: 100,
      tableLoading: false
    }
  },
  methods: {
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.members-search-wrap {
  padding: 30px 0;
  .el-input {
    width: 300px;
    margin-right: 20px;
  }
}
.members-table-wrap {
  // padding: 0 15px;
}
.members-pagination {
  text-align: center;
  padding: 0 30px;
  margin: 30px 0 10px 0;
}
</style>
