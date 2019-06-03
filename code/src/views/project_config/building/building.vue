<template>
  <el-container>
    <el-aside>
      <div class="side-wrap">
        <div class="header">
          <span>楼栋列表</span>
        </div>
        <div class="side-content-wrap">
          <el-select v-model="projectSelected" placeholder="请选择项目">
            <el-option value="三水城市花园" />
            <el-option value="市桥城市花园" />
          </el-select>
          <el-tree
            ref="projectTree"
            :data="projectTreeData"
            :props="projectTreeProp"
            :expand-on-click-node="false"
            highlight-current
            current-node-key
            class="project-tree"/>
        </div>
      </div>
    </el-aside>
    <el-main>
      <div class="main-wrap">
        <div class="header">
          <span>楼栋列表</span>
          <div>
            <el-button size="mini" type="primary">新增楼层</el-button>
            <el-button size="mini">生成房间</el-button>
          </div>
        </div>
        <div class="building-wrap">
          <h4>{{ buildingName }}</h4>
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
      </div>
    </el-main>
    <addFloor
      v-show="isAddFloorShow"
      :is-add-floor-show.sync="isAddFloorShow" />
    <addRooms
      v-show="isAddRoomsShow"
      :is-add-rooms-show.sync="isAddRoomsShow" />
    <editRooms
      v-show="isEditRoomsShow"
      :is-edit-rooms-show.sync="isEditRoomsShow" />
  </el-container>
</template>
<script>
import AddFloor from '@/views/project_config/building/components/addFloor'
import AddRooms from '@/views/project_config/building/components/addRooms'
import EditRooms from '@/views/project_config/building/components/editRooms'
export default {
  components: { AddFloor, AddRooms, EditRooms },
  data() {
    return {
      projectTreeData: [],
      projectTreeProp: {
        name: '',
        children: []
      },
      projectSelected: '',
      buildingName: '楼栋一',
      isAddFloorShow: false,
      isAddRoomsShow: false,
      isEditRoomsShow: false
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
          width: 80%;
          margin: 0 10% 20px 10%;
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
      h4 {
        margin-top: 0;
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
</style>
