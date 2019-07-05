<template>
  <div class="container-shadow" @click="closeBox">
    <el-carousel
      :autoplay="false"
      :loop="false"
      arrow="always"
      trigger="click" >
      <el-carousel-item
        v-for="(item, idx) in photoList"
        :key="idx" >
        <img :src="GetOssImgFullPath(item.imgSrc)" @click.stop>
      </el-carousel-item>
    </el-carousel>
    <span class="close-btn" @click="closeBox">
      <i class="el-icon-close" />
    </span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      photoList: []
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this[key] = obj[key]
      })
    },
    closeBox(evt) {
      this.$emit('update:isPhotosZoomShow', false)
      this.$set(this, 'photoList', [])
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
  // z-index: 2001;
  background: rgba(0, 0, 0,.7);
  @include flex-layout(center, center, null, null);
  .el-carousel {
    width: 100%;
    height: 100%;
    &/deep/ .el-carousel__container {
      width: 100%;
      height: 100%;
      .el-carousel__arrow {
        width: 50px;
        height: 50px;
        font-size: 34px;
        background: rgba(255, 255, 255, .5);
        &:hover {
          background: rgba(255, 255, 255, .8);
        }
      }
      .el-carousel__item {
        width: 100%;
        height: 100%;
        @include flex-layout(center, center, null, null);
        img {
          max-width: 95%;
          max-height: 95%;
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
