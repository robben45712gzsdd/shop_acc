export const state = () => ({
  darkMode: true,
  user_data: {}
})

export const mutations = {
  setUserData(state, payload) {
    state.user_data = payload
  },
  setIsDarkMode(state) {
    state.darkMode = state
  }
}

export const actions = {
  
}
