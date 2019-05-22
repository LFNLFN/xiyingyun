<template>
  <el-container direction="vertical">
    <el-main class="stage-info-watp">
      <div class="header">
        <span>基础信息</span>
      </div>
      <el-form class="stage-Info-form">
        <el-form-item label="项目名称">
          <el-input size="small" placeholder="请输入项目名称"/>
        </el-form-item>
        <el-form-item label="项目编码">
          <el-input size="small" placeholder="请输入项目编码"/>
        </el-form-item>
        <el-form-item label="项目地址">
          <el-input size="small" placeholder="请输入地址">
            <!-- <el-button slot="append">查询经纬度</el-button> -->
            <a slot="append" href="https://lbs.amap.com/console/show/picker" target="_blank">查询经纬度</a>
          </el-input>
        </el-form-item>
        <el-form-item label="项目状态">
          <el-select v-model="prjectStatusSel" size="small" placeholder="请选择">
            <el-option
              value="在建" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属公司">
          <el-input size="small"/>
        </el-form-item>
        <el-form-item label="所在城市">
          <el-select v-model="prjectStatusSel" size="small" placeholder="请选择">
            <el-option
              value="在建" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="prjectStatusSel" size="small" placeholder="请选择">
            <el-option
              value="在建" />
          </el-select>
        </el-form-item>
        <el-form-item label="建筑面积">
          <el-input size="small" placeholder="请输入地址">
            <span slot="append" class="area-text">㎡</span>
          </el-input>
        </el-form-item>
        <el-form-item label="交付类型">
          <el-select v-model="deliverTypeSel" size="small" placeholder="请选择">
            <el-option
              value="毛坯交付" />
          </el-select>
        </el-form-item>
        <el-form-item label="施工阶段">
          <el-select v-model="constructStageSel" size="small" placeholder="请选择">
            <el-option
              value="1阶段" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="aerialview-upload-wrap">
        <span class="title-text">上传鸟瞰图 (建议不超过50M)</span>
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/">
          <img :src="null">
          <i class="el-icon-plus" />
        </el-upload>
      </div>
    </el-main>
    <el-main class="house-type-wrap">
      <div class="header">
        <span>户型</span>
      </div>
      <div class="table-wrap">
        <el-table
          :data="houseTypeData"
          class="house-type-table">
          <!-- <template>
            <el-table-column label="名称" align="center">
              <template slot-scope="scope">
                <el-input size="small" placeholder="请输入户型名称"/>
              </template>
            </el-table-column>
            <el-table-column label="面积" align="center">
              <template slot-scope="scope">
                <el-input size="small" placeholder="请输入地址">
                  <span slot="append" class="area-text">㎡</span>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="房间结构" align="center">
              <template slot-scope="scope">
                <el-input size="small" placeholder="请输入户型结构"/>
              </template>
            </el-table-column>
            <el-table-column width="160" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary">保存</el-button>
                <el-button size="mini" type="primary">删除</el-button>
              </template>
            </el-table-column>
          </template> -->
          <template>
            <el-table-column porp="" label="名称" align="center"/>
            <el-table-column porp="" label="面积" align="center"/>
            <el-table-column porp="" label="房间结构" align="center"/>
            <el-table-column porp="" width="250" label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary">编辑</el-button>
                <el-button size="mini" type="primary">删除</el-button>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <el-button size="small" plain class="add-house-property-btn" @click="addHouseProperty">
          <i class="el-icon-plus" />
          新增属性
        </el-button>
      </div>
    </el-main>
    <footer class="footer">
      <div class="btn-warp">
        <el-button @click="cancelHandle">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </footer>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      houseTypeData: [],
      prjectStatusSel: '',
      citySel: '',
      dataStatusSel: '',
      deliverTypeSel: '',
      constructStageSel: '',
      isAddHouseProperty: true
    }
  },
  computed: {
    ...mapGetters([
      'projectList'
    ])
  },
  created() {
    const projectId = this.$route.params.projectId
    const curProject = this.projectList.find(item => {
      return item.id === projectId
    })
    console.log('curProject', curProject)
  },
  methods: {
    addHouseProperty() {
      console.log('addHouseProperty')
    },
    cancelHandle() {
      this.$router.go(-1)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-container {
  padding: 20px 20px 100px 20px;
  width: 100%;
  height: 100%;
  background: #f0f1f5;
  .header {
    padding: 15px;
    font-size: 18px;
    font-weight: bold;
    background: #fff;
    border-bottom: 1px solid #ccc;
  }
  .stage-info-watp {
    padding: 0;
    background: #fff;
    .stage-Info-form{
      padding: 20px;
      @include flex-layout(flex-start, center, row, wrap);
      .el-form-item {
        width: 27%;
        margin: 10px 3%;
        .el-input {
          .el-button {
            padding: 8px 5px;
          }
          &/deep/.el-input-group__append {
            padding: 0 7px;
          }
        }
        .el-select {
          width: 100%;
        }
      }
    }
    .aerialview-upload-wrap {
      padding: 0 20px 30px 20px;
      margin-left: 3%;
      .title-text {
        font-size: 14px;
        margin-left: 10px;
      }
      & /deep/ .el-upload {
        width: 130px;
        height: 130px;
        margin-top: 15px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        overflow: hidden;
        background: #fbfdff;
        cursor: pointer;
        @include flex-layout(center, center, null, nowrap);
        i {
          font-size: 46px;
          color: #ccc;
        }
      }
    }
  }
  .house-type-wrap {
    padding: 0;
    background: #fff;
    margin-top: 20px;
    .table-wrap {
      padding: 20px;
      .house-type-table {
        border: 1px solid #ccc;
        border-bottom: none;
        & /deep/ .el-table__header {
          th {
            padding: 8px;
            background: #f0f1f5;
            border-bottom: 1px solid #ccc;
          }
        }
      }
    }
    .add-house-property-btn {
      width: 100%;
      border: 1px dashed #ccc;
      margin-top: 10px;
      &:hover {
        border-color: #409EFF
      }
    }
  }
  .footer {
    height: 80px;
    line-height: 85px;
    width: 100%;
    position: fixed;
    bottom: 0;
    right:0;
    background: #fff;
    border-top: 2px solid #ccc;
    .btn-warp {
      float: right;
      margin-right: 30px;
    }
  }
}
</style>
