<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="defaultActive"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="vertical"
      @select="handleOpen" >
      <template>
        <sidebar-item v-for="route in homeRoutes" :key="route.path" :item="route" :base-path="route.path"/>
      </template>
      <template>
        <div class="divide-wrap">
          <span class="divide-line" />
          <div class="divide-text">
            <!-- <span class="el-icon-bottom" /> -->
            工程管理
            <!-- <span class="el-icon-bottom" /> -->
          </div>
        </div>
        <sidebar-item v-for="route in projectRoutes" :key="route.path" :item="route" :base-path="route.path"/>
      </template>
      <template>
        <div class="divide-wrap">
          <span class="divide-line" />
          <div class="divide-text">
            <!-- <span class="el-icon-bottom" /> -->
            公共业务管理
            <!-- <span class="el-icon-bottom" /> -->
          </div>
        </div>
        <sidebar-item v-for="route in publicRoutes" :key="route.path" :item="route" :base-path="route.path"/>
      </template>
      <template>
        <sidebar-item v-for="route in otherRouters" :key="route.path" :item="route" :base-path="route.path"/>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  data() {
    return {
      defaultActive: this.$route.name,
      homeRoutes: [],
      projectRoutes: [],
      publicRoutes: [],
      otherRouters: [],
      typeRouterIndex: {
        'home': 'homeRoutes',
        'project': 'projectRoutes',
        'public': 'publicRoutes'
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    const routes = this.$router.options.routes
    routes.forEach(item => {
      if (item.menuType) {
        const index = this.typeRouterIndex[item.menuType]
        this[index].push(item)
      } else {
        this.otherRouters.push(item)
      }
    })
  },
  methods: {
    handleOpen(index, indexPath) {
      this.defaultActive = index
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
@import "src/styles/variables.scss";

.divide-wrap {
  width: 100%;
  height: 45px;
  text-align: center;
  padding:0 10px;
  background: $menuBg;
  position: relative;
  .divide-text, .divide-line {
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
</style>
