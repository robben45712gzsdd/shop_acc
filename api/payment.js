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

  
};