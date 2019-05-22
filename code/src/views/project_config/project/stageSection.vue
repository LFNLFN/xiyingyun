<template>
  <el-container direction="vertical">
    <el-main class="section-info-watp">
      <div class="header">
        <span>基础信息</span>
      </div>
      <el-form class="section-Info-form">
        <el-form-item label="标段名称">
          <el-input size="small"/>
        </el-form-item>
        <el-form-item label="所属项目">
          <el-select v-model="projectSel" size="small" placeholder="请选择">
            <el-option
              value="在建" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="projectStatusSel" size="small" placeholder="请选择">
            <el-option
              value="在建" />
          </el-select>
        </el-form-item>
        <el-form-item label="总包单位">
          <el-select v-model="contractorSel" size="small" placeholder="请选择">
            <el-option
              value="毛坯交付" />
          </el-select>
        </el-form-item>
        <el-form-item label="监理单位">
          <el-select v-model="supervisionSel" size="small" placeholder="请选择">
            <el-option
              value="毛坯交付" />
          </el-select>
        </el-form-item>
        <el-form-item label="施工布置图">
          <el-select v-model="layoutPlanSel" size="small" placeholder="请选择">
            <el-option
              value="1阶段" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-main>
    <el-main class="scope-wrap">
      <div class="header">
        <span>施工范围</span>
      </div>
      <div class="transfer-wrap">
        <el-transfer
          v-model="buildingSelected"
          :titles="['楼栋列表', '已选']"
          :button-texts="['添加选项', '删除选项']"
          filterable />
      </div>
    </el-main>
    <el-main class="profession-wrap">
      <div class="header">
        <span>专业范围</span>
      </div>
      <div class="transfer-wrap">
        <el-transfer
          v-model="buildingSelected"
          :titles="['专业列表', '已选']"
          :button-texts="['添加选项', '删除选项']"
          filterable />
      </div>
    </el-main>
    <footer class="footer">
      <div class="btn-warp">
        <el-button @click="cancelHandle">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </footer>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      projectSel: '',
      projectStatusSel: '',
      contractorSel: '',
      supervisionSel: '',
      layoutPlanSel: '',
      houseTypeData: [],
      buildingSelected: [],
      isAddHouseProperty: true
    }
  },
  methods: {
    addHouseProperty() {
      console.log('addHouseProperty')
    },
    cancelHandle() {
      console.log('this.$router', this.$router)
      console.log('this.$route', this.$route)
      this.$router.history.go(-1)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-container {
  padding: 20px 20px 100px 20px;
  width: 100%;
  height: 100%;
  background: #f0f1f5;
  .header {
    padding: 15px;
    font-size: 18px;
    font-weight: bold;
    background: #fff;
    border-bottom: 1px solid #ccc;
  }
  .section-info-watp {
    padding: 0;
    background: #fff;
    .section-Info-form{
      padding: 20px;
      @include flex-layout(flex-start, center, row, wrap);
      .el-form-item {
        width: 27%;
        margin: 10px 3%;
        .el-input {
          .el-button {
            padding: 8px 5px;
          }
        }
        .el-select {
          width: 100%;
        }
      }
    }
  }
  .scope-wrap, .profession-wrap {
    padding: 0;
    background: #fff;
    margin-top: 20px;
    .transfer-wrap {
      padding: 20px;
      text-align: center;
      & /deep/ .el-transfer-panel {
        width: 35%;
      }
    }
  }
  .footer {
    height: 80px;
    line-height: 85px;
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
</style>
