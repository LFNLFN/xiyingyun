<template>
  <el-container class="detail-container">
    <el-header class="detail-header" height="no">
      <div class="detail-header-title">
        <span>
          <i class="el-icon-tickets"/>
          基础信息
        </span>
      </div>
      <el-row class="detail-header-row">
        <el-col :span="12" class="detail-header-col"><span>公司名称： {{ suppInfo.fullName }}</span></el-col>
        <el-col :span="12" class="detail-header-col"><span>公司简称： {{ suppInfo.name }}</span></el-col>
      </el-row>
      <el-row class="detail-header-row">
        <el-col :span="12" class="detail-header-col"><span>负责人： {{ suppInfo.inCharge }}</span></el-col>
        <el-col :span="12" class="detail-header-col"><span>联系方式： {{ suppInfo.contactNum }}</span></el-col>
      </el-row>
    </el-header>
    <el-main class="detail-main">
      <div class="detail-main-title">
        <span>
          <i class="el-icon-tickets"/>
          数据列表
        </span>
        <div class="staff-add-btns-wrap">
          <el-button type="primary" size="small" icon="el-icon-download" @click="pullStaffBoxCtrl">引入成员</el-button>
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addStaffBoxCtrl">新增成员</el-button>
        </div>
      </div>
      <el-table v-loading="isLoading" ref="staffTable" :data="staffTableData" border class="staff-table">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="name" width="100" label="姓名" align="center" />
        <el-table-column prop="phone" label="手机号码" align="center" />
        <el-table-column prop="work" label="职位描述" align="center" />
        <el-table-column label="是否是项目经理" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isManager" active-color="#13ce66" inactive-color="#6e6e6e" />
          </template>
        </el-table-column>
        <el-table-column width="180" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" class="suppliers-table-btn">编辑</el-button>
            <el-button size="mini" type="primary" class="suppliers-table-btn">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <div class="footer-operate-wrap">
        <el-checkbox v-model="allCheckdeValue" border size="mini" @change.native="tableToggleSelection">全选</el-checkbox>
        <el-select v-model="batchSelectedValue" clearable size="mini" placeholder="批量操作">
          <el-option value="changPassword" label="更改密码" />
          <el-option value="delete" label="禁用" />
        </el-select>
        <el-button type="primary" size="mini">确定</el-button>
      </div>
      <el-pagination
        :total="pageTotal"
        background
        layout="prev, pager, next, jumper"
        @current-change="pageChangeHandle"/>
    </el-footer>
    <addStaffBox v-show="addStaffBoxShow" @closePupupsBox="addStaffBoxCtrl"/>
    <PullStaffBox v-show="pullStaffBoxShow" @closePupupsBox="pullStaffBoxCtrl"/>
  </el-container>
</template>
<script>
import AddStaffBox from '@/views/base_data/suppliers/components/AddStaffBox'
import PullStaffBox from '@/views/base_data/suppliers/components/PullStaffBox'
export default{
  components: { AddStaffBox, PullStaffBox },
  // name: 'Details'
  data() {
    return {
      suppInfo: {
        fullName: '广州市席英一局',
        name: '席英一局',
        inCharge: '席英一局',
        contactNum: '13400000001'
      },
      staffTableData: [
        {
          name: '厂长',
          phone: '13743967777',
          work: 'edg five jungle',
          isManager: true
        }
      ],
      staffTableCheckBoxVal: [],
      batchSelectedValue: '',
      pageTotal: 10,
      allCheckdeValue: false,
      addStaffBoxShow: false,
      pullStaffBoxShow: false,
      isLoading: false
    }
  },
  methods: {
    showSuppDetail() {
      this.$router.push('/base_data/suppliers/info')
    },
    addStaffBoxCtrl() {
      this.addStaffBoxShow = !this.addStaffBoxShow
    },
    pullStaffBoxCtrl() {
      this.pullStaffBoxShow = !this.pullStaffBoxShow
    },
    // 表格多选控制
    handleSelectionChange(val) {
      this.staffTableCheckBoxVal = val
      val.length === this.staffTableData.length ? this.allCheckdeValue = true : this.allCheckdeValue = false
    },
    // 控制表格全选
    tableToggleSelection(rows) {
      this.$refs.staffTable.toggleAllSelection()
    },
    // 点击分页按钮处理
    pageChangeHandle(val) {
      // const params = {
      //   pageIndex: val - 1,
      //   pageSize: 10
      // }
      // this.getUsersFunc(params)
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.detail-container {
  padding: 20px;
  .detail-header {
    @include boxShadow-container;
    .detail-header-title {
      @include flex-layout(space-between, center, null, null);
      @include gray-header;
    }
    .detail-header-row {
      padding: 25px 50px;
    }
  }
  .detail-main {
    margin-top: 30px;
    @include boxShadow-container;
    .detail-main-title {
      @include gray-header;
      .staff-add-btns-wrap {
        float: right;
        .el-button {
          padding: 7px;
        }
      }
    }
  }
  .el-footer {
    padding: 0;
    margin-top: 30px;
    @include flex-layout(space-between, center, null, wrap);
    .el-select {
      width: 100px;
      margin: 0 10px;
    }
    .footer-operate-wrap {
      @include flex-layout(null, center, null, nowrap);
    }
  }
}
</style>
