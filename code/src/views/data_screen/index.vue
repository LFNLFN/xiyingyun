<template>
  <div
    :class="{'is-full-screen': fullScreen}"
    class="iframe-container">
    <iframe
      src="https://datav.aliyuncs.com/share/04d53a8317b1838f9b6726f91bf58bbc"
      scrolling="auto"
      frameborder="0"
      class="frame" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      iframeHeight: '',
      iframeWidth: '',
      sidebar: this.$store.getters.sidebar
    }
  },

  computed: {
    ...mapGetters([
      'fullScreen'
    ])
  },
  watch: {
    fullScreen: function(newVal) {
      if (newVal) {
        this.$message({
          message: '按 esc 可以退出全屏',
          type: 'success',
          duration: 3500,
          showClose: true
        })
      }
    }
  },
  // watch: {
  //   'sidebar.opened': function(newVal) {
  //     setTimeout(() => {
  //       this.handleHeight()
  //     }, 1000)
  //   }
  // },
  mounted() {
    // this.handleHeight()
    // window.addEventListener('resize', () => {
    //   this.handleHeight()
    // })
    window.addEventListener('keydown', (evt) => {
      const code = evt.keyCode
      if (code === 27) {
        this.fullScreenHandle()
      }
    })
  },
  methods: {
    fullScreenHandle() {
      if (this.fullScreen) {
        this.$store.dispatch('ToggleFullScreen')
      }
    }
    // handleHeight() {
    //   const containerWidth = document.querySelector('.iframe-container').offsetWidth
    //   const containerHeight = document.querySelector('.iframe-container').offsetHeight
    //   const height = containerWidth * 0.56
    //   if (containerHeight < height) {
    //     this.iframeHeight = `${containerHeight}px`
    //     this.iframeWidth = `${containerHeight / 0.56}px`
    //   } else {
    //     this.iframeHeight = `${height}px`
    //     this.iframeWidth = '100%'
    //   }
    // }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
@import "src/styles/variables.scss";

.iframe-container {
  width: 100%;
  height: calc(100vh - #{$navbarHeight});
  @include flex-layout(center, center, null, null);
  background: #0f2a42;
  .frame {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }
  &.is-full-screen {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }
}
</style>
