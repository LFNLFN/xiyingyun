<template>
  <el-container>
    <el-header>
      <span>所属项目：</span>
      <el-select v-model="projectSelected" @change="getParticipants">
        <el-option
          v-for="(item, idx) in projectDetailDatas"
          :key="idx"
          :label="item.name"
          :value="item.id" />
      </el-select>
    </el-header>
    <el-main>
      <div class="header">
        <span>参建方列表</span>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addParticiHandle">添加</el-button>
      </div>
      <div v-loading="isTableLoading" class="table-wrap">
        <el-table
          ref="particiTable"
          :data="particiTableData"
          :header-cell-style="tableCellStypeHandle"
          :cell-style="tableCellStypeHandle"
          border
          @row-click="particiDetailHandle">
          <el-table-column prop="fullName" label="参建方名称"/>
          <el-table-column :formatter="orgTypeformatter" prop="" width="150" label="类型" align="center"/>
          <el-table-column prop="official" width="150" label="负责人" align="center"/>
          <el-table-column width="120" label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" class="post-table-btn" @click.stop="unBindParticipant(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="pageTotal"
          :page-size="10"
          background
          layout="prev, pager, next, jumper"/>
      </div>
    </el-main>
    <participant
      v-show="isAddParticiShow"
      :project-id="projectSelected"
      :project-participant-ids="projectParticipantIds"
      :is-add-partici-show.sync="isAddParticiShow"
      @reloadParticipant="reloadParticipant"/>
  </el-container>
</template>
<script>
import { mapActions } from 'vuex'
import { unBindParticipant } from '@/api/project_config/participant'
import { getDictionaryItem } from '@/api/dictionary'
import getProjectMixin from '@/mixins/getProjectStage'
import Participant from '@/views/project_config/participant/components/addParticipant'
export default {
  components: { Participant },
  mixins: [getProjectMixin],
  data() {
    return {
      projectDetailDatas: [], // 保存项目数据
      projectSelected: '', // 保存已选择的项目的ID
      particiTableData: [], // 保存参建方数据
      suppliersTypeData: [], // 保存参建方类型
      projectParticipantIds: [], // 保存当前项目的参建方id
      isAddParticiShow: false,
      isTableLoading: false,
      pageTotal: 10
    }
  },
  created() {
    // 获取项目列表
    this.getProjectFunc().then((data) => {
      this.projectSelected = data[0].id
      this.getParticipants(this.projectSelected)
    })
  },
  methods: {
    ...mapActions([
      'getProjectParticipants'
    ]),
    // 表格样式控制
    tableCellStypeHandle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        return { 'padding-left': '20px' }
      }
    },
    // 控制添加参建方表格显隐
    addParticiHandle() {
      this.isAddParticiShow = !this.isAddParticiShow
    },
    // 获取项目参建方
    getParticipants(val) {
      this.isTableLoading = true
      const _obj = {
        projectId: val,
        isGet: true
      }
      this.getProjectParticipants(_obj).then(data => {
        const _participantIds = []
        data.forEach(v => {
          _participantIds.push(v.id)
        })
        this.projectParticipantIds = _participantIds
        if (this.suppliersTypeData.length === 0) {
          const params = {
            'terms[0].column': 'dict_id',
            'terms[0].value': 'supplier_type'
          }
          getDictionaryItem(params).then((dresp) => {
            this.suppliersTypeData = dresp.result
            this.particiTableData = data
            this.isTableLoading = false
          })
        } else {
          this.particiTableData = data
          this.isTableLoading = false
        }
      }).catch(() => {
        this.isTableLoading = false
      })
    },
    // 格式化参建方的类型数据
    orgTypeformatter(row, column) {
      let backVal
      const target = this.suppliersTypeData.find(item => item.id === row.orgType)
      target ? backVal = target.value : backVal = ''
      return backVal
    },
    // 通往参建方详情界面
    particiDetailHandle(row, column, event) {
      console.log()
      const curProject = this.projectDetailDatas.find(item => item.id === this.projectSelected)
      const params = {
        projectId: curProject.id,
        participantId: row.id
      }
      this.$router.push({ name: 'participantDetail', query: params })
    },
    // 解绑参建方
    unBindParticipant(row) {
      const particiIds = Array.of(row.id)
      const curProject = this.projectDetailDatas.find(item => item.id === this.projectSelected)
      this.$confirm(`确定将 ${row.fullName} 移出 ${curProject.name} 项目？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        this.isTableLoading = true
        unBindParticipant(this.projectSelected, particiIds).then(resp => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.reloadParticipant(true)
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    // 重新加载参建方数据
    reloadParticipant(reload) {
      if (reload) {
        this.getParticipants(this.projectSelected)
      }
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-container {
  .el-header {
    margin: 30px 0;
    padding-left: 50px;
    @include flex-layout(flex-start, center, null, null);
    .el-select {
      width: 300px;
    }
  }
  .el-main {
    margin: 0 20px;
    @include boxShadow-container;
    .header {
      @include gray-header;
    }
    .table-wrap {
      padding: 20px;
      &/deep/.el-table {
        border: 1px solid #dddee1;
        .el-table__header th {
          background: #f8f8f9;
        }
        .el-table__body tr {
          cursor: pointer;
        }
      }
    }
    .el-pagination {
      text-align: center;
      margin-top: 30px;
    }
  }
}
</style>
