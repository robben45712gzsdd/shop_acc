import axios from "axios";
import Cookies from "js-cookie";

export default ({ app }, inject) => {
    console.log(process.env);
    
  axios.defaults.baseURL = process.env.NUXT_ENV_BASE_URL;

  axios.interceptors.request.use((config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

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
};