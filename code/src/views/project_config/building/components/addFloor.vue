<template>
  <publicPopups title-text="新增楼层" @closePopupsBox="closeBox" @formConfirm="addFloorSubmit">
    <template slot="main-content">
      <el-form
        ref="floorForm"
        :model="floorFormData"
        :rules="floorFormRules">
        <el-form-item prop="" label="楼层名称">
          <el-input v-model="floorFormData.name" placeholder="请输入楼层名称" />
        </el-form-item>
        <el-form-item prop="" label="添加位置">
          <el-radio v-model="floorFormData.addPlace" label="top">顶层添加一层</el-radio>
          <el-radio v-model="floorFormData.addPlace" label="bottom">底层添加一层</el-radio>
        </el-form-item>
      </el-form>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { addRoom } from '@/api/project_config/building'
export default {
  components: { PublicPopups },
  props: {
    unitData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    allRoomsData: {
      type: Array,
      default: () => {
        return []
      }
    },
    isAddFloorShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      floorFormData: {
        name: '',
        addPlace: 'bottom'
      },
      floorFormRules: {
        name: [{ required: true, trigger: 'blur', message: '楼层名称不能为空' }],
        addPlace: [{ required: true, trigger: 'change', message: '请选择楼层添加位置' }]
      }
    }
  },
  methods: {
    addFloorSubmit() {
      this.$refs.floorForm.validate(valid => {
        if (valid) {
          let unitLastFloor, curSortIndex
          if (this.floorFormData.addPlace === 'top') {
            unitLastFloor = this.allRoomsData[this.allRoomsData.length - 1]
            curSortIndex = unitLastFloor.sortIndex + 1
          } else if (this.floorFormData.addPlace === 'bottom') {
            unitLastFloor = this.allRoomsData[0]
            curSortIndex = unitLastFloor.sortIndex - 1
          }
          console.log('unitLastFloor', unitLastFloor)
          const _addData = {
            unitId: this.unitData.id,
            name: this.floorFormData.name,
            parentId: '-1',
            level: 1,
            sortIndex: curSortIndex
          }
          console.log('_addData', _addData)
          addRoom(_addData).then(resp => {
            this.$message({
              message: '新增楼层成功',
              type: 'success'
            })
            this.$emit('refreshBuildRooms')
            this.closeBox()
          })
        }
      })
    },
    closeBox() {
      this.$emit('update:isAddFloorShow', false)
      this.$refs.floorForm.resetFields()
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
.el-form {
  padding-top: 40px;
  .el-form-item {
    .el-input {
      width: 350px;
    }
  }
}
</style>
