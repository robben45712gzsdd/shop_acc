import Cookies from "js-cookie";
import auth from "~/api/auth";

export default async function ({ store, redirect, route }) {
  const currentPath = route.path.toLowerCase();

  // Nếu đang ở trang login hoặc signup thì bỏ qua
  if (["/login", "/signup"].includes(currentPath)) {
    return;
  }

  const token = Cookies.get("token");

  // Nếu có token → restore session (không bắt buộc)
  if (token && !store.state.isAuthenticated) {
    try {
      await store.dispatch("login", { token });
    } catch (err) {
      console.error("Restore session failed:", err);
      store.dispatch("logout");
    }
  }

  const isLoggedIn = store.state.isAuthenticated;

  // Nếu có token hoặc đang login, gọi getMainProfile cho mọi trang (trừ login/signup)
  try {
    const res = await auth.getMainProfile();
    if (res.success) {
      // Chỉ commit nếu gọi đúng, nếu sai hoặc lỗi thì không commit gì
      store.commit("setUserData", res.data);
      store.commit("setIsAuthenticated", true);
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    // Không commit gì nếu lỗi, chỉ logout nếu muốn bảo mật
    // store.dispatch("logout");
  }

  // Nếu chưa login và muốn redirect những trang cần auth thì xử lý ở đây
  // Ví dụ: nếu muốn redirect tất cả trang ngoại trừ login/signup khi chưa auth
  // if (!isLoggedIn) return redirect("/login");
};
