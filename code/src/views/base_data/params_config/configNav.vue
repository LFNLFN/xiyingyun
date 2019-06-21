<template>
  <el-container>
    <el-main>
      <div class="header">
        <span class="el-icon-tickets"> 业务参数</span>
      </div>
      <div v-loading="isLoading" class="params-item-wrap">
        <el-row v-for="(item, idx) in paramsItems" :key="idx" type="flex" justify="space-between">
          <el-col>
            <span>{{ item.name }}</span>
          </el-col>
          <el-col :span="2">
            <el-button :disabled="componentDatas[item.id] === undefined" type="primary" size="small" @click="showCurConfigBox(item)">设置</el-button>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { getDictionary } from '@/api/dictionary'
export default{
  props: {
    componentDatas: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      paramsItems: [],
      showComponent: {},
      isLoading: false
    }
  },
  created() {
    console.log('componentDatas', this.componentDatas)
    this.isLoading = true
    getDictionary().then(resp => {
      this.paramsItems = resp.result
      this.isLoading = false
    }).catch(() => {
      this.isLoading = false
    })
  },
  methods: {
    showCurConfigBox(item) {
      this.$emit('changeSowCom', item.id, item)
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
  padding: 20px;
  .el-main {
    @include boxShadow-container;
    .header {
      @include gray-header;
    }
    .params-item-wrap {
      padding: 20px 30px;
      .el-row {
        padding: 0 10px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #c7c6c6;
      }
    }
  }
}
</style>
