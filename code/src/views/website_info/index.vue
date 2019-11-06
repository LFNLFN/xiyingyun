<template>
  <el-container class="global-container">
    <el-main class="left-wrap">
      <div class="statistics-wrap">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="statistics-card">
              <i class="el-icon-s-custom user icon-wrap"/>
              <div class="count">
                <span class="count-text">1494</span>
                <span class="name-text">企业用户</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="statistics-card">
              <i class="el-icon-upload login icon-wrap"/>
              <div class="count">
                <span class="count-text">69</span>
                <span class="name-text">今日登录用户</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="statistics-card">
              <i class="el-icon-s-open material icon-wrap"/>
              <div class="count">
                <span class="count-text">0</span>
                <span class="name-text">材料库</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="statistics-card">
              <i class="el-icon-s-order project icon-wrap"/>
              <div class="count">
                <span class="count-text">618</span>
                <span class="name-text">项目数</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="chart-wrap">
        <div class="header">用户活跃度</div>
        <div class="chart-container" />
      </div>
    </el-main>
    <el-main class="right-wrap">
      <div class="user-info-wrap">
        <div class="info-container">
          <div class="user-icon-wrap">
            <i slot="placeholder" class="el-icon-user-solid" />
          </div>
          <p class="user-name">用户名</p>
        </div>
        <div class="login-info">
          <p class="info-text">上次登录时间：2019-06-22 17:28:59</p>
          <p class="info-text">上次登录地点：广东 广州</p>
        </div>
      </div>
      <div class="todo-list-wrap">
        <div class="header">
          待办事项
          <span class="todo-count">(0)</span>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.el-container {
  padding: 10px;
  .header {
    font-size: 18px;
    padding: 20px 25px;
    border-bottom: 0.05rem solid #EAEAEA;
  }
  @include flex-layout(center, flex-start, null, nowrap);
  .left-wrap {
    padding: 10px;
    width: 70%;
    .statistics-wrap {
      .statistics-card {
        height: 100px;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        @include flex-layout(flex-start, center, null,  null);
        .icon-wrap {
          font-size: 30px;
          color: #fff;
          width: 30%;
          height: 100%;
          @include flex-layout(center, center, null,  null);
          &.user {
            background: #2d8cf0;
          }
          &.login {
            background: #ff9900;
          }
          &.material {
            background: #19be6b;
          }
          &.project {
            background: #ed3f14;
          }
        }
        .count {
          width: 70%;
          height: 100%;
          @include flex-layout(center, center, column,  null);
          .count-text {
            font-size: 20px;
            margin-bottom: 5px;
            color: #2d8cf0;
          }
          .name-text {
            color: #dddee1;
          }
        }
      }
    }
    .chart-wrap {
      margin-top: 20px;
      border-radius: 10px;
      background: #fff;
      .chart-container {
        height: 375px;
      }
    }
  }
  .right-wrap {
    padding: 10px;
    width: 30%;
    .user-info-wrap, .todo-list-wrap {
      height: 270px;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 15px;
      background: #fff;
    }
    .user-info-wrap {
      .info-container {
        margin-bottom: 15px;
        border-bottom: 0.05rem solid #EAEAEA;
        .user-icon-wrap {
          width: 80px;
          height: 80px;
          margin: 10px auto;
          border-radius: 40px;
          background: #d9d9d9;
          @include flex-layout(center, center, null, null);
          i {
            font-size: 46px;
            color: #fff;
          }
        }
        .user-name {
          padding: 10px;
          color: #2d8cf0;
          text-align: center
        }
      }
      .info-text {
        color: #a9a9a9;
        margin: 6px 0 0 0;
        line-height: 20px;
      }
    }
    .todo-list-wrap {
      padding-top: 0;
      .todo-count {
        font-size: 16px;
      }
    }
  }
}
@media screen and (max-width: 960px) {
  .el-container {
    @include flex-layout(center, flex-start, column, wrap);
    .left-wrap, .right-wrap {
      width: 100%;
    }
  }
}
</style>
