<template>
  <publicPopups width="750px" title-text="实测实量详情" v-on="$listeners" @closePopupsBox="closeBox">
    <template slot="main-content">
      <div class="info-container">
        <div class="info-wrap">
          <div class="info-item">
            <label>项目名称: </label>
            <div class="info">模拟体验项目</div>
          </div>
          <div class="info-item">
            <label>实测实量项: </label>
            <div class="info">混凝土结构工程</div>
          </div>
          <div class="info-item">
            <label>部位: </label>
            <div class="info">1栋1单元1层101</div>
          </div>
          <div class="info-item">
            <label>类型: </label>
            <div class="info">已标记</div>
          </div>
        </div>
        <div class="info-wrap">
          <div class="info-item">
            <label>实测人: </label>
            <div class="info">王五</div>
          </div>
          <div class="info-item">
            <label>所属公司: </label>
            <div class="info">江苏顺悦建设监理有限公司</div>
          </div>
          <div class="info-item">
            <label>实测时间: </label>
            <div class="info">2019-05-27 15:11:34</div>
          </div>
          <div class="info-item">
            <label>合格率: </label>
            <div class="info">90.91%</div>
          </div>
        </div>
      </div>
      <div class="measure-list">
        <div class="measure-item-warp">
          <p class="item-name">1.截面尺寸</p>
          <el-row :gutter="10">
            <el-col :span="8">计算点数：66</el-col>
            <el-col :span="8">爆点数：8</el-col>
            <el-col :span="8">计算点数：86.63%</el-col>
          </el-row>
        </div>
      </div>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  methods: {
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
