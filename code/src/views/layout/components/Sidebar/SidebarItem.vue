<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren) && !item.alwaysShow"
    >
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="setIndex(onlyOneChild)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :meta="Object.assign({},item.meta,onlyOneChild.meta)"/>
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu
      v-else
      ref="submenu"
      :index="item.name"
      popper-append-to-body
      @click.native="clickHandle($event, item)"
    >
      <template slot="title">
        <item :meta="item.meta"/>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :is-nest="true"
        :item="child"
        :key="child.path"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>
<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null;
    return {};
  },
  watch: {
    item: {
      handler: function(newVal) {
        if (newVal.meta && newVal.meta.pagePermissionId) {
          const pagePermissionDic = this.$store.state.user.permissions;
          console.log(newVal.meta.pagePermissionId);
          if (
            !pagePermissionDic[newVal.meta.pagePermissionId] ||
            pagePermissionDic[newVal.meta.pagePermissionId].indexOf("get") ===
              -1
          ) {
            // 如果页面权限id不存在于权限对象词典或者页面权限id对应数组不包含‘get’，则表示该用户没有此页面的浏览权限，侧边栏隐藏此页面
            if (newVal.meta.pagePermissionId === "report") {
              // 后来发现有些页面是没有get的
              newVal.hidden = false;
            } else {
              newVal.hidden = true;
            }
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    clickHandle(evt, item) {},
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }
      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }
      return false;
    },
    setIndex(item) {
      return item.children ? item.children[0].name : item.name;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      return path.resolve(this.basePath, routePath);
    }
  }
};
</script>
