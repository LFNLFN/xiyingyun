<template>
  <div class="check-flex">
    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkedAllPermission"
      @change="handleCheckAllChange"
    >
      <span class="page-name">{{ pageMsgObj.name }}</span>
    </el-checkbox>
    <el-checkbox-group v-model="checkedPermission" @change="handleCheckedCitiesChange">
      <el-checkbox
        :label="subItem.id"
        v-for="(subItem) in pageMsgObj.actions"
        :key="subItem.id"
      >{{ subItem.describe }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
import {
  rolesPermissionBinding,
  cancelRolesPermissionBinding
} from "@/api/base_data/permission.js";
export default {
  props: {
    pageMsgObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    currentRole: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      isIndeterminate: true,
      checkedPermission: [],
      allPermission: [],
      checkedAllPermission: false
    };
  },
  watch: {
    pageMsgObj: {
      handler(newVal) {
        console.log('newVal: ', newVal)
        this.allPermission = [];
        this.checkedPermission = [];
        newVal.actions.forEach(e => {
          this.allPermission.push(e.id);
          if (e.isCheck === 1) {
            this.checkedPermission.push(e.id);
          }
        });
        if (this.checkedPermission.length > 0) {
          if (this.checkedPermission.length === this.allPermission.length) {
            this.checkedAllPermission = true;
            this.isIndeterminate = false;
          } else {
            this.checkedAllPermission = false;
            this.isIndeterminate = true;
          }
        } else if (this.checkedPermission.length === 0) {
          this.checkedAllPermission = false;
          this.isIndeterminate = true;
        }
        console.log("this.checkedPermission", this.checkedPermission);
      },
      immediate: true
    }
  },
  methods: {
    handleCheckAllChange(val) {
      if (val) {
        this.checkedPermission = this.allPermission;
        this.isIndeterminate = false;
        rolesPermissionBinding({
          roleId: this.currentRole.id,
          paramArr: this.allPermission
        });
      } else {
        this.checkedPermission = [];
        this.isIndeterminate = true;
        cancelRolesPermissionBinding({
          roleId: this.currentRole.id,
          paramArr: this.allPermission
        });
      }
    },
    async handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      this.checkedAllPermission = checkedCount === this.allPermission.length;
      this.isIndeterminate =
        checkedCount >= 0 && checkedCount < this.allPermission.length;
      this.checkedPermission = value;
      await cancelRolesPermissionBinding({
        roleId: this.currentRole.id,
        paramArr: this.allPermission
      });
      await rolesPermissionBinding({
        roleId: this.currentRole.id,
        paramArr: this.checkedPermission
      });
    }
  }
};
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.page-name {
  font-weight: bold;
}
.check-flex {
  @include flex-layout(space-between, center, null, null);
}
</style>
