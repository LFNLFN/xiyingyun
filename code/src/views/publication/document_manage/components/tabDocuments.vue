<template>
  <div class="main-content">
    <el-container>
      <el-aside width="none">
        <div class="tree-header flex-layout-tree">
          <h3 class="title-text">{{ curTabName }}</h3>
          <div slot-scope="{ node, data }" class="drowdown-wrap">
            <el-dropdown @command="(order) => handleDropdown(order, data)">
              <span class="el-dropdown-link">
                <i class="el-icon-s-tools el-icon--right"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="addDocType">新增文档分类</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
          >
            <el-dropdown size="small" @command="(order) => handleDropdown(order, data)">
              <span class="el-icon-s-tools tree-icon-btn"/>
              <el-dropdown-menu slot="dropdown">
                <template v-if="data.level === 0">
                  <el-dropdown-item command="addDocType">新增子级</el-dropdown-item>
                </template>
                <template v-else-if="data.level === 1">
                  <el-dropdown-item command="addChild">新增子级</el-dropdown-item>
                  <el-dropdown-item command="editChild">编辑</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </div>
        <el-tree
          ref="typetree"
          :data="documentTreeData"
          :props="typeTreeProp"
          node-key="id"
          class="type-tree"
          @node-click="getNodesMsg"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node"
          >
            <span>
              {{ data.name }}
            </span>
            <span>
              <el-dropdown size="small" @command="(order) => handleDropdown(order, data)">
                <span class="el-icon-s-tools tree-icon-btn" />
                <el-dropdown-menu slot="dropdown">
                  <template v-if="data.level === 0">
                    <!-- <el-dropdown-item command="addDocType">新增子级</el-dropdown-item> -->
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
          <div class="flex-layout">
            <h3 class="title-text">文档列表</h3>
            <el-select v-if="curTabName==='项目文档'" v-model="selectedProject" placeholder="请选择项目">
              <el-option
                v-for="item in projectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </div>
          <div class="btn-wrap">
            <el-button type="primary" size="small">新增</el-button>
          </div>
        </div>
        <el-table
          :data="documentTableData"
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
  props: {
    documentTreeData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      curTabName: '企业文档',
      typeTreeProp: {
        label: 'name',
        children: 'children'
      },
      documentTableData: [
        // {
        //   name: '房地产信息化系统使用指引'
        // },
        // {
        //   name: '实测实量数据同步指引'
        // }
      ],
      pageIndex: 0,
      pageTotal: 10,
      currentTreeNodeObj: {},
      selectedProject: null,
      projectOptions: [],
      addingTypeName: '新增测试分类'
    }
  },
  methods: {
    getNodesMsg(obj, node, component) {
      console.log(obj, node, component)
      this.currentTreeNodeObj = obj
      if (obj.level !== 0) {
        if (obj.children) {
          this.documentTableData = obj.children
        } else {
          this.documentTableData = []
          this.documentTableData[0] = obj
        }
      }
    },
    addDocType(data) {
      // console.log(data, 11);
      this.$prompt('请输入分类名', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      }).then(() => {
        const addingTypeName = this.addingTypeName
        const params = {
          'type': 0,
          'name': addingTypeName,
          'parentId': data.id
        }
        this.$emit('add-doc-type', params)
      }).catch((err) => { console.log(err) })
    },
    resetDataProperty(obj) {
      const _keys = Object.keys(obj)
      _keys.forEach(key => {
        this[key] = obj[key]
      })
    },
    handleDropdown(order, data) {
      this[order](data)
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
.flex-layout {
  width: 70%;
  @include flex-layout(flex-start, center, null, null);
  & > * {
    min-width: 4em;
    margin-right: 1em
  }
}
.flex-layout-tree {
  @include flex-layout(space-between, center, null, null);
}
</style>
