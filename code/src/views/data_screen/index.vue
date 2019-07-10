<template>
  <div class="iframe-container">
    <iframe
    :style="{'width': iframeWidth, 'height': iframeHeight}"
    src="https://datav.aliyuncs.com/share/04d53a8317b1838f9b6726f91bf58bbc"
    scrolling="auto"
    frameborder="0"
    class="frame" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      iframeHeight: '',
      iframeWidth: '',
      sidebar: this.$store.getters.sidebar
    }
  },
  watch: {
    'sidebar.opened': function(newVal) {
      this.handleHeight()
    }
  },
  mounted() {
    this.handleHeight()
    window.addEventListener('resize', () => {
      this.handleHeight()
    })
  },
  methods: {
    handleHeight() {
      const containerWidth = document.querySelector('.iframe-container').offsetWidth
      const containerHeight = document.querySelector('.iframe-container').offsetHeight
      const height = containerWidth * 0.56
      if (containerHeight < height) {
        this.iframeHeight = `${containerHeight}px`
        this.iframeWidth = `${containerHeight / 0.56}px`
      } else {
        this.iframeHeight = `${height}px`
        this.iframeWidth = '100%'
      }
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.iframe-container {
  width: 100%;
  height: calc(100vh - 50px);
  @include flex-layout(center, center, null, null);
  background: #0f2a42;
  .frame {
    width: 100%;
    height: 100%;
  }
}
</style>
