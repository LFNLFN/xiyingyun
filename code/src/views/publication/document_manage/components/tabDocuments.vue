<template>
  <div class="main-content">
    <el-container>
      <el-aside width="none">
        <h3 class="title-text">{{ curTabName }}</h3>
        <el-tree
          ref="typetree"
          :data="typeTreeData"
          :props="typeTreeProp"
          node-key="id"
          class="type-tree">
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node">
            <span>
              {{ data.name }}
            </span>
            <span>
              <el-dropdown size="small" @command="(order) => handleDropdown(order, data)">
                <span class="el-icon-s-tools tree-icon-btn" />
                <el-dropdown-menu slot="dropdown">
                  <template v-if="data.level === 0">
                    <el-dropdown-item command="addBuilding">新增子级</el-dropdown-item>
                  </template>
                  <template v-else-if="data.level === 1">
                    <el-dropdown-item command="addChild">新增子级</el-dropdown-item>
                    <el-dropdown-item command="editChild">编辑</el-dropdown-item>
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>
        </el-tree>
      </el-aside>
      <el-main>
        <div class="header">
          <h3 class="title-text">文档列表</h3>
          <div class="btn-wrap">
            <el-button type="primary" size="small">新增</el-button>
          </div>
        </div>
        <el-table
          :data="docuentTableData"
          size="small"
          class="no-border-gary-head" >
          <el-table-column prop="name" label="文档名称" />
          <el-table-column width="300" label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="small" class="no-border">移动端查看</el-button>
              <el-button size="small" class="no-border">预览</el-button>
              <el-button size="small" class="no-border">编辑</el-button>
              <el-button size="small" class="no-border">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="pageTotal"
          :page-size="10"
          :page-sizes="[10, 20, 30, 40]"
          :current-page="pageIndex"
          background
          layout="total, prev, pager, next, sizes, jumper"
          class="pager-wrap"
          @current-change="pageChangeHandle"
          @size-change="pageSizeChangeHandle"/>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      curTabName: '企业文档',
      typeTreeData: [
        {
          name: '企业文档',
          level: 0,
          children: [
            {
              level: 1,
              name: '集团文档'
            },
            {
              level: 1,
              name: '区域文档'
            }
          ]
        }
      ],
      typeTreeProp: {
        label: 'name',
        children: 'children'
      },
      docuentTableData: [
        {
          name: '房地产信息化系统使用指引'
        },
        {
          name: '实测实量数据同步指引'
        }
      ],
      pageIndex: 0,
      pageTotal: 10
    }
  },
  methods: {
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this[key] = obj[key]
      })
    },
    handleDropdown(order, data) {
      console.log('order', order)
    },
    pageChangeHandle(page) {
      this.pageIndex = page
    },
    pageSizeChangeHandle(val) {
      console.log('val', val)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.main-content {
  height: calc(100vh - 150px);
  background: #fff;
  .el-container {
    height: 100%;
    .title-text {
      font-weight: normal;
      // margin: 0 0 20px 0;
    }
    .el-aside {
      width: 260px;
      height: 100%;
      padding: 0 20px 20px 20px;
      border-right: 1px solid #d4d5d6;
    }
    .el-main {
      padding: 0 20px 20px 20px;
      .header {
        @include flex-layout(space-between, center, null, null);
      }
      .el-table {
        margin-top: 20px;
        & /deep/.nowrap-row {
          .cell {
            white-space: nowrap;
          }
        }
      }
      .pager-wrap {
        text-align: center;
        margin-top: 20px;
      }
    }
  }
  &/deep/.custom-tree-node {
    font-size: 14px;
    .tree-icon-btn {
      display: none;
      font-size: 16px;
      margin-left: 5px;
    }
    &:hover {
      .tree-icon-btn {
        display: inline-block;
      }
    }
    &.is-active {
      background: #daecfe;
      border-radius: 5px;
    }
  }
}
</style>
