<template>
  <publicPopups title-text="添加成员" v-on="$listeners" @formConfirm="addStaffSubmit">
    <template slot="main-content">
      <el-form ref="addStaffForm" :model="addStaffForm" class="add-staff-from">
        <el-form-item label="人员姓名" prop="name">
          <el-input v-model="addStaffForm.name"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addStaffForm.phone" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idNum">
          <el-input v-model="addStaffForm.idNum" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="addStaffForm.email" />
        </el-form-item>
        <el-form-item label="职位描述" prop="work">
          <el-input v-model="addStaffForm.work" />
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  data() {
    return {
      addStaffForm: {
        name: '',
        phone: '',
        idNum: '',
        email: '',
        work: ''
      }
    }
  },
  methods: {
    addStaffSubmit() {
      console.log('submit')
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.add-staff-from {
  padding: 10px 40px;
  .el-form-item {
    margin: 20px auto;
    @include flex-layout(center, center, null, null);
    .el-input {
      width: 300px;
      margin-left: 10px;
    }
  }
}
</style>

