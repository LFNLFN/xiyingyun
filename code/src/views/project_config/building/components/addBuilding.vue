<template>
  <publicPopups title-text="新增楼层" width="550px" @closePopupsBox="closeBox">
    <template v-loading="isLoading" slot="main-content">
      <div class="main-wrap">
        <el-form
          ref="buildForm"
          :model="buildFormData"
          :rules="buildFormRules"
          class="building-form">
          <el-form-item prop="name" label="楼栋名称">
            <el-input v-model="buildFormData.name" size="mini" placeholder="请输入楼栋名称" />
          </el-form-item>
          <el-form-item v-show="!isEditBuild" prop="code" label="楼栋编码">
            <el-input v-model="buildFormData.code" size="mini" placeholder="请输入楼栋编码" />
          </el-form-item>
          <el-form-item v-show="!isEditBuild" prop="floorCount" label="楼栋层数">
            <el-input v-model.number="buildFormData.floorCount" size="mini" placeholder="请输入楼栋层数" />
          </el-form-item>
          <el-form-item prop="presaleFloorCount" label="预售层数">
            <el-input v-model.number="buildFormData.presaleFloorCount" size="mini" placeholder="请输入预售层数" />
          </el-form-item>
          <el-form-item v-show="!isEditBuild" prop="presaleFloorCount">
            <el-checkbox v-model="buildRoomsChecked">是否同步生成房间</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template slot="footer-content">
      <template v-if="addUnitAndRoomsData.status === 'addBuild'">
        <el-button type="primary" size="small" @click="nextStepHandle">下一步</el-button>
      </template>
      <template v-else-if="addUnitAndRoomsData.status === 'editBuild'">
        <el-button type="primary" size="small" @click="editBuildHandle">保存</el-button>
      </template>
    </template>
  </publicPopups>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import EventBus from '@/utils/eventBus'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { editBuild } from '@/api/project_config/building'
export default {
  components: { PublicPopups },
  props: {
    // projectData: {
    //   type: Object,
    //   default: () => {
    //     return {}
    //   }
    // },
    isAddBuildingShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      buildFormData: {
        name: '',
        code: '',
        floorCount: 1,
        presaleFloorCount: 1,
        projectId: ''
      },
      buildFormRules: {
        name: [{ required: true, trigger: 'blur', message: '楼栋名称不能为空' }],
        code: [{ required: true, trigger: 'blur', message: '楼栋编码不能为空' }],
        floorCount: [{ required: true, trigger: 'blur', message: '楼栋层数不能为空' }],
        presaleFloorCount: [{ required: true, trigger: 'blur', message: '预售层数不能为空' }]
      },
      projectData: {},
      allUnitData: [], // 保存所有楼栋数据
      addStatus: 'fill', // 当前状态：fill 填写表单，edit 编辑楼栋数据, added 新增完成
      buildRoomsChecked: true, // 选择是否生成房间
      isEditBuild: false, // 是否是编辑模式
      isLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'addUnitAndRoomsData'
    ])
  },
  watch: {
    isAddBuildingShow: function(newVal) {
      // 编辑楼栋模式，加载楼栋相关信息
      if (newVal && this.addUnitAndRoomsData.status === 'editBuild') {
        const unitData = this.addUnitAndRoomsData.unitFormData
        const _keys = Object.keys(this.buildFormData)
        _keys.forEach(key => {
          this.buildFormData[key] = unitData[key]
        })
        this.isEditBuild = true
      }
    },
    'buildFormData.presaleFloorCount': function(newVal) {
      if (newVal > this.buildFormData.floorCount) {
        this.buildFormData.presaleFloorCount = this.buildFormData.floorCount
      }
    }
  },
  mounted() {
    EventBus.$on('building.addBuildCloseHandle', (data) => {
      this.closeBox()
    })
    EventBus.$on('building.toAddBuildingData', (data) => {
      this.$emit('update:isAddBuildingShow', true)
    })
  },
  methods: {
    ...mapMutations({
      saveUnitFormData: 'SET_UNITROOM_DATA',
      resetunitFormData: 'RESET_UNITROOM_DATA'
    }),
    resetDataProperty(source) {
      Object.keys(source).forEach(key => {
        this[key] = source[key]
      })
    },
    // 填写完楼栋信息，前往编辑楼栋的楼层信息
    nextStepHandle() {
      this.$refs.buildForm.validate(valid => {
        if (valid) {
          const projectId = this.projectData.id
          if (!projectId) {
            this.$message({
              message: '新增楼栋失败，项目信息不完整',
              type: 'warning'
            })
            return
          }
          this.isLoading = true
          this.buildFormData.projectId = projectId
          const _obj = {
            allUnitData: this.allUnitData,
            unitFormData: this.buildFormData,
            isNextAddUnit: true,
            isBuildRoom: this.buildRoomsChecked
          }
          this.saveUnitFormData(_obj)
          this.toEditBuildingData()
        }
      })
    },
    toEditBuildingData() {
      this.$emit('update:isAddBuildingShow', false)
      EventBus.$emit('building.toEditBuildingData')
    },
    // 保存编辑好的楼栋信息
    editBuildHandle() {
      console.log('editBuildHandle', this.buildFormData)
      this.$refs.buildForm.validate(valid => {
        if (valid) {
          const unitId = this.addUnitAndRoomsData.unitFormData.id
          console.log('unitId', unitId)
          editBuild(unitId, this.buildFormData).then(resp => {
            this.$message({
              message: '编辑楼栋信息成功',
              type: 'success'
            })
            this.$emit('refreshBuilding')
            this.closeBox()
          })
        }
      })
    },
    closeBox() {
      this.$emit('update:isAddBuildingShow', false)
      // 重置数据
      this.$refs.buildForm.resetFields()
      this.buildFormData.projectId = ''
      this.buildFormData.floorCount = 1
      this.buildFormData.presaleFloorCount = 1
      this.isEditBuild = false
      this.resetunitFormData()
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.main-wrap {
  padding: 1px 20px 0 20px;
  // height: 480px;
  border-bottom: 1px solid #ccc;
  .building-form{
    .el-form-item {
      margin: 20px 0;
      .el-input {
        width: 370px;
      }
    }
  }
}
</style>
