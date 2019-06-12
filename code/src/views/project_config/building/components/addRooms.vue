<template>
  <publicPopups title-text="生成房间 " width="650px" @closePopupsBox="closeBox">
    <template slot="main-content">
      <div :class="{'add-rooms-active': isAddRooms}" class="main-wrap">
        <el-form
          ref="roomsForm"
          :model="roomsFormData"
          :rules="roomsFormRules"
          class="rooms-form">
          <el-form-item prop="presaleFloorCount" label="每层房间数">
            <el-input v-model.number="roomsFormData.roomCount" size="mini" placeholder="请输入每层房间数" />
            <el-button type="primary" size="mini" @click="addRoomsHandle">确定</el-button>
          </el-form-item>
        </el-form>
        <div class="list-wtap">
          <ul class="building-list">
            <li class="list-header">
              <span class="floor-text">楼层</span>
            </li>
            <li
              v-for="(item, idx) in floorData"
              :key="idx"
              class="list-item">
              <div class="item-wrap">
                <el-input v-model="item.name" size="mini" />
              </div>
            </li>
          </ul>
          <ul v-show="roomsDataShow" class="rooms-list">
            <li class="list-header">
              <span class="floor-text">单元</span>
            </li>
            <li
              v-for="(item, idx) in floorData"
              :key="idx"
              class="list-item">
              <div
                v-for="(room, ridx) in item.children"
                :key="ridx"
                class="item-wrap">
                <el-input v-model="room.name" size="mini" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template slot="footer-content">
      <el-button v-show="isNextAddUnit" size="small" @click="toPreviousHandle">上一步</el-button>
      <el-button type="primary" size="small" @click="submitBuildingHandle">确定</el-button>
    </template>
  </publicPopups>
</template>
<script>
import EventBus from '@/utils/eventBus'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { mapGetters } from 'vuex'
import { addBuilding, addRoomsBatch } from '@/api/project_config/building'
export default {
  components: { PublicPopups },
  props: {
    isAddRoomsShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roomsFormData: {
        roomCount: null
      },
      roomsFormRules: {
        roomCount: [{ required: true, trigger: 'blur', message: '房间数不能为空' }]
      },
      floorData: [], // 保存楼层数据
      isAddRooms: false,
      isNextAddUnit: false,
      roomsDataShow: false
    }
  },
  computed: {
    ...mapGetters([
      'addUnitAndRoomsData'
    ])
  },
  watch: {
    isAddRoomsShow: function(newVal) {
      if (newVal) {
        // 初始化数据
        this.isAddRooms = this.addUnitAndRoomsData.isAddRomms
        this.isNextAddUnit = this.addUnitAndRoomsData.isNextAddUnit
        // 根据楼栋数据加载楼栋的楼层数据
        const unitData = this.addUnitAndRoomsData.unitFormData
        console.log('unitData', unitData)
        const _keys = Object.keys(unitData)
        if (_keys.length <= 0) {
          this.$message({
            message: '警告：项目信息不完整，无法生成房间',
            type: 'warning',
            duration: 5,
            showClose: true
          })
          return
        }
        const floorCount = unitData.floorCount
        for (let i = 1; i <= floorCount; i++) {
          this.floorData.push({
            unitId: '',
            name: `${i}层`,
            parentId: '-1',
            children: []
          })
        }
        console.log('floorData', this.floorData)
      }
    }
  },
  mounted() {
    EventBus.$on('building.toEditBuildingData', () => {
      console.log('toEditBuildingData')
      this.$emit('update:isAddRoomsShow', true)
    })
  },
  methods: {
    // 为楼层添加房间
    addRoomsHandle() {
      const roomCount = this.roomsFormData.roomCount
      if (roomCount === null || roomCount <= 0) {
        this.$message({ message: '请填写每层房间数量', type: 'wraning' })
        return
      }
      this.floorData.forEach((item, idx) => {
        item.children.splice(0, item.children.length)
        for (let i = 1; i <= roomCount; i++) {
          let curIdx
          i < 10 ? curIdx = `0${i}` : String(i)
          item.children.push({
            unitId: item.unitId,
            name: `${idx + 1}${curIdx}`,
            parentId: '-1'
          })
        }
      })
      this.roomsDataShow = true
    },
    // 提交表单数据，新增单元
    submitBuildingHandle() {
      const addUnitFormData = this.addUnitAndRoomsData.unitFormData
      addBuilding(addUnitFormData).then(resp => {
        console.log('add unit resp', resp)
        const unitId = resp.result
        this.submitRoomsHandle(unitId)
      })
    },
    // 提交表单数据，新增楼层及房间
    submitRoomsHandle(unitId) {
      const floorData = this.floorData
      floorData.forEach(item => {
        item.unitId = unitId
        item.children.forEach(child => {
          child.unitId = unitId
        })
      })
      addRoomsBatch(floorData).then(resp => {
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.$emit('reloadBuilding')
        this.closeBox()
      })
    },
    // 返回上一步
    toPreviousHandle() {
      this.$emit('update:isAddRoomsShow', false)
      EventBus.$emit('building.toAddBuildingData')
      this.resetData()
    },
    closeBox() {
      EventBus.$emit('building.addBuildCloseHandle')
      this.$emit('update:isAddRoomsShow', false)
      this.resetData()
    },
    resetData() {
      this.floorData = []
      this.roomsDataShow = false
      this.$refs.roomsForm.resetFields()
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.main-wrap {
  padding: 1px;
  height: 480px;
  border-bottom: 1px solid #ccc;
  .rooms-form {
    margin-top: 10px !important;
    display: none;
    .el-form-item {
      margin: 0;
      .el-input {
        width: 350px;
        margin-right: 15px;
      }
    }
  }
  .list-wtap {
    padding: 1px;
    margin-top: 20px;
    width: 100%;
    height: 94%;
    overflow-x: auto;
    overflow-y: auto;
    @include flex-layout(flex-start, flex-start, null, nowrap);
    .building-list, .rooms-list {
      margin: 0;
      padding: 0;
      li {
        list-style: none;
        white-space: nowrap;
        .floor-text, .item-wrap {
          width: 100px;
          height: 35px;
          display: inline-block;
          border: 1px solid #ccc;
          text-align: center;
          .el-input {
            &/deep/.el-input__inner {
              border-radius: 0;
              border: none;
              text-align: center;
              cursor: pointer;
            }
          }
        }
        .floor-text {
          line-height: 30px;
          font-size: 14px;
          color: #495060;
          width: 100%
        }
      }
    }
  }
  &.add-rooms-active {
    .rooms-form {
      display: block;
    }
    .list-wtap {
      height: 84%;
      margin-top: 10px;
    }
  }
}
</style>
