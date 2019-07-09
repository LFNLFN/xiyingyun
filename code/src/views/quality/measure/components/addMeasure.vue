<template>
  <publicPopups :width="boxWidth" title-text="新增实测实量记录" v-on="$listeners" @closePopupsBox="closeBox">
    <template slot="main-content">
      <template v-if="curStep === 'checkInfo'">
        <el-form
          :model="addMeasureFormData"
          :inline="true"
          label-width="110px"
          label-position="right"
          size="small"
          class="add-check-form">
          <el-form-item label="项目名称">
            <el-select
              v-model="addMeasureFormData.projectId">
              <el-option
                value="选项一"/>
            </el-select>
          </el-form-item>
          <el-form-item label="实测实量项">
            <el-select
              v-model="addMeasureFormData.itemId">
              <el-option
                value="选项一"/>
            </el-select>
          </el-form-item>
          <el-form-item label="部位">
            <el-select
              v-model="addMeasureFormData.partId">
              <el-option
                value="选项一"/>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template v-else-if="curStep === 'fillInfo'">
        <el-form
          :inline="true"
          class="fill-info-form">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="实测实量项">
                <el-input disabled size="small" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部位">
                <el-input disabled size="small" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          :data="measureTableData"
          class="fill-info-table no-border-gary-head">
          <el-table-column label="序号"/>
          <el-table-column label="检查内容"/>
          <el-table-column label="计算点数"/>
          <el-table-column label="计算爆点数"/>
          <el-table-column label="合格率"/>
        </el-table>
      </template>
    </template>
    <template v-if="curStep === 'checkInfo'">
      <template slot="footer-content">
        <el-button size="small">取消</el-button>
        <el-button type="primary" size="small" @click="toFillMeasureInfo">下一步</el-button>
      </template>
    </template>
    <template v-else-if="curStep === 'fillInfo'">
      <template slot="footer-content">
        <el-button size="small">取消</el-button>
        <el-button size="small">上一步</el-button>
        <el-button type="primary" size="small">提交</el-button>
      </template>
    </template>
  </PublicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  data() {
    return {
      boxWidth: '550px',
      curStep: 'checkInfo', // 保存步骤，checkInfo：选项相关信息，fillInfo: 填写实测实量信息
      addMeasureFormData: {
        projectId: '',
        itemId: '',
        partId: ''
      },
      measureTableData: []
    }
  },
  methods: {
    toFillMeasureInfo() {
      this.boxWidth = '750px'
      this.curStep = 'fillInfo'
    },
    closeBox() {
      this.$emit('update:isAddMeasureShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.add-check-form {
  padding: 30px 20px 0 10px;
  &/deep/ .el-form-item {
    width: 100%;
    margin-top: 10px;
    .el-form-item__content {
      width: calc(100% - 130px);
    }
    .el-select {
      width: 100%;
    }
  }
}
.fill-info-form {
  padding-top: 20px;
  &/deep/ .el-form-item {
    .el-select {
      width: 230px;
    }
  }
}
.fill-info-table {
}
</style>
