import axios from "axios";

export default {
  checkPayment(body) {
    return new Promise((resolve, reject) => {
      axios
        .post("/Payment/CheckPayment", body)
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get list transaction
  getTransactionList(params) {
    return new Promise((resolve, reject) => {
      axios
        .get("/Payment/GetListTransaction", { params })
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //get list payment 

  getPaymentList(params) {
    return new Promise((resolve, reject) => {
      axios
        .get("/Payment/GetListPayment", { params })
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
