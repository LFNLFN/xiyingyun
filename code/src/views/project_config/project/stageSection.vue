<template>
  <el-container direction="vertical">
    <el-main class="section-info-watp">
      <div class="header">
        <span>基础信息</span>
      </div>
      <el-form
        ref="sectionForm"
        :data="sectionFormData"
        :rules="secionFormRules"
        class="section-Info-form">
        <el-form-item prop="name" label="标段名称">
          <el-input v-model="sectionFormData.name" size="small"/>
        </el-form-item>
        <el-form-item label="所属项目">
          <!-- <el-select v-model="projectSel" size="small" placeholder="请选择">
            <el-option
              value="在建" />
          </el-select> -->
          <el-input v-model="belongProject" disabled size="small"/>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-select
            v-model="sectionFormData.status"
            size="small"
            placeholder="请选择">
            <el-option
              value="在建" />
          </el-select>
        </el-form-item>
        <el-form-item prop="estateProjectStageEntity.constructionOrgId" label="总包单位">
          <el-select
            v-model="sectionFormData.estateProjectStageEntity.constructionOrgId"
            size="small"
            placeholder="请选择">
            <el-option
              value="毛坯交付" />
          </el-select>
        </el-form-item>
        <el-form-item prop="estateProjectStageEntity.supervisionOrgId" label="监理单位">
          <el-select
            v-model="sectionFormData.estateProjectStageEntity.supervisionOrgId"
            size="small"
            placeholder="请选择">
            <el-option
              value="毛坯交付" />
          </el-select>
        </el-form-item>
        <el-form-item prop="estateProjectStageEntity.floorPlanId" label="施工布置图">
          <el-select
            v-model="sectionFormData.estateProjectStageEntity.floorPlanId"
            size="small"
            placeholder="请选择">
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
import { mapGetters } from 'vuex'
import { findArrByKeyVal } from '@/utils/public'
export default {
  data() {
    return {
      sectionFormData: {
        name: '',
        parentId: '',
        type: 2,
        status: '',
        estateProjectStageEntity: {
          professionalEntityList: [],
          professionalList: [],
          supervisionOrgId: '',
          constructionOrgId: '',
          floorPlanId: ''
        }
      },
      secionFormRules: {
        name: [{ required: true, trigger: 'blur', message: '项目名称不能为空' }],
        status: [{ required: true, trigger: 'change', message: '请选择状态' }],
        estateProjectStageEntity: {
          constructionOrgId: [{ required: true, trigger: 'change', message: '请选择城市' }]
        }
      },
      projectSel: '',
      projectStatusSel: '',
      contractorSel: '',
      supervisionSel: '',
      layoutPlanSel: '',
      houseTypeData: [],
      buildingSelected: [],
      belongProject: '', // 保存标段所属项目
      isAddHouseProperty: true
    }
  },
  computed: {
    ...mapGetters([
      'projectList'
    ])
  },
  created() {
    const projectId = this.$route.query.projectId
    const eventType = this.$route.query.eventType
    const curProject = findArrByKeyVal(this.projectList, 'id', projectId)
    if (eventType === 'add') {
      this.sectionFormData.parentId = projectId
      if (curProject) {
        this.belongProject = curProject.name
      }
    } else if (eventType === 'edit') {
      if (curProject) {
        console.log('curProject', curProject)
        // const parentId = curProject.parentId
        // const _keys = Object.keys(curProject)
        // const parentProject = findArrByKeyVal(this.projectList, 'id', parentId)
        // if (parentProject) {
        //   this.belongProject = parentProject.name
        // }
        // _keys.forEach(key => {
        //   this.sectionFormData[key] = curProject[key]
        // })
      }
    }
  },
  methods: {
    addHouseProperty() {
      console.log('addHouseProperty')
    },
    cancelHandle() {
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
