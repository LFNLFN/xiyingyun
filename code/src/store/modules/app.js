import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    fullScreen: false, // 控制是否全屏
    fullScreenBtnPath: ['/data_screen/index'], // 显示全屏按钮的路径
    showFullScreenBtn: false // 是否显示全屏按钮
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    TOGGLE_FULLSCREEN: state => {
      state.fullScreen = !state.fullScreen
    },
    TOGGLE_FULLSCREEN_BTN: (state, bool) => {
      state.showFullScreenBtn = bool
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    ToggleFullScreen: ({ commit }) => {
      commit('TOGGLE_FULLSCREEN')
    },
    ToggleFullScreenBtn: ({ commit }, bool) => {
      commit('TOGGLE_FULLSCREEN_BTN', bool)
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    }
  }
}

export default app
