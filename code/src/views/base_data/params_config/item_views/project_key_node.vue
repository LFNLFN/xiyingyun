<template>
  <el-container>
    <el-main>
      <div class="header">
        <span class="el-icon-tickets">项目关键节点</span>
        <div class="btn-wrap">
          <el-button size="small" @click="operationHandler('add')">添加节点</el-button>
          <el-button type="primary" size="small" @click="backConigNav">返回</el-button>
        </div>
      </div>
      <el-table ref="levelTable" :data="projectKeyNodeTableData" border="" class="level-table">
        <el-table-column prop="name" label="节点名称" align="center">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isDoingInput===true" v-model="fillingMsgObj.name"/>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="cycle" label="默认跟进周期" align="center" /> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.isDoingInput===true">
              <el-button
                type="text"
                size="small"
                @click="operationHandler('save', scope.row, scope.$index)"
              >保存</el-button>
              <el-button
                type="text"
                size="small"
                @click="operationHandler('cancel', scope.row, scope.$index)"
              >取消</el-button>
            </template>
            <template v-else>
              <el-button
                type="text"
                size="small"
                @click="operationHandler('update', scope.row, scope.$index)"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="operationHandler('delete', scope.row, scope.$index)"
              >删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
import {
  getProjectKeyNodeList,
  addProjectKeyNode,
  editProjectKeyNode,
  deleteProjectKeyNode
} from "@/api/base_data/params_config";
export default {
  name: "ProjectKeyNode",
  props: {
    componentDatas: {
      type: Object,
      default: () => {
        return {};
      }
    },
    paramsData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      projectKeyNodeTableData: [],
      fillingMsgObj: {
        dictId: "",
        name: "",
        value: "",
        text: "",
        status: "",
        ordinal: "",
        isDoingInput: true
      },
      keyNodeOperation: ""
    };
  },
  methods: {
    backConigNav() {
      this.$emit("changeSowCom", "configNav");
    },
    getProjectKeyNodeListFunc() {
      const msg = this.$message({
        message: "数据加载中",
        type: "info",
        duration: 0
      });
      getProjectKeyNodeList()
        .then(resp => {
          msg.close();
          this.projectKeyNodeTableData = resp.result;
        })
        .catch(err => {
          console.log(err);
          msg.close();
          this.$message.error("请求失败");
        });
    },
    addProjectKeyNodeFunc() {
      const msg = this.$message({
        message: "数据加载中",
        type: "info",
        duration: 0
      });
      addProjectKeyNode({
        dictId: "project_key_node",
        name: this.fillingMsgObj.name,
        value: this.fillingMsgObj.name,
        valueType: "String",
        text: this.fillingMsgObj.name,
        status: 1,
        ordinal: this.projectKeyNodeTableData[this.projectKeyNodeTableData.length - 2].ordinal + 1
      })
        .then(resp => {
          console.log(resp);
          this.fillingMsgObj = {
            dictId: "",
            name: "",
            value: "",
            text: "",
            status: "",
            ordinal: "",
            isDoingInput: true
          }; // 初始化表单
          msg.close();
          this.getProjectKeyNodeListFunc(); // 刷新列表
        })
        .catch(err => {
          console.log(err);
          msg.close();
          this.$message.error("请求失败");
        });
    },
    editProjectKeyNodeFunc() {
      const msg = this.$message({
        message: "数据加载中",
        type: "info",
        duration: 0
      });
      this.fillingMsgObj.value = this.fillingMsgObj.text = this.fillingMsgObj.name;
      editProjectKeyNode({
        id: this.fillingMsgObj.id,
        paramsObj: this.fillingMsgObj
      })
        .then(resp => {
          console.log(resp);
          this.fillingMsgObj = {
            dictId: "",
            name: "",
            value: "",
            text: "",
            status: "",
            ordinal: "",
            isDoingInput: true
          }; // 初始化表单
          msg.close();
          this.getProjectKeyNodeListFunc(); // 刷新列表
        })
        .catch(err => {
          console.log(err);
          msg.close();
          this.$message.error("请求失败");
        });
    },
    deleteProjectKeyNodeFunc(levelId) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const msg = this.$message({
            message: "数据加载中",
            type: "info",
            duration: 0
          });
          deleteProjectKeyNode(levelId)
            .then(resp => {
              console.log(resp);
              msg.close();
              this.getProjectKeyNodeListFunc(); // 刷新列表
            })
            .catch(err => {
              console.log(err);
              msg.close();
              this.$message.error("请求失败");
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    operationHandler(action, row, index) {
      switch (action) {
        case "add":
          if (
            this.projectKeyNodeTableData.length > 0 &&
            this.projectKeyNodeTableData[this.projectKeyNodeTableData.length - 1].isDoingInput
          ) {
            this.$alert("请逐条添加完信息后再进行新增操作", "提示", {
              confirmButtonText: "确定",
              showClose: false
            });
            break;
          }
          this.keyNodeOperation = "add";
          this.projectKeyNodeTableData.push(this.fillingMsgObj);
          break;
        case "update":
          {
            const isDoingInput = this.projectKeyNodeTableData.some((e, i, s) => {
              return e.isDoingInput;
            });
            if (isDoingInput) {
              this.$alert("请逐条编辑完信息后再进行编辑操作", "提示", {
                confirmButtonText: "确定",
                showClose: false
              });
              break;
            }
            this.keyNodeOperation = "update";
            const _tmpRow = Object.assign({}, row);
            const tmpKeyArr = Object.keys(row);
            tmpKeyArr.forEach((e, i, s) => {
              this.fillingMsgObj[e] = _tmpRow[e];
            });
            this.projectKeyNodeTableData.splice(index, 1);
            _tmpRow.isDoingInput = true;
            this.projectKeyNodeTableData.splice(index, 1, _tmpRow);
            break;
          }
          break;
        case "save":
          if (this.keyNodeOperation === "add") {
            this.addProjectKeyNodeFunc();
          } else if (this.keyNodeOperation === "update") {
            this.editProjectKeyNodeFunc();
          }
          break;
        case "cancel":
          if (this.keyNodeOperation === "update") {
            this.projectKeyNodeTableData[index].isDoingInput = false;
            this.fillingMsgObj = {
              dictId: "",
              name: "",
              value: "",
              text: "",
              status: "",
              ordinal: "",
              isDoingInput: true
            }; // 初始化表单
          } else if (this.keyNodeOperation === "add") {
            this.projectKeyNodeTableData.splice(index, 1);
            this.fillingMsgObj = {
              dictId: "",
              name: "",
              value: "",
              text: "",
              status: "",
              ordinal: "",
              isDoingInput: true
            }; // 初始化表单
          }
          break;
        case "delete":
          this.deleteProjectKeyNodeFunc(row.id);
          break;
        default:
          break;
      }
    }
  },
  created() {
    // console.log('componentDatas', this.componentDatas)
    // console.log('paramsData', this.paramsData)
    this.getProjectKeyNodeListFunc();
  }
};
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
  padding: 20px;
  .el-main {
    @include boxShadow-container;
    .header {
      @include gray-header;
    }
    .params-item-wrap {
      padding: 20px 30px;
      .el-row {
        padding: 0 10px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #c7c6c6;
      }
    }
    .level-table {
      width: 600px;
      margin: 50px auto;
    }
  }
}
</style>
