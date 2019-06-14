<template>
  <el-container>
    <el-aside>
      <div class="side-wrap">
        <div class="header">
          <span>楼栋列表</span>
        </div>
        <div v-loading="projectTreeData.length === 0" class="side-content-wrap">
          <el-select
            v-model="projectSelected"
            filterable
            placeholder="请选择项目">
            <el-option
              v-for="(item, idx) in projectList"
              :key="idx"
              :value="item.id"
              :label="item.name" />
          </el-select>
          <el-tree
            ref="projectTree"
            :data="projectTreeData"
            :props="projectTreeProp"
            :expand-on-click-node="false"
            :default-expanded-keys="treeExpandedIds"
            node-key="id"
            class="project-tree">
            <span
              slot-scope="{ node, data }"
              :class="{'is-active': data.id === curUnitData.id}"
              class="custom-tree-node"
              @click="loadBuildingRooms(data)">
              <span>
                <template v-if="data.level === 1">
                  <span class="el-icon-office-building" />
                </template>
                {{ data.name }}
              </span>
              <span>
                <el-dropdown size="small" @command="(order) => handleDropdown(order, data)">
                  <span class="el-icon-s-tools tree-icon-btn" />
                  <el-dropdown-menu slot="dropdown">
                    <template v-if="data.level === 0">
                      <el-dropdown-item command="addBuilding">新增楼栋</el-dropdown-item>
                    </template>
                    <template v-else-if="data.level === 1">
                      <el-dropdown-item command="editBuilding">编辑楼栋</el-dropdown-item>
                      <el-dropdown-item command="delBuilding">删除楼栋</el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </el-aside>
    <el-main>
      <div class="main-wrap">
        <div class="header">
          <span>楼栋列表</span>
        </div>
        <div
          v-show="curRoomsData.length > 0"
          class="building-wrap">
          <div class="building-wrap-header">
            <span class="building-name">{{ curUnitData.name }}</span>
            <div>
              <el-button size="mini" type="primary">新增楼层</el-button>
              <el-button
                v-if="isUnitHasRooms"
                size="mini"
                @click="(evt) => emptyRoomsHandle()">清空房间</el-button>
              <el-button
                v-else
                size="mini"
                @click="(evt) => buildRoomsHandle()">生成房间</el-button>
            </div>
          </div>
          <div class="build-floor-wrap">
            <div
              v-for="(item, idx) in curRoomsData"
              :key="idx"
              class="building-floor">
              <div class="floor-wrap">
                <template v-if="idx === 0">
                  <div class="title-text">楼层</div>
                </template>
                <div class="floor-item-wrap">
                  <template v-if="idx === 0">
                    <el-button type="primary" size="mini" class="column-set-btn">整列设置</el-button>
                  </template>
                  <div class="floor-item">
                    <div class="left-side">
                      <el-input v-if="item.isEdit" v-model="item.name" autofocus />
                      <div v-else class="floor-name">{{ item.name }}</div>
                      <template v-if="item.isEdit">
                        <div class="edit-btn-wrap">
                          <el-button
                            size="mini"
                            class="edit-room-btn"
                            @click="editRoomsHandle(item, 'cancel')">取消</el-button>
                          <el-button
                            type="primary"
                            size="mini"
                            class="edit-room-btn"
                            @click="editRoomsHandle(item, 'confirm')">确定</el-button>
                        </div>
                      </template>
                      <template v-else>
                        <div class="footer">
                          <span class="text-wrap">楼层平面图</span>
                          <span class="foot-operate-wrap">
                            <i class="el-icon-picture" />
                            <i class="el-icon-edit" @click="editRoomsHandle(item, 'edit')" />
                            <i class="el-icon-delete-solid" @click="delRoomsHandle(item)" />
                          </span>
                        </div>
                      </template>
                    </div>
                    <div class="right-side">F</div>
                  </div>
                </div>
              </div>
              <div
                v-if="item.children && item.children.length > 0"
                class="room-wrap">
                <template v-if="idx === 0">
                  <div class="title-text">房间</div>
                </template>
                <div
                  v-for="(child, cidx) in item.children"
                  :key="cidx"
                  class="floor-item-wrap">
                  <template v-if="idx === 0">
                    <el-button type="primary" size="mini" class="column-set-btn">整列设置</el-button>
                  </template>
                  <!-- 非虚拟数据，渲染房间信息 -->
                  <template v-if="!child.isVirtual">
                    <div class="floor-item">
                      <div class="left-side">
                        <el-input v-show="child.isEdit" v-model="item.name" autofocus />
                        <div v-show="!child.isEdit" class="floor-name">{{ child.name }}</div>
                        <div class="footer">
                          <span class="text-wrap">楼层平面图</span>
                          <span class="foot-operate-wrap">
                            <i class="el-icon-picture" />
                            <i class="el-icon-edit" @click="editRoomsHandle(item)"/>
                            <i class="el-icon-delete-solid" @click="delRoomsHandle(child)"/>
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                  <!-- 虚拟数据，渲染添加房间按钮 -->
                  <template v-else>
                    <div class="floor-item">
                      <div class="add-rooms-item" @click="addRoomHandle(item)">添加房间</div>
                    </div>
                  </template>
                </div>
                <div class="floor-item-wrap">
                  <template v-if="idx === 0">
                    <el-button type="primary" size="mini" class="column-set-btn">批量添加</el-button>
                  </template>
                  <div class="floor-item">
                    <div class="add-rooms-item" @click="addRoomHandle(item)">添加房间</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <addBuilding
      v-show="isAddBuildingShow"
      :project-data="curProjectState"
      :is-add-building-show.sync="isAddBuildingShow"
      @refreshBuilding="refreshBuilding" />
    <addFloor
      v-show="isAddFloorShow"
      :unit-data="curUnitData"
      :all-rooms-data="curRoomsData"
      :is-add-floor-show.sync="isAddFloorShow" />
    <buildRoom
      v-show="isBuildRoomShow"
      :is-build-rooms-show.sync="isBuildRoomShow"
      @refreshBuilding="refreshBuilding"/>
    <addRoom
      v-show="isAddRoomShow"
      ref="addRoomCom"
      :is-add-room-show.sync="isAddRoomShow"
      @refreshBuilding="refreshBuilding" />
  </el-container>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import { getBuliding, delBuliding } from '@/api/project_config/building'
import { getRooms, editRoom, delRoom, emptyRooms } from '@/api/project_config/building'
import AddBuilding from '@/views/project_config/building/components/addBuilding'
import AddFloor from '@/views/project_config/building/components/addFloor'
import BuildRoom from '@/views/project_config/building/components/buildRoom'
import AddRoom from '@/views/project_config/building/components/addRoom'
export default {
  components: { AddBuilding, AddFloor, BuildRoom, AddRoom },
  data() {
    return {
      /* -------------- 项目信息相关 -----------------*/
      projectList: [],
      projectSelected: '',
      projectTreeData: [],
      projectTreeProp: {
        label: 'name',
        children: 'children'
      },
      treeExpandedIds: [], // 保存项目树默认展开的节点ID
      curProject: {}, // 保存已选择项目
      curProjectState: {}, // 保存已选择项目的子项目
      /* -------------- 楼栋房间相关 -----------------*/
      curUnitData: {}, // 保存选择楼栋的信息
      curRoomsData: [], // 保存选择楼栋的房间信息
      isUnitHasRooms: false, // 判断当前单元是否没有房间数据
      /* -------------- 状态数据 -----------------*/
      isAddBuildingShow: false,
      isAddFloorShow: false,
      isBuildRoomShow: false,
      isAddRoomShow: false
    }
  },
  watch: {
    projectSelected: function(newVal) {
      if (newVal === '') return
      const curProject = this.projectList.find(item => item.id === newVal)
      if (curProject) {
        this.curProject = curProject
        this.getBulidingFunc()
      }
      // 重置当前楼栋，房间数据
      this.curUnitData = {}
      this.curRoomsData = []
    }
  },
  created() {
    // 获取项目列表
    this.getProjectDetailsVuex().then(resp => {
      const defaultProjectId = resp[0].id
      this.projectList = resp
      this.projectSelected = defaultProjectId
    })
  },
  methods: {
    ...mapActions([
      'getProjectDetailsVuex'
    ]),
    ...mapMutations({
      saveUnitFormData: 'SET_UNITROOM_DATA'
    }),
    // 加载项目楼栋数据
    getBulidingFunc() {
      const curProject = this.curProject
      const curProjectIds = []
      const curProName = curProject.name
      const stages = curProject.childrenWithDetail
      if (stages && stages.length > 0) {
        const _treeData = []
        stages.forEach(item => {
          curProjectIds.push(item.id)
          _treeData.push({
            id: item.id,
            name: `${curProName}-${item.name}`,
            level: 0,
            children: []
          })
        })
        const projectIdStr = curProjectIds.join()
        const params = {
          'terms[0].column': 'projectId$IN',
          'terms[0].value': `%${projectIdStr}%`
        }
        getBuliding(params).then(resp => {
          const data = resp.result
          _treeData.forEach(item => {
            const curBuilding = data.filter(build => {
              if (build.projectId === item.id) {
                build['level'] = 1
                return true
              }
            })
            item.children = curBuilding
          })
          this.$set(this, 'projectTreeData', _treeData)
          this.reloadBuildRooms()
        }).catch(() => {
          this.$set(this, 'projectTreeData', [])
        })
      } else {
        this.$set(this, 'projectTreeData', [])
      }
    },
    // 刷新楼栋信息
    refreshBuilding() {
      this.getBulidingFunc()
    },
    // 刷新楼栋信息后，重新加载刷新前选择的楼栋及房间信息
    reloadBuildRooms() {
      const unitKeys = Object.keys(this.curUnitData)
      if (unitKeys.length === 0) {
        return
      }
      const unitId = this.curUnitData.id
      const curTreeNode = this.projectTreeData.find(item => {
        const target = item.children.find(child => {
          return unitId === child.id
        })
        return target !== undefined
      })
      console.log('curTreeNode', curTreeNode)
      this.treeExpandedIds = Array.of(curTreeNode.id)
      this.loadBuildingRooms(this.curUnitData)
    },
    // 添加楼栋处理
    addBuildingHandle(data) {
      if (data) {
        this.curProjectState = data
      }
      this.isAddBuildingShow = true
    },
    // 编辑楼栋信息处理
    editBuildingHandle(data) {
      const _data = {
        unitFormData: data,
        status: 'editBuild'
      }
      this.saveUnitFormData(_data)
      this.isAddBuildingShow = true
    },
    // 删除楼栋
    delBuildingHandle(data) {
      const buildingId = data.id
      const name = data.name
      this.$confirm(`确定删除 ${name} ?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(flag => {
        delBuliding(buildingId).then(resp => {
          this.$message({
            message: '删除楼栋成功',
            type: 'success'
          })
          this.$refs.projectTree.remove(data)
          if (buildingId === this.curUnitData.id) {
            this.curUnitData = {}
            this.curRoomsData = []
          }
        })
      }).catch(() => {
        console.log('cancel delete')
      })
    },
    // 加载选择楼栋的房间信息
    loadBuildingRooms(data) {
      if (data.level === 0) return
      this.curUnitData = data
      const unitId = data.unitId
      const params = {
        'terms[0].column': 'unitId',
        'terms[0].value': unitId
      }
      getRooms(params).then(resp => {
        const _data = resp.result
        const _floorData = []
        const _roomsData = {}
        const _roomLengthList = []
        let roomCount = 0
        // 处理所有数据，筛选出楼层数据以及房间数据
        _data.forEach(item => {
          if (item.parentId === '-1') {
            _floorData.push(item)
          } else {
            roomCount === 0 ? roomCount++ : roomCount
            const curParentId = item.parentId
            const index = Object.keys(_roomsData).indexOf(curParentId)
            if (index >= 0) {
              _roomsData[curParentId].push(item)
              _roomLengthList[index] = _roomsData[curParentId].length
            } else {
              _roomsData[curParentId] = Array.of(item)
            }
          }
        })
        // 添加虚拟数据，方便页面渲染添加房间按钮
        const maxRoomLength = Math.max(..._roomLengthList)
        Object.values(_roomsData).forEach(room => {
          const diff = maxRoomLength - room.length
          if (diff > 0) {
            const addArr = new Array(diff).fill({
              isVirtual: true
            })
            room.push(...addArr)
          }
        })
        // 楼层数据排序
        _floorData.sort(function(prev, next) {
          return prev.sortIndex - next.sortIndex
        })
        // 为留楼层添加对应的房间数据
        _floorData.forEach(floor => {
          if (_roomsData[floor.id]) {
            floor['children'] = _roomsData[floor.id].sort(function(prev, next) {
              return prev.sortIndex - next.sortIndex
            })
          }
        })
        this.curRoomsData = _floorData
        this.isUnitHasRooms = Boolean(roomCount)
      })
    },
    // 添加房间操作处理
    addRoomHandle(data) {
      const _obj = {
        floorData: data
      }
      this.$refs.addRoomCom.resetDataProperty(_obj)
      this.isAddRoomShow = true
    },
    // 生成房间操作处理
    buildRoomsHandle() {
      const _data = {
        unitFormData: this.curUnitData,
        roomsData: this.curRoomsData,
        status: 'buildRooms',
        isNextAddUnit: false,
        isBuildRoom: true
      }
      this.saveUnitFormData(_data)
      this.isBuildRoomShow = true
    },
    // 编辑房间操作处理
    editRoomsHandle(roomData, order) {
      const roomId = roomData.id
      switch (order) {
        case 'edit':
          this.$set(roomData, 'isEdit', true)
          break
        case 'confirm':
          editRoom(roomId, roomData).then(resp => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.refreshBuilding()
          })
          break
        case 'cancel':
          // Reflect.deleteProperty(roomData, 'isEdit')
          this.$delete(roomData, 'isEdit')
          break
      }
    },
    // 删除房间操作处理
    delRoomsHandle(data) {
      console.log('data', data)
      let msgText = ''
      const roomId = data.id
      data.parentId === '-1' ? msgText = `是否删除楼层：${data.name}` : msgText = `是否删除房间：${data.name}`
      this.$confirm(msgText, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((action) => {
        delRoom(roomId).then(resp => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.refreshBuilding()
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    // 清空房间操作处理
    emptyRoomsHandle() {
      this.$confirm('是否清空所有房间', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        const unitId = this.curUnitData.id
        emptyRooms(unitId).then(resp => {
          this.$message({
            message: '清空房间成功',
            type: 'success'
          })
          this.refreshBuilding()
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    // 下拉菜单点击处理
    handleDropdown(order, data) {
      switch (order) {
        // 添加楼栋
        case 'addBuilding':
          this.addBuildingHandle(data)
          break
        // 编辑楼栋
        case 'editBuilding':
          this.editBuildingHandle(data)
          break
        // 删除楼栋
        case 'delBuilding':
          this.delBuildingHandle(data)
          break
      }
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  .header {
    @include gray-header;
  }
  .el-aside {
    min-height: 100%;
    padding: 20px 0 20px 20px;
    .side-wrap {
      height: 100%;
       @include boxShadow-container;
      .side-content-wrap {
        padding: 20px 10px;
        .el-select {
          width: 90%;
          margin: 0 5% 20px 5%;
        }
      }
    }
  }
  .el-main {
    height: 100%;
    .main-wrap {
      height: 100%;
      @include boxShadow-container;
    }
    .building-wrap {
      width: 100%;
      height: calc(100% - 40px);
      padding: 20px;
      .building-wrap-header {
        padding: 10px;
        @include flex-layout(space-between, center, null, nowrap);
        .building-name {
          font-weight: bold;
        }
      }
      .build-floor-wrap {
        width: 100%;
        height: calc(100% - 50px);
        overflow: auto;
        .building-floor {
          white-space: nowrap;
          .floor-wrap, .room-wrap {
            display: inline-block;
            margin-right: 10px;
            .title-text {
              background: #daecfe;
              padding: 8px 0;
              font-size: 14px;
              text-align: center;
            }
            .column-set-btn {
              background: none;
              border: none;
              color: #2d8cf0;
              margin-bottom: 5px;
            }
            .floor-item-wrap {
              margin: 8px 8px 0 0;
              display: inline-block;
              text-align: center;
              .floor-item {
                width: 110px;
                height: 70px;
                .left-side {
                  width: calc(100% - 20px);
                  height: 100%;
                  float: left;
                  border: 1px solid #ccc;
                  .floor-name {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    cursor: default;
                  }
                  .footer {
                    .text-wrap, .foot-operate-wrap {
                      display: block;
                      height: 100%;
                      line-height: 28px;
                      font-size: 12px;
                    }
                    .text-wrap {
                      background: #f3eced;
                    }
                    .foot-operate-wrap {
                      display: none;
                      cursor: pointer;
                      i {
                        margin: 0 5px;
                      }
                    }
                  }
                  .edit-btn-wrap {
                    height: 28px;
                    background: #fff;
                    .edit-room-btn {
                      padding: 5px 6px;
                      margin: 2px 2px 0 2px;
                    }
                  }
                }
                .left-side:hover {
                  background: #409eff;
                  color: #fff;
                  .footer {
                    border-top: 1px solid #fff;
                    .text-wrap {
                      display: none;
                    }
                    .foot-operate-wrap {
                      display: block;
                    }
                  }
                }
                .add-rooms-item {
                  float: left;
                  width: 100%;
                  height: 100%;
                  line-height: 70px;
                  font-size: 14px;
                  background: #f3eced;
                  cursor: pointer;
                }
                .right-side {
                  width: 20px;
                  height: 100%;
                  line-height: 70px;
                  // text-align: center;
                  float: right;
                  background: #ccc;
                  color: #fff;
                }
              }
            }
          }
          .room-wrap {
            .floor-item-wrap {
              .floor-item {
                width: 100px;
                .left-side {
                  width: 100px;
                }
              }
            }
          }
        }
      }
    }
  }

  &/deep/.custom-tree-node {
    font-size: 14px;
    .el-icon-office-building {
      vertical-align: bottom;
      margin-right: 5px;
    }
    .tree-icon-btn {
      display: none;
      font-size: 16px;
      margin-left: 5px;
    }
    &:hover {
      .tree-icon-btn {
        display: inline-block;
      }
    }
    &.is-active {
      background: #daecfe;
      border-radius: 5px;
    }
  }
}
</style>
