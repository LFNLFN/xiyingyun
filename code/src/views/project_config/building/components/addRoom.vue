<template>
  <publicPopups title-text="添加房间 " @closePopupsBox="closeBox" @formConfirm="addRoomSubmit">
    <template slot="main-content">
      <div class="form-wrap">
        <!-- <el-form
          ref="roomsForm"
          :model="roomsFormData"
          :rules="roomsFormRules"
          class="rooms-form">
          <el-form-item prop="name" label="房间名">
            <el-input v-model.number="roomsFormData.name" size="small" placeholder="请输入房间名" />
          </el-form-item>
        </el-form> -->
        <el-form
          ref="roomsForm"
          class="rooms-form">
          <el-form-item
            v-for="(item, idx) in insertData"
            :key="idx"
            label="房间名">
            <el-input :ref="`roomInput${idx}`" v-model="item.name" size="small" placeholder="请输入房间名" />
          </el-form-item>
        </el-form>
      </div>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { addRoomsBatch } from '@/api/project_config/building'
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
      // roomsFormData: {
      //   unitId: '',
      //   name: '',
      //   parentId: '',
      //   level: 2,
      //   sortIndex: null
      // },
      // roomsFormRules: {
      //   name: [{ required: true, trigger: 'blur', message: '楼栋名称不能为空' }]
      // },
      floorData: [],
      insertData: []
    }
  },
  watch: {
    floorData: function(newVal) {
      console.log('newVal', newVal)
      if (newVal.length) {
        newVal.forEach(val => {
          const realRooms = val.children.filter(item => {
            if (!item.isVirtual || item.isVirtual === undefined) {
              return true
            }
          })
          let _obj
          if (realRooms.length > 0) {
            const lastRoom = realRooms[realRooms.length - 1]
            const nextSortIndex = lastRoom.sortIndex + 1
            let curSortIndex
            nextSortIndex < 10 ? curSortIndex = `0${nextSortIndex}` : nextSortIndex
            _obj = {
              unitId: lastRoom.unitId,
              name: `${val.sortIndex}${curSortIndex}`,
              parentId: lastRoom.parentId,
              level: 2,
              sortIndex: nextSortIndex
            }
          } else {
            _obj = {
              unitId: val.unitId,
              name: `${val.sortIndex}01`,
              parentId: val.id,
              level: 2,
              sortIndex: 1
            }
          }
          this.insertData.push(_obj)
        })
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
      console.log('insertData', this.insertData)
      const warnIndex = this.insertData.findIndex((item) => {
        return item.name === ''
      })
      if (warnIndex >= 0) {
        this.$message({
          message: '房间名不能为空，请填写完整',
          type: 'warning'
        })
        this.$refs[`roomInput${warnIndex}`][0].$el.querySelector('input').focus()
        return
      }
      addRoomsBatch(this.insertData).then(resp => {
        this.$message({
          message: '新增房间成功',
          type: 'success'
        })
        this.$emit('refreshBuildRooms')
        this.closeBox()
      })
    },
    closeBox() {
      this.$emit('update:isAddRoomShow', false)
      this.insertData = []
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
