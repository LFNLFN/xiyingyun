<template>
  <el-container class="global-container">
    <el-main>
      <el-tabs v-model="showTabName" @tab-click="changTabShow">
        <el-tab-pane label="集团检查" name="groupCheck">
          <TapCheckDatas
            ref="groupCheck"
            @addSpecialItem="addSpecialItemHandle" />
        </el-tab-pane>
        <el-tab-pane label="区域检查" name="areaCheck">
          <TapCheckDatas
            ref="areaCheck"
            @addSpecialItem="addSpecialItemHandle" />
        </el-tab-pane>
        <el-tab-pane label="项目检查" name="projectCheck">
          <TapCheckDatas
            ref="projectCheck"
            @addSpecialItem="addSpecialItemHandle" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <specialItemDetail
      v-show="isItemDetailShow"
      :is-item-detail-show.sync="isItemDetailShow" />
    <addSpecialItem
      v-show="isAddSpecialItemShow"
      :is-add-special-item-show.sync="isAddSpecialItemShow" />
  </el-container>
</template>
<script>
import getProjectMixin from '@/mixins/getProjectStage'
import AddSpecialItem from '@/views/quality/special_item_check/components/addSpecialItem'
import SpecialItemDetail from '@/views/quality/special_item_check/components/specialItemDetail'
import TapCheckDatas from '@/views/quality/special_item_check/tabPanes/tapCheckDatas'
export default {
  components: { TapCheckDatas, SpecialItemDetail, AddSpecialItem },
  mixins: [getProjectMixin],
  data() {
    return {
      showTabName: 'groupCheck',
      isItemDetailShow: false,
      isAddSpecialItemShow: false
    }
  },
  mounted() {
    this.getProjectFunc().then((data) => {
      this.changTabShow()
    })
  },
  methods: {
    // 获取专项检查表格数据
    getSpecialItemCheckFunc() {
      const params = {}
      const _keys = Object.keys(this.filterFormData)
      let paramIndex = 0
      _keys.forEach((key) => {
        const _data = this.filterFormData[key]
        if (_data !== null && _data !== '') {
          if (key === 'applyDate' && Array.isArray(_data)) {
            const termType = ['gte', 'lte']
            _data.forEach((item, idx) => {
              params[`terms[${paramIndex}].column`] = key
              params[`terms[${paramIndex}].value`] = item
              params[`terms[${paramIndex}].termType`] = termType[idx]
              paramIndex++
            })
          } else {
            params[`terms[${paramIndex}].column`] = key
            params[`terms[${paramIndex}].value`] = _data
            paramIndex++
          }
        }
      })
      params[`sorts[0].name`] = 'applyDate'
      params[`sorts[0].order`] = 'desc'
      params['pageIndex'] = this.pageIndex - 1
      params['pageSize'] = this.pageSize
      getProcessAccept(params).then(resp => {
        const data = resp.result
        this.pageTotal = data.total
        this.pageIndex = data.pageIndex + 1
        this.acceptTableData = data.data
      })
    },
    changTabShow() {
      const tabName = this.showTabName
      const _obj = {
        // curTabStatus: this.tabStatusData[tabName],
        projectDetailDatas: this.projectDetailDatas
      }
      this.$refs[tabName].resetDataProperty(_obj)
    },
    addSpecialItemHandle(data) {
      this.isAddSpecialItemShow = true
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
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
