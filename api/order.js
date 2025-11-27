import axios from "axios";

export default {
  createOrder(body) {
    return new Promise((resolve, reject) => {
      axios
        .post("/Order/CreateOrder", body )
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getOrderHistory(params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/Order/GetOrderHistory`, { params })
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  getOrderDetail(params) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/Order/GetOrderDetail`, { params })
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
