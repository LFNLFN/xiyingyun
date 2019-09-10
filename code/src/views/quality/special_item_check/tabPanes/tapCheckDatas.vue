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
    <el-table :data="tableData" size="small" class="no-border-gary-head" @row-click="tableRowClick">
      <el-table-column label="项目名称" prop="projectName"/>
      <el-table-column label="检查批次名称" prop="name"/>
      <el-table-column label="检查人" prop="checkPersonName"/>
      <el-table-column label="责任人" prop="dutyPersonName"/>
      <el-table-column label="计划开始日期" prop="planStartTime"/>
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
    <SpecialItemDetail ref="SpecialItemDetail" v-show="isDetailItemShow" :is-item-detail-show.sync="isDetailItemShow" :detail-data="detailData" :problem-data="problemData"/>
  </div>
</template>
<script>
/* eslint-disable */
import { mapActions } from "vuex";
import { isEmpty } from "@/utils/public";
import { getPersonNameStr } from "@/utils/dataFormat";
import { log } from "util";
import { batchProblemDetail } from "@/api/quality/specialItemCheck";
import getProjectMixin from "@/mixins/getProjectStage";
import SpecialItemDetail from "@/views/quality/special_item_check/components/specialItemDetail";
export default {
  mixins: [getProjectMixin],
  components: {
    SpecialItemDetail
  },
  data() {
    return {
      projectDetailDatas: [],
      filterFormData: {
        projectId: null,
        checkPersonName: null
      },
      curTabStatus: null,
      tableData: [],
      pageIndex: 0,
      pageTotal: 10,
      areaCompanys: [], // 保存区域公司数据
      companyProjects: [], // 保存选址区域公司后获取的项目数据
      isDetailItemShow: false,
      detailData: {},
      problemData: {},
    };
  },
  watch: {
    projectDetailDatas: function(newVal, oldVal) {
      if (!isEmpty(newVal)) {
        // this.filterFormData.projectId = newVal[0].id;
      }
    },
    // 所选区域公司改变时会发生的行为
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
        // 把对应区域公司的项目写入下拉框
        const _projects = this.projectDetailDatas.filter(project => {
          return orgIdList.includes(project.parent.orgId);
        });
        this.$set(this, "companyProjects", _projects); // 选址区域公司后获取的项目数据
        // 同步父组件的数据
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
      getOrganization: "getOrganizationData" // 获取组织架构以及供应商
    }),
    // 页面初始化
    async initPage() {
      const type = this.$store.getters.organizationType.organization; // 组织种类：1供应商，0某组织
      // 获取组织架构以及供应商
      await this.getOrganization({ type, reGet: true }).then(resp => {
        resp.forEach(item => {
          if ("children" in item) {
            // 区域公司数组存放在children里面（获取区域公司）
            this.areaCompanys.push(...item.children);
          }
        });
      });
      // 加载项目数据
      await this.getProjectFunc()
        .then(data => {
          this.$set(this, "companyProjects", data); // 区域公司后获取的项目数据
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
    },
    // 请求专项检查详情及问题
    tableRowClick(row, column, event) {
      const message = this.$message({
        message: "数据加载中",
        duration: 0
      });
      batchProblemDetail({ id: row.id })
        .then(resp => {
          const data = resp.result;
          // 人名拼接
          let checkPersonFormat = getPersonNameStr(data.checkPersonList)
          let ccPersonListFormat = getPersonNameStr(data.ccPersonList)
          this.detailData = {
            项目名称: data.projectName,
            检查批次名称: data.name,
            类型: data.typeName,
            检查人: checkPersonFormat,
            督办人: data.supervisor.personName,
            责任人: data.dutyPerson.personName,
            抄送人: ccPersonListFormat,
            检查模板: data.templateName,
            计划开始时间: data.planStartTime
          };
          this.problemData = {
            allProblemList: data.allProblemList, // 全部问题
            assignProblemList: data.assignProblemList, // 待指派问题集合
            rectificationProblemList: data.rectificationProblemList, // 待整改问题集合
            waitSalesProblemList: data.waitSalesProblemList, // 待销项问题集合
            hasSalesProblemList: data.hasSalesProblemList, // 已销项问题集合
            invalidProblemList: data.invalidProblemList, // 已作废问题集合
            timelyRate: data.timelyRate, // 按时整改率
            rectificationRate: data.rectificationRate, // 整改完成率
          }
          // this.$refs[tabName].resetDataProperty(_obj); // 表格数据获取成功并处理后传入子组件之中
          message.close()
          this.$refs['SpecialItemDetail'].selectProblemType(this.problemData.allProblemList)
          this.isDetailItemShow = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
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
