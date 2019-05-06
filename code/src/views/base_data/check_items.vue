<template>
  <el-container class="container">
    <el-header height="none" class="router-tab-wrap">
      <el-button
        v-for="(tab, idx) in routerTabData"
        :key="idx"
        :class="{active: routerTabCActiveCtrl(tab)}"
        type="primary"
        plain
        class="router-tab-item"
        @click="changeCheckItem(tab)">{{ tab.title }}
      </el-button>
    </el-header>
    <el-container class="main-wrap">
      <el-aside width="250px" class="side-wrap">
        <div class="header">
          <span>{{ checkItemTitle }}检查项</span>
          <span class="el-icon-circle-plus add-check-item-btn" />
        </div>
        <el-tree :data="checkItemTreeData" :props="checkItemTreeProps" class="check-item-tree" />
      </el-aside>
      <el-main class="main-wrap">
        <div class="check-index-wrap">
          <div class="header">
            <span>检查索引</span>
            <el-button type="primary" size="small">保存</el-button>
          </div>
          <el-input v-model="checkIndex" type="textarea" rows="4" placeholder="请输入索引值" class="check-index-ipt" />
        </div>
        <div class="common-problem-wrap">
          <div class="header">
            <span>常见问题项</span>
            <el-button type="primary" size="small">添加</el-button>
          </div>
          <div class="content">
            <el-table ref="probTable" :data="probTableData" border>
              <el-table-column prop="description" label="问题描述" align="center" />
              <el-table-column prop="level" width="100" label="姓名" align="center" />
              <el-table-column width="150" label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini">编辑</el-button>
                  <el-button type="primary" size="mini">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :total="probPageTotal"
              :pager-size="5"
              background
              layout="prev, pager, next, jumper"/>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      routerTabData: this.$store.getters.checkItems,
      checkItemTitle: '质量风险',
      checkItemTreeData: [
        {
          name: '土建工程',
          children: [
            {
              name: '地下防漏工程'
            },
            {
              name: '钢筋工程'
            },
            {
              name: '模板工程'
            }
          ]
        },
        {
          name: '水电工程'
        },
        {
          name: '装修工程'
        }
      ],
      checkItemTreeProps: {
        label: 'name',
        children: 'children'
      },
      checkIndex: '',
      probTableData: [
        {
          description: '防水施工前基层处理不到位，钢筋头外露、孔洞未修补、模板拼缝错台、阴阳角没做R角等；',
          level: '一般'
        },
        {
          description: '防水施工前基层处理不到位，钢筋头外露、孔洞未修补、模板拼缝错台、阴阳角没做R角等；',
          level: '紧急'
        },
        {
          description: '防水施工前基层处理不到位，钢筋头外露、孔洞未修补、模板拼缝错台、阴阳角没做R角等；',
          level: '加急'
        }
      ],
      probPageTotal: 20
    }
  },
  beforeRouteUpdate(to, from, next) {
    next()
  },
  methods: {
    routerTabCActiveCtrl(tab) {
      const itemId = this.$route.params.checkItemsId
      return tab.name === itemId
    },
    changeCheckItem(tab) {
      this.checkItemTitle = tab.title
      this.$router.push(tab.path)
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.container {
  .header {
    @include gray-header;
  }
  .router-tab-wrap {
    padding: 10px 10px;
    margin: 15px;
    .router-tab-item {
      margin: 0 10px;
      &.active {
        background: #3a8ee6  !important;
        border-color: #3a8ee6 !important;
        color: #fff !important;
        outline: 0;
      }
    }
  }
  .main-wrap {
    .side-wrap {
      margin: 20px;
      min-height: 300px;
      @include boxShadow-container;
      .check-item-tree {
        padding: 10px;
      }
      .add-check-item-btn {
        font-size: 28px;
        color: #409EFF;
        cursor: pointer;
      }
    }
    .main-wrap {
      .check-index-wrap {
        @include boxShadow-container;
        .check-index-ipt {
          margin: 10px 2%;
          width: 96%;
        }
      }
      .common-problem-wrap {
        margin-top: 30px;
        @include boxShadow-container;
        .content {
          padding: 15px;
          .el-pagination {
            text-align: center;
            margin-top: 20px;
          }
        }
      }
    }
  }
}
</style>
