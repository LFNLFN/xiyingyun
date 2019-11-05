<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <!-- <img
      v-show="$store.state.app.sidebar.opened"
      src="../../../../assets/logo_images/seeingCloudLogo.png"
      alt=""
      id="sidebar-pic-open"
    >-->
    <!-- <h3 v-show="$store.state.app.sidebar.opened" id="sidebar-pic-open">Seeing Cloud</h3> -->
    111111
    <!-- <img v-show="!$store.state.app.sidebar.opened" src="../../../../assets/home-page-pic/mini-logo.png" alt="" id="sidebar-pic-close"> -->
    <el-menu
      :default-active="defaultActive"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="vertical"
      @select="handleOpen"
    >
      <template>
        <sidebar-item
          v-for="route in homeRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </template>
      <template>
        <!-- <div class="divide-wrap"> -->
        <!-- <span class="divide-line" /> -->
        <!-- <div class="divide-text"> -->
        <!-- <span class="el-icon-bottom" /> -->
        <!-- 工程管理 -->
        <!-- <span class="el-icon-bottom" /> -->
        <!-- </div> -->
        <!-- </div> -->
        <sidebar-item
          v-for="route in projectRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          v-show="$store.state.app.sidebar.sidebarType==='project'"
        />
      </template>
      <template>
        <!-- <div class="divide-wrap"> -->
        <!-- <span class="divide-line" /> -->
        <!-- <div class="divide-text"> -->
        <!-- <span class="el-icon-bottom" /> -->
        <!-- 公共业务管理 -->
        <!-- <span class="el-icon-bottom" /> -->
        <!-- </div> -->
        <!-- </div> -->
        <sidebar-item
          v-for="route in publicRoutes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          v-show="$store.state.app.sidebar.sidebarType==='public'"
        />
      </template>
      <template>
        <sidebar-item
          v-for="route in otherRouters"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import variables from "@/styles/variables.scss";
import SidebarItem from "./SidebarItem";
import permissionOfPage from "@/mixins/permissionOfPage";

export default {
  components: { SidebarItem },
  mixins: [permissionOfPage],
  data() {
    return {
      defaultActive: this.$route.name,
      homeRoutes: [],
      projectRoutes: [],
      publicRoutes: [],
      otherRouters: [],
      typeRouterIndex: {
        home: "homeRoutes",
        project: "projectRoutes",
        public: "publicRoutes"
      },
      pagePermissionDic: {}
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  created() {
    this.refreshSidebar()
  },
  methods: {
    handleOpen(index, indexPath) {
      this.defaultActive = index;
    },
    refreshSidebar() {
      const routes = this.$router.options.routes;
      this.pagePermissionDic = this.$store.state.user.permissions;
      routes.forEach(item => {
        if (item.meta && item.meta.pagePermissionId) {
          if (
            !this.pagePermissionDic[item.meta.pagePermissionId] ||
            this.pagePermissionDic[item.meta.pagePermissionId].indexOf(
              "get"
            ) === -1
          ) {
            // 如果页面权限id不存在于权限对象词典或者页面权限id对应数组不包含‘get’，则表示该用户没有此页面的浏览权限，侧边栏隐藏此页面
            item.hidden = true;
          }
        }
        if (item.menuType) {
          const index = this.typeRouterIndex[item.menuType];
          this[index].push(item);
        } else {
          this.otherRouters.push(item);
        }
      });
    }
  }
};
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.divide-wrap {
  width: 100%;
  height: 45px;
  text-align: center;
  padding: 0 10px;
  background: $menuBg;
  position: relative;
  .divide-text,
  .divide-line {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .divide-text {
    padding: 0 10px;
    color: $menuText;
    font-size: 10px;
    background: $menuBg;
    white-space: nowrap;
  }
  .divide-line {
    display: block;
    width: 90%;
    border-top: 1px dashed $menuText;
    position: absolute;
  }
}

#sidebar-pic-open {
  box-sizing: border-box;
  padding-right: 10px;
  width: 300px;
  background-color: #fff;
}
#sidebar-pic-close {
  box-sizing: border-box;
  width: 36px;
  padding: 2px;
}
</style>
