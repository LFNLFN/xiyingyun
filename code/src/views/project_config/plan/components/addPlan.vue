<template>
  <publicPopups width="600px" title-text="新增平面图" v-on="$listeners" @closePopupsBox="closeBox">
    <template slot="main-content">
      <el-form>
        <el-form-item label="所属项目">
          <el-input v-model="belongProject" size="small" disabled class="no-border"/>
        </el-form-item>
        <el-form-item label="平面图名称" porp="name">
          <el-input size="small" placeholder="请输入平面图名称"/>
        </el-form-item>
        <el-form-item label="平面图类型" porp="type">
          <el-radio v-model="planTypeSelected" label="1">备选项</el-radio>
          <el-radio v-model="planTypeSelected" label="2">备选项</el-radio>
        </el-form-item>
        <el-form-item label="户型/合同" porp="houseType">
          <el-select v-model="houseTypeSelected" size="small">
            <el-option value="三水城市花园" />
            <el-option value="市桥城市花园" />
          </el-select>
        </el-form-item>
        <el-form-item label="平面图预览">
          <div class="upload-wrap">
            <el-upload
              action="https://static-dev.gzxiyingyun.com">
              <img :src="null">
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
        name: '',
        type: '',
        houseType: ''
      },
      belongProject: '三水城市花园',
      houseTypeSelected: '',
      planTypeSelected: ''
    }
  },
  methods: {
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
        i {
          font-size: 46px;
          color: #ccc;
        }
      }
      .operat-wrap {
        // width: 100%;
        // height: 100%;
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
      &.uploaded:hover {
        .operat-wrap {
          @include flex-layout(center, center, null, nowrap);
        }
      }
    }
    &/deep/.el-form-item__label {
      width: 90px;
      text-align: left;
    }
  }
}
</style>
