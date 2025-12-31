export const state = () => ({
  showPolicyModal: false,
  showCookieConsent: false,
  showPromoModal: false
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
  }
}
