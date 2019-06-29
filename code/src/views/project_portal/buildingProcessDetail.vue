<template>
  <el-container>
    <el-header>
      <h3>
        1栋
        <el-button type="primary" size="mini" @click="backHandle">返回</el-button>
      </h3>
    </el-header>
    <el-main>
      <ul class="building-wrap">
        <li>
          <span class="title" />
          <span class="room" />
        </li>
      </ul>
      <div class="legend-wrap">
        <ul class="legend-list">
          <li>
            <span class="legend-icon accept-failed" />
            <span class="text">验收不合格</span>
          </li>
          <li>
            <span class="legend-icon accept-wait" />
            <span class="text">待验收</span>
          </li>
          <li>
            <span class="legend-icon accepted" />
            <span class="text">已验收</span>
          </li>
        </ul>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  methods: {
    backHandle() {
      this.$router.go(-1)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.el-container {
  min-height: calc(100vh - 50px);
  background: #f0f1f5;
  .accept-failed {
    background: #ed3f14;
  }
  .accepted {
    background: #59bba4;
  }
  .accept-wait {
    background: #ff9900;
  }
  .el-header {
    background: #fff;
    .el-button {
      float: right;
    }
  }
  .el-main {
    background: #fff;
    position: relative;
    margin: 20px;
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .legend-wrap {
      position: absolute;
      top: 20px;
      right: 30px;
      padding: 10px;
      background: #fff;
      border-radius: 10px;
      .legend-list  {
        li {
          margin: 5px 0;
          .legend-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 7px;
            vertical-align: middle;
          }
          .text {
            font-size: 14px;
            vertical-align: middle;
          }
        }
      }
    }
  }
}
</style>
