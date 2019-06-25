<template>
  <div class="main-content">
    <div class="filter-wrap">
      <el-form
        :inline="true"
        label-position="right"
        label-width="90px"
        class="filter-form">
        <el-form-item label="快捷筛选:" class="block-item">
          <el-checkbox-group v-model="filterFormData.checkedList">
            <el-checkbox-button label="已逾期" />
            <el-checkbox-button label="我整改的" />
          </el-checkbox-group>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="项目名称:">
              <el-select v-model="filterFormData.name" size="small">
                <el-option
                  value="移动" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="楼栋:">
              <el-select v-model="filterFormData.name" size="small">
                <el-option
                  value="移动" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="责任单位:">
              <el-select v-model="filterFormData.name" size="small">
                <el-option
                  value="移动" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间:">
              <el-date-picker
                v-model="filterFormData.name"
                type="daterange"
                size="small"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="date-select" />
            </el-form-item>
          </el-col>
          <el-form-item class="btn-wrap">
            <el-button type="primary" size="mini">查询</el-button>
            <el-button size="mini">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="problem-list-wrap">
      <el-card class="problem-list-item">
        <div class="img-wrap">
          <el-image src="" class="problem-img" />
        </div>
        <div class="detail-wrap">
          <div class="header">
            <span>待销项</span>
            <span>2019-05-07</span>
          </div>
          <p class="content-text">卷材与基底粘结不牢、空鼓、搭接宽度不够、收口错误、铺设范围等</p>
          <div class="footer">
            <span>1栋1单元1层101</span>
            <span>一般</span>
          </div>
        </div>
      </el-card>
    </div>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      filterFormData: {
        checkedList: [],
        name: ''
      },
      pageIndex: 0,
      pageTotal: 10,
      fullFilterForm: false
    }
  },
  methods: {
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
  .filter-wrap {
    .filter-form {
      padding: 20px;
      background: #fff;
      .el-form-item {
        margin: 0 0 15px 0;
        white-space: nowrap;
        &.block-item {
          display: block;
        }
        &.btn-wrap {
          padding-left: 20px;
        }
        .el-select, .date-select {
          width: 180px;
        }
        .form-ctrl-btn {
          font-size: 14px;
        }
      }
    }
  }
  .problem-list-wrap {
    .problem-list-item {
      width: 200px;
      height: 250px;
      font-size: 14px;
      margin: 15px 15px 0 0;
      &/deep/.el-card__body {
        padding: 0;
      }
      .img-wrap {
        width: 200px;
        height: 132px;
        @include flex-layout(center, center, null, null);
        problem-img {
          width: 100%;
        }
      }
      .detail-wrap {
        padding: 10px 20px;
        .header, .footer {
          @include flex-layout(space-between, center, null, null);
        }
        .content-text {
          height: 40px;
          margin: 12px 0;
          color: #80848f;
          line-height: 20px;
          @include ellipsis-textarea(2)
        }
        .footer {
          color: #80848f;
        }
      }
    }
  }
  .pager-wrap {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
