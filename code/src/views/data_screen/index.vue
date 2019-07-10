<template>
  <div class="iframe-container">
    <iframe src="https://datav.aliyuncs.com/share/04d53a8317b1838f9b6726f91bf58bbc" scrolling="auto" frameborder="0" class="frame" />
  </div>
</template>
<script>
export default {
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.iframe-container {
  width: 100%;
  height: calc(100vh - 50px);
  .frame {
    width: 100%;
    height: 100%;
  }
}
</style>
