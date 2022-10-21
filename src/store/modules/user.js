import { login, logout, getInfo } from '@/api/user'
import { getToken, getRefreshToken, setToken, setRefreshToken, removeToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    // 这些都是state的信息
    token: getToken(),
    refreshToken: getRefreshToken(),
    userName: Cookies.get('permission'),
    permission: '',
    isAdmin: Cookies.get('isAdmin'),
    userId: Cookies.get('userId')
  }
}

const state = getDefaultState()
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  RE_FRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  },
  SET_USER_NAME: (state, userName) => {
    state.userName = userName
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  },
  SET_IS_ADMIN: (state, isAdmin) => {
    state.isAdmin = isAdmin
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  }
}
const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        var str = userInfo.split('&')
        var obj = {}
        str.map((e) => {
          obj[e.split('=')[0]] = e.split('=')[1]
        })
        Cookies.set('permission', obj.userName)
        Cookies.set('userId', response.data.userId)
        Cookies.set('isAdmin', response.data.isAdmin)
        commit('SET_USER_NAME', obj.userName)
        commit('SET_IS_ADMIN', response.data.isAdmin)
        commit('SET_USER_ID', response.data.userId)
        // token 如果token失效会返回新的refreshToken
        var token = response.data.token
        var refreshToken = response.data.refreshToken
        commit('SET_TOKEN', token)
        setToken(token)
        commit('RE_FRESH_TOKEN', refreshToken)
        setRefreshToken(refreshToken)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      const params = `userName=${Cookies.get('permission')}`
      console.log('登出参数', params)
      logout(params).then(() => {
        removeToken() // must remove  token  first
        removeRefreshToken()
        Cookies.remove('permission')
        Cookies.remove('userId')
        Cookies.remove('isAdmin')
        window.location.reload() // f5
        resetRouter()
        // resolve() //
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const { data } = response

    //     if (!data) {
    //       return reject('Verification failed, please Login again.')
    //     }

    //     const { userName } = data

    //     commit('SET_USER_NAME', userName)
    //     // commit('SET_AVATAR')
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true, // 必须写
  state,
  mutations,
  actions
}

