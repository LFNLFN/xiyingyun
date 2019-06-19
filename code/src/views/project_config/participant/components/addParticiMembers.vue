<template>
  <publicPopups width="750px" title-text="添加人员" v-on="$listeners" @formConfirm="bindMembersHandle" @closePopupsBox="closeBox">
    <template slot="main-content">
      <el-container v-loading="isBoxLoading">
        <el-main>
          <el-transfer
            v-model="memberSeleted"
            :data="transferData"
            :filter-method="filterSuppliers"
            :titles="['参建方人员', '已选']"
            :button-texts="['删除选项', '添加选项']"
            filterable
            filter-placeholder="请输入人员名称" />
        </el-main>
      </el-container>
    </template>
  </publicPopups>
</template>
<script>
import { getParticiMemers, bindMemebers } from '@/api/project_config/participant'
import PublicPopups from '@/components/Pop-ups/PublicPopups'
export default {
  components: { PublicPopups },
  props: {
    isAddMembersShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      projectId: '',
      participantId: '',
      memberSeleted: [], // 保存选择的人员ID
      transferData: [], // 保存穿梭框数据
      isBoxLoading: false
    }
  },
  watch: {
    isAddMembersShow: function(newVal) {
      if (newVal) {
        this.isBoxLoading = true
        // 加载参建方下的所有人员表
        getParticiMemers(this.participantId).then(resp => {
          console.log('resp', resp)
          const _data = resp.result

          _data.forEach(v => {
            this.transferData.push({
              key: v.id,
              label: v.name,
              disabled: false
            })
          })
          this.isBoxLoading = false
        }).catch(() => {
          this.isBoxLoading = false
        })
      }
    }
  },
  created() {
    this.projectId = this.$route.query.projectId
    this.participantId = this.$route.query.participantId
  },
  methods: {
    resetDataProperty(source) {
      Object.keys(source).forEach(key => {
        this[key] = source[key]
      })
    },
    // 根据条件搜索人员
    filterSuppliers(query, item) {
      return item.label.indexOf(query) > -1
    },
    // 绑定参建方人员到项目中
    bindMembersHandle() {
      if (this.memberSeleted.length === 0) {
        this.closeBox()
        return
      } else {
        this.isBoxLoading = true
        bindMemebers(this.projectId, this.participantId, this.memberSeleted).then(resp => {
          this.$message({
            message: '添加人员成功',
            type: 'success'
          })
          this.isBoxLoading = false
          this.$emit('refreshMembers')
          this.closeBox()
        })
      }
    },
    closeBox() {
      this.memberSeleted = []
      this.transferData = []
      this.$emit('update:isAddMembersShow', false)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
  .el-main {
    &/deep/.el-transfer {
      @include flex-layout(center, center, null, null);
      .el-transfer-panel {
        width: 250px;
        .el-transfer-panel__body {
          height: 350px;
          .el-checkbox-group  {
            height: 300px;
          }
        }
      }
    }
  }
}
</style>
