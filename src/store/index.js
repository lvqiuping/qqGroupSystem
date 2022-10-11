import Vue from 'vue'
import Vuex from 'vuex'
// import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters: {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    // avatar: state => state.user.avatar,
    userName(state) {
      return state.user.userName
    },
    userId(state) {
      return state.user.userId
    },
    permission: state => state.user.permission
  }
})

export default store
