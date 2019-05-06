<template>
  <el-container class="container">
    <el-aside width="no" class="side-wrap">
      <div class="header">
        <span>组织架构</span>
        <span class="el-icon-circle-plus add-check-item-btn" />
      </div>
      <el-tree :data="organTreeData" :props="organTreeProps" class="check-item-tree" />
    </el-aside>
    <el-main class="main-wrap">
      <div class="job-info-table-wrap">
        <div class="header">
          <span>岗位</span>
          <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline">添加</el-button>
        </div>
      </div>
      <div class="staff-table-wrap">
        <div class="header">
          <span>人员</span>
          <div>
            <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline">引入成员</el-button>
            <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline">新增成员</el-button>
          </div>
        </div>
        <el-table
          ref="staffTable"
          :data="staffTableData"
          border
          class="staff-table">
          <el-table-column prop="name" width="100" label="姓名" align="center" />
          <el-table-column prop="username" label="账号" align="center" />
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="expireTime" label="失效时间" align="center" />
          <el-table-column width="80" label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" class="staff-table-btn">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      organTreeData: [
        {
          name: '美的置业',
          children: [
            {
              name: '中建一局'
            },
            {
              name: '中建二局'
            },
            {
              name: '中建三局'
            }
          ]
        }
      ],
      organTreeProps: {
        label: 'name',
        children: 'children'
      },
      staffTableData: []
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
    @include boxShadow-container;
    .check-item-tree {
      min-width: 200px;
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
    .job-info-table-wrap {
      @include boxShadow-container;
    }
    .staff-table-wrap {
      margin-top: 20px;
      @include boxShadow-container;
      .staff-table {
        width: 95%;
        margin: 10px auto;
      }
    }
  }
}
</style>
