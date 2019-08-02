<template>
  <div class="accept-record-wrap">
    <div class="header">验收记录</div>
    <ul class="record-list">
      <li
        v-for="item in recordList"
        :key="item.id"
        class="record-item">
        <div class="record-info-wrap">
          <i class="user-img el-icon-user-solid"/>
          <p>
            <span class="name-text">{{ item.creatorName }}</span>
            <span class="date-text">{{ item.createTime }}</span>
          </p>
          <p>{{ item.creatorOrgName }}</p>
        </div>
        <p class="record-status">#{{ item.typeName }}</p>
        <p
          v-if="item.content"
          class="problem-content">{{ item.content }}</p>
        <div
          v-if="item.images && item.images !== ''"
          class="photo-list">
          <div
            v-for="(img, imgidx) in String(item.images).split(',')"
            :key="imgidx"
            class="photo-item">
            <img
              :src="GetOssImgFullPath(img)"
              @click="showPhotoZoomHandle(item.images)" >
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    recordList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    // 查看图片操作
    showPhotoZoomHandle(datas) {
      const imageDataList = []
      const dataList = datas.split(',')
      dataList.forEach(item => {
        imageDataList.push({
          imgSrc: item
        })
      })
      this.$emit('toPhotosZoom', imageDataList)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.accept-record-wrap {
  margin-top: 15px;
  .header {
    padding: 8px 0;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
  }
  .record-list {
    list-style: none;
    padding: 0;
    margin: 15px 0 0 0;
    .record-item {
      font-size: 12px;
      color: #80848f;
      width: 100%;
      margin-bottom: 10px;
      padding: 10px 10px 20px 70px;
      border: 1px solid #dddee1;
      border-radius: 5px;
      // box-shadow: 0 0 5px #dddee1;
      .record-info-wrap {
        position: relative;
        .user-img {
          width: 40px;
          height: 40px;
          line-height: 40px;
          background: #d9d9d9;
          border-radius: 50px;
          position: absolute;
          left: -50px;
          top: -3px;
          color: #fff;
          font-size: 26px;
          text-align: center;
        }
        .name-text {
          font-size: 16px;
        }
        .date-text {
          float: right;
        }
      }
      p {
        margin: 7px 0;
        &.record-status {
          color: #5cadff;
        }
      }
      .photo-list {
        @include flex-layout(flex-start, flex-start, null, wrap);
        .photo-item {
          width: 80px;
          height: 65px;
          border: 1px solid #dddee1;
          border-radius: 5px;
          margin: 10px 10px 0 0;
          padding: 10px;
          @include flex-layout(center, center, null, null);
          img {
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
