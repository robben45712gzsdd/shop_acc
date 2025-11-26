import axios from "axios";

export default {
  getCategoryList() {
    return new Promise((resolve, reject) => {
      axios
        .get("/Account/GetListCategory")
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
        .get("/Account/GetListAccount", { params })
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
        .get(`/Account/GetAccountDetail`, { params })
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
