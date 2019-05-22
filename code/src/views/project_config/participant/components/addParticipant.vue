<template>
  <publicPopups width="650px" title-text="添加参建方" v-on="$listeners" @closePopupsBox="closeBox">
    <template slot="main-content">
      <el-container>
        <el-header height="auto">
          <span>类型: </span>
          <el-select v-model="partTypeSelected" size="small">
            <el-option
              v-for="(item, idx) in partTypeData"
              :key="idx"
              :value="item.name"/>
          </el-select>
        </el-header>
        <el-main />
      </el-container>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { getPartType } from '@/api/project_config/participant'
export default {
  components: { PublicPopups },
  props: {
    isAddParticiShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      partTypeData: [],
      partTypeSelected: ''
    }
  },
  created() {
    getPartType().then(resp => {
      this.partTypeData = resp.result.data
    })
  },
  methods: {
    closeBox() {
      this.$emit('update:isAddParticiShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
  .el-header {
    padding: 25px 30px;
    .el-select {
      width: 300px;
      margin-left: 20px;
    }
  }
}
</style>
