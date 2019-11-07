<template>
  <el-container>
    <el-main>
      <div class="header">
        <span class="el-icon-tickets">业务参数</span>
      </div>
      <div v-loading="isLoading" class="params-item-wrap">
        <el-row v-for="(item, idx) in paramsItems" :key="idx" type="flex" justify="space-between">
          <el-col>
            <span>{{ item.name }}</span>
          </el-col>
          <el-col :span="7" align="right" v-if="item.name==='默认整改期限'">
            <template v-if="isSettingDefaultChangeDeadline===false">
              <span>{{ dafaultChangeDeadlineMsg.text }}&nbsp;&nbsp;</span>
              <el-button
                :disabled="!(pagePermission.update)"
                type="primary"
                size="small"
                @click="isSettingDefaultChangeDeadline=true"
              >设置</el-button>
            </template>
            <template v-else>
              <el-button
                :disabled="!(pagePermission.update)"
                type="text"
                size="small"
                @click="editDafaultChangeDeadlineFunc(dafaultChangeDeadlineMsg)"
              >保存</el-button>
              <el-button
                :disabled="!(pagePermission.update)"
                type="text"
                size="small"
                @click="isSettingDefaultChangeDeadline=false;defaultChangeDeadline=dafaultChangeDeadlineMsg.value"
              >取消</el-button>
              <span>&nbsp;&nbsp;</span>
              <el-input
                v-model="defaultChangeDeadline"
                :disabled="isSettingDefaultChangeDeadline===false"
                :min="0"
                type="number"
                style="max-width: 70px"
              />
            </template>
          </el-col>
          <el-col :span="7" align="right" v-else-if="item.name==='精装修验收工序项数'">
            <template v-if="isSettingExquisiteAcceptItemNum===false">
              <span>{{ exquisiteAcceptItemNumMsg.text }}&nbsp;&nbsp;</span>
              <el-button
                :disabled="!(pagePermission.update)"
                type="primary"
                size="small"
                @click="isSettingExquisiteAcceptItemNum=true"
              >设置</el-button>
            </template>
            <template v-else>
              <el-button
                :disabled="!(pagePermission.update)"
                type="text"
                size="small"
                @click="editExquisiteAcceptItemNumFunc(exquisiteAcceptItemNumMsg)"
              >保存</el-button>
              <el-button
                :disabled="!(pagePermission.update)"
                type="text"
                size="small"
                @click="isSettingExquisiteAcceptItemNum=false;exquisiteAcceptItemNum=exquisiteAcceptItemNumMsg.value"
              >取消</el-button>
              <span>&nbsp;&nbsp;</span>
              <el-input
                v-model="exquisiteAcceptItemNum"
                :disabled="isSettingExquisiteAcceptItemNum===false"
                :min="0"
                type="number"
                style="max-width: 70px"
              />
            </template>
          </el-col>
          <el-col :span="7" align="right" v-else>
            <!-- <el-button
              :disabled="componentDatas[item.id] === undefined"
              type="primary"
              size="small"
              @click="showCurConfigBox(item)"
            >设置</el-button>-->
            <el-button
              :disabled="!(pagePermission.update)"
              type="primary"
              size="small"
              @click="showCurConfigBox(item)"
            >设置</el-button>
          </el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { getDictionary } from "@/api/dictionary";
import permissionOfPage from "@/mixins/permissionOfPage";
import {
  getDafaultChangeDeadline,
  editDafaultChangeDeadline,
  getExquisiteAcceptItemNum,
  editExquisiteAcceptItemNum
} from "@/api/base_data/params_config";
export default {
  mixins: [permissionOfPage],
  props: {
    componentDatas: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      paramsItems: [
        {
          classifiedId: "problem_level",
          createTime: 1562033785402,
          creatorId: "0",
          creatorIdProperty: "creatorId",
          // describe: "问题等级",
          describe: "日常检查问题等级",
          id: "problem_level",
          // name: "问题等级",
          name: "日常检查问题等级",
          status: 1
        },
        {
          classifiedId: "default_rectification_period",
          createTime: 1569220544636,
          creatorId: "0",
          creatorIdProperty: "creatorId",
          describe: "默认整改期限",
          id: "default_rectification_period",
          name: "默认整改期限",
          status: 1
        },
        {
          classifiedId: "album_choose",
          createTime: 1569671693959,
          creatorId: "0",
          creatorIdProperty: "creatorId",
          describe: "允许相册选择",
          id: "album_choose",
          name: "允许相册选择",
          status: 1
        },
        {
          classifiedId: "photo_setting",
          createTime: 1569672951379,
          creatorId: "0",
          creatorIdProperty: "creatorId",
          describe: "照片必填设置",
          id: "photo_setting",
          name: "照片必填设置",
          status: 1
        },
        {
          classifiedId: "project_key_node",
          createTime: 1569673868368,
          creatorId: "0",
          creatorIdProperty: "creatorId",
          describe: "项目关键节点",
          id: "project_key_node",
          name: "项目关键节点",
          status: 1
        },
        {
          classifiedId: "measured_quantity_type",
          createTime: 1569674481566,
          creatorId: "0",
          creatorIdProperty: "creatorId",
          describe: "实测实量录入模式",
          id: "measured_quantity_type",
          name: "实测实量录入模式",
          status: 1
        },
        {
          classifiedId: "exquisite_accept_item_num",
          createTime: 1569675070564,
          creatorId: "0",
          creatorIdProperty: "creatorId",
          describe: "精装修验收工序项数",
          id: "exquisite_accept_item_num",
          name: "精装修验收工序项数",
          status: 1
        }
        // 后面是目前不需要显示的配置项，先保留方便以后使用
        // {
        //   classifiedId: "checkType",
        //   createTime: 1572255334716,
        //   creatorId: "0",
        //   creatorIdProperty: "creatorId",
        //   describe: "检查分类",
        //   id: "checkType",
        //   name: "检查分类",
        //   status: 1
        // },
        // {
        //   classifiedId: "city",
        //   createTime: 1558581703363,
        //   creatorId: "0",
        //   creatorIdProperty: "creatorId",
        //   describe: "城市",
        //   id: "city",
        //   name: "城市",
        //   status: 1
        // },
        // {
        //   classifiedId: "construction_type",
        //   createTime: 1558581548185,
        //   creatorId: "0",
        //   creatorIdProperty: "creatorId",
        //   describe: "施工阶段",
        //   id: "construction_type",
        //   name: "施工阶段",
        //   status: 1
        // },
        // {
        //   classifiedId: "default_passing_rate",
        //   createTime: 1566803529428,
        //   creatorId: "0",
        //   creatorIdProperty: "creatorId",
        //   describe: "默认实测实量通过率",
        //   id: "default_passing_rate",
        //   name: "默认实测实量通过率",
        //   status: 1
        // },
        // {
        //   classifiedId: "delivery_type",
        //   createTime: 1558424800691,
        //   creatorId: "0",
        //   creatorIdProperty: "creatorId",
        //   describe: "交付类型",
        //   id: "delivery_type",
        //   name: "交付类型",
        //   status: 1
        // },
        // {
        //   classifiedId: "org_type",
        //   createTime: 1557211113185,
        //   creatorId: "0",
        //   creatorIdProperty: "creatorId",
        //   describe: "组织的性质",
        //   id: "org_type",
        //   name: "组织性质",
        //   status: 1
        // },
        // {
        //   classifiedId: "permission_type",
        //   createTime: 1571227858319,
        //   creatorId: "0",
        //   creatorIdProperty: "creatorId",
        //   describe: "权限种类",
        //   id: "permission_type",
        //   name: "权限种类",
        //   status: 1
        // },
        // {
        //   classifiedId: "professionType",
        //   createTime: 1561014450431,
        //   creatorId: "0",
        //   creatorIdProperty: "creatorId",
        //   describe: "专业分类",
        //   id: "professionType",
        //   name: "专业分类",
        //   status: 1
        // },
        // {
        //   classifiedId: "project_status",
        //   createTime: 1558424488618,
        //   creatorId: "0",
        //   creatorIdProperty: "creatorId",
        //   describe: "项目状态",
        //   id: "project_status",
        //   name: "项目状态",
        //   status: 1
        // },
        // {
        //   classifiedId: "show_file_household_tab",
        //   createTime: 1566803712692,
        //   creatorId: "0",
        //   creatorIdProperty: "creatorId",
        //   describe: "一档一户展示tab",
        //   id: "show_file_household_tab",
        //   name: "一档一户展示tab",
        //   status: 1
        // },
        // {
        //   classifiedId: "supplier_type",
        //   createTime: 1557211575188,
        //   creatorId: "0",
        //   creatorIdProperty: "creatorId",
        //   describe: "供应商的性质",
        //   id: "supplier_type",
        //   name: "供应商性质",
        //   status: 1
        // },
        // {
        //   classifiedId: "work_type",
        //   createTime: 1569737962906,
        //   creatorId: "0",
        //   creatorIdProperty: "creatorId",
        //   describe: "工种",
        //   id: "work_type",
        //   name: "工种",
        //   status: 1
        // }
      ],
      showComponent: {},
      isLoading: false,
      isSettingDefaultChangeDeadline: false,
      dafaultChangeDeadlineMsg: {},
      defaultChangeDeadline: 7,
      isSettingExquisiteAcceptItemNum: false,
      exquisiteAcceptItemNumMsg: {},
      exquisiteAcceptItemNum: 2
    };
  },
  methods: {
    showCurConfigBox(item) {
      this.$emit("changeSowCom", item.id, item);
    },
    getDafaultChangeDeadlineFunc() {
      const msg = this.$message({
        message: "数据加载中",
        type: "info",
        duration: 0
      });
      getDafaultChangeDeadline()
        .then(resp => {
          this.dafaultChangeDeadlineMsg = resp.result[0];
          this.defaultChangeDeadline = this.dafaultChangeDeadlineMsg.value;
          msg.close();
        })
        .catch(err => {
          console.log(err);
          msg.close();
          this.$message.error("请求失败");
        });
    },
    editDafaultChangeDeadlineFunc(msgObj) {
      const msg = this.$message({
        message: "数据加载中",
        type: "info",
        duration: 0
      });
      msgObj.value = this.defaultChangeDeadline;
      msgObj.describe = msgObj.text = this.defaultChangeDeadline + "天";
      editDafaultChangeDeadline({ id: msgObj.id, paramsObj: msgObj })
        .then(resp => {
          msg.close();
          this.isSettingDefaultChangeDeadline = false;
        })
        .catch(err => {
          console.log(err);
          msg.close();
          this.$message.error("请求失败");
        });
    },
    getExquisiteAcceptItemNumFunc() {
      const msg = this.$message({
        message: "数据加载中",
        type: "info",
        duration: 0
      });
      getExquisiteAcceptItemNum()
        .then(resp => {
          this.exquisiteAcceptItemNumMsg = resp.result[0];
          this.exquisiteAcceptItemNum = this.exquisiteAcceptItemNumMsg.value;
          msg.close();
        })
        .catch(err => {
          console.log(err);
          msg.close();
          this.$message.error("请求失败");
        });
    },
    editExquisiteAcceptItemNumFunc(msgObj) {
      const msg = this.$message({
        message: "数据加载中",
        type: "info",
        duration: 0
      });
      msgObj.value = this.exquisiteAcceptItemNum;
      msgObj.text = this.exquisiteAcceptItemNum + "项";
      editDafaultChangeDeadline({ id: msgObj.id, paramsObj: msgObj })
        .then(resp => {
          msg.close();
          this.isSettingExquisiteAcceptItemNum = false;
        })
        .catch(err => {
          console.log(err);
          msg.close();
          this.$message.error("请求失败");
        });
    }
  },
  created() {
    console.log("componentDatas", this.componentDatas);
    // 由于返回的一部分数据是不需要的，所以暂时直接写死在data里面
    // this.isLoading = true;
    // getDictionary()
    //   .then(resp => {
    //     this.paramsItems = resp.result;
    //     this.isLoading = false;
    //   })
    //   .catch(() => {
    //     this.isLoading = false;
    //   });
    this.getDafaultChangeDeadlineFunc();
    this.getExquisiteAcceptItemNumFunc();
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
  }
}
</style>
