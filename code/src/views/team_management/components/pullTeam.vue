<template>
  <publicPopups
    width="750px"
    title-text="添加班组"
    v-on="$listeners"
    @formConfirm="bingParticiHandle"
    @closePopupsBox="closeBox"
  >
    <template v-loading="isBoxLoading" slot="main-content">
      <el-container>
        <!-- <el-header height="auto">
          <span>类型: </span>
          <el-select v-model="partTypeSelected" size="small">
            <el-option
              v-for="(item, idx) in partTypeData"
              :key="idx"
              :value="item.value"/>
          </el-select>
        </el-header>-->
        <el-main>
          <el-transfer
            v-model="particiSelected"
            :data="transferData"
            :filter-method="filterSuppliers"
            :titles="['班组列表', '已选']"
            :button-texts="['删除选项', '添加选项']"
            @change="handleChange"
            filterable
            filter-placeholder="请输入班组名称"
          />
        </el-main>
      </el-container>
    </template>
  </publicPopups>
</template>
<script>
import { mapActions } from "vuex";
import { bindParticipant } from "@/api/project_config/participant";
import PublicPopups from "@/components/Pop-ups/PublicPopups";
// import { getPartType } from '@/api/project_config/participant'
export default {
  components: { PublicPopups },
  props: {
    isPullTeamShow: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: String,
      default: ""
    },
    projectParticipantIds: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      // partTypeData: [],
      // partTypeSelected: '',
      suppliersData: [],
      transferData: [],
      particiSelected: [],
      isBoxLoading: false,
      isBindSuccess: false
    };
  },
  watch: {
    isPullTeamShow: function(newVal) {
      if (newVal) {
        this.particiSelected = this.projectParticipantIds;
        this.getOrganizationFunc();
      }
    }
  },
  methods: {
    ...mapActions({
      getOrganization: "getOrganizationData"
    }),
    // 加载供应商信息
    getOrganizationFunc() {
      const type = this.$store.getters.organizationType.suppliers;
      this.getOrganization({ type }).then(resp => {
        this.transferData.splice(0, this.transferData.length);
        resp.forEach(v => {
          this.transferData.push({
            key: v.id,
            label: v.name,
            disabled: false
          });
        });
        this.suppliersData = resp;
      });
    },
    // 根据条件搜索供应商
    filterSuppliers(query, item) {
      return item.label.indexOf(query) > -1;
    },
    // 绑定供应商处理
    bingParticiHandle() {
      if (this.particiSelected.length === 0) {
        // this.closeBox()
        this.$message.error("请选择班组");
        return;
      } else {
        this.isBoxLoading = true;
        bindParticipant(this.projectId, this.particiSelected)
          .then(resp => {
            this.isBindSuccess = true;
            this.isBoxLoading = false;
            this.closeBox();
            this.$message({
              message: "绑定班组成功",
              type: "success"
            });
          })
          .catch(() => {
            this.isBoxLoading = false;
          });
      }
    },
    closeBox() {
      this.particiSelected = [];
      this.$emit("update:isPullTeamShow", false);
      this.$emit("reloadParticipant", this.isBindSuccess);
    },
    handleChange(value, direction, movedKeys) {
      if (direction === "left") {
        this.$emit("teamOperation", "delete", { movedKeys });
      }
      console.log(value, direction, movedKeys);
    }
  }
};
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
  .el-main {
    &/deep/.el-transfer {
      @include flex-layout(center, center, null, null);
      .el-transfer-panel {
        width: 250px;
        .el-transfer-panel__body {
          height: 350px;
          .el-checkbox-group {
            height: 300px;
          }
        }
      }
    }
  }
}
</style>
