<template>
  <div>
    <div class="tree-wrap" v-loading="isLoading">
      <el-tree
        :data="warrantOrgTree"
        :props="{label: 'name',children: 'treeChildren'}"
        node-key="id"
        :default-checked-keys="defaultCheckNode"
        show-checkbox
        @check-change="handleCheckChange"
      ></el-tree>
    </div>
    <p></p>
    <!-- <div class="btn-wrap">
            <el-button type="primary" size="mini" @click="confirmBinding()">确认绑定</el-button>
            <el-button type="danger" size="mini" @click="cancelBinding()">解除绑定</el-button>
    </div>-->
  </div>
</template>
<script>
import {
  getProjectWarrantTree,
  warrantBinding,
  cancelWarrantBinding,
  delPostMember
} from "@/api/base_data/organization";
export default {
  name: "Warrant",
  props: {
    positionData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      warrantOrgTree: [],
      isLoading: false,
      defaultCheckNode: []
    };
  },
  watch: {
    positionData: function(newVal) {
      // console.log(newVal, 22);
      if (newVal.positionId) {
        this.getWarrantTreeFunc(newVal.positionId);
      }
    }
  },
  methods: {
    tableFormatter(row) {
      return this.positionData.name;
    },
    // 获取项目授权的组织列表
    getWarrantTreeFunc(id) {
      this.isLoading = true;
      getProjectWarrantTree(id).then(resp => {
        this.isLoading = false;
        this.warrantOrgTree = resp.result;
        console.log(resp.result);
        // 格式化数据便于渲染树组件
        function formatForTree(arr, defaultCheckNode) {
          arr.map((e, i, s) => {
            if (e.children) {
              if (e.projectEntityList) {
                e.treeChildren = e.children.concat(e.projectEntityList);
              } else {
                e.treeChildren = e.children;
              }
              if (e.autzStatus === 1) {
                defaultCheckNode.push(e.id);
              }
              formatForTree(e.children, defaultCheckNode);
            } else {
              if (e.projectEntityList) {
                if (e.children) {
                  e.treeChildren = e.children.concat(e.projectEntityList);
                  if (e.autzStatus === 1) {
                    defaultCheckNode.push(e.id);
                  }
                  formatForTree(e.children, defaultCheckNode);
                } else {
                  e.treeChildren = e.projectEntityList;
                  if (e.autzStatus === 1) {
                    defaultCheckNode.push(e.id);
                  }
                  formatForTree(e.projectEntityList, defaultCheckNode);
                }
              }
              if (e.autzStatus === 1) {
                defaultCheckNode.push(e.id);
              }
            }
          });
        }
        formatForTree(this.warrantOrgTree, this.defaultCheckNode);
      });
    },
    // 绑定项目授权机构
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
      if (!data.projectId) return;
      let projectIds = [data.projectId];
      data.projectEntityList &&
        data.projectEntityList.forEach((e, i, s) => {
          projectIds.push(e.projectId);
          projectIds.push(e.parentId);
        });
      if (checked) {
        warrantBinding({
          positionId: this.positionData.positionId,
          // projectId: data.projectId
          projectId: projectIds
        }).then(() => {});
      } else {
        cancelWarrantBinding({
          positionId: this.positionData.positionId,
          // projectId: data.projectId
          projectId: projectIds
        }).then(() => {});
      }
    },
    // 移除成员
    deleteMember(row) {
      this.$confirm(`确定移除 ${row.name}？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const positionId = this.positionData.positionId;
          this.isLoading = true;
          delPostMember(positionId, Array.of(row.personId))
            .then(() => {
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
                duration: 3 * 1000
              });
              this.getWarrantTreeFunc(positionId);
            })
            .catch(() => {
              this.isLoading = false;
            });
        })
        .catch(() => {
          console.log("cancel");
        });
    },
    // // 重置数据
    // resetData() {
    //   this.positionData = emptyTarget(this.positionData)
    // },
    // 新增、添加人员按钮点击处理
    emitEvent(event) {
      this.$emit("postMemberEmitEvent", event, this.positionData);
    }
  }
};
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.btn-wrap {
  @include flex-layout(flex-start, center, null, null);
}
</style>
