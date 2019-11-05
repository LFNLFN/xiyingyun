<template>
  <el-container class="global-container">
    <el-main class="left-wrap">
      <div class="chart-wrap">
        <div class="header">企业信息</div>
        <div class="chart-container form-wrap">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px">
            <el-form-item label="企业Logo" prop="logo">
              <el-upload
                v-loading="isUploadingLogoPic"
                :http-request="uploadLogoPic"
                :show-file-list="false"
                :disabled="!(pagePermission.add)"
                class="avatar-uploader"
                action=""
              >
                <img
                  v-if="ruleForm.logo"
                  :src="GetOssImgFullPath(ruleForm.logo)"
                  @error="ruleForm.logo=undefined"
                  class="avatar"
                >
                <el-button type="primary" v-else>上传
                  <i class="el-icon-upload el-icon--right"></i>
                </el-button>
                <el-input v-show="false" type="hidden" v-model="ruleForm.logo"></el-input>
              </el-upload>
            </el-form-item>
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="ruleForm.name" :disabled="!(pagePermission.add)"></el-input>
            </el-form-item>
            <el-form-item label="企业网址" prop="website">
              <el-input v-model="ruleForm.website" :disabled="!(pagePermission.add)"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="ruleForm.address" :disabled="!(pagePermission.add)"></el-input>
            </el-form-item>
            <el-form-item label="组织结构代码" prop="code">
              <el-input v-model="ruleForm.code" :disabled="!(pagePermission.add)"></el-input>
            </el-form-item>
            <el-form-item label="工商执照注册号" prop="registrationNumber">
              <el-input v-model="ruleForm.registrationNumber" :disabled="!(pagePermission.add)"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" :disabled="!(pagePermission.add)">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import {
  editOrgInfo,
  getOrgDetailInfo
} from "@/api/organization_information/info_management.js";
import { uploadImg } from "@/utils/manageOSS";
import permissionOfPage from "@/mixins/permissionOfPage";
export default {
  mixins: [permissionOfPage],
  data() {
    return {
      ruleForm: {
        logo: undefined,
        name: undefined,
        website: undefined,
        address: undefined,
        code: undefined,
        registrationNumber: undefined,
      },
      isUploadingLogoPic: false,
      rules: {
        logo: [{ required: true, trigger: "change", message: "不能为空" }],
        name: [{ required: true, trigger: "blur", message: "不能为空" }],
        website: [{ required: true, trigger: "blur", message: "不能为空" }],
        address: [{ required: true, trigger: "blur", message: "不能为空" }],
        code: [{ required: true, trigger: "blur", message: "不能为空" }],
        registrationNumber: [
          { required: true, trigger: "blur", message: "不能为空" }
        ]
        // registrationNumber: [{ required: true, trigger: 'change', validator: validCityFunc }],
      }
    };
  },
  created() {
    getOrgDetailInfo()
      .then(resp => {
        if (resp.result.data.length > 0) {
          this.ruleForm = resp.result.data[0];
        }
      })
      .catch(err => {
        console.log(err);
        this.$message.error("请求失败");
      });
  },
  methods: {
    // 上传Logo图
    uploadLogoPic({ file }) {
      this.isUploadingLogoPic = true;
      uploadImg(file, "companyLogoPic").then(resp => {
        this.ruleForm.logo = resp.url;
        this.isUploadingLogoPic = false;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editOrgInfo(this.ruleForm).then(resp => {
            this.$message.success('操作成功')
          }).catch(err => {
            console.log(err)
            this.$message.error("请求失败");
          })
        } else {
          this.$message.error("表格填写有误");
        }
      });
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
        height: auto;
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
.form-wrap {
  padding: 1em 50px;
}
</style>
