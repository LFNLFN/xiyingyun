<template>
  <el-container class="global-container">
    <el-header>
      <h3>
        {{ buildingName }} 工序验收汇总
        <el-button type="primary" size="mini" @click="backHandle">返回</el-button>
      </h3>
    </el-header>
    <el-main>
      <div class="main-header">
        <el-checkbox-group v-model="professionCheckList">
          <el-checkbox
            v-for="item in professionList"
            :key="item.id"
            :label="item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
        <div class="legend-wrap">
          <ul class="legend-list">
            <li>
              <span class="legend-icon accepted" />
              <span class="text">已验收</span>
            </li>
            <li>
              <span class="legend-icon no-accept " />
              <span class="text">未验收</span>
            </li>
            <li>
              <span class="legend-icon accept-wait" />
              <span class="text">待验收</span>
            </li>
            <li>
              <span class="legend-icon accept-failed" />
              <span class="text">验收不合格</span>
            </li>
          </ul>
        </div>
      </div>
      <ul class="building-wrap">
        <li
          v-for="(acceptItem, aidx) in acceptItemList"
          :key="acceptItem.id" >
          <div
            v-for="(room, ridx) in acceptItem.roomEntityList"
            :key="room.id"
            class="process-wrap" >
            <div class="floor-wrap">
              <template v-if="aidx === 0">
                <span class="floor-name">{{ room.name }}</span>
              </template>
              <span
                :style="{'background': acceptColorDatas[Number(room.acceptStatus)]}"
                class="room-item" />
            </div>
            <div
              v-if="ridx === acceptItem.roomEntityList.length - 1"
              :class="{'first': aidx === 0}"
              class="accept-item-name">{{ acceptItem.name }}</div>
          </div>
        </li>
      </ul>
    </el-main>
  </el-container>
</template>
<script>
import { getProgressCollect } from '@/api/project_portal/index'
import { redStatus, orangeStatus, greenStatus, grayStatus } from '@/styles/variables.scss'
export default {
  data() {
    return {
      buildingName: '', // 保存楼栋名称
      acceptItemList: [],
      professionList: [], // 保存专业数据
      professionCheckList: [], // 保存已选择的专业ID
      progressCollectDatas: [], // 保存专业汇总数据
      acceptColorDatas: {
        0: greenStatus,
        1: grayStatus,
        2: orangeStatus,
        3: redStatus
      }
    }
  },
  watch: {
    professionCheckList: function(newVal) {
      if (newVal.length > 0) {
        this.acceptItemList = []
        this.progressCollectDatas.forEach(item => {
          if (newVal.includes(item.professionalId)) {
            this.acceptItemList.push(...item.acceptItemList)
          }
        })
      }
    }
  },
  created() {
    const unitId = this.$route.query.unitId
    const unitName = this.$route.query.unitName
    this.buildingName = unitName
    getProgressCollect(unitId).then(resp => {
      const data = resp.result
      this.$set(this, 'progressCollectDatas', data)
      data.forEach(item => {
        this.professionList.push({
          id: item.professionalId,
          name: item.professionalName
        })
        this.professionCheckList.push(item.professionalId)
        item.acceptItemList.forEach(accept => {
          accept.roomEntityList.reverse()
        })
      })
    })
  },
  methods: {
    backHandle() {
      this.$router.go(-1)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
@import 'src/styles/variables.scss';

.el-container {
  .accept-failed {
    background: $redStatus;
  }
  .accepted {
    background: $greenStatus;
  }
  .accept-wait {
    background: $orangeStatus;
  }
  .no-accept {
    background: $grayStatus;
  }
  .el-header {
    background: #fff;
    .el-button {
      float: right;
    }
  }
  .el-main {
    background: #fff;
    position: relative;
    margin: 20px;
    .main-header {
      padding: 5px 20px;
      @include flex-layout(space-between, center, null, nowrap);
      &/deep/ .el-checkbox-group {
        .el-checkbox__label {
          font-size: 16px;
          vertical-align: middle;
        }
      }
      .legend-wrap {
        padding: 10px;
        background: #fff;
        border-radius: 10px;
        .legend-list  {
          li {
            display: inline-block;
            margin: 5px 10px;
            .legend-icon {
              display: inline-block;
              width: 20px;
              height: 20px;
              margin-right: 7px;
              vertical-align: middle;
            }
            .text {
              font-size: 14px;
              vertical-align: middle;
            }
          }
        }
      }
    }
    .building-wrap {
      margin: 0;
      padding: 20px;
      list-style: none;
      overflow: auto;
      @include flex-layout(flex-start, flex-start, null, nowrap);
      li {
        margin-right: 5px;
        font-size: 14px;
        .process-wrap {
          margin-bottom: 5px;
          .floor-wrap {
            white-space: nowrap;
            .floor-name {
              display: inline-block;
              width: 45px;
              text-align: center;
            }
            .room-item {
              vertical-align: text-top;
              display: inline-block;
              width: 25px;
              height: 20px;
              // background: #ccc;
            }
          }
          .accept-item-name {
            width: 25px;
            text-align: center;
            margin-top: 10px;
            &.first {
              float: right;
            }
          }
        }
      }
    }
  }
}
</style>
