<template>
  <publicPopups width="650px" title-text="验收详情" v-on="$listeners" @closePopupsBox="closeBox">
    <template slot="main-content">
      <div v-loading="isLoading" class="mian-container">
        <div class="status-wrap">
          <span
            :style="{ 'color': acceptStatusColors[Number(acceptDetailData.status)] }"
            class="status">
            <i class="el-icon-s-opportunity" />
            {{ acceptDetailData.statusName }}
          </span>
          <span class="btn-wrap">
            <el-button type="danger" size="small" @click="invalidHandle(acceptDetailData)">作废</el-button>
          </span>
        </div>
        <div class="process-info-wrap">
          <div class="process-info-item">
            <label>项目名称: </label>
            <div class="process-info">{{ acceptDetailData.projectName }}</div>
          </div>
          <div class="process-info-item">
            <label>工序验收项: </label>
            <div class="process-info">{{ acceptDetailData.acceptItemName }}</div>
          </div>
          <div class="process-info-item">
            <label>部位: </label>
            <div class="process-info">{{ acceptDetailData.partName }}</div>
          </div>
          <div class="process-info-item">
            <label>申报人: </label>
            <div
              v-if="acceptDetailData.applyPersonEntity"
              class="process-info">{{ acceptDetailData.applyPersonEntity.name }}</div>
          </div>
          <div class="process-info-item">
            <label>施工单位: </label>
            <div class="process-info">{{ acceptDetailData.orgName }}</div>
          </div>
          <div class="process-info-item">
            <label>验收人: </label>
            <div class="process-info">
              <span
                v-for="(item, idx) in acceptDetailData.acceptPersonList"
                :key="idx"
                class="text-span" >{{ item.name }}</span>
            </div>
          </div>
          <div class="process-info-item">
            <label>抄送人: </label>
            <div class="process-info">
              <span
                v-for="(item, idx) in acceptDetailData.ccPersonList"
                :key="idx"
                class="text-span" >{{ item.name }}</span>
            </div>
          </div>
        </div>
        <div
          v-for="(item, idx) in acceptDetailData.acceptItemEntityList"
          :key="idx"
          class="process-info-wrap">
          <div class="info-wrap">
            <p class="title">{{ idx + 1 }}、{{ item.name }}</p>
            <p class="content">{{ item.content }}</p>
          </div>
          <div
            v-for="(child, cidx) in item.processAcceptDetailEntityList"
            :key="cidx"
            :class="{'no-border-bottom': item.processAcceptDetailEntityList.length === cidx + 1}"
            class="accept-info-wrap">
            <div class="accept-info">
              <span
                :class="setAcceptStutasClassName(child.personStatus)"
                class="accept-tag">{{ child.personStatusName }}</span>
              <span class="user-date-info">{{ child.personDate }} {{ child.personName }}</span>
            </div>
            <div
              v-if="child.content && content !== ''"
              class="reject-content">
              {{ child.conten }}
            </div>
            <ul
              v-if="child.acceptItemImage !== undefined && child.acceptItemImage !== ''"
              class="photo-list">
              <li
                v-for="(imgItem, imgIdx) in child.acceptItemImage.split(',')"
                :key="imgIdx">
                <img
                  :src="GetOssImgFullPath(imgItem)"
                  @click="showPhotoZoom(child.acceptItemImage)" >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer-content">
      <el-button type="primary" size="small" class="close-box-btn" @click="closeBox">关闭</el-button>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { getProcessAcceptDetail, invalidProcessAccept } from '@/api/quality/processAcceptance'
export default {
  components: { PublicPopups },
  props: {
    isAcceptDetailShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      acceptData: {}, // 保存要查看的工序验收项数据
      acceptDetailData: {},
      acceptStatusColors: [],
      isLoading: false
    }
  },
  watch: {
    isAcceptDetailShow: function(newVal) {
      if (!newVal) return
      this.getDetail()
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this[key] = obj[key]
      })
    },
    // 设置验收状态
    setAcceptStutasClassName(status) {
      if ([0, 2].includes(Number(status))) {
        return 'success'
      } else if ([1, 3].includes(Number(status))) {
        return 'failed'
      }
    },
    // 获取工序验收项详情
    getDetail() {
      this.isLoading = true
      const processId = this.acceptData.id || ''
      getProcessAcceptDetail(processId).then(resp => {
        console.log('resp', resp)
        this.$set(this, 'acceptDetailData', resp.result)
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    // 工序验收项作废操作处理
    invalidHandle(data) {
      const processId = data.id
      this.$confirm('作废工序项，请确认操作', '警告', {
        confirmButtonText: '确定作废',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        if (action) {
          this.isLoading = true
          invalidProcessAccept(processId).then(resp => {
            this.getDetail()
            this.isLoading = false
            this.$emit('refreshProcessData')
          }).catch(() => {
            this.isLoading = false
          })
        }
      })
    },
    // 查看图片操作
    showPhotoZoom(datas) {
      const imageDataList = []
      const dataList = datas.split(',')
      dataList.forEach(item => {
        imageDataList.push({
          imgSrc: item
        })
      })
      this.$emit('toPhotosZoom', imageDataList)
    },
    closeBox() {
      this.$emit('update:isAcceptDetailShow', false)
      this.acceptData = {}
      this.acceptDetailData = {}
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
@import 'src/styles/variables.scss';

.mian-container {
  margin-top: 20px;
  padding: 0 20px;
  color: #495060;
  .status-wrap  {
    @include flex-layout(space-between, center, null, null);
    .status {
      color: #ffbf00;
      &.pass {
        color: #4caf50;
      }
    }
  }
  .process-info-wrap {
    margin-bottom: 25px;
    font-size: 14px;
    .process-info-item {
      margin: 12px 0;
      label {
        width: 90px;
        text-align: right;
        display: inline-block;
        vertical-align: top;
      }
      .process-info {
        width: calc(100% - 105px);
        padding-left: 15px;
        display: inline-block;
        font-size: 12px;
        line-height: 15px;
        .text-span {
          margin-right: 8px;
        }
      }
    }
  }
  .process-info-wrap {
    padding: 10px 15px;
    margin-top: 20px;
    border: 1px solid #dddee1;
    border-radius: 10px;
    font-size: 14px;
    .info-wrap {
      padding-bottom: 15px;
      border-bottom: 1px solid #dddee1;
      p {
        margin: 5px 0 0 0;
        &.content {
          text-indent: 2em;
        }
      }
    }
    .accept-info-wrap {
      margin-top: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ccc;
      &.no-border-bottom {
        border-bottom: none;
      }
      .accept-info {
        @include flex-layout(space-between, center, null, null);
        .accept-tag {
          font-size: 12px;
          color: #fff;
          padding: 5px 15px;
          border-radius: 15px;
          &.success {
            background: $greenStatus;
          }
          &.failed {
            background: $redStatus;
          }
        }
        .user-date-info {
          font-size: 10px;
        }
      }
      .reject-content {
        margin-top: 15px;
        text-indent: 2em;
      }
      .photo-list {
        margin: 10px 0 0 0;
        padding: 1px;
        list-style: none;
        @include flex-layout(flex-start, center, null, wrap);
        li {
          width: 100px;
          height: 100px;
          margin: 10px 10px 0 10px;
          border: 1px solid #dddee1;
          border-radius: 10px;
          @include flex-layout(center, center, null, wrap);
          img {
            max-width: 98%;
            max-height: 98%;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
