<template>
  <el-switch
    v-model="currentRow.value"
    active-text="是"
    inactive-text="否"
    @change="changeSwitch"
  ></el-switch>
</template>
<script>
export default {
  props: {
    currentRow: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  methods: {
    changeSwitch(val) {
      this.$emit('changeSwitch', this.currentRow)
    }
  }
};
</script>
