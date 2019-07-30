<template>
  <footerBarContainer v-loading="sectionLoading" @cancelHandle="cancelHandle" @confirmHandle="submitHandle">
    <template slot="main-content">
      <el-main v-loading="sectionInfoLoading" class="section-info-watp">
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
              clearable
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
              clearable
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
              clearable
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
              :loading="projectPlanDatas.length === 0"
              size="small"
              clearable
              placeholder="请选择"
              @visible-change="(visiable) => getProjectPlan(visiable)">
              <el-option
                v-for="item in projectPlanDatas"
                :key="item.id"
                :label="item.name"
                :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-main>
      <el-main v-loading="buildingLoading" class="scope-wrap">
        <div class="header">
          <span>施工范围</span>
        </div>
        <div class="transfer-wrap">
          <el-transfer
            v-model="buildingSelected"
            :data="transBuildingData"
            :filter-method="filterSuppliers"
            :titles="['楼栋列表', '已选']"
            :button-texts="['删除楼栋', '添加楼栋']"
            filterable
            filter-placeholder="请输入楼栋名称" />
        </div>
      </el-main>
      <el-main v-loading="professionLoading" class="profession-wrap">
        <div class="header">
          <span>专业范围</span>
        </div>
        <div class="transfer-wrap">
          <el-transfer
            v-model="professionSelected"
            :data="transProfessionData"
            :filter-method="filterSuppliers"
            :titles="['专业列表', '已选']"
            :button-texts="['删除专业', '添加专业']"
            filterable />
        </div>
      </el-main>
    </template>
  </footerBarContainer>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { searchArrByKeyVal } from '@/utils/public'
import { getDictionaryItem } from '@/api/dictionary'
import { getBuliding } from '@/api/project_config/building'
import { getPlansNoPage } from '@/api/project_config/plan'
import { addProjectStage, editProjectStage } from '@/api/project_config/project'
import FooterBarContainer from '@/components/FooterBarContainer'
export default {
  components: { FooterBarContainer },
  data() {
    return {
      /* ------------------- 表单数据相关 --------------------*/
      sectionFormData: {
        name: '',
        parentId: '',
        type: 2,
        orgId: '',
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
      belongProject: '', // 保存标段所属项目
      /* ------------------- 楼栋信息相关 --------------------*/
      allBuildingData: [], // 保存所有楼栋数据
      transBuildingData: [], // 保存穿梭框展示的楼栋数据
      buildingSelected: [], // 保存所选择的楼栋Id
      /* ------------------- 专业信息相关 --------------------*/
      projectPlanDatas: [], // 保存平面图数据
      allProfessionData: [], // 保存所有专业数据
      transProfessionData: [], // 保存穿梭框展示的专业数据
      professionSelected: [], // 保存所选择的专业Id
      sectionLoading: false,
      sectionInfoLoading: false,
      buildingLoading: false,
      professionLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'projectList',
      'projectDetails'
    ])
  },
  watch: {
    buildingSelected: function(newVal) {
      const curBuildings = this.allBuildingData.filter(item => {
        return newVal.includes(item.id)
      })
      this.sectionFormData.estateProjectStageEntity.unitEntityList = curBuildings
    },
    professionSelected: function(newVal) {
      const curProfession = this.allProfessionData.filter(item => {
        return newVal.includes(item.id)
      })
      this.sectionFormData.estateProjectStageEntity.professionalList = curProfession
    }
  },
  created() {
    this.sectionInfoLoading = true
    this.buildingLoading = true
    this.professionLoading = true
    const projectId = this.$route.query.projectId
    const parentId = this.$route.query.parentId
    const eventType = this.$route.query.eventType
    // 其他数据
    if (eventType === 'add') {
      const curProject = searchArrByKeyVal(this.projectList, 'id', parentId)
      this.sectionFormData.parentId = parentId
      this.sectionFormData.orgId = curProject.orgId
      if (curProject) {
        this.belongProject = curProject.name
      }
    } else if (eventType === 'edit') {
      // 编辑项目分期，加载表单数据
      const curProject = searchArrByKeyVal(this.projectDetails, 'id', projectId)
      if (curProject) {
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
    this.getContractSupervise()
    // 加载楼栋数据
    this.getBuildingData()
    // 加载专业分类数据
    this.getProfessionData()
  },
  methods: {
    ...mapActions({
      getOrganization: 'getOrganizationData'
    }),
    // 根据条件搜索穿梭框数据
    filterSuppliers(query, item) {
      return item.label.indexOf(query) > -1
    },
    // 加载总包单位以及监理单位数据处理
    getContractSupervise() {
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
          this.sectionInfoLoading = false
        }).catch(() => {
          this.sectionInfoLoading = false
        })
      }).catch(() => {
        this.sectionInfoLoading = false
      })
    },
    // 加载平面图数据
    getProjectPlan(visible) {
      if (!visible || this.projectPlanDatas.length > 0) return
      const { parentId, projectId } = this.$route.query
      const idsStr = [parentId, projectId].join()
      console.log('idsStr', idsStr)
      const params = {
        'terms[0].column': 'projectId$IN',
        'terms[0].value': idsStr,
        'terms[1].column': 'type',
        'terms[1].value': 1,
        pageIndex: this.pageIndex,
        pageSize: 10
      }
      getPlansNoPage(params).then(resp => {
        const result = resp.result
        this.$set(this, 'projectPlanDatas', result)
        console.log('projectPlanDatas', this.projectPlanDatas)
      })
    },
    // 加载楼栋数据处理
    getBuildingData() {
      const { parentId, projectId } = this.$route.query
      const idsStr = [parentId, projectId].join()
      const params = {
        'terms[0].column': 'projectId$IN',
        'terms[0].value': `${idsStr}`
      }
      getBuliding(params).then(resp => {
        const _data = resp.result
        this.allBuildingData = _data
        const unitEntityList = this.sectionFormData.estateProjectStageEntity.unitEntityList
        _data.forEach(v => {
          this.transBuildingData.push({
            key: v.id,
            label: v.name,
            disabled: false
          })
          const index = unitEntityList.findIndex(item => {
            return v.projectId === item.projectId
          })
          if (index >= 0) {
            this.buildingSelected.push(v.id)
          }
        })
        this.buildingLoading = false
      }).catch(() => {
        this.buildingLoading = false
      })
    },
    // 加载专业分类数据处理
    getProfessionData() {
      const dictParams = {
        'terms[0].column': 'dict_id',
        'terms[0].value': 'professionType'
      }
      getDictionaryItem(dictParams).then(resp => {
        const _data = resp.result
        this.allProfessionData = _data
        const professionalList = this.sectionFormData.estateProjectStageEntity.professionalList
        _data.forEach(v => {
          this.transProfessionData.push({
            key: v.id,
            label: v.value,
            disabled: false
          })
          // 加载已选择的专业分类
          const index = professionalList.findIndex(item => {
            return item.id === v.id
          })
          if (index >= 0) {
            this.professionSelected.push(v.id)
          }
        })
        this.professionLoading = false
      }).catch(() => {
        this.professionLoading = false
      })
    },
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
            this.sectionLoading = false
            this.$router.history.go(-1)
            this.$message({
              message: _msg,
              type: 'success'
            })
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
      & /deep/.el-transfer {
        @include flex-layout(center, center, null, nowrap);
        .el-transfer-panel {
          width: 400px;
          .el-transfer-panel__body {
          max-height: 400px;
          .el-checkbox-group  {
            max-height: 350px;
            .el-transfer-panel__item {
              display: block !important;
            }
          }
        }
        }
      }
    }
  }
</style>
