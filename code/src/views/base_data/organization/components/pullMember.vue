<template>
  <publicPopups v-show="true" title-text="添加人员" width="800px" v-on="$listeners" @closePupupsBox="closeHandle">
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
            <span>组织架构</span>
          </div>
          <el-tree
            ref="organTree"
            :data="organTreeData"
            :props="organTreeProp"
            :expand-on-click-node="false"
            node-key="id"
            highlight-current
            current-node-key
            class="organization-tree"/>
        </el-aside>
        <el-main class="main-cont-wrap">
          <div class="header-title">
            <span>人员列表</span>
          </div>
          <el-form :model="searchFormData" :inline="true" class="search-wrap">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="searchFormData.name" size="small" placeholder="请输入姓名"/>
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="searchFormData.phone" size="small" placeholder="请输入手机号"/>
            </el-form-item>
            <el-form-item class="form-btn-wrap">
              <el-button type="primary" size="small">查询</el-button>
              <el-button size="small">重置</el-button>
            </el-form-item>
          </el-form>
          <el-table
            ref="membersTable"
            :data="membersTableData"
            :header-row-class-name="() => 'table-header'"
            size="mini"
            class="member-table">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column prop="name" width="100" label="姓名" align="center" />
            <el-table-column prop="phone" label="联系方式" align="center" />
            <el-table-column prop="department" width="180" label="所属部门" align="center" />
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
import { gerPersons } from '@/api/base_data/organization'
export default {
  components: { PublicPopups },
  props: {
    organTreeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    organTreeProp: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      searchFormData: {
        name: '',
        phone: ''
      },
      membersTableData: [],
      selectedmemberList: [],
      tableLoading: false,
      pageTotal: 25
    }
  },
  created() {
    this.gerPersonsFunc()
  },
  methods: {
    pageChangeHandle(index) {
      console.log('change page', index)
      this.gerPersonsFunc({ pageIndex: index - 1 })
    },
    gerPersonsFunc(obj = {}) {
      const { pageIndex } = obj
      const params = {
        'terms[0].column': 'name',
        'terms[0].value': 'zmb1',
        'terms[0].column': 'phone',
        'terms[0].value': '13760026661',
        pageSize: 4,
        pageIndex: pageIndex || 0
      }
      gerPersons(params).then(resp => {
        const data = resp.result
        this.membersTableData = data.data
        this.pageTotal = data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    // handleNodeClick(data, node, com) {
    //   this.$nextTick(function() {
    //     this.$refs.organTree.setCurrentKey(data.id)
    //   })
    //   this.tableLoading = true
    //   this.gerPersonsFunc(data)
    // },
    closeHandle() {
      // 重置数据
      this.$emit('submitComplete', false, 'pullMember')
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/element-ui.scss";

.selected-member-warp {
  height: 100%;
  margin-top: 25px;
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
    height: 420px;
    margin-top: 10px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    .organization-tree {
      font-size: 14px;
      // min-width: 200px;
      // height: 350px;
      padding: 10px;
      .el-tree-node__content {
        margin: 5px 0;
      }
    }
  }
  .main-cont-wrap {
    padding: 0;
    width: 500px;
    height: 420px;
    margin: 10px 0 0 20px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    .search-wrap {
      padding: 5px 20px;
      .el-form-item {
        margin: 10px 0;
        .el-input {
          width: 110px;
        }
      }
      .form-btn-wrap {
        margin-left: 30px ;
      }
    }
    .el-pagination {
      margin-top: 20px;
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
.custom-tree-node {
  @include flex-layout(space-between, center, null, null);
  padding: 4px 8px;
  flex: 1;
  .tree-edit-btn {
    padding: 3px;
  }

  &.is-selected {
    background: #f5f5f5;
    border-radius: 8px;
  }
}
</style>
