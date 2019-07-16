<template>
  <el-container v-loading="isLoading" class="global-container">
    <el-header height="none">
      <span class="title-text">参建方详情</span>
      <span>
        <el-button type="primary" size="mini" @click="backHandle">返回</el-button>
      </span>
    </el-header>
    <el-main>
      <div class="base-info-wrap">
        <p class="title-text">基础信息</p>
        <div class="base-info">
          <div class="base-info-item">
            <span class="title-text">公司名称：</span>
            <span>{{ curParticipantData.fullName }}</span>
          </div>
          <div class="base-info-item">
            <span class="title-text">公司简称：</span>
            <span>{{ curParticipantData.name }}</span>
          </div>
          <div class="base-info-item">
            <span class="title-text">负责人：</span>
            <span>{{ curParticipantData.official }}</span>
          </div>
          <div class="base-info-item">
            <span class="title-text">联系电话：</span>
            <span>{{ curParticipantData.phone }}</span>
          </div>
        </div>
      </div>
      <div class="member-table-header">
        <p class="title-text">参建人员</p>
        <div class="btn-warp">
          <el-button type="primary" size="mini" @click="addMembersHandle">添加人员</el-button>
          <!-- <el-button type="primary" size="mini">新增人员</el-button> -->
        </div>
      </div>
      <el-table
        ref="membersTable"
        :data="membersTableData"
        class="members-table">
        <el-table-column prop="name" width="100" label="姓名" align="center" />
        <el-table-column prop="phone" label="联系方式" align="center" />
        <el-table-column width="180" label="职位描述" align="center" />
        <el-table-column width="180" label="是否是项目经理" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isManager"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#adadad"
              @change="managerChangeHandle(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column width="180" label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button size="mini" class="no-border">编辑</el-button> -->
            <el-button size="mini" class="no-border" @click.stop="unbindMemberHandle(scope.row)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <addParticiMembers
      v-show="isAddMembersShow"
      ref="addMembersCom"
      :is-add-members-show.sync="isAddMembersShow"
      @refreshMembers="getPariticMembers" />
  </el-container>
</template>
<script>
import { mapActions } from 'vuex'
import { editPersonInfo } from '@/api/base_data/suppliers'
import { getBindtMemebers, unbindMemebers } from '@/api/project_config/participant'
import AddParticiMembers from '@/views/project_config/participant/components/addParticiMembers'
export default {
  components: { AddParticiMembers },
  data() {
    return {
      projectId: '',
      membersTableData: [],
      curParticipantData: {},
      bindedMemberIds: [],
      isAddMembersShow: false,
      isLoading: false
    }
  },
  created() {
    // 获取项目列表
    const participantId = this.$route.query.participantId
    this.projectId = this.$route.query.projectId
    this.isLoading = true
    this.getProjectParticipants({ projectId: this.projectId }).then(resp => {
      this.curParticipantData = resp.find(item => item.id === participantId)
      this.getPariticMembers()
    })
  },
  methods: {
    ...mapActions([
      'getProjectParticipants'
    ]),
    // 获取已绑定的参建方人员
    getPariticMembers() {
      if (!this.isLoading) {
        this.isLoading = true
      }
      const participantId = this.$route.query.participantId
      getBindtMemebers(this.projectId, participantId).then(resp => {
        this.membersTableData = resp.result
        this.membersTableData.forEach(item => {
          this.bindedMemberIds.push(item.id)
        })
        this.isLoading = false
      })
    },
    // 添加参建方操作处理
    addMembersHandle() {
      const _obj = {
        memberSeleted: this.bindedMemberIds
      }
      this.$refs.addMembersCom.resetDataProperty(_obj)
      this.isAddMembersShow = true
    },
    // 升级人员为产品经理
    managerChangeHandle(data) {
      console.log('data before', data)
      let text = ''
      if (data.isManager) {
        text = `确定升级 ${data.name} 为项目经理？`
      } else {
        text = `确定取消 ${data.name} 的项目经理职位？`
      }
      this.$confirm(text, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(bool => {
        console.log('data changed', data)
        this.isLoading = true
        editPersonInfo(data).then(resp => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.isLoading = false
        }).catch(() => {
          data.isManager = Number(Boolean(!data.isManager))
          this.isLoading = false
        })
      }).catch(() => {
        data.isManager = Number(Boolean(!data.isManager))
      })
    },
    // 解绑参建方人员
    unbindMemberHandle(data) {
      const personIds = Array.of(data.id)
      const participantId = this.$route.query.participantId
      this.$confirm(`确定移除 ${data.name}？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        this.isLoading = true
        unbindMemebers(this.projectId, participantId, personIds).then(resp => {
          this.$message({
            type: 'success',
            message: '移除成功'
          })
          this.getPariticMembers()
        })
      })
    },
    backHandle() {
      this.$router.go(-1)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.el-container {
  width: 100%;
  .el-header {
    height: 75px;
    margin: 6px 0;
    background: #fff;
    @include flex-layout(space-between, center, null, null);
    .title-text {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .el-main {
    margin: 20px;
    padding: 25px;
    background: #fff;
    .title-text {
      font-size: 18px;
      font-weight: bold;
    }
    .base-info-wrap {
      margin-bottom: 30px;
      .base-info {
        font-size: 14px;
        @include flex-layout(flex-start, center, null, wrap);
        .base-info-item {
          .title-text {
            font-size: 14px;
            font-weight: bold;
          }
          margin: 8px 65px 8px 0px;
        }
      }
    }
    &/deep/.members-table {
      margin-top: 20px;
      border: 1px solid #dddee1;
      .el-table__header th {
        background: #f8f8f9;
      }
    }
  }
}
</style>
