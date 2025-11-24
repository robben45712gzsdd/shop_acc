import Cookies from 'js-cookie';
import profile from '~/api/auth';

export default async function ({ store, redirect, route }) {
  const currentPath = route.path.toLowerCase();
  console.log("Data: ", store.getters);
  const token = store.state.auth.token || Cookies.get('token');
  if (token) {
    await store.dispatch('auth/login', {
      token,
    });
  }
  const routerDontNeedLogin = ['/auth/login', '/auth/signup'];
  const isAuthRoute = routerDontNeedLogin.includes(currentPath);
  // Nếu đã xác thực và không phải route yêu cầu login, sử dụng dữ liệu từ store
  let isAuthenticated = store.state.auth.isAuthenticated;
  // Nếu có token nhưng chưa xác thực, gọi API để lấy profile
  if (!isAuthRoute) {
    await profile.getMainProfile(token)
      .then((res) => {        
        const { avatarUrl, accountId, name, role, phoneNumber, email } = res?.data;
        store.commit('auth/setIsAuthenticated', true);
        store.commit('auth/setUser', { avatarUrl, accountId, name, phoneNumber, email });
        store.commit('auth/setRole', role);
      })
      .catch((error) => {
        store.dispatch('auth/logout');
        isAuthenticated = false;
        console.error('Error fetching profile:', error);
      });
  }


  // Nếu không rơi vào trường hợp nào, redirect về login
  if (!isAuthenticated && !isAuthRoute) {
    return redirect('/auth/login');
  }
}