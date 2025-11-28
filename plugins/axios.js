import axios from "axios";
import Cookies from "js-cookie";
import md5 from "md5";

export default ({ app }, inject) => {
  axios.defaults.baseURL = process.env.NUXT_ENV_BASE_URL;

  const API_KEY = process.env.NUXT_ENV_API_KEY;

  // Tạo request-time theo yyyyMMddHHmmss
  function getRequestTime() {
    const now = new Date();
    return now
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);
  }
  function getQueryParams(obj) {
    return new URLSearchParams(obj).toString();
  }

  // Tính contentMD5 dựa trên body (POST/PUT/PATCH) hoặc rỗng (GET)
  function getContentMD5(config) {
    const method = config?.method?.toUpperCase();
    let body = {};

    if (method === "GET" || method === "DELETE") {
      // GET/DELETE không có body → dùng params
      body = config.params ? getQueryParams(config.params) : "";
    } else {
      // POST/PUT/PATCH → dùng body
      body = config.data ? JSON.stringify(config.data) : "";
    }

    if (!body || body === "") {
      return md5(""); // rỗng thì hash chuỗi rỗng
    }

    return md5(body);
  }

  // Lấy path của request (không bao gồm baseURL)
  function getRequestPath(url) {
    try {
      const fullUrl = new URL(url, axios.defaults.baseURL);
      return fullUrl.pathname;
    } catch {
      return url; // fallback
    }
  }

  // Interceptor request
  axios.interceptors.request.use((config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const httpMethod = (config.method || "GET").toUpperCase();
    const path = getRequestPath(config.url);
    const contentMD5 = getContentMD5(config);
    const requestTime = getRequestTime();

    const stringToSign = `${httpMethod}${path}${contentMD5}${requestTime}${API_KEY}`;

    const sign = md5(stringToSign);

    // Gắn headers
    config.headers["Sign"] = sign;
    config.headers["Request-Time"] = requestTime;

    return config;
  });

  // Interceptor response
  axios.interceptors.response.use(
    (res) => res,
    (error) => {
      const status = error?.response?.status;
      if (status === 403 && process.client) {
        window.location.href = "/403";
      }
      return Promise.reject(error);
    }
  );

  // Inject axios để dùng: this.$axios hoặc context.$axios
  inject("axios", axios);
};
