import Cookies from 'js-cookie'
import auth from '~/api/auth'

export default async function ({ store, redirect, route }) {
  const currentPath = route.path.toLowerCase()
  const routerDontNeedLogin = ['/auth/login', '/auth/signup']
  const isAuthRoute = routerDontNeedLogin.includes(currentPath)

  let token = store.state.auth.token || Cookies.get('token')

  if (token) {
    // Lưu token vào store nếu chưa có
    if (!store.state.auth.token) {
      await store.dispatch('auth/login', { token })
    }
  }

  // Nếu route cần xác thực
  if (!isAuthRoute) {
    if (!store.state.auth.isAuthenticated) {
      try {
        const res = await auth.getMainProfile(token)
        const { avatarUrl, accountId, name, role, phoneNumber, email } = res?.data
        store.commit('auth/setUserData', { avatarUrl, accountId, name, phoneNumber, email })
        store.commit('auth/setIsAuthenticated', true)
      } catch (err) {
        console.error('Error fetching profile:', err)
        store.dispatch('auth/logout')
        return redirect('/auth/login')
      }
    }
  }
}
