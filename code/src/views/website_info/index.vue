<template>
  <el-container class="global-container">
    <el-main class="left-wrap">
      <div class="chart-wrap">
        <div class="header">用户活跃度</div>
        <div class="chart-container">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
          >
            <el-form-item label="企业Logo" prop="logo">
              <el-input v-model="ruleForm.logo"></el-input>
            </el-form-item>
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="企业网址" prop="website">
              <el-input v-model="ruleForm.website"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="ruleForm.address"></el-input>
            </el-form-item>
            <el-form-item label="组织结构代码" prop="code">
              <el-input v-model="ruleForm.code"></el-input>
            </el-form-item>
            <el-form-item label="工商执照注册号" prop="registrationNumber">
              <el-input v-model="ruleForm.registrationNumber"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {

      },
      rules: []
    }
  }
};
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.el-container {
  padding: 10px;
  .header {
    font-size: 18px;
    padding: 20px 25px;
    border-bottom: 0.05rem solid #eaeaea;
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
        @include flex-layout(flex-start, center, null, null);
        .icon-wrap {
          font-size: 30px;
          color: #fff;
          width: 30%;
          height: 100%;
          @include flex-layout(center, center, null, null);
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
          @include flex-layout(center, center, column, null);
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
    .user-info-wrap,
    .todo-list-wrap {
      height: 270px;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 15px;
      background: #fff;
    }
    .user-info-wrap {
      .info-container {
        margin-bottom: 15px;
        border-bottom: 0.05rem solid #eaeaea;
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
          text-align: center;
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
    .left-wrap,
    .right-wrap {
      width: 100%;
    }
  }
}
</style>
