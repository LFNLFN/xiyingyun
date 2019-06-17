<template>
  <el-container>
    <el-header height="none">
      <span class="title-text">参建方详情</span>
      <span>
        <el-button type="primary" size="mini">返回</el-button>
      </span>
    </el-header>
    <el-main>
      <div class="base-info-wrap">
        <p class="title-text">基础信息</p>
        <div class="base-info">
          <div class="base-info-item">
            <span class="title-text">公司名称：</span>
            <span>广东联合监理有限公司</span>
          </div>
          <div class="base-info-item">
            <span class="title-text">公司简称：</span>
            <span>广东联合监理有限公司</span>
          </div>
          <div class="base-info-item">
            <span class="title-text">负责人：</span>
            <span>刘能</span>
          </div>
          <div class="base-info-item">
            <span class="title-text">联系电话：</span>
            <span>13816866777</span>
          </div>
        </div>
      </div>
      <div class="member-table-header">
        <p class="title-text">参建人员</p>
        <div class="btn-warp">
          <el-button size="mini">添加人员</el-button>
          <el-button type="primary" size="mini">新增人员</el-button>
        </div>
      </div>
      <el-table
        ref="membersTable"
        :data="membersData"
        class="members-table">
        <el-table-column prop="name" width="100" label="姓名" align="center" />
        <el-table-column prop="phone" label="联系方式" align="center" />
        <el-table-column width="180" label="职位描述" align="center" />
        <el-table-column width="180" label="是否是项目经理" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isManager"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#adadad"/>
          </template>
        </el-table-column>
        <el-table-column width="80" align="center">
          <template slot-scope="scope">
            <el-button size="mini" class="no-border">编辑</el-button>
            <el-button size="mini" class="no-border">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      membersData: []
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
  width: 100%;
  min-height: calc(100vh - 50px);
  background: #f0f1f5;
  .el-header {
    height: 75px;
    margin: 6px 0;
    background: #fff;
    @include flex-layout(space-between, center, null, null);
    .title-text {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .el-main {
    margin: 20px;
    padding: 25px;
    background: #fff;
    .title-text {
      font-size: 18px;
      font-weight: bold;
    }
    .base-info-wrap {
      margin-bottom: 30px;
      .base-info {
        font-size: 14px;
        @include flex-layout(flex-start, center, null, wrap);
        .base-info-item {
          .title-text {
            font-size: 14px;
            font-weight: bold;
          }
          margin: 8px 65px 8px 0px;
        }
      }
    }
    .members-table {
      margin: 20px;
    }
  }
}
</style>
