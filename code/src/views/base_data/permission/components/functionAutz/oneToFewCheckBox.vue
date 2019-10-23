<template>
    <div class="check-flex">
        <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkedAllPermission"
            @change="handleCheckAllChange"
        >
            <span class="page-name">{{pageMsgObj.name}}</span>
        </el-checkbox>
        <el-checkbox-group v-model="checkedPermission" @change="handleCheckedCitiesChange">
            <el-checkbox
                :label="subItem.id"
                v-for="(subItem) in pageMsgObj.actions"
                :key="subItem.id"
            >{{subItem.describe}}</el-checkbox>
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
      type: Object
    },
    currentRole: {
      type: Object
    }
  },
  watch: {
    pageMsgObj: function(newVal) {
        console.log(this.currentRole)
      this.allPermission = [];
      this.checkedPermission = []
      newVal.actions.forEach(e => {
        this.allPermission.push(e.id);
        if (e.isCheck) {
            this.checkedPermission.push(e.id)
        }
      });
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
  methods: {
    handleCheckAllChange(val) {
      if (val) {
        this.checkedPermission = this.allPermission;
        this.isIndeterminate = false;
        rolesPermissionBinding({
          roleId: this.currentRole.id,
          paramArr: this.checkedPermission
        });
      } else {
        this.checkedPermission = [];
        this.isIndeterminate = true;
        cancelRolesPermissionBinding({
          roleId: this.currentRole.id,
          paramArr: this.checkedPermission
        });
      }
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkedAllPermission = checkedCount === this.allPermission.length;
      this.isIndeterminate = checkedCount >= 0 && checkedCount < this.allPermission.length;
      rolesPermissionBinding({
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