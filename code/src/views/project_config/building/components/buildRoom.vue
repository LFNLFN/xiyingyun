<template>
  <publicPopups title-text="生成房间 " width="650px" @closePopupsBox="closeBox">
    <template slot="main-content">
      <div v-loading="isAddRoomsLoading" :class="{'add-rooms-active': isBuildRoom}" class="main-wrap">
        <el-form
          ref="roomsForm"
          :model="roomsFormData"
          class="rooms-form">
          <el-form-item prop="roomCount" label="每层房间数">
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
          <ul v-show="addRoomCompelete" class="rooms-list">
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
import { mapGetters, mapMutations } from 'vuex'
import { addBuilding, addRoomsBatch } from '@/api/project_config/building'
export default {
  components: { PublicPopups },
  props: {
    isBuildRoomShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roomsFormData: {
        roomCount: null
      },
      floorData: [], // 保存楼层数据
      isBuildRoom: false,
      isNextAddUnit: false,
      addRoomCompelete: false,
      isAddRoomsLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'addUnitAndRoomsData'
    ])
  },
  watch: {
    isBuildRoomShow: function(newVal) {
      if (newVal) {
        // 初始化数据
        this.isBuildRoom = this.addUnitAndRoomsData.isBuildRoom
        this.isNextAddUnit = this.addUnitAndRoomsData.isNextAddUnit
        // 根据楼栋数据加载楼栋的楼层数据
        const { unitFormData, isNextAddUnit, roomsData } = this.addUnitAndRoomsData
        const _keys = Object.keys(unitFormData)
        if (_keys.length === 0) {
          this.$message({
            message: '警告：项目信息不完整，无法生成房间',
            type: 'warning',
            showClose: true
          })
          return
        }
        if (roomsData.length > 0 && !isNextAddUnit) {
          roomsData.forEach(room => {
            const _keys = Object.keys(room)
            const _roomObj = {}
            _keys.forEach(key => {
              _roomObj[key] = room[key]
            })
            this.floorData.push(_roomObj)
          })
        } else {
          const floorCount = unitFormData.floorCount
          for (let i = 1; i <= floorCount; i++) {
            this.floorData.push({
              unitId: '',
              name: `${i}层`,
              parentId: '-1',
              children: [],
              level: 1,
              sortIndex: i
            })
          }
        }
      }
    }
  },
  mounted() {
    EventBus.$on('building.toEditBuildingData', () => {
      this.$emit('update:isBuildRoomShow', true)
    })
  },
  methods: {
    ...mapMutations({
      resetunitFormData: 'RESET_UNITROOM_DATA'
    }),
    // 为楼层添加房间
    addRoomsHandle() {
      const roomCount = this.roomsFormData.roomCount
      if (roomCount === null || roomCount <= 0) {
        this.$message({ message: '请填写每层房间数量', type: 'wraning' })
        return
      }
      this.floorData.forEach((item, idx) => {
        item.children = []
        for (let i = 1; i <= roomCount; i++) {
          let curIdx
          const floorId = item.id && item.id !== '' ? item.id : '-1'
          i < 10 ? curIdx = `0${i}` : String(i)
          item.children.push({
            unitId: item.unitId,
            name: `${idx + 1}${curIdx}`,
            parentId: floorId,
            level: 2,
            sortIndex: curIdx
          })
        }
      })
      this.addRoomCompelete = true
    },
    // 提交表单数据，新增单元
    submitBuildingHandle() {
      if (!this.addRoomCompelete && this.isBuildRoom) {
        this.$message({
          message: '请先添加房间信息',
          type: 'warning'
        })
        return
      }
      this.isAddRoomsLoading = true
      const addUnitFormData = this.addUnitAndRoomsData.unitFormData
      // 如果是再新增楼栋时同步生成房间，则先添加楼栋数据
      if (this.addUnitAndRoomsData.isNextAddUnit) {
        const unitDatas = this.addUnitAndRoomsData.allUnitData
        console.log('unitDatas', unitDatas)
        const sortIndex = unitDatas.length > 0 ? unitDatas[unitDatas.length - 1].sortIndex + 1 || 1 : 1
        addUnitFormData.sortIndex = sortIndex
        console.log('addUnitFormData', addUnitFormData)
        addBuilding(addUnitFormData).then(resp => {
          const unitId = resp.result
          this.addFloorRoomsSubmit(unitId)
        }).catch(() => {
          this.isAddRoomsLoading = false
        })
      // 否则直接添加房间信息
      } else {
        this.addRoomsSubmit()
      }
    },
    // 新增楼层及房间
    addFloorRoomsSubmit(unitId) {
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
        this.isAddRoomsLoading = false
        this.$emit('refreshBuilding')
        this.closeBox()
      }).catch(() => {
        this.isAddRoomsLoading = false
      })
    },
    // 楼层添加房间处理
    addRoomsSubmit() {
      const allRoomData = []
      this.floorData.forEach(floor => {
        allRoomData.push(...floor.children)
      })
      addRoomsBatch(allRoomData).then(resp => {
        this.$message({
          message: '生成房间成功',
          type: 'success'
        })
        this.isAddRoomsLoading = false
        this.$emit('refreshBuildRooms')
        this.closeBox()
      }).catch(() => {
        this.isAddRoomsLoading = false
      })
    },
    // 返回上一步
    toPreviousHandle() {
      this.$emit('update:isBuildRoomShow', false)
      EventBus.$emit('building.toAddBuildingData')
      this.resetData()
    },
    closeBox() {
      if (this.addUnitAndRoomsData.isNextAddUnit) {
        EventBus.$emit('building.addBuildCloseHandle')
      }
      this.$emit('update:isBuildRoomShow', false)
      this.resetData()
    },
    resetData() {
      console.log('this.$refs.roomsForm', this.$refs.roomsForm)
      this.floorData = []
      this.addRoomCompelete = false
      this.$refs.roomsForm.resetFields()
      this.resetunitFormData()
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
