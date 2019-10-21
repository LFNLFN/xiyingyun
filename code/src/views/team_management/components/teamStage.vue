<template>
  <footerBarContainer
    v-loading="sectionLoading"
    @cancelHandle="cancelHandle"
    @confirmHandle="submitHandle"
  >
    <template slot="main-content">
      <el-main v-loading="sectionInfoLoading" class="section-info-watp">
        <div class="header">
          <span>基础信息</span>
        </div>
        <el-form
          ref="sectionForm"
          :model="sectionFormData"
          :rules="secionFormRules"
          class="section-Info-form"
        >
          <el-form-item prop="name" label="公司名称">
            <el-input v-model="sectionFormData.name" size="small" :disabled="viewDetail"/>
          </el-form-item>
          <el-form-item prop="official" label="班组负责人">
            <el-input v-model="sectionFormData.official" size="small" :disabled="viewDetail"/>
          </el-form-item>
          <el-form-item prop="phone" label="班组负责人手机号">
            <el-input v-model="sectionFormData.phone" size="small" :disabled="viewDetail"/>
          </el-form-item>
          <el-form-item label="施工范围">
            <el-input v-model="sectionFormData.constructionScope" size="small" :disabled="viewDetail"/>
          </el-form-item>
        </el-form>
      </el-main>
      <el-main v-loading="sectionInfoLoading" class="section-info-watp">
        <div class="header">
          <span>{{`班组人员（人数:${projectTeamMemberList.length}）`}}</span>
        </div>
        <div class="table-wrap">
          <el-table
            v-loading="memberTableLoading"
            ref="memberTable"
            :data="projectTeamMemberList"
            row-key="id"
            border=""
            show-overflow-tooltip
            class="member-table"
          >
            <el-table-column prop="name" min-width="100" label="姓名" align="left">
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.doingInput && scope.row.doingInput===true"
                  v-model="memberFillingObj.name"
                />
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="phone" min-width="200" label="手机号" align="left">
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.doingInput && scope.row.doingInput===true"
                  v-model="memberFillingObj.phone"
                />
                <span v-else>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="idCard" min-width="200" label="身份证" align="left">
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.doingInput && scope.row.doingInput===true"
                  v-model="memberFillingObj.idCard"
                />
                <span v-else>{{ scope.row.idCard }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="workTypeName" width="180" label="工种" align="left">
              <template slot-scope="scope">
                <el-select
                  v-if="scope.row.doingInput && scope.row.doingInput===true"
                  v-model="memberFillingObj.workType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in workTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span v-else>{{ scope.row.workTypeName }}</span>
              </template>
            </el-table-column>
            <el-table-column width="200" label="操作" align="center" v-if="!viewDetail">
              <template slot-scope="scope">
                <template v-if="!scope.row.doingInput">
                  <el-button
                    type="text"
                    class="search-btn"
                    @click="showMemberOperationView('edit', scope.row, scope.$index)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    class="search-btn"
                    @click="teamMemberOperation('delete', scope.row)"
                  >删除</el-button>
                </template>
                <template v-else>
                  <el-button
                    type="text"
                    class="search-btn"
                    @click="showMemberOperationView('cancel', scope.row, scope.$index)"
                  >取消</el-button>
                  <el-button
                    type="text"
                    class="search-btn"
                    @click="teamMemberOperation(memberOperation, scope.row)"
                  >提交</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <p v-if="!viewDetail">
            <el-button
              type="primary"
              size="small"
              class="search-btn"
              @click="showMemberOperationView('add')"
            >新增班组人员</el-button>
          </p>
        </div>
      </el-main>
    </template>
  </footerBarContainer>
</template>
<script>
import {
  addTeam,
  editTeam,
  addTeamMember,
  editTeamMember,
  deleteTeamMember
} from "@/api/team_management/team_management";
// old code
import { mapGetters, mapActions } from "vuex";
import { searchArrByKeyVal } from "@/utils/public";
import { getDictionaryItem } from "@/api/dictionary";
import { getBuliding } from "@/api/project_config/building";
import { getPlansNoPage } from "@/api/project_config/plan";
import {
  addProjectStage,
  editProjectStage
} from "@/api/project_config/project";
import FooterBarContainer from "@/components/FooterBarContainer";
// new code
import {
  getTeamDetail,
  getWorkTypeList
} from "@/api/team_management/team_management";
import { isvalidPhoneNum, phoneNumValid, idCardValid } from "@/utils/validate";
export default {
  components: { FooterBarContainer },
  data() {
    return {
      /* ------------------- 表单数据相关 --------------------*/
      memberTableLoading: false,
      projectTeamMemberList: [],
      workTypeDic: [],
      memberFillingObj: {
        name: null,
        phone: null,
        idCard: null,
        workType: null,
        doingInput: true
      },
      currentRow: {},
      workTypeOptions: [],
      memberOperation: "",
      viewDetail: false,
      sectionFormData: {
        projectId: "",
        orgId: "",
        name: "",
        official: "",
        constructionScope: "",
        phone: "",
        parentId: "",
        type: 2,
        orgId: "",
        status: "",
        estateProjectStageEntity: {
          professionalEntityList: [],
          professionalList: [],
          unitEntityList: [],
          supervisionOrgId: "",
          constructionOrgId: "",
          floorPlanId: ""
        }
      },
      secionFormRules: {
        name: [{ required: true, trigger: "change", message: "不能为空" }],
        official: [{ required: true, trigger: "change", message: "不能为空" }],
        status: [{ required: true, trigger: "change", message: "请选择状态" }],
        phone: [
          { required: true, trigger: "change", validator: isvalidPhoneNum }
        ]
      },
      constructionOrgs: [], // 保存施工单位列表
      supervisionOrgs: [], // 保存监理单位列表
      projectStatus: [{ id: 0, value: "在建" }, { id: 1, value: "已完工" }], // 保存项目状态
      belongProject: "", // 保存标段所属项目
      /* ------------------- 楼栋信息相关 --------------------*/
      allBuildingData: [], // 保存所有楼栋数据
      transBuildingData: [], // 保存穿梭框展示的楼栋数据
      buildingSelected: [], // 保存所选择的楼栋Id
      /* ------------------- 专业信息相关 --------------------*/
      projectPlanDatas: [], // 保存平面图数据
      allProfessionData: [], // 保存所有专业数据
      transProfessionData: [], // 保存穿梭框展示的专业数据
      professionSelected: [], // 保存所选择的专业Id
      sectionLoading: false,
      sectionInfoLoading: false,
      buildingLoading: false,
      professionLoading: false
    };
  },
  computed: {
    ...mapGetters(["projectList", "projectDetails"])
  },
  watch: {
    buildingSelected: function(newVal) {
      const curBuildings = this.allBuildingData.filter(item => {
        return newVal.includes(item.id);
      });
      this.sectionFormData.estateProjectStageEntity.unitEntityList = curBuildings;
    },
    professionSelected: function(newVal) {
      const curProfession = this.allProfessionData.filter(item => {
        return newVal.includes(item.id);
      });
      this.sectionFormData.estateProjectStageEntity.professionalList = curProfession;
    }
  },
  created() {
    if (this.$route.query.operation === "add") {
      this.sectionFormData.projectId = this.$route.query.projectId;
      getWorkTypeList()
      .then(resp => {
        this.workTypeDic = resp.result;
        this.generateWorkTypeOption(this.workTypeDic);
      })
      .catch(err => {
        // this.$message.error(err)
      });
      return;
    }
    if (this.$route.query.operation === "detail") {
      this.viewDetail = true
    }
    // 获取请求参数
    this.sectionFormData.projectId = this.$route.query.projectId;
    this.sectionFormData.orgId = this.$route.query.orgId;
    getWorkTypeList()
      .then(resp => {
        this.workTypeDic = resp.result;
        this.generateWorkTypeOption(this.workTypeDic);
        // 请求详情数据
        getTeamDetail(this.sectionFormData)
          .then(resp => {
            const keyArr = Object.keys(resp.result);
            keyArr.forEach(key => {
              this.sectionFormData[key] = resp.result[key];
            });
            this.projectTeamMemberList = resp.result.personEntityList || [];
          })
          .catch(err => {
            // this.$message.error(err)
          });
      })
      .catch(err => {
        // this.$message.error(err)
      });
    return;
    // this.sectionInfoLoading = true;
    // this.buildingLoading = true;
    // this.professionLoading = true;
    // const projectId = this.$route.query.projectId;
    // const parentId = this.$route.query.parentId;
    // const eventType = this.$route.query.eventType;
    // 其他数据
    if (eventType === "add") {
      const curProject = searchArrByKeyVal(this.projectList, "id", parentId);
      this.sectionFormData.parentId = parentId;
      this.sectionFormData.orgId = curProject.orgId;
      if (curProject) {
        this.belongProject = curProject.name;
      }
    } else if (eventType === "edit") {
      // 编辑项目分期，加载表单数据
      const curProject = searchArrByKeyVal(
        this.projectDetails,
        "id",
        projectId
      );
      if (curProject) {
        const _keys = Object.keys(curProject);
        const parentProject = searchArrByKeyVal(
          this.projectList,
          "id",
          parentId
        );
        // 加载所属项目
        if (parentProject) {
          this.belongProject = parentProject.name;
        }
        // 加载表单数据
        _keys.forEach(key => {
          this.sectionFormData[key] = curProject[key];
        });
      }
    }
    // 加载总包单位以及监理单位数据
    this.getContractSupervise();
    // 加载楼栋数据
    this.getBuildingData();
    // 加载专业分类数据
    this.getProfessionData();
  },
  methods: {
    // 班组人员的增删改查
    showMemberOperationView(operation, row, index) {
      switch (operation) {
        // 新增班组人员
        case "add":
          if (
            this.projectTeamMemberList.length > 0 &&
            this.projectTeamMemberList[this.projectTeamMemberList.length - 1]
              .doingInput
          ) {
            this.$alert("请逐条添加完人员信息后再进行新增操作", "提示", {
              confirmButtonText: "确定",
              showClose: false
            });
            break;
          }
          this.memberOperation = "add";
          this.projectTeamMemberList.push(this.memberFillingObj);
          break;
        // 编辑班组人员
        case "edit":
          let isDoingInput = this.projectTeamMemberList.some((e, i, s) => {
            return e.doingInput;
          });
          if (isDoingInput) {
            this.$alert("请逐条编辑完人员信息后再进行编辑操作", "提示", {
              confirmButtonText: "确定",
              showClose: false
            });
            break;
          }
          this.memberOperation = "edit";
          this.currentRow = row;
          let _tmpRow = Object.assign({}, row);
          let tmpKeyArr = Object.keys(this.memberFillingObj);
          tmpKeyArr.forEach((e, i, s) => {
            this.memberFillingObj[e] = _tmpRow[e];
          });
          this.projectTeamMemberList.splice(index, 1);
          _tmpRow.doingInput = true;
          this.projectTeamMemberList.splice(index, 1, _tmpRow);
          break;
        case "cancel":
          if (this.memberOperation === "edit") {
            this.projectTeamMemberList[index].doingInput = false;
          } else if (this.memberOperation === "add") {
            this.projectTeamMemberList.splice(index, 1);
          }

          break;
        // 删除班组人员
        case "delete":
          this.$confirm("确定删除该班组人员?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
          break;
      }
    },
    teamMemberOperation(operation, row) {
      switch (operation) {
        // 新增班组人员
        case "add":
          // 添加验证
          if(!phoneNumValid(this.memberFillingObj.phone)) {
            this.$message.error('电话号码格式错误')
            break
          }
          if(!idCardValid(this.memberFillingObj.idCard)) {
            this.$message.error('身份证格式错误')
            break
          }
          this.sectionFormData.memberFillingObj = Object.assign(
            {},
            this.memberFillingObj
          );
          addTeamMember(this.sectionFormData).then(resp => {
            this.sectionFormData.memberFillingObj = {};
            this.memberFillingObj = {
              name: null,
              phone: null,
              idCard: null,
              workType: null,
              doingInput: true
            };
            this.$message.success("操作成功");
            // 请求详情数据
            getTeamDetail(this.sectionFormData)
              .then(resp => {
                const keyArr = Object.keys(resp.result);
                keyArr.forEach(key => {
                  this.sectionFormData[key] = resp.result[key];
                });
                this.projectTeamMemberList = resp.result.personEntityList || [];
              })
              .catch(err => {
                console.log(err);
                this.$message.error("操作失败，请重试");
              });
          });
          break;
        // 编辑班组人员
        case "edit":
          // 添加验证
          if(!phoneNumValid(this.memberFillingObj.phone)) {
            this.$message.error('电话号码格式错误')
            break
          }
          if(!idCardValid(this.memberFillingObj.idCard)) {
            this.$message.error('身份证格式错误')
            break
          }
          this.sectionFormData.memberFillingObj = Object.assign(
            { personId: row.id },
            this.memberFillingObj
          );
          editTeamMember(this.sectionFormData).then(resp => {
            this.sectionFormData.memberFillingObj = {};
            this.memberFillingObj = {
              name: null,
              phone: null,
              idCard: null,
              workType: null,
              doingInput: true
            };
            this.$message.success("操作成功");
            // 请求详情数据
            getTeamDetail(this.sectionFormData)
              .then(resp => {
                const keyArr = Object.keys(resp.result);
                keyArr.forEach(key => {
                  this.sectionFormData[key] = resp.result[key];
                });
                this.projectTeamMemberList = resp.result.personEntityList || [];
              })
              .catch(err => {
                console.log(err);
                this.$message.error("操作失败，请重试");
              });
          });
          break;
        // 删除班组人员
        case "delete":
          this.$confirm("确定删除该班组人员?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            showClose: false,
            type: "warning"
          }).then(() => {
            this.sectionFormData.memberFillingObj = Object.assign(
              { personId: row.id },
              this.memberFillingObj
            );
            deleteTeamMember(this.sectionFormData).then(resp => {
              this.sectionFormData.memberFillingObj = {};
              this.memberFillingObj = {
                name: null,
                phone: null,
                idCard: null,
                workType: null,
                doingInput: true
              };
              this.$message.success("操作成功");
              // 请求详情数据
              getTeamDetail(this.sectionFormData)
                .then(resp => {
                  const keyArr = Object.keys(resp.result);
                  keyArr.forEach(key => {
                    this.sectionFormData[key] = resp.result[key];
                  });
                  this.projectTeamMemberList =
                    resp.result.personEntityList || [];
                })
                .catch(err => {
                  console.log(err);
                  this.$message.error("操作失败，请重试");
                });
            });
          });
          break;
      }
    },
    // 制造工种下拉框
    generateWorkTypeOption(arr) {
      let tmpArr = [];
      arr.forEach((e, i, s) => {
        let tmpObj = {};
        tmpObj.label = e.value;
        tmpObj.value = e.id;
        tmpArr.push(tmpObj);
      });
      this.workTypeOptions = tmpArr;
    },
    // old code
    ...mapActions({
      getOrganization: "getOrganizationData"
    }),
    // 根据条件搜索穿梭框数据
    filterSuppliers(query, item) {
      return item.label.indexOf(query) > -1;
    },
    // 加载总包单位以及监理单位数据处理
    getContractSupervise() {
      const dictParams = {
        "terms[0].column": "dict_id",
        "terms[0].value": "supplier_type"
      };
      getDictionaryItem(dictParams)
        .then(dresp => {
          const supplierType = dresp.result;
          let constructionId, supervisorId;
          supplierType.forEach(item => {
            if (item.name === "construction") {
              constructionId = item.id;
            } else if (item.name === "supervisor") {
              supervisorId = item.id;
            }
          });
          const type = this.$store.getters.organizationType.suppliers;
          this.getOrganization({ type })
            .then(oresp => {
              const organs = oresp;
              organs.forEach(org => {
                if (org.orgType === constructionId) {
                  this.constructionOrgs.push(org);
                } else if (org.orgType === supervisorId) {
                  this.supervisionOrgs.push(org);
                }
              });
              this.sectionInfoLoading = false;
            })
            .catch(() => {
              this.sectionInfoLoading = false;
            });
        })
        .catch(() => {
          this.sectionInfoLoading = false;
        });
    },
    // 加载平面图数据
    getProjectPlan(visible) {
      if (!visible || this.projectPlanDatas.length > 0) return;
      const { parentId, projectId } = this.$route.query;
      const idsStr = [parentId, projectId].join();
      console.log("idsStr", idsStr);
      const params = {
        "terms[0].column": "projectId$IN",
        "terms[0].value": idsStr,
        "terms[1].column": "type",
        "terms[1].value": 1,
        pageIndex: this.pageIndex,
        pageSize: 10
      };
      getPlansNoPage(params).then(resp => {
        const result = resp.result;
        this.$set(this, "projectPlanDatas", result);
        console.log("projectPlanDatas", this.projectPlanDatas);
      });
    },
    // 加载楼栋数据处理
    getBuildingData() {
      const { parentId, projectId } = this.$route.query;
      const idsStr = [parentId, projectId].join();
      const params = {
        "terms[0].column": "projectId$IN",
        "terms[0].value": `${idsStr}`
      };
      getBuliding(params)
        .then(resp => {
          const _data = resp.result;
          this.allBuildingData = _data;
          const unitEntityList = this.sectionFormData.estateProjectStageEntity
            .unitEntityList;
          _data.forEach(v => {
            this.transBuildingData.push({
              key: v.id,
              label: v.name,
              disabled: false
            });
            const index = unitEntityList.findIndex(item => {
              return v.projectId === item.projectId;
            });
            if (index >= 0) {
              this.buildingSelected.push(v.id);
            }
          });
          this.buildingLoading = false;
        })
        .catch(() => {
          this.buildingLoading = false;
        });
    },
    // 加载专业分类数据处理
    getProfessionData() {
      const dictParams = {
        "terms[0].column": "dict_id",
        "terms[0].value": "professionType"
      };
      getDictionaryItem(dictParams)
        .then(resp => {
          const _data = resp.result;
          this.allProfessionData = _data;
          const professionalList = this.sectionFormData.estateProjectStageEntity
            .professionalList;
          _data.forEach(v => {
            this.transProfessionData.push({
              key: v.id,
              label: v.value,
              disabled: false
            });
            // 加载已选择的专业分类
            const index = professionalList.findIndex(item => {
              return item.id === v.id;
            });
            if (index >= 0) {
              this.professionSelected.push(v.id);
            }
          });
          this.professionLoading = false;
        })
        .catch(() => {
          this.professionLoading = false;
        });
    },
    // 班组处理-增删改
    submitHandle() {
      this.$refs.sectionForm.validate(valid => {
        if (valid) {
          this.sectionFormData.personEntityList = this.projectTeamMemberList;
          switch (this.$route.query.operation) {
            case "add":
              addTeam(this.sectionFormData)
                .then(resp => {
                  this.$message.success("操作成功");
                  this.$router.history.go(-1);
                })
                .catch(err => {
                  this.$message.success("操作失败，请重试");
                });
              break;
            case "edit":
              editTeam(this.sectionFormData)
                .then(resp => {
                  this.$message.success("操作成功");
                  // 重新请求详情数据
                  getTeamDetail(this.sectionFormData)
                    .then(resp => {
                      const keyArr = Object.keys(resp.result);
                      keyArr.forEach(key => {
                        this.sectionFormData[key] = resp.result[key];
                      });
                      this.projectTeamMemberList =
                        resp.result.personEntityList || [];
                    })
                    .catch(err => {
                      // this.$message.error(err)
                    });
                })
                .catch(err => {
                  this.$message.success("操作失败，请重试");
                });
              break;
          }
        }
      });
    },
    cancelHandle() {
      this.$router.history.go(-1);
    }
  }
};
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.header {
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  background: #fff;
  border-bottom: 1px solid #ccc;
}
.section-info-watp {
  padding: 0;
  background: #fff;
  .section-Info-form {
    padding: 20px;
    @include flex-layout(flex-start, center, row, wrap);
    .el-form-item {
      width: 40%;
      margin: 10px 3%;
      .el-input {
        .el-button {
          padding: 8px 5px;
        }
      }
      .el-select {
        width: 100%;
      }
    }
  }
}
.scope-wrap,
.profession-wrap {
  padding: 0;
  background: #fff;
  margin-top: 20px;
  .transfer-wrap {
    padding: 20px;
    & /deep/.el-transfer {
      @include flex-layout(center, center, null, nowrap);
      .el-transfer-panel {
        width: 400px;
        .el-transfer-panel__body {
          max-height: 400px;
          .el-checkbox-group {
            max-height: 350px;
            .el-transfer-panel__item {
              display: block !important;
            }
          }
        }
      }
    }
  }
}
.table-wrap {
  padding: 20px;
}
</style>
