<template>
  <div :style="{'width': width + 'px'}" class="select-tree">
    <el-popover
      :width="width"
      class="select-tree_wrap">
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
        :class="{'active': inputActive}"
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
      default: '200px'
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
      organizationData: [], // 保存所有公司信息
      organTreeProp: {
        label: 'name',
        children: 'children'
      },
      inputActive: false,
      selectVal: ''
    }
  },
  methods: {
    nodeClickHandle(data, node, com) {
      // this.value = data.name
      this.$emit('input', data.name)
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
.el-popover {
  width: 300px;
}
</style>
