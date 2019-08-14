<template>
  <div class="main-content">
    <el-form :inline="true" label-position="right" label-width="90px" class="filter-form">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="所选区域">
            <el-select v-model="filterFormData.orgId" size="small">
              <el-option
                v-for="(item, idx) in areaCompanys"
                :key="idx"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="选择项目">
            <el-select v-model="filterFormData.projectId" size="small">
              <el-option
                v-for="(item, idx) in companyProjects"
                :key="idx"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="检查人:">
            <el-input
              v-model="filterFormData.checkPersonName"
              size="small"
              placeholder="请输入内容"
              style="width: 200px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="btn-wrap">
            <el-button type="primary" size="mini" @click="searchHandler">查询</el-button>
            <el-button size="mini">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="operate-wrap">
      <el-button type="primary" size="small" @click="toAddSpecialItem">新增</el-button>
    </div>
    <el-table :data="tableData" size="small" class="no-border-gary-head">
      <el-table-column label="项目名称" prop/>
      <el-table-column label="检查批次名称"/>
      <el-table-column label="检查人"/>
      <el-table-column label="责任人"/>
      <el-table-column label="计划开始日期"/>
      <el-table-column width="80" label="操作">
        <template slot-scope="scope">
          <el-button size="small" class="no-border">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="pageTotal"
      :page-size="10"
      :page-sizes="[10, 20, 30, 40]"
      :current-page="pageIndex"
      background=""
      layout="total, prev, pager, next, sizes, jumper"
      class="pager-wrap"
      @current-change="pageChangeHandle"
      @size-change="pageSizeChangeHandle"
    />
  </div>
</template>
<script>
/* eslint-disable */

import { isEmpty } from "@/utils/public";
import { mapActions } from "vuex";
import { log } from "util";
import getProjectMixin from "@/mixins/getProjectStage";
export default {
  mixins: [getProjectMixin],
  data() {
    return {
      projectDetailDatas: [],
      filterFormData: {
        projectId: "",
        checkPersonName: ""
      },
      tableData: [],
      pageIndex: 0,
      pageTotal: 10,
      areaCompanys: [], // 保存区域公司数据
      companyProjects: [] // 保存选址区域公司后获取的项目数据
    };
  },
  watch: {
    projectDetailDatas: function(newVal, oldVal) {
      if (!isEmpty(newVal)) {
        this.filterFormData.projectId = newVal[0].id;
      }
    },
    "filterFormData.orgId": function(newVal) {
      if (newVal !== "") {
        const orgIdList = Array.of(newVal); // 生成一个含有newVal的数组
        const orgData = this.areaCompanys.find(item => {
          return item.id === newVal;
        }); // 返回所选区域的数据对象
        if (orgData.children) {
          orgData.children.forEach(org => {
            orgIdList.push(org.id);
          });
        }
        const _projects = this.projectDetailDatas.filter(project => {
          return orgIdList.includes(project.parent.orgId);
        });
        this.$set(this, "companyProjects", _projects);
        this.$emit("update:orgId", this.filterFormData.orgId);
        this.$emit("update:projectId", this.filterFormData.projectId);
      }
    },
    "filterFormData.projectId": function(newVal) {
      if (newVal !== "") {
        this.$emit("update:projectId", this.filterFormData.projectId);
      }
    },
    "filterFormData.checkPersonName": function(newVal) {
      if (newVal !== "") {
        this.$emit(
          "update:checkPersonName",
          this.filterFormData.checkPersonName
        );
      }
    }
  },
  methods: {
    ...mapActions({
      getOrganization: "getOrganizationData"
    }),
    // 页面初始化
    async initPage() {
      const type = this.$store.getters.organizationType.organization;
      await this.getOrganization({ type, reGet: true }).then(resp => {
        resp.forEach(item => {
          if ("children" in item) {
            this.areaCompanys.push(...item.children);
          }
        });
      });
      await this.getProjectFunc()
        .then(data => {
          this.$set(this, "companyProjects", data);
          this.filterFormData.projectId = "";
        })
        .catch(() => {});
      // await getMaterialType().then(resp => {
      //   this.$set(this, "materialTypeData", resp.result);
      // });
    },
    resetDataProperty(obj) {
      const _keys = Object.keys(obj);
      _keys.forEach(key => {
        this.$set(this, key, obj[key]);
      });
    },
    searchHandler() {
      this.$emit("searchAction");
    },
    // 新增专项处理
    toAddSpecialItem() {
      this.$emit("addSpecialItem");
    },
    pageChangeHandle(page) {
      this.pageIndex = page;
    },
    pageSizeChangeHandle(val) {
      console.log("val", val);
    }
  },
  created() {
    const message = this.$message({
      message: "数据加载中",
      duration: 0
    });
    this.initPage()
      .then(() => {
        message.close();
        // this.getMaterialDatas()
      })
      .catch(() => {
        message.close();
      });
  }
};
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.main-content {
  padding: 20px;
  background: #fff;
  .filter-form {
    &/deep/ .el-form-item {
      width: 100%;
      white-space: nowrap;
      margin: 15px 0 0 0;
      .el-form-item__content {
        width: 100%;
      }
      .el-form-item__label {
        width: 90px;
        text-align: right;
      }
      .el-select,
      .date-select {
        width: calc(100% - 102px);
      }
      &.btn-wrap {
        padding-left: 20px;
      }
      .form-ctrl-btn {
        font-size: 14px;
      }
    }
  }
  .operate-wrap {
    padding: 20px 10px;
  }
  .el-table {
    margin-top: 5px;
  }
  .pager-wrap {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
