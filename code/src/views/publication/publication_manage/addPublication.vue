<template>
  <el-container class="global-container">
    <el-header>
      <h3>
        新增公告
        <el-button type="primary" size="mini" @click="backHandle">返回</el-button>
      </h3>
    </el-header>
    <el-main>
      <el-form
        ref="publicationForm"
        :data="formData"
        label-position="right"
        label-width="100px">
        <el-form-item prop="name" label="名称: ">
          <el-input v-model="formData.name" size="small"/>
        </el-form-item>
        <el-form-item prop="name" label="生效日期: ">
          <el-date-picker
            v-model="formData.date"
            type="daterange"
            size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="date-picker" />
        </el-form-item>
        <el-form-item prop="name" label="授权角色: ">
          <el-checkbox-group v-model="formData.roles">
            <el-checkbox label="甲方" />
            <el-checkbox label="监理" />
            <el-checkbox label="施工" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="name" label="公告内容: ">
          <vue-editor v-model="formData.content" />
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import { VueEditor } from 'vue2-editor'
export default {
  components: { VueEditor },
  data() {
    return {
      formData: {
        name: '',
        date: '',
        roles: [],
        content: ''
      }
    }
  },
  methods: {
    backHandle() {
      this.$router.go(-1)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
@import "src/styles/variables.scss";

.el-container {
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
    .el-form {
      .el-form-item {
        .el-input, .el-date-editor {
          width: 300px;
        }
      }
    }
  }
}
</style>
