<template>
  <publicPopups v-loading="containerLoading" v-show="true" title-text="添加人员" width="800px" v-on="$listeners" @closePopupsBox="closeHandle" @formConfirm="submitMember">
    <template slot="main-content">
      <div class="selected-member-warp">
        <div class="title-text">已选择：</div>
        <div class="selected-member-item-wrap">
          <span
            v-for="(item, idx) in selectedmemberList"
            :key="idx"
            class="selected-member-item">
            {{ item.name }}
            <i class="el-icon-close" />
          </span>
        </div>
      </div>
      <el-container class="content-container">
        <el-aside width="no" class="side-tree-wrap">
          <div class="header-title">
            <span>供应商</span>
          </div>
          <el-tree
            ref="suppTree"
            :data="suppTreeData"
            :props="suppTreeProp"
            :expand-on-click-node="false"
            node-key="id"
            highlight-current
            current-node-key
            class="suppliers-tree"/>
        </el-aside>
        <el-main class="main-cont-wrap">
          <div class="header-title">
            <span>人员列表</span>
          </div>
          <el-form ref="searchForm" :model="searchFormData" :inline="true" class="search-wrap">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="searchFormData.name" size="small" placeholder="请输入姓名"/>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="searchFormData.phone" size="small" placeholder="请输入手机号"/>
            </el-form-item>
            <el-form-item class="form-btn-wrap">
              <el-button type="primary" size="small" @click="searchHandle">查询</el-button>
              <el-button size="small" @click="resetSearchForm">重置</el-button>
            </el-form-item>
          </el-form>
          <el-table
            v-loading="tableLoading"
            ref="membersTable"
            :data="membersTableData"
            :header-row-class-name="() => 'table-header'"
            show-overflow-tooltip
            height="235px"
            size="mini"
            class="member-table"
            @select="selectedHandle"
            @select-all="selectedAllHandle">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column prop="name" width="100" label="姓名" align="center" />
            <el-table-column prop="phone" label="联系方式" align="center" />
            <el-table-column prop="department" width="170" label="所属部门" align="center" />
            <el-table-column prop="position" label="岗位" align="center" />
          </el-table>
          <el-pagination
            :total="pageTotal"
            :page-size="4"
            :pager-count="5"
            background
            layout="prev, pager, next, jumper"
            @current-change="pageChangeHandle"/>
        </el-main>
      </el-container>
    </template>
  </publicPopups>
</template>
<script>
import PublicPopups from '@/components/Pop-ups/PublicPopups'
import { gerPersons, addPostMember } from '@/api/base_data/suppliers'
export default {
  components: { PublicPopups },
  props: {
    suppTreeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    suppTreeProp: {
      type: Object,
      default: () => {
        return {}
      }
    },
    positionData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    boxShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchFormData: {
        name: '',
        phone: ''
      },
      membersTableData: [],
      selectedmemberList: [], // 保存已选择的人员数据
      containerLoading: false,
      tableLoading: false,
      pageTotal: 25
    }
  },
  watch: {
    boxShow: function(newVal) {
      if (newVal) {
        this.gerPersonsFunc()
      }
    }
  },
  // created() {
  //   this.gerPersonsFunc()
  // },
  methods: {
    // 分页处理
    pageChangeHandle(index) {
      this.gerPersonsFunc({ pageIndex: index - 1 })
    },
    // 获取人员数据
    gerPersonsFunc(obj = {}) {
      const { pageIndex, name, phone } = obj
      const params = {
        'terms[0].column': 'name',
        'terms[0].value': name || '',
        'terms[1].column': 'phone',
        'terms[1].value': phone || '',
        pageSize: 4,
        pageIndex: pageIndex || 0
      }
      this.tableLoading = true
      gerPersons(params).then(resp => {
        const data = resp.result
        this.membersTableData = data.data
        this.pageTotal = data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // 按条件搜索人员处理
    searchHandle() {
      const searchData = this.searchFormData
      const param = {
        name: searchData.name,
        phone: searchData.phone
      }
      this.gerPersonsFunc(param)
    },
    // 单选处理
    selectedHandle(val, row) {
      if (val.includes(row)) {
        this.selectedmemberList.push(row)
      } else {
        const index = this.selectedmemberList.findIndex(item => {
          return item === row
        })
        this.selectedmemberList.splice(index, 1)
      }
    },
    // 全选处理
    selectedAllHandle(val) {
      if (val.length === 0 && this.selectedmemberList.length > 0) {
        // 取消选择
        const _arr = []
        this.selectedmemberList.forEach(item => {
          if (!this.membersTableData.includes(item)) {
            _arr.push(item)
          }
        })
        this.selectedmemberList = _arr
      } else {
        // 添加选择
        val.forEach(item => {
          if (!this.selectedmemberList.includes(item)) {
            this.selectedmemberList.push(item)
          }
        })
      }
    },
    // 提交人员信息绑定岗位
    submitMember() {
      this.$confirm('确定添加?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.containerLoading = true
        const positionId = this.positionData.positionId
        const personIds = []
        this.selectedmemberList.forEach(item => {
          personIds.push(item.personId)
        })
        addPostMember(positionId, personIds).then(resp => {
          this.containerLoading = false
          this.$message({
            showClose: false,
            message: '添加成功',
            type: 'success',
            duration: 3 * 1000
          })
        }).catch(() => {
          this.containerLoading = false
        })
      })
    },
    // 重置表单
    resetSearchForm() {
      this.$refs.searchForm.resetFields()
    },
    // handleNodeClick(data, node, com) {
    //   this.$nextTick(function() {
    //     this.$refs.suppTree.setCurrentKey(data.id)
    //   })
    //   this.tableLoading = true
    //   this.gerPersonsFunc(data)
    // },
    closeHandle() {
      // 重置数据
      this.$refs.searchForm.resetFields()
      this.$emit('submitComplete', false, 'pullMember')
      this.selectedmemberList = []
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/element-ui.scss";

.selected-member-warp {
  height: 100%;
  margin-top: 15px;
  font-size: 12px;
  padding: 5px;
  @include flex-layout(flex-start, flex-start, nowrap, null);
  .title-text {
    font-weight: bold;
    white-space: nowrap;
    padding: 3px;
  }
  .selected-member-item-wrap {
    @include flex-layout(flex-start, flex-start, wrap, null);
    .selected-member-item {
      background: #e9eaec;
      border-radius: 5px;
      padding: 3px 5px;
      margin: 0 8px 10px 0;
      i {
        cursor: pointer;
      }
    }
  }
}
.content-container {
  .header-title {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    text-indent: 20px;
    border-bottom: 1px solid #e6e6e6;
  }
  .side-tree-wrap {
    padding: 0;
    width: 200px;
    height: 405px;
    margin-top: 10px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    .suppliers-tree {
      font-size: 14px;
      // min-width: 200px;
      // height: 350px;
      padding: 10px;
    }
  }
  .main-cont-wrap {
    padding: 0;
    width: 500px;
    height: 405px;
    margin: 10px 0 0 20px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    .search-wrap {
      padding: 5px 20px;
      .el-form-item {
        margin: 10px 0;
        .el-input {
          width: 120px;
        }
      }
      .form-btn-wrap {
        margin-left: 30px ;
      }
    }
    .member-table {
      &/deep/.el-table__header th {
        padding: 2px;
        background: #f8f8f9;
        border-top: 1px solid #80848f;
        height: 46px;
      }
      &/deep/ td {
        padding: 2px !important;
        height: 46px;
      }
    }
    .el-pagination {
      margin-top: 15px;
      float: right;
    }
    .el-button {
      padding: 7px;
    }
  }
  .footer {
    .el-button {
      padding: 7px;
    }
  }
}
</style>
