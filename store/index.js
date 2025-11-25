import Cookies from 'js-cookie'
export const state = () => ({
  darkMode: true,
  user_data: {},
  isAuthenticated: false,
  token: null
})

export const mutations = {
  setUserData(state, payload) {    
    state.user_data = payload
  },
  setToken(state, token) {
    state.token = token
    Cookies.set('token', token)
  },
  setIsAuthenticated(state, status) {
    state.isAuthenticated = status
  },
  setIsDarkMode(state, value) {
    state.darkMode = value
  },
  resetAuth(state) {
    state.user_data = {}
    state.token = null
    state.isAuthenticated = false 
    Cookies.remove('token')
  }
}

export const actions = {
  login({ commit }, { token }) {
    commit('setToken', token)
    commit('setIsAuthenticated', true)
  },
  logout({ commit }) {
    commit('resetAuth')
  }
}
