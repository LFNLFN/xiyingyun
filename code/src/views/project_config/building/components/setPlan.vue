<template>
  <publicPopups title-text="设置平面图" width="780px" @closePopupsBox="closeBox" @formConfirm="setPlanSubmit">
    <template slot="main-content">
      <div
        v-loading="isGetPlanLoading"
        class="main-wrap">
        <div
          v-for="(item, idx) in allPlanList"
          :key="idx"
          class="plan-item">
          <div class="plan-info-wrap">
            <img :src="GetOssImgFullPath(item.imageUrl)" >
            <span
              :class="{ 'is-checked': planCheckedData.floorPlanId === item.id }"
              class="plan-checkbox"
              @click="checkedPlanHandle(item)">
              <i class="cheked-icon el-icon-check" />
            </span>
          </div>
          <p class="plan-name">{{ item.name }}</p>
        </div>
      </div>
    </template>
  </publicPopups>
</template>
<script>
import { isEmpty } from '@/utils/public'
import { getPlansNoPage } from '@/api/project_config/plan'
import { editRoomsBatch } from '@/api/project_config/building'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  props: {
    isSetPlanShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      projectId: '',
      setRoomDatas: [],
      allPlanList: [],
      planCheckedData: {},
      isGetPlanLoading: false
    }
  },
  watch: {
    isSetPlanShow: function(newVal) {
      if (newVal) {
        this.getPlansFunc()
      }
    }
  },
  methods: {
    resetDataProperty(source) {
      Object.keys(source).forEach(key => {
        this[key] = source[key]
      })
    },
    checkedPlanHandle(data) {
      const planId = data.id
      const roomPlanId = this.planCheckedData.id
      if (planId === roomPlanId) {
        this.$set(this, 'planCheckedData', {})
      } else {
        this.$set(this, 'planCheckedData', data)
      }
      console.log('planCheckedData', this.planCheckedData)
    },
    // 加载平面图
    getPlansFunc() {
      const params = {
        'terms[0].column': 'projectId',
        'terms[0].value': this.projectId
      }
      this.isGetPlanLoading = true
      getPlansNoPage(params).then(resp => {
        const result = resp.result
        // 设置单个房间平面图时，标出已选择的平面图
        if (this.setRoomDatas.length === 1 && this.setRoomDatas[0].floorPlanId) {
          const planSelected = this.setRoomDatas[0].floorPlanId
          const _planCheckedData = result.find(item => {
            return item.id === planSelected
          })
          this.$set(this, 'planCheckedData', _planCheckedData)
        }
        this.isGetPlanLoading = false
        this.$set(this, 'allPlanList', result)
      }).then(() => {
        this.isGetPlanLoading = false
      })
    },
    // 添加平面图
    setPlanSubmit() {
      let planId = ''
      let planName = ''
      this.isGetPlanLoading = true
      if (!isEmpty(this.planCheckedData)) {
        planId = this.planCheckedData.id
        planName = this.planCheckedData.name
      }
      this.setRoomDatas.forEach(room => {
        room.floorPlanId = planId
        room.floorPlanName = planName
      })
      console.log('setRoomDatas', this.setRoomDatas)
      editRoomsBatch(this.setRoomDatas).then(resp => {
        this.$message({
          type: 'success',
          message: '设置平面图成功'
        })
        this.isGetPlanLoading = false
        this.closeBox()
      }).catch(() => {
        this.isGetPlanLoading = false
      })
    },
    closeBox() {
      this.projectId = ''
      this.allPlanList = []
      this.setRoomDatas = []
      this.planCheckedData = {}
      this.$emit('update:isSetPlanShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.main-wrap {
  padding-top: 20px;
  height: 450px;
  overflow: auto;
  border-bottom: 1px solid #ccc;
  .plan-item {
    display: inline-block;
    margin: 10px;
    border: 1px solid #ccc;
    background: #f3eced;
    width: 160px;
    .plan-info-wrap {
      width: 100%;
      height: 160px;
      position: relative;
      @include flex-layout(center, center, null, null);
      img {
        width: 100%;
        height: 100%;
      }
      .plan-checkbox {
        width: 18px;
        height: 18px;
        position: absolute;
        right: 5px;
        top: 5px;
        border: 1px solid #a5a5a5;
        background: #fff;
        text-align: center;
        cursor: pointer;
        .cheked-icon {
          color: #fff;
          font-weight: bold;
          font-size: 14px;
          display: none;
        }
        &.is-checked {
          background: #409eff;
          border-color: #409eff;
          .cheked-icon {
            display: block;
          }
        }
      }
    }
    .plan-name {
      width: 100%;
      height: 25px;
      margin: 0;
      line-height: 25px;
      text-align: center;
      font-size: 14px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
