<template>
  <div class="container-shadow" />
</template>
<script>
export default {
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
  z-index: 1999;
  background: rgba(0, 0, 0,.5);
  @include flex-layout(center, center, null, null);
}
</style>
