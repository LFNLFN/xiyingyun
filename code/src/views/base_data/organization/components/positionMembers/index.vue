<template>
  <div class="container-shadow">
    <transition name="slide-fade" @after-leave="leaveHandle">
      <el-container v-show="boxShow" class="container">
        <el-header height="50px" class="header-wrap">
          <div class="item-warp">
            <span :class="{'is-active': currentComponent === 'Members'}" class="item-tag">人员</span>
            <!-- <span :class="{'is-active': currentComponent === 'Warrant'}" class="item-tag">项目授权</span> -->
          </div>
          <span><i class="el-icon-close" @click="closeBox" /></span>
        </el-header>
        <el-main>
          <component v-bind="$attrs" :is="currentComponent" v-on="$listeners" />
        </el-main>
      </el-container>
    </transition>
  </div>
</template>
<script>
import Members from '@/views/base_data/organization/components/PositionMembers/members'
export default {
  components: { Members },
  props: {
    isBoxShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentComponent: 'Members',
      boxShow: false
    }
  },
  watch: {
    isBoxShow: function(newVal) {
      this.boxShow = newVal
    }
  },
  methods: {
    closeBox() {
      this.boxShow = false
      // this.$emit('closeBox')
    },
    leaveHandle(el) {
      this.$emit('closeBox')
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.container-shadow {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: rgba(255, 255, 255,.4);
}
.container {
  float: right;
  width: 680px;
  height: calc(100% - 52px);
  margin-top: 52px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  overflow: hidden;
  .header-wrap {
    background: #fff;
    padding: 0 10px 0 0;
    border-bottom: 1px solid #ccc;
    @include flex-layout(space-between, center, null, null);
    .item-warp {
      height: 100%;
      .item-tag {
        padding: 0 15px;
        display: inline-block;
        height: 100%;
        line-height: 50px;
        cursor: pointer;
        &.is-active {
          border-bottom: 2px solid #03A9F4;
          color: #03A9F4;
          margin-top: 1px;
        }
      }
    }
    i {
      cursor: pointer;
      float: right;
      font-size: 20px;
      font-weight: bold;
    }
  }
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(680px);
}
</style>
