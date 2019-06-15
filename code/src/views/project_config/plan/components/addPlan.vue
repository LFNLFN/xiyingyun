<template>
  <publicPopups width="600px" title-text="新增平面图" v-on="$listeners" @closePopupsBox="closeBox" @formConfirm="submitPlanHandle">
    <template slot="main-content">
      <el-form
        ref="planForm"
        :model="planFormData"
        :rules="planFormrules">
        <el-form-item label="所属项目">
          <el-input v-model="projectData.name" size="small" disabled class="no-border"/>
        </el-form-item>
        <el-form-item prop="name" label="平面图名称" porp="name">
          <el-input size="small" placeholder="请输入平面图名称"/>
        </el-form-item>
        <el-form-item prop="" label="平面图类型" porp="type">
          <el-radio v-model="planFormData.type" label="1">备选项</el-radio>
          <el-radio v-model="planFormData.type" label="2">备选项</el-radio>
        </el-form-item>
        <el-form-item prop="houseTypeId" label="户型/合同" porp="houseType">
          <el-select v-model="planFormData.houseTypeId" size="small">
            <el-option value="三水城市花园" />
            <el-option value="市桥城市花园" />
          </el-select>
        </el-form-item>
        <el-form-item prop="imageUrl" label="平面图预览">
          <div
            v-loading="isUploadPlan"
            :class="{'uploaded': planFormData.imageUrl !== ''}"
            class="upload-wrap">
            <el-upload
              :http-request="uploadPlan"
              :show-file-list="false"
              action="">
              <img :src="planFormData.imageUrl">
              <i class="el-icon-plus" />
            </el-upload>
            <div class="operat-wrap">
              <el-tooltip class="item" effect="dark" content="查看图片" placement="top-start">
                <span class="el-icon-zoom-in" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="重新上传" placement="top-start">
                <span class="el-icon-upload" />
              </el-tooltip>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import { upload } from '@/utils/manageOSS'
import { getdictionaty } from '@/api/project_config/plan'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  props: {
    isAddPlanShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      planFormData: {
        // contractId : string,
        // contractName : string,
        floorPlanId: '',
        houseTypeId: '',
        imageUrl: '',
        name: '',
        projectId: '',
        type: 0
      },
      planFormrules: {
        name: [{ required: true, trigger: 'blur', message: '平面图名称不能为空' }],
        imageUrl: [{ required: true, trigger: 'change', message: '请上传平面图' }],
        houseTypeId: [{ required: true, trigger: 'change', message: '请选择户型/合同' }]
      },
      projectData: {},
      houseTypeSelected: '',
      planTypeSelected: '',
      isUploadPlan: false
    }
  },
  methods: {
    resetDataProperty(source) {
      Object.keys(source).forEach(key => {
        this[key] = source[key]
      })
      getdictionaty().then(resp => {
        console.log('resp', resp)
      })
    },
    // 上传平面图
    uploadPlan({ file }) {
      this.isUploadPlan = true
      upload(file).then(resp => {
        console.log('uploadPlan resp', resp)
        this.planFormData.imageUrl = resp.url
        this.isUploadPlan = false
      })
    },
    // 提交平面图相关数据，添加平面图
    submitPlanHandle() {
      console.log('submitPlanHandle')
    },
    closeBox() {
      this.$emit('update:isAddPlanShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-form {
  padding: 0 30px;
  margin: 20px 0;
  .el-form-item {
    margin-bottom: 15px;
    &/deep/.el-form-item__label {
      width: 100px;
      text-align: left;
    }
    .el-input {
      width: 350px;
      &.no-border /deep/ .el-input__inner {
        border: none;
        background-color: #fff;
        border-color: #fff;
        color: #000;
        cursor: default;
      }
    }
    .el-select {
      width: 350px;
    }
    .upload-wrap {
      width: 350px;
      height: 230px;
      margin: 0 0 0 100px;
      border: 1px solid #e6e6e6;
      position: relative;
      &/deep/.el-upload {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        background: #fbfdff;
        cursor: pointer;
        z-index: 10;
        @include flex-layout(center, center, null, nowrap);
        img {
          display: none;
          width: 85%;
        }
        i {
          font-size: 46px;
          color: #ccc;
        }
      }
      .operat-wrap {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .5);
        z-index: 20;
        display: none;
        span {
          cursor: pointer;
          font-size: 50px;
          color: #fff;
          margin: 0 25px;
          border: 1px solid #fff;
          border-radius: 40px;
          padding: 10px;
        }
      }
      &.uploaded {
        background: #fff;
        &/deep/.el-upload {
          i {
            display: none;
          }
          img {
            display: block;
          }
        }
        &:hover {
          .operat-wrap {
            @include flex-layout(center, center, null, nowrap);
          }
        }
      }
    }
  }
}
</style>
