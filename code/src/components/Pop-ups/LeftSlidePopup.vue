<template>
  <!-- <div class="container-shadow"> -->
  <transition name="slide-fade" @leave="afterLeaveHandle">
    <div v-show="show" :style="{ width:width }" class="left-slide-container">
      <slot name="main-content" />
    </div>
  </transition>
  <!-- </div> -->
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '500px'
    }
  },
  methods: {
    afterLeaveHandle() {
      this.$emit('leaveOver')
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

// .container-shadow {
//   width: 100vw;
//   height: 100vh;
//   position: fixed;
//   top: 0;
//   left: 0;
//   background: rgba(255, 255, 255,.5);
//   .container {
//     float: right;
//     // height: calc(100vh - 52px);
//     height: 100%;
//     // margin-top: 52px;
//     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
//     background: #fff;
//     overflow: hidden;
//   }
// }
.left-slide-container {
  position: fixed;
  top: $navbarHeight;
  right: 0;
  height: calc(100vh - #{$navbarHeight});
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: #fff;
  overflow: hidden;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100vh);
}
</style>
