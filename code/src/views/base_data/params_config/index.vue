<template>
  <component
    :is="showComponent"
    :component-datas="componentDatas"
    :params-data="paramsData"
    @changeSowCom="showCurConfigBox"
  />
</template>
<script>
import ProblemLevel from "@/views/base_data/params_config/item_views/problemLevel";
import AlbumChoose from "@/views/base_data/params_config/item_views/album_choose";
import PhotoSetting from "@/views/base_data/params_config/item_views/photo_setting";
import ProjectKeyNode from "@/views/base_data/params_config/item_views/project_key_node";
import MeasuredQuantityType from "@/views/base_data/params_config/item_views/measured_quantity_type";
import SupplierProperty from "@/views/base_data/params_config/item_views/supplierProperty";
import ProfessionSort from "@/views/base_data/params_config/item_views/professionSort";
import ConfigNav from "@/views/base_data/params_config/configNav";
import { toHump } from "@/utils/dataFormat";
// import { getMenus } from '@/api/dictionary'
export default {
  components: {
    ProblemLevel,
    AlbumChoose,
    PhotoSetting,
    ProjectKeyNode,
    MeasuredQuantityType,
    SupplierProperty,
    ProfessionSort,
    ConfigNav
  },
  data() {
    return {
      showComponent: "ConfigNav",
      componentDatas: {
        configNav: ConfigNav,
        professionType: ProfessionSort,
        problemLevel: ProblemLevel,
        albumChoose: AlbumChoose,
        photoSetting: PhotoSetting,
        projectKeyNode: ProjectKeyNode,
        measuredQuantityType: MeasuredQuantityType
      },
      paramsData: {}
    };
  },
  created() {
    // getMenus().then(resp => {
    //   console.log('resp', resp)
    //   // const menuList = []
    //   // const subMenuLists = {}
    //   // resp.result.forEach(item => {
    //   //   if (item.parentId === '-1') {
    //   //     menuList.push(item)
    //   //     if (subMenuLists[item.id] === undefined) {
    //   //       subMenuLists[item.id] = []
    //   //     }
    //   //   } else {
    //   //     const curParentId = item.parentId
    //   //     const index = Object.keys(subMenuLists).indexOf(curParentId)
    //   //     if (index >= 0) {
    //   //       subMenuLists[curParentId].push(item)
    //   //     } else {
    //   //       subMenuLists[curParentId] = Array.of(item)
    //   //     }
    //   //   }
    //   // })
    //   // menuList.forEach(menu => {
    //   //   if (subMenuLists[menu.id]) {
    //   //     menu['children'] = subMenuLists[menu.id]
    //   //   }
    //   // })
    //   // console.log('menuList', menuList)
    // })
  },
  methods: {
    showCurConfigBox(itemId, item) {
      itemId = toHump(itemId)
      const _showComponent = this.componentDatas[itemId];
      // if (!_showComponent) {
      //   this.$message({
      //     type: "warning",
      //     message: "暂未开放，请等待...",
      //     showClose: true,
      //     duration: 2000
      //   });
      //   return;
      // }
      console.log('itemId', itemId)
      if (item) {
        this.paramsData = item;
      }
      this.showComponent = _showComponent;
    }
  }
};
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
  padding: 25px;
  .el-main {
    @include boxShadow-container;
    .header {
      @include gray-header;
    }
    .params-item-wrap {
      padding: 20px 30px;
      .el-row {
        padding: 0 10px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #c7c6c6;
      }
    }
  }
}
</style>
