<template>
  <el-container>
    <el-main>
      <div class="header">
        <span class="el-icon-tickets">允许相册选择</span>
        <div class="btn-wrap">
          <el-button type="primary" size="small" @click="backConigNav">返回</el-button>
        </div>
      </div>
      <el-table ref="levelTable" :data="allowAlbumChooseData" border="" class="level-table">
        <el-table-column prop="text" label="业务场景" align="center"/>
        <el-table-column prop="describe" :formatter="formatter" label="企业类型" align="center"/>
        <el-table-column prop="value" label="操作" align="center">
          <template slot-scope="scope">
            <chooseCheckbox
              :current-row="scope.row"
              @changeSwitch="editAllowAlbumChooseListFunc($event)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
import {
  getAllowAlbumChooseList,
  editAllowAlbumChooseList
} from "@/api/base_data/params_config";
import chooseCheckbox from "@/views/base_data/params_config/item_views/choose_checkbox";
export default {
  name: "albumChoose",
  components: { chooseCheckbox },
  data() {
    return {
      allowAlbumChooseData: []
    };
  },
  methods: {
    backConigNav() {
      this.$emit("changeSowCom", "configNav");
    },
    formatter(row, column) {
      switch (row.describe) {
        case "company":
          return "地产企业";
          break;
        case "supervisor":
          return "监理单位";
          break;
        case "construction":
          return "施工单位";
          break;
      }
    },
    getAllowAlbumChooseListFunc() {
      const msg = this.$message({
        message: "数据加载中",
        type: "info",
        duration: 0
      });
      getAllowAlbumChooseList()
        .then(resp => {
          msg.close();
          this.allowAlbumChooseData = resp.result;
          this.allowAlbumChooseData.map(e => {
            e.value = e.value === "1" ? true : false;
          });
        })
        .catch(err => {
          console.log(err);
          msg.close();
          this.$message.error("请求失败");
        });
    },
    editAllowAlbumChooseListFunc(paramsObj) {
      const msg = this.$message({
        message: "数据加载中",
        type: "info",
        duration: 0
      });
      let _value = null;
      if (paramsObj.value) {
        _value = "1";
      } else {
        _value = "0";
      }
      editAllowAlbumChooseList({
        id: paramsObj.id,
        paramsObj: { value: _value }
      })
        .then(resp => {
          msg.close();
        })
        .catch(err => {
          console.log(err);
          msg.close();
          this.$message.error("请求失败");
          paramsObj.value = !paramsObj.value;
        });
    }
  },
  created() {
    this.getAllowAlbumChooseListFunc();
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
