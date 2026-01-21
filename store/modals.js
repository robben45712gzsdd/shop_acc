export const state = () => ({
  showPolicyModal: false,
  showCookieConsent: false,
  showPromoModal: false,
  showVerifyMailModal: false,
  showChangePasswordModal: false
})

export const mutations = {
  SHOW_POLICY_MODAL(state) {
    state.showPolicyModal = true
  },
  HIDE_POLICY_MODAL(state) {
    state.showPolicyModal = false
  },
  SHOW_COOKIE_CONSENT(state) {
    state.showCookieConsent = true
  },
  HIDE_COOKIE_CONSENT(state) {
    state.showCookieConsent = false
  },
  SHOW_PROMO_MODAL(state) {
    state.showPromoModal = true
  },
  HIDE_PROMO_MODAL(state) {
    state.showPromoModal = false
  },
  SHOW_VERIFY_MAIL_MODAL(state) {
    state.showVerifyMailModal = true
  },
  HIDE_VERIFY_MAIL_MODAL(state) {
    state.showVerifyMailModal = false
  },
  SHOW_CHANGE_PASSWORD_MODAL(state) {
    state.showChangePasswordModal = true
  },
  HIDE_CHANGE_PASSWORD_MODAL(state) {
    state.showChangePasswordModal = false
  }
}

export const actions = {
  showPolicyModal({ commit }) {
    commit('SHOW_POLICY_MODAL')
  },
  hidePolicyModal({ commit }) {
    commit('HIDE_POLICY_MODAL')
  },
  showCookieConsent({ commit }) {
    commit('SHOW_COOKIE_CONSENT')
  },
  hideCookieConsent({ commit }) {
    commit('HIDE_COOKIE_CONSENT')
  },
  showPromoModal({ commit }) {
    commit('SHOW_PROMO_MODAL')
  },
  hidePromoModal({ commit }) {
    commit('HIDE_PROMO_MODAL')
  },
  showVerifyMailModal({ commit }) {
    commit('SHOW_VERIFY_MAIL_MODAL')
  },
  hideVerifyMailModal({ commit }) {
    commit('HIDE_VERIFY_MAIL_MODAL')
  },
  showChangePasswordModal({ commit }) {
    commit('SHOW_CHANGE_PASSWORD_MODAL')
  },
  hideChangePasswordModal({ commit }) {
    commit('HIDE_CHANGE_PASSWORD_MODAL')
  }
}
