<template>
  <el-container class="container global-container">
    <el-main v-loading="isLoading">
      <el-form ref="userInfoForm" :model="userInfoForm" :rules="userInfoFormRules">
        <el-form-item label="头像" prop="photo">
          <template slot-scope="scope">
            <!-- <el-upload
              :show-file-list="false"
              action="https://jsonplaceholder.typicode.com/posts/"
              class="avatar-uploader">
              <img :src="imageUrl" class="avatar-img">
              <i class="el-icon-edit avatar-edit-icon"/>
            </el-upload> -->
            <div class="upload-wrap">
              <el-upload
                :http-request="uploadAvatar"
                :show-file-list="false"
                class="avatar-uploader"
                action="">
                <!-- <img :src="GetOssImgFullPath('9682d46c2353a1bfa3105263e5ff7375.jpg' || imageUrl)" alt="暂无头像"> -->
                <img :src="GetOssImgFullPath(imageUrl)" alt="暂无头像">
                <!-- <i class="el-icon-plus" /> -->
              </el-upload>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="登录账号" prop="personUser.username">
          <el-input v-model="userInfoForm.personUser.username" disabled class="no-border"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="userInfoForm.phone" disabled class="no-border"/>
          <el-button class="change-info-btn" @click="changePhoneBoxCtrl">更改手机号</el-button>
        </el-form-item>
        <el-form-item label="密码" prop="phone">
          <el-input v-model="userInfoForm.phone" type="password" disabled class="no-border" />
          <el-button class="change-info-btn" @click="resetPswBoxCtrl">更改密码</el-button>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userInfoForm.name" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="userInfoForm.sex" label="man">男</el-radio>
          <el-radio v-model="userInfoForm.sex" label="woman">女</el-radio>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfoForm.email" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="userInfoForm.birthday"
            type="date"
            placeholder="选择日期" />
        </el-form-item>
        <!-- <el-form-item class="button-wrap">
          <el-button type="primary" class="submit-btn">保存</el-button>
        </el-form-item> -->
      </el-form>
    </el-main>
    <footer class="footer">
      <div class="btn-warp">
        <el-button type="primary" @click="editAccountInfoFunc">保存</el-button>
      </div>
    </footer>
    <resetUserPassword
      v-show="isResetPswShow"
      @closeBox="isResetPswShow = false"
      :is-reset-psw-show.sync="isResetPswShow"/>
    <changePhoneNum
      v-show="isChangePhoneShow"
      :is-change-phone-show.sync="isChangePhoneShow" />
  </el-container>
</template>
<script>
import ResetUserPassword from '@/views/user/user_set/components/ResetUserPassword'
import ChangePhoneNum from '@/views/user/user_set/components/ChangePhoneNum'
import { getUserInfo } from '@/api/user/userSet'
import { uploadImg } from '@/utils/manageOSS'
import { editAccountInfo } from '@/api/base_data/accounts'
export default {
  components: { ResetUserPassword, ChangePhoneNum },
  data() {
    return {
      userInfoForm: {
        name: '',
        photo: '',
        phone: '',
        sex: '',
        email: '',
        birthday: '',
        personUser: {
          username: ''
        }
      },
      imageUrl: this.$store.getters.avatar,
      isLoading: true,
      isResetPswShow: false,
      isChangePhoneShow: false,
      userInfoFormRules: {
        name: [{ required: true, trigger: 'change', message: '不能为空' }],
        photo: [{ required: true, trigger: 'change', message: '不能为空' }],
        phone: [{ required: true, trigger: 'change', message: '不能为空' }],
        sex: [{ required: true, trigger: 'change', message: '不能为空' }],
        email: [{ required: true, trigger: 'change', message: '不能为空' }],
        // birthday: [{ required: true, trigger: 'change', message: '不能为空' }],
        'personUser.username': [{ required: true, trigger: 'change', message: '不能为空' }],
      }
    }
  },
  created() {
    getUserInfo().then(resp => {
      this.$store.commit('SET_AVATAR', resp.result.photo)
      this.userInfoForm = resp.result
      this.imageUrl = this.userInfoForm.photo || ''
      this.isLoading = false
    })
  },
  methods: {
    resetPswBoxCtrl() {
      this.isResetPswShow = !this.isResetPswShow
    },
    changePhoneBoxCtrl() {
      this.isChangePhoneShow = !this.isChangePhoneShow
    },
    // 上传头像
    uploadAvatar({ file }) {
      const msg = this.$message({
        type: 'info',
        message: '头像上传中',
        duration: 0
      })
      uploadImg(file, 'user_avatar').then(resp => {
        this.imageUrl = this.userInfoForm.photo = resp.url
        msg.close()
      }).catch(err => {
        msg.close()
        this.$message.error('操作失败，请重试')
      })
    },
    // 保存编辑后的用户信息
    editAccountInfoFunc() {
      const personId = this.$store.getters.userAllInfo.id
      editAccountInfo(personId, this.userInfoForm).then(resp => {
        this.$store.commit('SET_AVATAR', this.userInfoForm.photo)
        this.$message.success('操作成功')
      })
      // this.$refs.userInfoForm.validate(valid => {
      //   if (valid) {
      //     // this.isFormLoading = true
      //   } else {
      //     this.$message.error('请正确填写表格')
      //   }
      // })
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.container {
  padding: 20px 20px 100px 20px;
  width: 100%;
  height: 100%;
  .el-main {
    padding-left: 40px;
    background: #fff;
    width: 100%;
    height: 100%;
  }
  .el-form {
    .el-form-item {
      // width: 450px;
      margin-bottom: 30px;
      &/deep/.el-upload {
        width: 130px;
        height: 130px;
        border-radius: 65px;
        overflow: hidden;
        border: none;
        position: relative;
        cursor: pointer;
        @include flex-layout(center, center, null, nowrap);
        .avatar-edit-icon {
          display: block;
          width: 100%;
          height: 100%;
          line-height: 130px;
          position: absolute;
          top: 0;
          left: 0;
          font-size: 30px;
          color: #fff;
          background: rgba(0, 0, 0, .3);
          opacity: 0;
        }
        &:hover {
          .avatar-edit-icon {
            opacity: 1;
            transition: opacity 0.5s;
          }
        }
        .avatar-img {
          width: 100%;
          height: 100%;
        }
      }
      &/deep/.el-form-item__label {
        width: 80px;
        text-align: left;
      }
      .el-input {
        width: 250px;
        &.no-border /deep/ .el-input__inner {
          border: none;
          background-color: #fff;
          border-color: #fff;
          color: #C0C4CC;
          cursor: default;
        }
      }
      .change-info-btn {
        border: none;
        color: #409EFF;
        background: #fff;
        &:hover, &:active {
          background: #fff;
          border: none;
        }
      }
    }
  }
  .footer {
    height: 75px;
    line-height: 75px;
    width: 100%;
    position: fixed;
    bottom: 0;
    right:0;
    background: #fff;
    border-top: 2px solid #ccc;
    .btn-warp {
      float: right;
      margin-right: 30px;
    }
  }
}
.upload-wrap {
  img {
      width: 135px;
      line-height: 18px;
    }
}
</style>
