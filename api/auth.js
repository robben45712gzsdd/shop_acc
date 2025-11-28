import axios from "axios";
//Login with email and password
const login = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Auth/Login`, body)
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
      .post(`/api/Auth/Register`, body)
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
      .get(`/api/Auth/GetUserProfile`)
      .then((response) => {
        resolve(response?.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// change password
const changePassword = async (body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/Auth/ChangePassword`, body)
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
  changePassword,
};
