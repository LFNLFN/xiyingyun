<template>
  <el-container class="main-wrap">
    <el-aside width="250px" class="side-wrap">
      <div class="header">
        <span>{{ checkItemTitle }}检查项</span>
        <span class="el-icon-circle-plus add-check-item-btn" />
      </div>
      <el-tree :data="checkItemTreeData" :props="checkItemTreeProps" class="check-item-tree" />
    </el-aside>
    <el-main>
      <div class="check-index-wrap">
        <div class="header">
          <span>检查索引</span>
          <el-button type="primary" size="mini">保存</el-button>
        </div>
        <el-input v-model="checkIndex" type="textarea" rows="4" placeholder="请输入索引值" class="check-index-ipt" />
      </div>
      <div class="common-problem-wrap">
        <div class="header">
          <span>常见问题项</span>
          <el-button type="primary" size="mini">添加</el-button>
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
</template>
<script>
export default {
  data() {
    return {
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
  methods: {
    changTabShow(tab) {
      console.log(tab)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.main-wrap {
  .header {
    padding: 0 15px;
    height: 45px;
    border-bottom: 1px solid #ccc;
    @include flex-layout(space-between, center, null, null);
  }
  .side-wrap {
    // margin: 20px 0 20px 20px;
    min-height: 300px;
    background: #fff;
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
  .el-main {
    padding: 0 0 0 20px;
    .check-index-wrap {
      background: #fff;
      @include boxShadow-container;
      .check-index-ipt {
        margin: 10px 2%;
        width: 96%;
      }
    }
    .common-problem-wrap {
      background: #fff;
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
</style>
