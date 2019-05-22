<template>
  <div class="main-wrap">
    <div class="button-wrap">
      <el-button type="primary" @click="emitEvent('addMember')">新增人员</el-button>
      <el-button @click="emitEvent('pullMember')">添加人员</el-button>
    </div>
    <el-table
      v-loading="isLoading"
      ref="membersTable"
      :data="membersData"
      class="members-table">
      <!-- <el-table-column width="80" align="center" />
        <template slot-scope="scope">
          <img src="" class="member-avatar" >
        </template>
      </el-table-column> -->
      <el-table-column prop="name" width="100" label="姓名" align="center" />
      <el-table-column prop="phone" label="联系方式" align="center" />
      <el-table-column :formatter="tableFormatter" width="180" label="所属部门" align="center" />
      <el-table-column width="80" align="center">
        <template slot-scope="scope">
          <el-button class="no-border" @click="deleteMember(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { gerPersonsByPost, delPostMember } from '@/api/base_data/organization'
export default {
  name: 'Members',
  props: {
    positionData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      membersData: [],
      isLoading: false
    }
  },
  watch: {
    positionData: function(newVal) {
      if (newVal.positionId) {
        this.getMembersFunc(newVal.positionId)
      }
    }
  },
  methods: {
    tableFormatter(row) {
      return this.positionData.name
    },
    // 获取岗位成员列表
    getMembersFunc(id) {
      this.isLoading = true
      gerPersonsByPost(id).then(resp => {
        this.isLoading = false
        this.membersData = resp.result
      })
    },
    // 移除成员
    deleteMember(row) {
      this.$confirm(`确定移除 ${row.name}？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const positionId = this.positionData.positionId
        this.isLoading = true
        delPostMember(positionId, Array.of(row.personId)).then(() => {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success',
            duration: 3 * 1000
          })
          this.getMembersFunc(positionId)
        }).catch(() => {
          this.isLoading = false
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    // // 重置数据
    // resetData() {
    //   this.positionData = emptyTarget(this.positionData)
    // },
    // 新增、添加人员按钮点击处理
    emitEvent(event) {
      this.$emit('postMemberEmitEvent', event, this.positionData)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/element-ui.scss";

.main-wrap {
  .members-table {
    margin-top: 20px;
    border: 1px solid #ccc;
    border-bottom: none;
  }
}
</style>
