import axios from "axios";

export default {
  getCategoryList() {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/Account/GetListCategory")
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getAccountList(params) {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/Account/GetListAccount", { params })
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getAccountDetail(params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/Account/GetAccountDetail`, { params })
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
