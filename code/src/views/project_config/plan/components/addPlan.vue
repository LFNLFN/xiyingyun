<template>
  <publicPopups width="600px" title-text="新增平面图" v-on="$listeners" @closePopupsBox="closeBox" @formConfirm="submitPlanHandle">
    <template slot="main-content">
      <el-form
        v-loading="isFormLoading"
        ref="planForm"
        :model="planFormData"
        :rules="planFormrules"
        element-loading-text="正在提交数据">
        <el-form-item prop="projectId" label="所属项目">
          <el-select v-model="planFormData.projectId" size="small">
            <el-option
              v-for="(item, idx) in projectsData"
              :key="idx"
              :value="item.id"
              :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="平面图名称" porp="name">
          <el-input v-model="planFormData.name" size="small" placeholder="请输入平面图名称"/>
        </el-form-item>
        <el-form-item prop="type" label="平面图类型" porp="type">
          <div class="radio-wrap">
            <el-radio
              v-for="(item, idx) in planTypeList"
              v-model="planFormData.type"
              :key="idx"
              :label="item.id">{{ item.name }}</el-radio>
          </div>
        </el-form-item>
        <el-form-item v-if="planFormData.type === 4" prop="houseTypeId" label="选择户型" porp="houseType">
          <el-select v-model="planFormData.houseTypeId" size="small">
            <el-option
              v-for="(item, idx) in houseTypeData"
              :key="idx"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" prop="houseTypeId" label="相关合同" porp="houseType">
          <el-select v-model="planFormData.contractId" size="small">
            <el-option
              v-for="(item, idx) in houseTypeData"
              :key="idx"
              :label="item.name"
              :value="item.id" />
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
              <img :src="GetOssImgFullPath(planFormData.imageUrl)">
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
import { uploadImg } from '@/utils/manageOSS'
import { addPlan, editPlan } from '@/api/project_config/plan'
import planTypeMixin from '@/mixins/planTypeData'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  mixins: [planTypeMixin],
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
        houseTypeId: '',
        imageUrl: '',
        name: '',
        projectId: '',
        type: 0
      },
      planFormrules: {
        name: [{ required: true, trigger: 'blur', message: '平面图名称不能为空' }],
        type: [{ required: true, trigger: 'blur', message: '请选择平面图类型' }],
        imageUrl: [{ required: true, trigger: 'change', message: '请上传平面图' }],
        houseTypeId: [{ required: true, trigger: 'change', message: '请选择户型/合同' }],
        projectId: [{ required: true, trigger: 'change', message: '请选择项目' }]
      },
      editPlanData: {}, // 保存要编辑的平面图信息
      projectSelected: '', // 保存已选择的项目的id
      projectsData: {}, // 保存所有项目数据
      houseTypeData: [], // 保存户型数据
      isAddOrEdit: 'add', // 确定是编辑还是新增
      isFormLoading: false,
      isUploadPlan: false
    }
  },
  watch: {
    isAddPlanShow: function(newVal) {
      if (newVal) {
        // 编辑模式，加载表单数据
        if (this.isAddOrEdit === 'edit') {
          const _keys = Object.keys(this.planFormData)
          _keys.forEach(key => {
            if (this.editPlanData.hasOwnProperty(key)) {
              this.planFormData[key] = this.editPlanData[key]
            }
          })
          this.projectSelected = this.editPlanData.projectId
        }
      }
    },
    projectSelected: function(newVal) {
      if (newVal !== '') {
        // 设置默认选择的项目
        this.planFormData.projectId = newVal
        // 加载项目的户型数据
        const curProject = this.projectsData.find(pro => {
          return pro.id === newVal
        })
        if (curProject) {
          this.$set(this, 'houseTypeData', curProject.stageDetail.houseTypeEntityList)
        }
        console.log('this.houseTypeData', this.houseTypeData)
      }
    }
  },
  methods: {
    resetDataProperty(source) {
      Object.keys(source).forEach(key => {
        this[key] = source[key]
      })
    },
    // 上传平面图
    uploadPlan({ file }) {
      this.isUploadPlan = true
      uploadImg(file, 'project_plan').then(resp => {
        this.planFormData.imageUrl = resp.url
        this.isUploadPlan = false
      })
    },
    // 提交平面图相关数据，添加平面图
    submitPlanHandle() {
      console.log('submitPlanHandle', this.planFormData)
      if (this.isUploadPlan) {
        this.$alert('正在上传平面图，请等待上传完成再提交', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$refs.planForm.validate(valid => {
        if (valid) {
          this.isFormLoading = true
          if (this.isAddOrEdit === 'add') {
            addPlan(this.planFormData).then(resp => {
              this.$message({
                message: '新增平面图成功',
                type: 'success'
              })
              this.closeBox()
              this.isFormLoading = false
              this.$emit('refreshPlansData')
            }).catch(() => {
              this.isFormLoading = false
            })
          } else if (this.isAddOrEdit === 'edit') {
            const planId = this.editPlanData.id
            editPlan(planId, this.planFormData).then(resp => {
              this.$message({
                message: '编辑平面图成功',
                type: 'success'
              })
              this.closeBox()
              this.isFormLoading = false
              this.$emit('refreshPlansData')
            }).catch(() => {
              this.isFormLoading = false
            })
          }
        }
      })
    },
    closeBox() {
      this.$emit('update:isAddPlanShow', false)
      this.projectSelected = ''
      this.$refs.planForm.resetFields()
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
    .radio-wrap {
      width: 350px;
      height: 80px;
      margin: 0 0 0 100px;
      .el-radio {
        margin-right: 15px;
        &/deep/ .el-radio__label {
          padding-left: 5px
        }
      }
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
        // &:hover {
        //   .operat-wrap {
        //     @include flex-layout(center, center, null, nowrap);
        //   }
        // }
      }
    }
  }
}
</style>
