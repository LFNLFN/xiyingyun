<template>
  <el-container class="global-container">
    <el-main>
      <el-tabs v-model="showTabName" @tab-click="changTabShow">
        <el-tab-pane label="集团检查" name="groupCheck">
          <TapCheckDatas
            ref="groupCheck"
            :org-id.sync="filterFormData.orgId"
            :project-id.sync="filterFormData.projectId"
            :check-person-name.sync="filterFormData.checkPersonName"
            @searchAction="getSpecialItemCheckFunc"
            @addSpecialItem="addSpecialItemHandle"
          />
        </el-tab-pane>
        <el-tab-pane label="区域检查" name="areaCheck">
          <TapCheckDatas
            ref="areaCheck"
            :org-id.sync="filterFormData.orgId"
            :project-id.sync="filterFormData.projectId"
            :check-person-name.sync="filterFormData.checkPersonName"
            @searchAction="getSpecialItemCheckFunc"
            @addSpecialItem="addSpecialItemHandle"
          />
        </el-tab-pane>
        <el-tab-pane label="项目检查" name="projectCheck">
          <TapCheckDatas
            ref="projectCheck"
            :org-id.sync="filterFormData.orgId"
            :project-id.sync="filterFormData.projectId"
            :check-person-name.sync="filterFormData.checkPersonName"
            @searchAction="getSpecialItemCheckFunc"
            @addSpecialItem="addSpecialItemHandle"
          />
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
import {
  getSpecialItemCheck,
  fetchSpcialInspection
} from "@/api/quality/specialItemCheck";
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
        type: ""
        // orgId: "",
        // projectId: "",
        // checkPersonName: "" // 'termType=like'
      },
      pageIndex: 0,
      pageSize: 10,
      pageTotal: 0
    };
  },
  async mounted() {
    await this.getProjectFunc().then(data => {
      const _projectId = data[0].id;
      const _orgId = data[0].parent.orgId;
      // this.filterFormData.projectId = _projectId;
      // this.filterFormData.orgId = _orgId;
      this.changTabShow();
    });
    await this.getSpecialItemCheckFunc();
  },
  methods: {
    // 获取专项检查主体表格数据
    getSpecialItemCheckFunc() {
      const params = {};
      const tabName = this.showTabName; // 决定是集团检查、区域检查还是项目检查
      this.filterFormData.type = this.tabStatusData[tabName]; // 确定检查类型（1-集团检查，2-区域检查，3-项目检查）
      const _keys = Object.keys(this.filterFormData); // 获取一个数组，里面存储查询条件的属性名
      let paramIndex = 0;
      _keys.forEach(key => {
        const _data = this.filterFormData[key];
        if (_data !== null) {
          // 如果某个查询条件不为空
          if (key == "checkPersonName") {
            params[`terms[${paramIndex}].column`] = key;
            params[`terms[${paramIndex}].termType`] = "like";
            params[`terms[${paramIndex}].value`] = _data;
          } else {
            params[`terms[${paramIndex}].column`] = key; // 接口查询条件的特殊格式
            params[`terms[${paramIndex}].value`] = _data;
          }
          paramIndex++;
        }
      });
      params["pageIndex"] = this.pageIndex;
      params["pageSize"] = this.pageSize;
      console.log(params);
      // 之前是传输参数处理，后面是正式调用接口查询
      getSpecialItemCheck(params).then(resp => {
        const data = resp.result;
        const _obj = {
          pageTotal: data.total,
          pageIndex: data.pageIndex + 1,
          tableData: data.data
        };
        this.$refs[tabName].resetDataProperty(_obj); // 表格数据获取成功并处理后传入子组件之中
      });
    },
    changTabShow() {
      const _thisVue = this;
      const tabName = this.showTabName;

      const tabStatus = _thisVue.tabStatusData[tabName];
      let _obj = {
        curTabStatus: tabStatus,
        projectDetailDatas: _thisVue.projectDetailDatas
      };
      _thisVue.$refs[tabName].resetDataProperty(_obj);
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
