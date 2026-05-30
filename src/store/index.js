import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Vuex 全局状态管理：统一管理用户认证信息和跨组件共享数据
export default new Vuex.Store({
  state: {
    // 用户认证信息
    token: localStorage.getItem('jwt') || '',
    userId: localStorage.getItem('userID') || '',
    avatar: localStorage.getItem('avatar') || '',
    role: localStorage.getItem('role') || '',
  },
  getters: {
    // 是否已登录
    isLoggedIn: state => !!state.token,
    // 是否为管理员
    isAdmin: state => state.role === '管理员',
    // 用户头像URL
    avatarUrl: state => state.avatar ? `/main/download?name=${state.avatar}` : '',
  },
  mutations: {
    // 设置用户认证信息
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('jwt', token)
    },
    SET_USER_ID(state, userId) {
      state.userId = userId
      localStorage.setItem('userID', userId)
    },
    SET_AVATAR(state, avatar) {
      state.avatar = avatar
      localStorage.setItem('avatar', avatar)
    },
    SET_ROLE(state, role) {
      state.role = role
      localStorage.setItem('role', role)
    },
    // 清除所有认证信息（退出登录时使用）
    CLEAR_AUTH(state) {
      state.token = ''
      state.userId = ''
      state.avatar = ''
      state.role = ''
      localStorage.removeItem('jwt')
      localStorage.removeItem('userID')
      localStorage.removeItem('avatar')
      localStorage.removeItem('role')
    },
  },
  actions: {
    // 登录后保存用户信息
    saveLoginInfo({ commit }, { token, userId, avatar, role }) {
      commit('SET_TOKEN', token)
      commit('SET_USER_ID', userId)
      commit('SET_AVATAR', avatar || '')
      commit('SET_ROLE', role || '')
    },
    // 退出登录
    logout({ commit }) {
      commit('CLEAR_AUTH')
    },
  },
  modules: {
  }
})
