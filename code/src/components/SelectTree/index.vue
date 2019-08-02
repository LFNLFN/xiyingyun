<template>
  <div :style="{'width': width + 'px'}" class="select-tree">
    <el-popover
      :width="width"
      class="select-tree_wrap"
      @hide="popoverHideHandle">
      <el-tree
        ref="tree"
        :data="treeData"
        :props="treeProp"
        :expand-on-click-node="false"
        class="select-tree_tree"
        @node-click="nodeClickHandle"/>
      <el-input
        slot="reference"
        :value="value"
        :class="{'active': inputActive, 'nomal': !inputActive}"
        readonly="readonly"
        class="select-tree_input"
        @click.native="iptClickHandle"/>
    </el-popover>
  </div>
</template>
<script>
export default {
  props: {
    width: {
      type: String,
      default: '200'
    },
    prop: {
      type: String,
      default: '200'
    },
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    treeProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputActive: false,
      selectVal: ''
    }
  },
  methods: {
    nodeClickHandle(data, node, com) {
      this.$emit('input', data[this.prop])
    },
    popoverHideHandle() {
      this.inputActive = false
    },
    iptClickHandle() {
      this.inputActive = !this.inputActive
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
.select-tree {
  .select-tree_wrap {
    .select-tree_tree {
      width: 100%;
    }
    .select-tree_input {
      &/deep/ input {
        cursor: pointer;
      }
      &:after {
        content: '';
        cursor: pointer;
        position: absolute;
        top: 50%;
        right: 0px;
        transform: translate(0%, -50%);
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 8px solid #ccc;
        border-right: 8px solid transparent;
      }
      &.nomal {
        // &:after {
        //   right: 0px;
        //   transform: rotate(0);
        //   transition: transform 0.5s;
        // }
      }
      &.active {
        &:after {
          right: 5px;
          transform: rotate(90deg);
          transition: all 0.5s;
        }
      }
    }
  }
}
</style>
