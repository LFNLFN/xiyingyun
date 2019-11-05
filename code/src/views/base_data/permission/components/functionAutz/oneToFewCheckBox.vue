<template>
  <div class="check-flex">
    <div class="btn-wrap">
      <el-button type="text" v-show="isEditing===false" @click="isEditing=true">修改</el-button>
      <el-button type="text" v-show="isEditing===true" @click="saveEdit">保存</el-button>
      <el-button type="text" v-show="isEditing===true" @click="cancelEdit">取消</el-button>
    </div>
    <div class="left-wrap">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkedAllPermission"
        @change="handleCheckAllChange"
        :disabled="isEditing===false"
      >
        <span class="page-name" style="color: #000">{{ pageMsgObj.name }}</span>
      </el-checkbox>
    </div>
    <el-checkbox-group v-model="checkedPermission" v-show="parentTitle!=='APP端'">
      <el-checkbox
        :label="subItem.id"
        v-for="(subItem) in pageMsgObj.actions"
        :key="subItem.id"
        :disabled="isEditing===false"
      >
        <span style="color: #000">{{ subItem.describe }}</span>
      </el-checkbox>
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
        return {};
      }
    },
    currentRole: {
      type: Object,
      default: () => {
        return {};
      }
    },
    parentTitle: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      isIndeterminate: true,
      initIsIndeterminate: true,
      checkedPermission: [],
      initCheckedPermission: [],
      allPermission: [],
      checkedAllPermission: false,
      isEditing: false
    };
  },
  watch: {
    pageMsgObj: {
      handler(newVal) {
        console.log("newVal: ", newVal);
        this.allPermission = [];
        this.checkedPermission = [];
        newVal.actions.forEach(e => {
          this.allPermission.push(e.id);
          if (e.isCheck === 1) {
            this.checkedPermission.push(e.id);
            this.initCheckedPermission.push(e.id);
          }
        });
        if (this.checkedPermission.length > 0) {
          if (this.checkedPermission.length === this.allPermission.length) {
            this.checkedAllPermission = true;
            this.isIndeterminate = false;
            this.initIsIndeterminate = this.isIndeterminate;
          } else {
            this.checkedAllPermission = false;
            this.isIndeterminate = true;
            this.initIsIndeterminate = this.isIndeterminate;
          }
        } else if (this.checkedPermission.length === 0) {
          this.checkedAllPermission = false;
          this.isIndeterminate = true;
          this.initIsIndeterminate = this.isIndeterminate;
        }
        // console.log("this.checkedPermission", this.checkedPermission);
      },
      immediate: true
    }
  },
  methods: {
    handleCheckAllChange(val) {
      if (val) {
        this.checkedPermission = this.allPermission;
        this.isIndeterminate = false;
        // rolesPermissionBinding({
        //   roleId: this.currentRole.id,
        //   paramArr: this.allPermission
        // });
      } else {
        this.checkedPermission = [];
        this.isIndeterminate = true;
        // cancelRolesPermissionBinding({
        //   roleId: this.currentRole.id,
        //   paramArr: this.allPermission
        // });
      }
    },
    async handleCheckedCitiesChange(value) {
      const msg = this.$message({
        message: "数据加载中",
        type: "info",
        duration: 0
      });
      const checkedCount = value.length;
      this.checkedAllPermission = checkedCount === this.allPermission.length;
      this.isIndeterminate =
        checkedCount >= 0 && checkedCount < this.allPermission.length;
      this.checkedPermission = value;
      let cancelBindingSuccess = true;
      await cancelRolesPermissionBinding({
        roleId: this.currentRole.id,
        paramArr: this.allPermission
      })
        .then(() => {
          msg.close();
        })
        .catch(err => {
          console.log(err);
          cancelBindingSuccess = false;
        });
      if (!cancelBindingSuccess) {
        this.$message.error("操作失败，请重试");
        msg.close();
        return false;
      }
      if (this.checkedPermission.length === 0) {
        return false;
      }
      await rolesPermissionBinding({
        roleId: this.currentRole.id,
        paramArr: this.checkedPermission
      })
        .then(() => {
          this.initCheckedPermission = this.checkedPermission;
          this.initIsIndeterminate = this.isIndeterminate;
          msg.close();
          this.isEditing = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error("操作失败，请重试");
          msg.close();
        });
    },
    cancelEdit() {
      this.isEditing = false;
      this.checkedPermission = this.initCheckedPermission;
      this.initIsIndeterminate = this.isIndeterminate;
    },
    saveEdit() {
      this.isEditing = false;
      // this.checkedPermission = this.initCheckedPermission;
      this.handleCheckedCitiesChange(this.checkedPermission);
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
  @include flex-layout(flex-start, center, null, null);
  margin: 1em 0;
  border-bottom: 1px solid;
}
.left-wrap {
  min-width: 150px;
}
.btn-wrap {
  margin-right: 10px;
}
</style>
