<template>
  <publicPopups width="550px" title-text="重置密码" v-on="$listeners" @closePopupsBox="submitedHandle">
    <template slot="main-content">
      <el-form ref="ruleForm" :model="ruleForm" :rules="ruleFormRules">
        <!-- <el-form-item prop="phone" label="手机号/账号">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号或账号"/>
        </el-form-item> -->
        <!-- <el-form-item prop="verifyNum" label="短信验证码">
          <el-input v-model="ruleForm.verifyNum" placeholder="请输入验证码">
            <el-button slot="append" @click="sendVerifyNumHandle">{{ verifyNumBtnText }}</el-button>
          </el-input>
        </el-form-item>-->

        <el-form-item prop="password" label="输入密码">
          <el-input v-model="ruleForm.password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item prop="reIptPassword" label="确认密码">
          <el-input v-model="ruleForm.reIptPassword" placeholder="请再次输入密码"/>
        </el-form-item>
      </el-form>
    </template>
    <template slot="footer-content">
      <el-button size="primary" @click="batchResetSubmit">重置</el-button>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from "@/components/Pop-ups/PublicPopups";
import { isvalidPassword, isvalidPhoneNum } from "@/utils/validate";
import { batchResetPswd } from "@/api/base_data/accounts";
export default {
  components: { PublicPopups },
  data() {
    let isvalidReIptPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        phone: "",
        verifyNum: "",
        password: "",
        reIptPassword: ""
      },
      ruleFormRules: {
        phone: [
          // { required: true, trigger: "blur", validator: isvalidPhoneNum }
          { required: true, trigger: "blur", message: "不能为空" }
        ],
        verifyNum: [
          { required: true, trigger: "blur", message: "验证码不能为空" }
        ],
        password: [
          { required: true, trigger: "change", validator: isvalidPassword }
        ],
        reIptPassword: [
          { required: true, trigger: "change", validator: isvalidReIptPassword }
        ]
      },
      verifyNumBtnText: "发送验证码",
      sendingVerifyNum: false
    };
  },
  methods: {
    sendVerifyNumHandle() {
      if (this.sendingVerifyNum) return;
      this.sendingVerifyNum = true;
      let timeNum = 60;
      this.verifyNumBtnText = `${timeNum}秒后可重发`;
      const verifyTimer = setInterval(() => {
        timeNum--;
        this.verifyNumBtnText = `${timeNum}秒后可重发`;
        if (timeNum === 0) {
          clearInterval(verifyTimer);
          this.sendingVerifyNum = false;
          this.verifyNumBtnText = "重新发送";
        }
      }, 1000);
    },
    batchResetSubmit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let idArr = [];
          idArr.push(this.$store.getters.userAllInfo.id);
          if (idArr.length === 0) {
            this.$message({
              showClose: true,
              message: "重置密码失败，用户信息不完整",
              type: "warning",
              duration: 3 * 1000
            });
            return;
          }
          // this.resetLoading = true;
          const passwordObj = {
            password: String(this.ruleForm.reIptPassword)
          };
          batchResetPswd(idArr, passwordObj)
            .then(resp => {
              this.resetSuccess();
            })
            .catch(() => {
              // this.resetLoading = false;
            });
        } else {
          this.$message.error('请正确填写表格')
          return false;
        }
      });
    },
    resetSuccess() {
      this.$message({
        showClose: true,
        message: "重置密码成功",
        type: "success",
        duration: 3 * 1000
      });
      this.$refs["ruleForm"].resetFields();
      // this.resetLoading = false
      this.closeBox();
    },
    closeBox() {
      this.$refs["ruleForm"].resetFields();
      this.$emit("closeBox");
    },
    submitedHandle() {
      this.$emit("update:isResetPswShow", false);
    }
  }
};
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
  .el-form {
    padding: 40px 20px 10px 20px;
    .el-form-item {
      @include flex-layout(center, center, null, nowrap);
      &/deep/.el-form-item__label {
        width: 100px;
        text-align: right;
        margin-left: 0;
      }
      .el-input {
        width: 300px;
        &/deep/.el-input-group__append {
          padding: 7px;
        }
      }
    }
  }
}
</style>
