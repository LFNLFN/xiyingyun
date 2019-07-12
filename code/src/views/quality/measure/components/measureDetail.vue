<template>
  <publicPopups
    :main-border="true"
    width="750px"
    title-text="实测实量详情"
    v-on="$listeners"
    @closePopupsBox="closeBox">
    <template slot="main-content">
      <div v-loading="isLoading">
        <div class="info-container">
          <div class="info-wrap">
            <div class="info-item">
              <label>项目名称: </label>
              <div class="info">{{ measureDetailData.projectName }}</div>
            </div>
            <div class="info-item">
              <label>实测实量项: </label>
              <div class="info">{{ measureDetailData.checkItemName }}</div>
            </div>
            <div class="info-item">
              <label>部位: </label>
              <div class="info">{{ measureDetailData.partName }}</div>
            </div>
            <div class="info-item">
              <label>类型: </label>
              <div class="info">{{ measureDetailData.typeName }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="info-item">
              <label>实测人: </label>
              <div class="info">{{ measureDetailData.personName }}</div>
            </div>
            <div class="info-item">
              <label>所属公司: </label>
              <div class="info">{{ measureDetailData.orgName }}</div>
            </div>
            <div class="info-item">
              <label>实测时间: </label>
              <div class="info">{{ measureDetailData.createTime }}</div>
            </div>
            <div class="info-item">
              <label>合格率: </label>
              <div class="info">{{ `${measureDetailData.passingRate}%` }}</div>
            </div>
          </div>
        </div>
        <div v-if="measureDetailData.detailEntityList" class="measure-list">
          <div
            v-for="item in measureDetailData.detailEntityList"
            :key="item.id"
            class="measure-item-warp">
            <p class="item-name">{{ item. detailCheckItemName }}</p>
            <el-row :gutter="10">
              <el-col :span="8">计算点数：{{ item. measuredCount }}</el-col>
              <el-col :span="8">爆点数：{{ item. burstPoint }}</el-col>
              <el-col :span="8">及格率：{{ `${item.passingRate}%` }}</el-col>
            </el-row>
          </div>
        </div>
      </div>
    </template>
    <template slot="footer-content">
      <el-button type="primary" size="small" @click="closeBox">关闭</el-button>
    </template>
  </publicPopups>
</template>
<script>
import { isEmpty } from '@/utils/public'
import { getMeasureDetail } from '@/api/quality/measure'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  data() {
    return {
      measureData: {}, // 保存实测实量数据
      measureDetailData: {}, // 保存实测实量详情数据
      isLoading: false
    }
  },
  watch: {
    measureData: function(newVal) {
      if (!isEmpty(newVal)) {
        this.getDetailFunc()
      }
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this.$set(this, key, obj[key])
      })
    },
    getDetailFunc() {
      const { projectId, unitId, partId, checkItemId } = this.measureData
      const userType = String(this.measureData.type)
      this.isLoading = true
      getMeasureDetail(projectId, unitId, partId, checkItemId).then(resp => {
        const _data = resp.result
        this.measureDetailData = _data[userType]
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    closeBox() {
      this.$emit('update:isMeasureDetailShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.info-container {
  margin-top: 30px;
  padding: 0 30px;
  .info-wrap {
    width: 49%;
    display: inline-block;
    margin-bottom: 25px;
    font-size: 14px;
    .info-item {
      margin: 12px 0;
      label {
        width: 90px;
        text-align: left;
        display: inline-block;
      }
      .info {
        color: #80848f;
        width: calc(100% - 95px);
        text-indent: 12px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.measure-list {
  padding: 0 30px;
  .measure-item-warp {
    padding: 10px;
    border: 1px solid #dddee1;
    border-radius: 5px;
    margin: 10px 0;
    font-size: 14px;
    color: #80848f;
    .item-name {
      color: #000;
      margin: 5px 0 15px 0;
    }
  }
}
</style>
