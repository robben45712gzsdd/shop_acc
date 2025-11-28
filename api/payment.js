import axios from "axios";

export default {
  checkPayment(body) {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/Payment/CheckPayment", body)
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
        .get("/api/Payment/GetListTransaction", { params })
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
        .get("/api/Payment/GetListPayment", { params })
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // payment card 
  // paymentCard(body) { 
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .post("/api/Payment/GetHistoryTopUpCard", body)
  //       .then((response) => {
  //         resolve(response?.data);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // },

  // payment card 
  getPaymentCard(params) { 
    return new Promise((resolve, reject) => {
      axios
        .get("/api/Payment/GetHistoryTopUpCard", { params })
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
