<template>
  <el-container>
    <el-aside>
      <div class="side-wrap">
        <div class="header">
          <span>楼栋列表</span>
        </div>
        <div
          v-loading="isGetProjectLoading"
          class="side-content-wrap">
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
            :load="loadTreeNodeHandle"
            lazy
            node-key="id"
            auto-expand-parent
            class="project-tree"
            @node-expand="treeNodeExpandedClose"
            @node-collapse="treeNodeExpandedClose">
            <span
              slot-scope="{ node, data }"
              :class="{'is-active': data.id === curUnitData.id}"
              class="custom-tree-node"
              @click="loadBuildingRooms(data)">
              <span class="tree-item-name">
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
          v-loading="isGetBuildLoading"
          v-if="floorsRoomsData.length > 0"
          class="building-wrap">
          <div class="building-wrap-header">
            <span class="building-name">{{ curUnitData.name }}</span>
            <div>
              <el-button size="mini" type="primary" @click="addFloorHandle">新增楼层</el-button>
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
              v-for="(item, idx) in floorsRoomsData"
              :key="idx"
              class="building-floor">
              <div class="floor-wrap">
                <template v-if="idx === 0">
                  <div class="title-text">楼层</div>
                </template>
                <div class="floor-item-wrap">
                  <template v-if="idx === 0">
                    <el-button
                      type="primary"
                      size="mini"
                      class="column-set-btn"
                      @click="setPlanBatchHandle(item, idx)">整列设置</el-button>
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
                          <span class="text-wrap">{{ item.floorPlanName || '无平面图' }}</span>
                          <span class="foot-operate-wrap">
                            <i class="el-icon-picture" @click="setPlanHandle(item)" />
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
                    <el-button
                      type="primary"
                      size="mini"
                      class="column-set-btn"
                      @click="setPlanBatchHandle(child, cidx)">整列设置</el-button>
                  </template>
                  <!-- 非虚拟数据，渲染房间信息 -->
                  <template v-if="!child.isVirtual">
                    <div class="floor-item">
                      <div class="left-side">
                        <el-input v-if="child.isEdit" v-model="child.name" autofocus />
                        <div v-else class="floor-name">{{ child.name }}</div>
                        <template v-if="child.isEdit">
                          <div class="edit-btn-wrap">
                            <el-button
                              size="mini"
                              class="edit-room-btn"
                              @click="editRoomsHandle(child, 'cancel')">取消</el-button>
                            <el-button
                              type="primary"
                              size="mini"
                              class="edit-room-btn"
                              @click="editRoomsHandle(child, 'confirm')">确定</el-button>
                          </div>
                        </template>
                        <template v-else>
                          <div class="footer">
                            <span class="text-wrap">{{ child.floorPlanName || '无平面图' }}</span>
                            <span class="foot-operate-wrap">
                              <i class="el-icon-picture" @click="setPlanHandle(child)" />
                              <i class="el-icon-edit" @click="editRoomsHandle(child, 'edit')"/>
                              <i class="el-icon-delete-solid" @click="delRoomsHandle(child)"/>
                            </span>
                          </div>
                        </template>
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
                    <el-button
                      type="primary"
                      size="mini"
                      class="column-set-btn"
                      @click="addRoomBatchHandle">批量添加</el-button>
                  </template>
                  <div class="floor-item">
                    <div class="add-rooms-item" @click="addRoomHandle(item)">添加房间</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-loading="isGetBuildLoading"
          v-else
          class="building-wrap" />
      </div>
    </el-main>
    <addBuilding
      v-show="isAddBuildingShow"
      ref="addBuildingCom"
      :is-add-building-show.sync="isAddBuildingShow"
      @refreshBuilding="reloadBuildings" />
    <addFloor
      v-show="isAddFloorShow"
      :unit-data="curUnitData"
      :all-rooms-data="floorsRoomsData"
      :is-add-floor-show.sync="isAddFloorShow"
      @refreshBuildRooms="reloadBuildRooms" />
    <buildRoom
      v-show="isBuildRoomShow"
      :is-build-room-show.sync="isBuildRoomShow"
      @refreshBuilding="reloadBuildings"
      @refreshBuildRooms="reloadBuildRooms" />
    <addRoom
      v-show="isAddRoomShow"
      ref="addRoomCom"
      :is-add-room-show.sync="isAddRoomShow"
      @refreshBuildRooms="reloadBuildRooms" />
    <setPlan
      v-show="isSetPlanShow"
      ref="setPlanCom"
      :is-set-plan-show.sync="isSetPlanShow" />
  </el-container>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
import { isEmpty } from '@/utils/public'
import { getBuliding, delBuliding } from '@/api/project_config/building'
import { getRooms, editRoom, delRoom, emptyRooms } from '@/api/project_config/building'
import AddBuilding from '@/views/project_config/building/components/addBuilding'
import AddFloor from '@/views/project_config/building/components/addFloor'
import BuildRoom from '@/views/project_config/building/components/buildRoom'
import AddRoom from '@/views/project_config/building/components/addRoom'
import SetPlan from '@/views/project_config/building/components/setPlan'
export default {
  components: { AddBuilding, AddFloor, BuildRoom, AddRoom, SetPlan },
  data() {
    return {
      /* -------------- 项目信息相关 -----------------*/
      projectList: [],
      projectSelected: '',
      projectTreeData: [],
      projectTreeProp: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      treeExpandedIds: [], // 保存项目树默认展开的节点ID
      curProject: {}, // 保存已选择项目
      /* -------------- 楼栋房间相关 -----------------*/
      allUnitData: [], // 保存所有楼栋信息
      curUnitData: {}, // 保存选择楼栋的信息
      floorsRoomsData: [], // 保存选择楼栋的楼层以及房间信息
      isUnitHasRooms: false, // 判断当前单元是否没有房间数据
      /* -------------- 组件显隠状态数据 -----------------*/
      isAddBuildingShow: false,
      isAddFloorShow: false,
      isBuildRoomShow: false,
      isAddRoomShow: false,
      isSetPlanShow: false,
      /* -------------- 加载状态数据 -----------------*/
      isGetBuildLoading: false,
      isGetProjectLoading: false
    }
  },
  watch: {
    // 监听项目选择，加载对应楼栋数据
    projectSelected: function(newVal) {
      if (newVal === '') return
      this.curProject = this.projectList.find(item => item.id === newVal)
      // this.getBulidingFunc()
      this.getProBulidingFunc()
      // 重置当前楼栋数据，所有房间数据
      this.curUnitData = {}
      this.floorsRoomsData = []
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
    // 加载项目分期、标段所属的的楼栋数据
    getProBulidingFunc(getRooms = false) {
      const curProject = this.curProject
      const proectIds = []
      const stageList = curProject.childrenWithDetail
      this.isGetProjectLoading = true
      if (stageList) {
        stageList.forEach(stage => {
          proectIds.push(stage.projectId)
          const sectionList = stage.childrenWithDetail
          if (sectionList) {
            sectionList.forEach(section => {
              proectIds.push(section.projectId)
            })
          }
        })
      }
      const proectIdStr = proectIds.join()
      const params = {
        'terms[0].column': 'projectId$IN',
        'terms[0].value': `${proectIdStr}`,
        'sorts[0].name': 'sortIndex',
        'sorts[0].order': 'asc'
      }
      getBuliding(params).then(resp => {
        this.allUnitData = resp.result
        const _treeData = this.buildProjectTree(curProject)
        this.$set(this, 'projectTreeData', _treeData)
        if (getRooms) {
          this.reloadBuildRooms()
        }
        this.isGetProjectLoading = false
      }).catch(() => {
        this.isGetProjectLoading = false
      })
    },
    // 项目树展开关闭处理
    treeNodeExpandedClose(data, node) {
      if (node.childNodes.length === 0) return
      const nodeId = data.id
      const index = this.treeExpandedIds.indexOf(nodeId)
      if (index >= 0) {
        this.treeExpandedIds.splice(index, 1)
      } else {
        this.treeExpandedIds.push(nodeId)
      }
    },
    // 生成项目树状图
    buildProjectTree(project, treeLevel = 0) {
      const { name, childrenWithDetail } = project
      const _treeData = []
      if (childrenWithDetail && childrenWithDetail.length > 0) {
        childrenWithDetail.forEach(item => {
          _treeData.push({
            id: item.id,
            name: `${name}-${item.name}`,
            level: treeLevel,
            projectData: item,
            children: []
          })
        })
      }
      return _treeData
    },
    // 加载项目树的子节点
    loadTreeNodeHandle(node, resolve) {
      const project = node.data.projectData
      if (!project) {
        return resolve([])
      }
      const projectId = project.id
      const _treeData = this.buildProjectTree(project)
      this.allUnitData.forEach((unit, idx) => {
        if (unit.projectId === projectId) {
          unit['level'] = 1
          unit['leaf'] = true
          _treeData.push(unit)
        }
      })
      if (_treeData.length === 0) {
        this.$message({
          showClose: true,
          message: '暂无数据...',
          duration: 1500
        })
      }
      _treeData.sort(function(prev, next) {
        return prev.sortIndex - next.sortIndex
      })
      resolve(_treeData)
      // const params = {
      //   'terms[0].column': 'projectId',
      //   'terms[0].value': `${project.id}`
      // }
      // getBuliding(params).then(resp => {
      //   const unitData = resp.result
      //   unitData.forEach(unit => {
      //     unit['level'] = 1
      //     unit['leaf'] = true
      //     _treeData.push(unit)
      //   })
      //   if (_treeData.length === 0) {
      //     this.$message({
      //       showClose: true,
      //       message: '暂无数据...',
      //       duration: 1500
      //     })
      //   }
      //   resolve(_treeData)
      // }).catch(() => {
      //   resolve(_treeData)
      // })
    },
    // getBulidingFunc() {
    //   console.log('this.curProject', this.curProject)
    //   const curProject = this.curProject
    //   const curProjectIds = []
    //   const curProName = curProject.name
    //   const stages = curProject.childrenWithDetail
    //   this.isGetProjectLoading = true
    //   if (stages && stages.length > 0) {
    //     this.isGetBuildLoading = true
    //     const _treeData = []
    //     stages.forEach(item => {
    //       curProjectIds.push(item.id)
    //       _treeData.push({
    //         id: item.id,
    //         name: `${curProName}-${item.name}`,
    //         level: 0,
    //         children: []
    //       })
    //     })
    //     const projectIdStr = curProjectIds.join()
    //     const params = {
    //       'terms[0].column': 'projectId$IN',
    //       'terms[0].value': `${projectIdStr}`
    //     }
    //     getBuliding(params).then(resp => {
    //       const data = resp.result
    //       _treeData.forEach(item => {
    //         const curBuilding = data.filter(build => {
    //           if (build.projectId === item.id) {
    //             build['level'] = 1
    //             return true
    //           }
    //         })
    //         item.children = curBuilding
    //       })
    //       this.$set(this, 'projectTreeData', _treeData)
    //       this.isGetProjectLoading = false
    //       this.reloadBuildRooms()
    //     }).catch(() => {
    //       this.$set(this, 'projectTreeData', [])
    //       this.isGetBuildLoading = false
    //       this.isGetProjectLoading = false
    //     })
    //   } else {
    //     this.isGetProjectLoading = false
    //     this.$set(this, 'projectTreeData', [])
    //   }
    // },
    // 刷新楼栋信息
    reloadBuildings() {
      this.getProBulidingFunc(true)
    },
    // 刷新楼栋信息后，重新加载刷新前选择的楼栋及房间信息
    reloadBuildRooms() {
      // 判断是否已选择楼栋
      if (isEmpty(this.curUnitData)) return
      console.log('reloadBuildRooms this.curUnitData', this.curUnitData)
      // const projectId = this.curUnitData.projectId
      // this.treeExpandedIds = Array.of(projectId)
      this.loadBuildingRooms(this.curUnitData)
    },
    // 添加楼栋处理
    addBuildingHandle(data) {
      const _obj = {
        projectData: data,
        allUnitData: this.allUnitData
      }
      this.$refs.addBuildingCom.resetDataProperty(_obj)
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
            type: 'success',
            showClose: true
          })
          this.$refs.projectTree.remove(data)
          if (buildingId === this.curUnitData.id) {
            this.curUnitData = {}
            this.floorsRoomsData = []
          }
        })
      }).catch(() => {
        console.log('cancel delete')
      })
    },
    // 加载选择楼栋的房间信息
    loadBuildingRooms(data) {
      if (data.level === 0) return
      this.isGetBuildLoading = true
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
        let maxRoomLength = 0
        let roomCount = 0
        // 处理所有数据，筛选出楼层数据以及房间数据
        _data.forEach(item => {
          if (item.parentId === '-1') {
            _floorData.push(item)
            if (_roomsData[item.id] === undefined) {
              _roomsData[item.id] = []
            }
          } else {
            roomCount === 0 ? roomCount++ : roomCount
            const curParentId = item.parentId
            const index = Object.keys(_roomsData).indexOf(curParentId)
            if (index >= 0) {
              _roomsData[curParentId].push(item)
              if (_roomsData[curParentId].length > maxRoomLength) {
                maxRoomLength = _roomsData[curParentId].length
              }
            } else {
              _roomsData[curParentId] = Array.of(item)
            }
          }
        })
        // 根据楼层的最大房间数，未达到该数量用虚拟数据填充，然后根据虚拟数据渲染添加房间按钮
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
        this.floorsRoomsData = _floorData
        this.isUnitHasRooms = Boolean(roomCount)
        this.isGetBuildLoading = false
      })
    },
    // 添加楼层处理
    addFloorHandle(data) {
      this.isAddFloorShow = true
    },
    // 设置平面图处理
    setPlanHandle(data) {
      const _obj = {
        projectId: this.curUnitData.projectId,
        setRoomDatas: Array.of(data)
      }
      this.$refs.setPlanCom.resetDataProperty(_obj)
      this.isSetPlanShow = true
    },
    // 批量设置平面图处理
    setPlanBatchHandle(data, index) {
      let _setPlanDatas = []
      if (data.parentId === '-1' && index === 0) {
        _setPlanDatas = this.floorsRoomsData
      } else {
        this.floorsRoomsData.forEach(item => {
          _setPlanDatas.push(item.children[index])
        })
      }
      const _obj = {
        projectId: this.curUnitData.projectId,
        setRoomDatas: _setPlanDatas
      }
      this.$refs.setPlanCom.resetDataProperty(_obj)
      this.isSetPlanShow = true
    },
    // 批量添加房间操作
    addRoomBatchHandle() {
      const _obj = {
        floorData: this.floorsRoomsData
      }
      this.$refs.addRoomCom.resetDataProperty(_obj)
      this.isAddRoomShow = true
    },
    // 添加房间操作处理
    addRoomHandle(data) {
      const _obj = {
        floorData: Array.of(data)
      }
      this.$refs.addRoomCom.resetDataProperty(_obj)
      this.isAddRoomShow = true
    },
    // 生成房间操作处理
    buildRoomsHandle() {
      const _data = {
        unitFormData: this.curUnitData,
        roomsData: this.floorsRoomsData,
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
            this.reloadBuildRooms()
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
          this.reloadBuildRooms()
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
          this.reloadBuildRooms()
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
    .building-empty {
        text-align: center;
        color: #d2cfcf;
        padding: 60px 0;
        font-size: 22px;
        letter-spacing: 4px;
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
                      overflow: hidden;
                      text-overflow: ellipsis;
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
    display: inline-block;
    width: 100%;
    font-size: 14px;
    .tree-item-name {
      display: inline-block;
      width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: top;
    }
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
