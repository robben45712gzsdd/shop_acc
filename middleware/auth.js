import Cookies from "js-cookie";
import auth from "~/api/auth";

function generateStrongCode(length = 8) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const all = letters + numbers;

  // bắt buộc 1 chữ và 1 số
  let result = "";
  result += letters[Math.floor(Math.random() * letters.length)];
  result += numbers[Math.floor(Math.random() * numbers.length)];

  // random các ký tự còn lại
  for (let i = 2; i < length; i++) {
    result += all[Math.floor(Math.random() * all.length)];
  }

  // shuffle chuỗi
  return result
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

export default async function ({ store, redirect, route }) {
  const currentPath = (route.path || "").toLowerCase();

  // skip login/signup
  if (["/login", "/signup"].includes(currentPath)) return;

  const token = Cookies.get("token");

  // try restore session if token exists but not authenticated yet
  if (token && !store.state.isAuthenticated) {
    try {
      await store.dispatch("login", { token });
    } catch (err) {
      console.error("Restore session failed:", err);
      store.dispatch("logout");
    }
  }

  try {
    const res = await auth.getMainProfile();

    if (res && res.success) {
      const userProfile = res.data || {};

      const code =
        "TopUpCode " + userProfile.topUpCode + " Trans " + generateStrongCode();

      store.commit("setUserData", {
        ...userProfile,
        topUpCode: code,
      });

      store.commit("setIsAuthenticated", true);
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    // không commit, không redirect — chỉ log
  }
}
