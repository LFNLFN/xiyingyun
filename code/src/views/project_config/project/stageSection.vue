<template>
  <el-container v-loading="sectionLoading" direction="vertical">
    <el-main class="section-info-watp">
      <div class="header">
        <span>基础信息</span>
      </div>
      <el-form
        ref="sectionForm"
        :model="sectionFormData"
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
              v-for="(item, idx) in projectStatus"
              :key="idx"
              :label="item.value"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="estateProjectStageEntity.constructionOrgId" label="总包单位">
          <el-select
            v-model="sectionFormData.estateProjectStageEntity.constructionOrgId"
            size="small"
            placeholder="请选择">
            <el-option
              v-for="(item, idx) in constructionOrgs"
              :key="idx"
              :label="item.fullName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="estateProjectStageEntity.supervisionOrgId" label="监理单位">
          <el-select
            v-model="sectionFormData.estateProjectStageEntity.supervisionOrgId"
            size="small"
            placeholder="请选择">
            <el-option
              v-for="(item, idx) in supervisionOrgs"
              :key="idx"
              :label="item.fullName"
              :value="item.id"/>
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
        <el-button type="primary" @click="submitHandle">确定</el-button>
      </div>
    </footer>
  </el-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { searchArrByKeyVal } from '@/utils/public'
import { getDictionaryItem } from '@/api/dictionary'
import { addProjectStage, editProjectStage } from '@/api/project_config/project'
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
          unitEntityList: [],
          supervisionOrgId: '',
          constructionOrgId: '',
          floorPlanId: ''
        }
      },
      secionFormRules: {
        name: [{ required: true, trigger: 'blur', message: '项目名称不能为空' }],
        status: [{ required: true, trigger: 'change', message: '请选择状态' }]
      },
      constructionOrgs: [], // 保存施工单位列表
      supervisionOrgs: [], // 保存监理单位列表
      projectStatus: [
        { id: 0, value: '在建' },
        { id: 1, value: '已完工' }
      ], // 保存项目状态
      buildingSelected: [], // 保存所选择的楼栋
      belongProject: '', // 保存标段所属项目
      sectionLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'projectList',
      'projectDetails'
    ])
  },
  created() {
    this.sectionLoading = true
    const projectId = this.$route.query.projectId
    const eventType = this.$route.query.eventType
    // 其他数据
    if (eventType === 'add') {
      const curProject = searchArrByKeyVal(this.projectList, 'id', projectId)
      this.sectionFormData.parentId = projectId
      if (curProject) {
        this.belongProject = curProject.name
      }
    } else if (eventType === 'edit') {
      // 编辑项目分期，加载表单数据
      const curProject = searchArrByKeyVal(this.projectDetails, 'id', projectId)
      if (curProject) {
        const parentId = curProject.parentId
        const _keys = Object.keys(curProject)
        const parentProject = searchArrByKeyVal(this.projectList, 'id', parentId)
        // 加载所属项目
        if (parentProject) {
          this.belongProject = parentProject.name
        }
        // 加载表单数据
        _keys.forEach(key => {
          this.sectionFormData[key] = curProject[key]
        })
      }
    }
    // 加载总包单位以及监理单位数据
    const dictParams = {
      'terms[0].column': 'dict_id',
      'terms[0].value': 'supplier_type'
    }
    getDictionaryItem(dictParams).then(dresp => {
      const supplierType = dresp.result
      let constructionId, supervisorId
      supplierType.forEach(item => {
        if (item.name === 'construction') {
          constructionId = item.id
        } else if (item.name === 'supervisor') {
          supervisorId = item.id
        }
      })
      const type = this.$store.getters.organizationType.suppliers
      this.getOrganization({ type }).then(oresp => {
        const organs = oresp
        organs.forEach(org => {
          if (org.orgType === constructionId) {
            this.constructionOrgs.push(org)
          } else if (org.orgType === supervisorId) {
            this.supervisionOrgs.push(org)
          }
        })
        this.sectionLoading = false
      }).catch(() => {
        this.sectionLoading = false
      })
    }).catch(() => {
      this.sectionLoading = false
    })
  },
  methods: {
    ...mapActions({
      getOrganization: 'getOrganizationData'
    }),
    // 添加标段处理
    submitHandle() {
      this.$refs.sectionForm.validate(valid => {
        if (valid) {
          let _method, _msg
          this.sectionLoading = true
          const eventType = this.$route.query.eventType
          console.log('this.sectionFormData', this.sectionFormData)
          if (eventType === 'add') {
            _method = addProjectStage(this.sectionFormData)
            _msg = '新增标段成功'
          } else if (eventType === 'edit') {
            _method = editProjectStage(this.sectionFormData)
            _msg = '编辑标段完成'
          }
          _method.then(resp => {
            this.$message({
              message: _msg,
              type: 'success'
            })
            this.sectionLoading = false
          }).catch(() => {
            this.sectionLoading = false
          })
        }
      })
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
