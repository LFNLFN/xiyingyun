<template>
  <el-container class="global-container">
    <el-main>
      <el-tabs v-model="showTabName" @tab-click="changTabShow">
        <el-tab-pane label="集团检查" name="groupCheck">
          <TapCheckDatas
            ref="groupCheck"
            :org-id.sync="filterFormData.orgId"
            @searchAction="getSpecialItemCheckFunc"
            @addSpecialItem="addSpecialItemHandle"
          />
        </el-tab-pane>
        <el-tab-pane label="区域检查" name="areaCheck">
          <TapCheckDatas ref="areaCheck" @addSpecialItem="addSpecialItemHandle"/>
        </el-tab-pane>
        <el-tab-pane label="项目检查" name="projectCheck">
          <TapCheckDatas ref="projectCheck" @addSpecialItem="addSpecialItemHandle"/>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <specialItemDetail v-show="isItemDetailShow" :is-item-detail-show.sync="isItemDetailShow"/>
    <addSpecialItem
      v-show="isAddSpecialItemShow"
      :is-add-special-item-show.sync="isAddSpecialItemShow"
    />
  </el-container>
</template>
<script>
/* eslint-disable */
import getProjectMixin from "@/mixins/getProjectStage";
import { getSpecialItemCheck } from "@/api/quality/specialItemCheck";
import AddSpecialItem from "@/views/quality/special_item_check/components/addSpecialItem";
import SpecialItemDetail from "@/views/quality/special_item_check/components/specialItemDetail";
import TapCheckDatas from "@/views/quality/special_item_check/tabPanes/tapCheckDatas";
import { log } from "util";
export default {
  components: { TapCheckDatas, SpecialItemDetail, AddSpecialItem },
  mixins: [getProjectMixin],
  data() {
    return {
      showTabName: "groupCheck",
      tabStatusData: {
        groupCheck: 1,
        areaCheck: 2,
        projectCheck: 3
      },
      isItemDetailShow: false,
      isAddSpecialItemShow: false,
      filterFormData: {
        type: "",
        orgId: "",
        projectId: "",
        // checkPersonName: "",
        termType: "like"
      },
      pageIndex: 0,
      pageSize: 10,
      pageTotal: 0
    };
  },
  async mounted() {
    await this.getProjectFunc().then(data => {
      const _projectId = data[0].id;
      // this.filterFormData.projectId = _projectId;
      // this.changTabShow();
    });
    await this.getSpecialItemCheckFunc();
  },
  methods: {
    // 获取专项检查表格数据
    getSpecialItemCheckFunc() {
      const params = {};
      const tabName = this.showTabName;
      this.filterFormData.type = this.tabStatusData[tabName]; // 确定检查类型
      const _keys = Object.keys(this.filterFormData);
      let paramIndex = 0;
      _keys.forEach(key => {
        const _data = this.filterFormData[key];
        if (_data !== null && _data !== "") {
          // 如果某个查询条件不为空
          // const termType = ["gte", "lte"];
          params[`terms[${paramIndex}].column`] = key;
          params[`terms[${paramIndex}].value`] = _data;
          paramIndex++;
        }
      });
      params["pageIndex"] = this.pageIndex + 1;
      params["pageSize"] = this.pageSize;
      getSpecialItemCheck(params).then(resp => {
        const data = resp.result;
        const _obj = {
          pageTotal: data.total,
          pageIndex: data.pageIndex + 1,
          tableData: data.data
        };
        this.$refs[tabName].resetDataProperty(_obj);
      });
    },
    changTabShow() {
      const tabName = this.showTabName;
      let _obj = {
        // curTabStatus: this.tabStatusData[tabName],
        // projectDetailDatas: this.projectDetailDatas
      };
      // this.$refs[tabName].resetDataProperty(_obj);
    },
    addSpecialItemHandle(data) {
      this.isAddSpecialItemShow = true;
    }
  }
};
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.el-container {
  .el-main {
    padding: 0;
    &/deep/.el-tabs {
      .el-tabs__header {
        margin: 0;
        padding: 20px 20px 0 20px;
        background: #fff;
      }
      .el-tabs__content {
        padding: 20px;
      }
    }
  }
}
</style>
