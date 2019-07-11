<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <!-- <systemChange /> -->
    <div class="navbar-right-part">
      <fullScreenCtrl
        v-show="showFullScreenBtn"
        :toggle-click="toggleFullScreen" />
      <msgDropdown />
      <userDropdown />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import SystemChange from '@/components/SystemChange'
import Hamburger from '@/components/Hamburger'
import UserDropdown from '@/components/UserDropdown'
import MsgDropdown from '@/components/MsgDropdown'
import FullScreenCtrl from '@/components/FullScreenCtrl'

export default {
  components: {
    Breadcrumb,
    SystemChange,
    Hamburger,
    UserDropdown,
    MsgDropdown,
    FullScreenCtrl
  },
  data() {
    return {
      // showFullScreenBtn: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'showFullScreenBtn'
    ])
  },
  // watch: {
  //   '$route.path': function(newVal) {
  //     if (newVal.match('data_screen')) {
  //       this.showFullScreenBtn = true
  //     } else {
  //       this.showFullScreenBtn = false
  //     }
  //   }
  // },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    toggleFullScreen() {
      this.$store.dispatch('ToggleFullScreen')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/variables.scss';

.navbar {
  background: #fff;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 0 3px 0 rgba(0,0,0,.08);
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
}
</style>

