<template>
  <div class="container-shadow" @click="closeBox">
    <div class="img-wrap" @click.stop>
      <template v-if="planData.imageUrl">
        <el-image
          :src="GetOssImgFullPath(planData.imageUrl)"
          fit="scale-down"
          class="plan-img"
          @load="imgLoadedHandle" />
        <div class="mark-shadow">
          <div
            :style="{'width': `${markWrapInfo.width}px`, 'height': `${markWrapInfo.height}px`}"
            class="mark-wrap">
            <span
              v-for="(item, idx) in markList"
              :key="idx"
              :style="{'top': `${item.ypoint * markWrapInfo.height}px`, 'left': `${item.xpoint * markWrapInfo.width}px`}"
              class="mark-icon" />
          </div>
        </div>
      </template>
    </div>
    <span class="close-btn" @click="closeBox">
      <i class="el-icon-close" />
    </span>
  </div>
</template>
<script>
import { getCheckProblemPlan } from '@/api/quality/checkProblems'
export default {
  data() {
    return {
      curProblemData: {},
      markList: [],
      planData: {},
      markWrapInfo: {
        width: 0,
        height: 0
      },
      messageEntity: null
    }
  },
  watch: {
    markList: function(newVal) {
      this.getPlanFunc()
      this.messageEntity = this.$message({
        message: '图片拼命加载中...',
        duration: 0
      })
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this[key] = obj[key]
      })
    },
    getPlanFunc() {
      const { partId } = this.curProblemData
      getCheckProblemPlan(partId).then(resp => {
        this.messageEntity.close()
        this.$set(this, 'planData', resp.result)
      }).catch(() => {
        this.messageEntity.close()
      })
    },
    imgLoadedHandle(evt) {
      const target = evt.path[0]
      const _obj = {
        width: target.offsetWidth,
        height: target.offsetHeight
      }
      this.$set(this, 'markWrapInfo', _obj)
    },
    closeBox() {
      this.$emit('update:isShowPlanMarkShow', false)
      this.messageEntity = null
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.container-shadow {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0,.7);
  @include flex-layout(center, center, null, null);
  .img-wrap {
    position: relative;
    @include flex-layout(flex-start, flex-start, null, null);
    .plan-img {
      width: 90%;
      height: 90%;
    }
    .mark-shadow {
      position: absolute;
      top: 0;
      left: 0;
      .mark-wrap {
        position: relative;
        .mark-icon {
          width: 10px;
          height: 10px;
          border-radius: 20px;
          background: #f00;
          position: absolute
        }
      }
    }
  }
  .close-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    cursor: pointer;
    color: #f00;
    font-size: 36px;
    z-index: 9999;
  }
}
</style>
