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
            node-key="id"
            class="project-tree">
            <span
              slot-scope="{ node, data }"
              :class="{'is-active': data.id === curUnitData.id}"
              class="custom-tree-node"
              @click="loadBuildingRooms(data, node)">
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
                @click="(evt) => delAllRoomsHandle()">清空房间</el-button>
              <el-button
                v-else
                size="mini"
                @click="(evt) => addRoomsHandle()">生成房间</el-button>
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
                      <el-input />
                      <div class="floor-name">{{ item.name }}</div>
                      <div class="footer">
                        <span class="text-wrap">楼层平面图</span>
                        <span class="foot-operate-wrap">
                          <i class="el-icon-picture" />
                          <i class="el-icon-edit" />
                          <i class="el-icon-delete-solid" />
                        </span>
                      </div>
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
                  <div class="floor-item">
                    <div class="left-side">
                      <el-input />
                      <div class="floor-name">{{ child.name }}</div>
                      <div class="footer">
                        <span class="text-wrap">楼层平面图</span>
                        <span class="foot-operate-wrap">
                          <i class="el-icon-picture" />
                          <i class="el-icon-edit" />
                          <i class="el-icon-delete-solid" />
                        </span>
                      </div>
                    </div>
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
      @reloadBuilding="reloadBuilding" />
    <addFloor
      v-show="isAddFloorShow"
      :is-add-floor-show.sync="isAddFloorShow" />
    <addRooms
      v-show="isAddRoomsShow"
      :is-add-rooms-show.sync="isAddRoomsShow"
      @reloadBuilding="reloadBuilding"/>
  </el-container>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import { getBuliding, delBuliding } from '@/api/project_config/building'
import { getRooms, delRoomsBatch } from '@/api/project_config/building'
import AddBuilding from '@/views/project_config/building/components/addBuilding'
import AddFloor from '@/views/project_config/building/components/addFloor'
import AddRooms from '@/views/project_config/building/components/addRooms'
export default {
  components: { AddBuilding, AddFloor, AddRooms },
  data() {
    return {
      projectList: [],
      projectSelected: '',
      projectTreeData: [],
      projectTreeProp: {
        label: 'name',
        children: 'children'
      },
      curProject: {}, // 保存当前项目
      curProjectState: {}, // 当前项目的子项目
      curUnitData: {}, // 保存当前楼栋信息
      curRoomsData: {}, // 保存当前楼栋的房间信息
      isUnitHasRooms: false, // 判断当前单元是否没有房间数据
      isAddBuildingShow: false,
      isAddFloorShow: false,
      isAddRoomsShow: false
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
      this.curRoomsData = {}
    }
  },
  created() {
    // 获取项目列表
    this.getProjectDetailsVuex().then(resp => {
      const projectId = resp[0].id
      this.projectList = resp
      this.projectSelected = projectId
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
        }).catch(() => {
          this.$set(this, 'projectTreeData', [])
        })
      } else {
        this.$set(this, 'projectTreeData', [])
      }
    },
    reloadBuilding() {
      const projectId = this.curProject.id
      this.getBulidingFunc(projectId)
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
            this.curRoomsData = {}
          }
        })
      }).catch(() => {
        console.log('cancel delete')
      })
    },
    // 加载选择楼栋的房间信息
    loadBuildingRooms(data, node) {
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
        let roomCount = 0
        _data.forEach(item => {
          if (item.parentId === '-1') {
            _floorData.push(item)
          } else {
            roomCount++
            const curParentId = item.parentId
            const _keys = Object.keys(_roomsData)
            if (_keys.includes(curParentId)) {
              _roomsData[curParentId].push(item)
            } else {
              _roomsData[curParentId] = Array.of(item)
            }
          }
        })
        _floorData.sort(function(prev, next) {
          return prev.sortIndex - next.sortIndex
        })
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
    // 生成房间处理
    addRoomsHandle() {
      const _data = {
        unitFormData: this.curUnitData,
        roomsData: this.curRoomsData,
        status: 'addRooms',
        isNextAddUnit: false,
        isAddRooms: true
      }
      this.saveUnitFormData(_data)
      this.isAddRoomsShow = true
    },
    // 清空房间处理
    delAllRoomsHandle() {
      this.$confirm('是否清空所有房间', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        const unitId = this.curUnitData.id
        console.log('unitId', unitId)
        delRoomsBatch(unitId).then(resp => {
          this.$message({
            message: '清空房间成功',
            type: 'success'
          })
          this.reloadBuilding()
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
                  .el-input {
                    display: none;
                  }
                  .floor-name {
                    width: 100%;
                    // text-align: center;
                    height: 40px;
                    line-height: 40px;
                    cursor: default;
                  }
                  .footer {
                    height: 28px;
                    .text-wrap, .foot-operate-wrap {
                      display: block;
                      height: 100%;
                      line-height: 28px;
                      // text-align: center;
                      font-size: 12px;
                    }
                    .text-wrap {
                      background: #e6e6e6;
                    }
                    .foot-operate-wrap {
                      display: none;
                      cursor: pointer;
                      i {
                        margin: 0 5px;
                      }
                    }
                  }
                  &:hover {
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
