<template>
  <el-container class="global-container">
    <el-main>
      <el-tabs v-model="showTabName" @tab-click="changTabShow">
        <el-tab-pane label="企业文档" name="company" v-if="!(pagePermission.org_get)">
          <tabDocuments ref="company" :document-tree-data="documentTreeData" @add-doc-type="addDocTypeHandle($event)"/>
        </el-tab-pane>
        <el-tab-pane label="项目文档" name="project" v-if="!(pagePermission.project_get)">
          <tabDocuments ref="project" :document-tree-data="documentTreeData" @add-doc-type="addDocTypeHandle($event)"/>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>
<script>
import { getDocumentTree, addDocumentType } from '@/api/publication/document'
import TabDocuments from '@/views/publication/document_manage/components/tabDocuments'
import permissionOfPage from "@/mixins/permissionOfPage";
export default {
  components: { TabDocuments },
  mixins: [permissionOfPage],
  data() {
    return {
      showTabName: 'company',
      documentTreeData: []
    }
  },
  computed: {
    documentType() {
      if (this.showTabName === 'company') {
        return 0
      } else if (this.showTabName === 'project') {
        return 1
      } else {
        return null
      }
    }
  },
  mounted() {
    this.getDocumentTreeHandle()
  },
  methods: {
    getDocumentTreeHandle() {
      const msg = this.$message({
        message: '数据请求中',
        duration: 0
      })
      getDocumentTree(this.documentType)
        .then(resp => {
          this.documentTreeData = resp.result
          msg.close()
        })
        .catch(err => {
          this.$message.error('数据请求失败')
          console.log(err)
          msg.close()
        })
    },
    addDocTypeHandle(params) {
      const msg = this.$message({
        message: '数据请求中',
        duration: 0
      })
      addDocumentType(params)
        .then(() => {
          this.$message.success('操作成功')
          msg.close()
        })
        .catch(err => {
          this.$message.error('数据请求失败')
          console.log(err)
          msg.close()
        })
    },
    async changTabShow(tab, event) {
      await this.getDocumentTreeHandle()
      const tabLabel = tab.label
      const tabName = tab.name
      const _obj = {
        curTabName: tabLabel,
        documentTreeData: this.documentTreeData
      }
      this.$refs[tabName].resetDataProperty(_obj)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.el-container {
  .el-main {
    padding: 0;
    &/deep/.el-tabs {
      .el-tabs__header {
        margin: 0;
        padding: 20px 20px 0 20px;
        background: #fff;
      }
      .el-tabs__content {
        padding: 20px;
      }
    }
  }
}
</style>
