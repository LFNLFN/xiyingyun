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
          <el-form-item prop="code" label="楼栋编码">
            <el-input v-model="buildFormData.code" size="mini" placeholder="请输入楼栋编码" />
          </el-form-item>
          <el-form-item prop="floorCount" label="楼栋层数">
            <el-input v-model.number="buildFormData.floorCount" size="mini" placeholder="请输入楼栋层数" />
          </el-form-item>
          <el-form-item prop="presaleFloorCount" label="预售层数">
            <el-input v-model.number="buildFormData.presaleFloorCount" size="mini" placeholder="请输入预售层数" />
          </el-form-item>
          <el-form-item prop="presaleFloorCount">
            <el-checkbox v-model="addRoomsChecked">是否同步生成房间</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template slot="footer-content">
      <el-button type="primary" size="small" @click="nextStepHandle">下一步</el-button>
    </template>
  </publicPopups>
</template>
<script>
import { mapMutations } from 'vuex'
import EventBus from '@/utils/eventBus'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
// import { addBuliding } from '@/api/project_config/building'
export default {
  components: { PublicPopups },
  props: {
    projectData: {
      type: Object,
      default: () => {
        return {}
      }
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
      addStatus: 'fill', // 当前状态：fill 填写表单，edit 编辑楼栋数据, added 新增完成
      addRoomsChecked: true, // 选择是否生成房间
      isLoading: false
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
            unitFormData: this.buildFormData,
            isNextAddUnit: true,
            isAddRomms: this.addRoomsChecked
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
    closeBox() {
      this.$emit('update:isAddBuildingShow', false)
      // 重置数据
      this.$refs.buildForm.resetFields()
      this.buildFormData.projectId = ''
      this.buildFormData.floorCount = 1
      this.buildFormData.presaleFloorCount = 1
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