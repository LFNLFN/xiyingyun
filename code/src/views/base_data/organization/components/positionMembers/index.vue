<template>
  <LeftSlidePopup :show="boxShow" width="680px" @leaveOver="leaveHandle">
    <el-container slot="main-content" class="container">
      <el-header height="50px" class="header-wrap">
        <div class="item-warp">
          <span :class="{'is-active': currentComponent === 'Members'}" class="item-tag" @click="currentComponent='Members'">人员</span>
          <span :class="{'is-active': currentComponent === 'Warrant'}" class="item-tag" @click="currentComponent='Warrant'">项目授权</span>
         </div>
        <span><i class="el-icon-close" @click="closeBox" /></span>
      </el-header>
      <el-main>
        <Members v-bind="$attrs" v-show="currentComponent==='Members'" v-on="$listeners"/>
        <Warrant v-bind="$attrs" v-show="currentComponent==='Warrant'" v-on="$listeners"/>
        <!-- <component v-bind="$attrs" :is="currentComponent" v-on="$listeners" /> -->
      </el-main>
    </el-container>
  </LeftSlidePopup>
</template>
<script>
import LeftSlidePopup from '@/components/Pop-ups/LeftSlidePopup'
import Members from '@/views/base_data/organization/components/PositionMembers/members'
import Warrant from '@/views/base_data/organization/components/PositionMembers/warrant'
export default {
  components: { LeftSlidePopup, Members, Warrant },
  props: {
    isBoxShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentComponent: 'Members',
      boxShow: false
    }
  },
  watch: {
    isBoxShow: function(newVal) {
      this.boxShow = newVal
      // console.log(newVal,999)
    }
  },
  methods: {
    closeBox() {
      this.boxShow = false
    },
    leaveHandle(el) {
      this.$emit('closeBox')
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.container {
  .header-wrap {
    background: #fff;
    padding: 0 10px 0 0;
    border-bottom: 1px solid #ccc;
    @include flex-layout(space-between, center, null, null);
    .item-warp {
      height: 100%;
      .item-tag {
        padding: 0 15px;
        display: inline-block;
        height: 100%;
        line-height: 50px;
        cursor: pointer;
        &.is-active {
          border-bottom: 2px solid #03A9F4;
          color: #03A9F4;
          margin-top: 1px;
        }
      }
    }
    i {
      cursor: pointer;
      float: right;
      font-size: 20px;
      font-weight: bold;
    }
  }
}
</style>
