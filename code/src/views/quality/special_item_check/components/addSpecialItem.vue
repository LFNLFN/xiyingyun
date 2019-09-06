<template>
  <publicPopups width="650px" title-text="新增专项检查" v-on="$listeners" @closePopupsBox="closeBox" @formConfirm="submitHandle">
    <template slot="main-content">
      <el-form :model="addItemFormData" :inline="true" size="small">
        <el-form-item label="项目名称">
          <el-select v-model="addItemFormData.projectId">
            <el-option value="选项一"/>
          </el-select>
        </el-form-item>
        <el-form-item label="检查批次名称">
          <el-input v-model="addItemFormData.name"/>
        </el-form-item>
        <el-form-item label="检查人">
          <el-select v-model="addItemFormData.checkId">
            <el-option value="选项一"/>
          </el-select>
        </el-form-item>
        <el-form-item label="督办人">
          <el-select v-model="addItemFormData.checkId">
            <el-option value="选项一"/>
          </el-select>
        </el-form-item>
        <el-form-item label="责任人">
          <el-select v-model="addItemFormData.checkId">
            <el-option value="选项一"/>
          </el-select>
        </el-form-item>
        <el-form-item label="巡检模板">
          <el-select v-model="addItemFormData.templateId">
            <el-option value="选项一"/>
          </el-select>
        </el-form-item>
        <el-form-item label="抄送人">
          <el-select v-model="addItemFormData.checkId">
            <el-option value="选项一"/>
          </el-select>
        </el-form-item>
        <el-form-item label="计划开始日期">
          <el-date-picker
            v-model="addItemFormData.planStartTime"
            size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="date-select"
          />
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
/* eslint-disable */
import PublicPopups from "@/components/Pop-ups/PublicPopups";
import { getSpecialItemCheck, fetchSpcialInspection } from "@/api/quality/specialItemCheck";
export default {
  components: { PublicPopups },
  data() {
    return {
      addItemFormData: {
        name: "", // 批次名称
        projectId: "", // 项目分期id
        bidId: "", // 标段id
        templateId: "", // 模板id
        type: "", // 巡检类型（1、集团检查；2、区域检查；3、项目检查）
        creatorOrgId: "", // 创建人所属机构id
        planStartTime: "", // 计划开始时间
        checkPersonList: [
          { personOrgId: "" }, // 人员所属机构id
          { personId: "" } // 人员id
        ], // 检查人集合
        supervisor: [
          { personOrgId: "" }, // 人员所属机构id
          { personId: "" } // 人员id
        ], // 督办人（选填）
        dutyPerson: [
          { personOrgId: "" }, // 人员所属机构id
          { personId: "" } // 人员id
        ], // 责任人
        ccPersonList: [
          { personOrgId: "" }, // 人员所属机构id
          { personId: "" } // 人员id
        ], // 抄送人（选填）
      }
    };
  },
  methods: {
    closeBox() {
      this.$emit("update:isAddSpecialItemShow", false);
    },
    submitHandle() {
      addProblemCheckBatch().then(res => {
        this.$message('提交成功')
        this.closeBox()
      }).catch(err => {
        this.$message('提交失败')
      })
    }
  }
};
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-form {
  padding: 25px 20px 0 20px;
  &/deep/ .el-form-item {
    width: 100%;
    margin-bottom: 27px;
    .el-form-item__label {
      width: 115px;
      text-align: right;
    }
    .el-form-item__content {
      width: calc(100% - 130px);
      .el-select,
      .el-input {
        width: 100%;
      }
    }
  }
}
</style>
