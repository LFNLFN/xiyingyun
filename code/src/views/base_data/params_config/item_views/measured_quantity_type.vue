<template>
  <el-container>
    <el-main>
      <div class="header">
        <span class="el-icon-tickets">实测实量录入模式</span>
        <div class="btn-wrap">
          <el-button type="primary" size="small" @click="backConigNav">返回</el-button>
        </div>
      </div>
      <el-table ref="levelTable" :data="measuredQuantityTypeData" border="" class="level-table">
        <el-table-column prop="value" label="录入模式" align="center"/>
        <el-table-column prop="text" label="描述" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-radio
              v-model="radioValue"
              :label="scope.row.id"
              style="margin-right: -1em"
              @change="changeRadio"
            >&nbsp;</el-radio>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
import {
  getMeasuredQuantityTypeList,
  addMeasuredQuantityType,
  editMeasuredQuantityType,
  deleteMeasuredQuantityType
} from "@/api/base_data/params_config";
export default {
  name: "MeasuredQuantityType",
  data() {
    return {
      measuredQuantityTypeData: [],
      radioValue: ""
    };
  },
  methods: {
    backConigNav() {
      this.$emit("changeSowCom", "configNav");
    },
    getMeasuredQuantityTypeListFunc() {
      const msg = this.$message({
        message: "数据加载中",
        type: "info",
        duration: 0
      });
      getMeasuredQuantityTypeList()
        .then(resp => {
          msg.close();
          this.measuredQuantityTypeData = resp.result;
          this.measuredQuantityTypeData.forEach(e => {
            if (e.status === 1) {
              this.radioValue = e.id;
            }
          });
        })
        .catch(err => {
          console.log(err);
          msg.close();
          this.$message.error("请求失败");
        });
    },
    editMeasuredQuantityTypeListFunc(modeId) {
      const msg = this.$message({
        message: "数据加载中",
        type: "info",
        duration: 0
      });
      this.measuredQuantityTypeData.forEach(async (e, i, s) => {
        if (e.id === modeId) {
          await editMeasuredQuantityType({
            id: e.id,
            paramsObj: { status: 1 }
          })
            .then(resp => {
              msg.close();
            })
            .catch(err => {
              console.log(err);
              msg.close();
              this.$message.error("请求失败");
            });
        } else {
          await editMeasuredQuantityType({
            id: e.id,
            paramsObj: { status: 0 }
          })
            .then(resp => {
              msg.close();
            })
            .catch(err => {
              console.log(err);
              msg.close();
              this.$message.error("请求失败");
            });
        }
      });
    },
    changeRadio(val) {
      this.editMeasuredQuantityTypeListFunc(val)
    }
  },
  created() {
    this.getMeasuredQuantityTypeListFunc();
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
