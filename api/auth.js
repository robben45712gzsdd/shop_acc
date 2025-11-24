import axios from "axios";
//Login with email and password
const login = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/Auth/Login`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Register with email and password
const register = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/Auth/Register`, body)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// get profile
const getMainProfile = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/Auth/GetUserProfile`)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default {
  login,
  register,
  getMainProfile,
};
