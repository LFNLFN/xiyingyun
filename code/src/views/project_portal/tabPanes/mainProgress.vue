<template>
  <el-container>
    <el-header>
      <h3>主体进度</h3>
      <div>
        <el-select
          v-model="processSelected"
          clearable
          size="small"
          placeholder="请选择工序">
          <el-option
            v-for="item in processItemDatas"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
      </div>
    </el-header>
    <el-main v-loading="processLoading">
      <div class="legend-wrap">
        <span
          v-for="item in checkedProcessItemDatas"
          :key="item.id"
          class="legend-item">
          <span
            v-if="item.value && item.value !== ''"
            :style="{'background': `#${item.value}`}"
            class="color-icon" />
          <span
            v-else
            :style="{'background': `${processAcceptedColor}`}"
            class="color-icon" />
          <span class="legend-text">{{ item.text || item.name }}</span>
        </span>
      </div>
      <div
        v-for="item in progressProjectData"
        :key="item.id"
        class="section-info-container">
        <template v-if="item.level === 3">
          <h4 class="seection-name">{{ item.name }}</h4>
        </template>
        <template v-else>
          <h4 class="seection-name">其他</h4>
        </template>
        <div class="section-building-wrap">
          <div
            v-for="build in item.unitEntityList"
            :key="build.id"
            class="building-wrap"
            @click="toProgressDetails(build)">
            <template v-if="build.roomList && build.roomList.length > 0">
              <MainBuilding
                :room-list="build.roomList"
                :process-items="presetProcessItemDatas" />
            </template>
            <div class="building-info-wrap">
              <p>{{ build.name }}</p>
              <p>({{ build.presaleFloorCount }}) 层</p>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { getDictionaryItem } from '@/api/dictionary'
import { acceptDefault, processAccepted } from '@/styles/variables.scss'
import { getProcessItem, getMainProgress } from '@/api/project_portal/index'
import MainBuilding from '@/views/project_portal/renderCom/mainBuilding'
export default {
  components: { MainBuilding },
  data() {
    return {
      acceptDefaultColor: acceptDefault,
      processAcceptedColor: processAccepted,
      processSelected: '',
      projectData: {}, // 项目数据
      processItemDatas: [], // 所有工序项数据
      presetProcessItemDatas: [], // 预设工序项数据
      checkedProcessItemDatas: [], // 选中工序项数据
      mainProgressData: {}, // 主题进度数据
      progressProjectData: [], // 主题进度的项目数据
      processLoading: true
    }
  },
  watch: {
    projectData: function(newVal) {
      if ('projectId' in newVal) {
        this.pageInit()
      }
    },
    processSelected: function(newVal) {
      if (newVal === '') {
        this.checkedProcessItemDatas = this.presetProcessItemDatas
      } else {
        let target
        target = this.presetProcessItemDatas.find(item => {
          return item.describe === newVal
        })
        if (target === undefined) {
          console.log('processItemDatas', this.processItemDatas)
          target = this.processItemDatas.find(item => {
            return item.id === newVal
          })
        }
        this.checkedProcessItemDatas = Array.of(target)
      }
      this.getMainProgressFunc()
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this.$set(this, key, obj[key])
      })
    },
    async pageInit() {
      // 获取工序项
      await getProcessItem().then(resp => {
        this.$set(this, 'processItemDatas', resp.result)
      })
      // 获取预设工序
      await this.getPresetProcessItem()
      // 获取主体进度数据
      await this.getMainProgressFunc()
    },
    // 获取预设工序项处理
    getPresetProcessItem() {
      const params = {
        'terms[0].column': 'dictId',
        'terms[0].value': 'subjectProcessAcceptItem'
      }
      return new Promise((resolve, reject) => {
        getDictionaryItem(params).then(resp => {
          this.$set(this, 'presetProcessItemDatas', resp.result)
          this.$set(this, 'checkedProcessItemDatas', resp.result)
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    // 获取主体进度详情
    getMainProgressFunc() {
      const projectId = this.projectData.id
      const acceptItemId = this.processSelected
      // 重置数据
      this.processLoading = true
      this.$set(this, 'mainProgressData', [])
      this.$set(this, 'progressProjectData', [])
      return new Promise((resolve, reject) => {
        getMainProgress(projectId, acceptItemId).then(resp => {
          const data = resp.result
          this.$set(this, 'mainProgressData', data)
          this.$set(this, 'progressProjectData', data.children)
          this.processLoading = false
          resolve()
        }).catch(() => {
          this.processLoading = false
          reject()
        })
      })
    },
    toProgressDetails(data) {
      const unitId = data.id
      this.$router.push({ name: 'buildingProcessDetail', query: { unitId: unitId, unitName: data.name }})
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.el-container {
  margin-bottom: 15px;
  border-radius: 8px;
  background: #fff;
  .el-header{
    border-bottom: 1px solid #ccc;
    @include flex-layout(space-between, center, null, null);
    &/deep/ .date-select {
      width: 250px;
    }
  }
  .el-main {
    min-height: 400px;
    .legend-wrap {
      padding: 15px 10px;
      .legend-item {
        display: inline-block;
        width: 250px;
        padding: 0 15px;
        margin: 6px 0;
        .color-icon {
          display: inline-block;
          width: 12px;
          height: 12px;
          vertical-align: text-top;
        }
        .legend-text {
          font-size: 14px;
          display: inline-block;
          width: calc( 100% - 25px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          letter-spacing: 2px;
        }
      }
    }
    .section-info-container {
      padding: 1px;
      .seection-name {
        border-left: 3px solid #009dff;
        padding-left: 10px;
      }
      .section-building-wrap {
        height: auto;
        @include flex-layout(flex-start, flex-end, row, wrap);
        .building-wrap {
          width: 20%;
          min-width: 90px;
          padding: 0 5px;
          font-size: 0;
          &/deep/ .building-item-warp {
            width: 80px;
            cursor: pointer;
            margin: 40px auto 20px auto;
            position: relative;
            .building-top {
              position: absolute;
              top: -34px;
              left: 8px;
              width: 65px;
              height: 50px;
              background: #f8f7f7;
              transform: rotateX(55deg) rotate(-35deg);
              perspective: 200;
            }
            .building-left, .building-right {
              height: auto;
              display: inline-block;
              padding: 3px 2px 10px 2px;
              .floor-wrap {
                width: 100%;
                height: 12px;
                font-size: 0;
                @include flex-layout(flex-start, center, null, nowrap);
                .room-item {
                  display: block;
                  width: 6px;
                  height: 7px;
                  background: #fff;
                  margin: 0 1px;
                }
              }
            }
            .building-left {
              width: 35%;
              background: #ccc;
              transform: skewY(35deg);
            }
            .building-right {
              width: 65%;
              background: #e6e6e6;
              transform: skewY(-20deg);
            }
          }
          .building-info-wrap {
            padding: 1px;
            font-size: 14px;
            p {
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin: 8px 0 0px 0;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
