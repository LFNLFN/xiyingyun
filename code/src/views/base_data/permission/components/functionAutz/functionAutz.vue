<template>
  <div class="funcAtuz-content" v-loading="listLoading">
    <div class="warm-tip">---温馨提示：页面权限设置完毕后请刷新页面启用新的权限设置。---</div>
    <checkItem
      :module-msg-obj="rolesPermissionList['公共管理']"
      :title="'公共管理'"
      :current-role="currentRole"
    />
    <checkItem
      :module-msg-obj="rolesPermissionList['工程管理']"
      :title="'工程管理'"
      :current-role="currentRole"
    />
    <checkItem
      :module-msg-obj="rolesPermissionList['APP端']"
      :title="'APP端'"
      :current-role="currentRole"
    />
  </div>
</template>
<script>
import { getRolesPermissionList } from "@/api/base_data/permission.js";
import checkItem from "@/views/base_data/permission/components/functionAutz/allCheckbox";
export default {
  components: { checkItem },
  props: {
    currentRole: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      rolesPermissionList: {},
      listLoading: false
    };
  },
  watch: {
    currentRole: function(newVal) {
      this.listLoading = true;
      console.log("newVal: ", newVal);
      getRolesPermissionList(newVal.id)
        .then(resp => {
          console.log("rolelist: ", resp.result);
          this.rolesPermissionList = resp.result;
          this.listLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.listLoading = false;
          this.$message.error("请重试");
        });
    }
  }
};
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.funcAtuz-content {
  padding: 20px;
  padding-top: 0;
}
.warm-tip {
  font-size: 14px;
}
</style>
