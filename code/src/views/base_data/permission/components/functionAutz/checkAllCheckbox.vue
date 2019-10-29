<template>
  <div class="check-item">
    <div class="module-name">{{ title }}</div>
    <checkSubItem
      v-for="(item) in moduleMsgObj"
      :key="item.id"
      :page-msg-obj="item"
      :current-role="currentRole"
    />
  </div>
</template>
<script>
import checkSubItem from "@/views/base_data/permission/components/functionAutz/oneToFewCheckBox";
export default {
  components: { checkSubItem },
  props: {
    moduleMsgObj: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    currentRole: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
};
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.module-name {
  font-weight: bold;
  font-size: 1em;
  margin: 12px 0;
}
</style>
