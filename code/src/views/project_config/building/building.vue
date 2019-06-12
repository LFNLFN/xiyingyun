<template>
  <el-container>
    <el-aside>
      <div class="side-wrap">
        <div class="header">
          <span>楼栋列表</span>
        </div>
        <div class="side-content-wrap">
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
            :render-content="treeContRender"
            node-key="id"
            class="project-tree"/>
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
              <el-button size="mini" @click="(evt) => addRoomsHandle()">生成房间</el-button>
            </div>
          </div>
          <div class="building-floor">
            <div class="floor-wrap">
              <div class="title-text">楼层</div>
              <el-button type="primary" size="mini" class="column-set-btn">整列设置</el-button>
              <div class="floor-item-wrap">
                <div class="left-side">
                  <el-input />
                  <div class="floor-name">1层</div>
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
            <div class="room-wrap">
              <div class="title-text">房间</div>
              <el-button type="primary" size="mini" class="column-set-btn">整列设置</el-button>
              <div class="floor-item-wrap">
                <div class="left-side">
                  <el-input />
                  <div class="floor-name">1层</div>
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
    </el-main>
    <addBuilding
      v-show="isAddBuildingShow"
      :project-data="curProjectState"
      :is-add-building-show.sync="isAddBuildingShow" />
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
import { mapActions } from 'vuex'
import { getBuliding, delBuliding } from '@/api/project_config/building'
import { getRooms } from '@/api/project_config/building'
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
        // const curProjectIds = []
        // const curProName = curProject.name
        // const stages = curProject.childrenWithDetail
        // this.curProject = curProject
        // if (stages && stages.length > 0) {
        //   const _treeData = []
        //   stages.forEach(item => {
        //     curProjectIds.push(item.id)
        //     _treeData.push({
        //       id: item.id,
        //       name: `${curProName}-${item.name}`,
        //       level: 0,
        //       children: []
        //     })
        //   })
        //   this.$set(this, 'projectTreeData', _treeData)
        //   this.getBulidingFunc(curProjectIds)
        // } else {
        //   this.$set(this, 'projectTreeData', [])
        // }
      }
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
    // 填写完楼栋信息后，转到添加房间组件，编辑楼栋相关信息
    addRoomsHandle() {
      this.isAddRoomsShow = true
    },
    // 删除楼栋
    delBuildingHandle(data) {
      const id = data.id
      const name = data.name
      this.$confirm(`确定删除 ${name} ?`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(flag => {
        delBuliding(id).then(resp => {
          this.$message({
            message: '删除楼栋成功',
            type: 'success'
          })
          // this.reloadBuilding()
          this.$refs.projectTree.remove(data)
        })
      }).catch(() => {
        console.log('cancel delete')
      })
    },
    // 加载选择楼栋的房间信息
    loadBuildingRooms(data) {
      console.log('data', data)
      const unitId = data.unitId
      this.curUnitData = data
      const params = {
        'terms[0].column': 'unitId',
        'terms[0].value': unitId
      }
      console.log('params', params)
      getRooms(params).then(resp => {
        console.log('get rooms resp', resp)
        this.curRoomsData = resp.result
        const _data = resp.result.filter(item => {
          if (item.parentId === '-1' || item.parentId === -1) {
            return true
          }
        })
        console.log('_data', _data)
      })
    },
    // 下拉菜单点击处理
    handleDropdown(order, data) {
      switch (order) {
        case 'addBuilding':
          this.addBuildingHandle(data)
          break
        case 'editBuilding':
          this.editBuildingHandle(data)
          break
        case 'delBuilding':
          this.delBuildingHandle(data)
          break
      }
    },
    // 供应商树渲染函数
    treeContRender(h, { node, data, store }) {
      const roleData = data
      if (data.level === 0) {
        return (
          <span class='custom-tree-node'>
            <span>{roleData.name}</span>
            <span>
              <el-dropdown size='small' on-command={(order) => this.handleDropdown(order, roleData)}>
                <span class='el-icon-s-tools tree-icon-btn' />
                <el-dropdown-menu slot='dropdown'>
                  <el-dropdown-item command='addBuilding'>新增楼栋</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>
        )
      } else if (data.level === 1) {
        return (
          <span class='custom-tree-node' on-click={() => this.loadBuildingRooms(roleData)}>
            <span>
              <span class='el-icon-office-building' />
              {roleData.name}
            </span>
            <span>
              <el-dropdown size='small' on-command={(order) => this.handleDropdown(order, roleData)}>
                <span class='el-icon-s-tools tree-icon-btn' />
                <el-dropdown-menu slot='dropdown'>
                  <el-dropdown-item command='editBuilding'>编辑楼栋</el-dropdown-item>
                  <el-dropdown-item command='delBuilding'>删除楼栋</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>
        )
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
      padding: 20px;
      .building-wrap-header {
        padding: 10px;
        @include flex-layout(space-between, center, null, nowrap);
        .building-name {
          font-weight: bold;
        }
      }
      .building-floor {
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
          }
          .floor-item-wrap {
            width: 110px;
            height: 70px;
            margin: 5px 5px 0 0;
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
                text-align: center;
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
                  text-align: center;
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
              text-align: center;
              float: right;
              background: #ccc;
              color: #fff;
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
      // background: #daecfe;
      // border-radius: 5px;
      .tree-icon-btn {
        display: inline-block;
      }
    }
  }
}
</style>
