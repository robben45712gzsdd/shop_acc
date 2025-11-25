import Cookies from 'js-cookie'
import auth from '~/api/auth'

export default async function ({ store, redirect, route }) {
  const currentPath = route.path.toLowerCase()
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.includes(currentPath)

  const token = Cookies.get('token')

  // Nếu có token → cố gắng restore session
  if (token) {
    await store.dispatch('login', { token })
  }

  const isLoggedIn = store.state.isAuthenticated

  // 🔥 Nếu đã đăng nhập mà vào /login hoặc /signup → đưa về /
  if (isLoggedIn && isAuthRoute) {
    return redirect('/')
  }

  // 🔥 Nếu route cần login
  if (!isAuthRoute) {
    try {
      const res = await auth.getMainProfile()

      if (!res.success) {
        store.dispatch('logout')
        return redirect('/login')
      }

      store.commit('setUserData', res.data)
      store.commit('setIsAuthenticated', true)
    } catch (err) {
      console.error('Error fetching profile:', err)
      store.dispatch('logout')
      return redirect('/login')
    }
  }
}
