<template>
  <el-container>
    <el-header>
      <h3>主体进度</h3>
      <div>
        <el-select v-model="sectionSelected" size="small">
          <el-option
            value="钢筋工程" />
        </el-select>
      </div>
    </el-header>
    <el-main>
      <div class="section-info-container">
        <h4 class="seection-name">一期一标</h4>
        <div ref="canvasContainer" class="section-building-wrap">
          <div
            v-for="(item, idx) in buildingData"
            :key="idx"
            class="building-wrap"
            @click="toProgressDetails">
            <div class="building-item-warp">
              <div class="building-item">
                <img :src="buildingFloorTop">
                <div
                  v-for="(floor, fidx) in item.floorData"
                  :key="fidx">
                  <img :src="buildingFloorItem" :class="{ 'is-active': floor.compeleted }">
                </div>
              </div>
            </div>
            <div class="building-info-wrap">
              <p>{{ item.name }}</p>
              <p>({{ item.floorData.length }}) 层</p>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      sectionSelected: '钢筋工程',
      buildingData: [
        {
          name: '1栋',
          floorData: [
            {
              compeleted: false
            },
            {
              compeleted: true
            },
            {
              compeleted: false
            },
            {
              compeleted: true
            },
            {
              compeleted: true
            },
            {
              compeleted: false
            },
            {
              compeleted: false
            },
            {
              compeleted: false
            },
            {
              compeleted: false
            }
          ]
        },
        {
          name: '1栋',
          floorData: [
            {
              compeleted: false
            },
            {
              compeleted: true
            },
            {
              compeleted: false
            },
            {
              compeleted: true
            },
            {
              compeleted: true
            }
          ]
        },
        {
          name: '3栋',
          floorData: [
            {
              compeleted: true
            },
            {
              compeleted: true
            },
            {
              compeleted: true
            },
            {
              compeleted: true
            },
            {
              compeleted: true
            },
            {
              compeleted: false
            },
            {
              compeleted: false
            },
            {
              compeleted: false
            },
            {
              compeleted: false
            }
          ]
        }
      ],
      buildingFloorTop: require('@/assets/building_images/floor_top.png'),
      buildingFloorItem: require('@/assets/building_images/floor_item.png'),
      buildingFloorItemDisabled: require('@/assets/building_images/floor_hover.png')
    }
  },
  methods: {
    toProgressDetails() {
      this.$router.push({ name: 'buildingProcessDetail' })
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
          min-width: 80px;
          .building-item-warp {
            width: 80px;
            cursor: pointer;
            margin: 40px auto 0 auto;
            .building-item {
              padding: 10px;
              img {
                width: 100%;
                display: block;
                margin-top: -25%;
                opacity: 0.3;
                &.is-active {
                  opacity: 1;
                }
              }
            }
          }
          .building-info-wrap {
            padding: 1px;
            font-size: 14px;
            p {
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
