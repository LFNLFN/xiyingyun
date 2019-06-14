<template>
  <publicPopups title-text="生成房间 " @closePopupsBox="closeBox" @formConfirm="addRoomSubmit">
    <template slot="main-content">
      <div class="form-wrap">
        <el-form
          ref="roomsForm"
          :model="roomsFormData"
          :rules="roomsFormRules"
          class="rooms-form">
          <el-form-item prop="name" label="房间名">
            <el-input v-model.number="roomsFormData.name" size="small" placeholder="请输入房间名" />
          </el-form-item>
        </el-form>
      </div>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { addRoom } from '@/api/project_config/building'
export default {
  components: { PublicPopups },
  props: {
    isAddRoomShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roomsFormData: {
        unitId: '',
        name: '',
        parentId: '',
        level: 2,
        sortIndex: null
      },
      roomsFormRules: {
        name: [{ required: true, trigger: 'blur', message: '楼栋名称不能为空' }]
      },
      floorData: {}
    }
  },
  watch: {
    floorData: function(newVal) {
      const _keys = Object.keys(newVal)
      if (_keys.length) {
        const realRooms = newVal.children.filter(item => {
          if (!item.isVirtual || item.isVirtual === undefined) {
            return true
          }
        })
        const lastRoom = realRooms[realRooms.length - 1]
        const nextSortIndex = lastRoom.sortIndex + 1
        const _obj = {
          unitId: lastRoom.unitId,
          parentId: lastRoom.parentId,
          level: 2,
          sortIndex: nextSortIndex
        }
        this.roomsFormData = _obj
        console.log('this.roomsFormData', this.roomsFormData)
      }
    }
  },
  methods: {
    resetDataProperty(source) {
      Object.keys(source).forEach(key => {
        this[key] = source[key]
      })
    },
    addRoomSubmit() {
      this.$refs.roomsForm.validate(valid => {
        if (valid) {
          addRoom(this.roomsFormData).then(resp => {
            this.$message({
              message: '新增房间成功',
              type: 'success'
            })
            this.$emit('refreshBuilding')
            this.closeBox()
          })
        }
      })
    },
    closeBox() {
      this.$emit('update:isAddRoomShow', false)
      this.roomsFormData = {
        unitId: '',
        name: '',
        parentId: '',
        level: 2,
        sortIndex: null
      }
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
.form-wrap {
  padding: 20px;
  border-bottom: 1px solid #ccc;
  .el-form {
    max-height: 480px;
    overflow: auto;
    .el-form-item {
      margin-bottom: 15px;
      .el-input {
        width: 340px;
      }
    }
  }
}
</style>
